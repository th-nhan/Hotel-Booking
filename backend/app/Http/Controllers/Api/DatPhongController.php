<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DatPhongController extends Controller
{
    public function store(Request $request)
    {
        // 1. Validate dữ liệu đầu vào
        $request->validate([
            'HoTen' => 'required|string',
            'Email' => 'required|email',
            'SoDienThoai' => 'required',
            'CCCD' => 'required',
            'PhongID' => 'required|exists:phong,PhongID',
            'NgayCheckIn' => 'required|date|after_or_equal:today',
            'NgayCheckOutDuKien' => 'required|date|after:NgayCheckIn',
            'HinhThucThanhToan' => 'required'
        ]);

        $checkIn = Carbon::parse($request->NgayCheckIn);
        $checkOut = Carbon::parse($request->NgayCheckOutDuKien);
        $phongId = $request->PhongID;

        // 2. KIỂM TRA TRÙNG LỊCH (Logic quan trọng)
        // Tìm xem phòng này đã có phiếu đặt nào nằm trong khoảng thời gian khách chọn chưa?
        // Công thức trùng: (StartA <= EndB) and (EndA >= StartB)
        $conflicts = DB::table('phieu_dat_phong')
            ->join('chi_tiet_phieu_dat_phong', 'phieu_dat_phong.PhieuDatPhongID', '=', 'chi_tiet_phieu_dat_phong.PhieuDatPhongID')
            ->where('chi_tiet_phieu_dat_phong.PhongID', $phongId)
            ->where(function ($query) use ($checkIn, $checkOut) {
                $query->whereRaw("? < DATE_ADD(NgayCheckOutDuKien, INTERVAL 1 DAY)", [$checkOut])
              ->where('NgayCheckOutDuKien', '>', $checkIn);
            })
            // Chỉ tính những phiếu chưa bị hủy hoặc chưa check-out xong
            ->whereNotIn('phieu_dat_phong.TrangThaiThanhToan', ['Đã hủy'])
            ->exists();

        // 3. XỬ LÝ NẾU TRÙNG LỊCH -> GỢI Ý PHÒNG KHÁC
        if ($conflicts) {
            // Lấy loại phòng của phòng hiện tại
            $currentRoom = DB::table('phong')->where('PhongID', $phongId)->first();
            
            // Tìm các phòng cùng loại nhưng ĐANG TRỐNG trong khoảng thời gian đó
            $alternativeRooms = DB::table('phong')
                ->where('LoaiPhongID', $currentRoom->LoaiPhongID)
                ->where('PhongID', '<>', $phongId)
                ->whereNotExists(function ($query) use ($checkIn, $checkOut) {
                    $query->select(DB::raw(1))
                        ->from('chi_tiet_phieu_dat_phong')
                        ->join('phieu_dat_phong', 'phieu_dat_phong.PhieuDatPhongID', '=', 'chi_tiet_phieu_dat_phong.PhieuDatPhongID')
                        ->whereColumn('chi_tiet_phieu_dat_phong.PhongID', 'phong.PhongID')
                        ->where('NgayCheckIn', '<', $checkOut)
                        ->where('NgayCheckOutDuKien', '>', $checkIn);
                })
                ->get();

            return response()->json([
                'status' => 'error',
                'message' => 'Phòng này đã được đặt trong khoảng thời gian bạn chọn.',
                'suggested_rooms' => $alternativeRooms
            ], 409); // 409 Conflict
        }

        // 4. NẾU KHÔNG TRÙNG -> TIẾN HÀNH ĐẶT PHÒNG (Transaction)
        DB::beginTransaction();
        try {
            // A. Lưu hoặc Lấy thông tin Khách Hàng
            // Kiểm tra xem khách đã có trong hệ thống chưa (theo Email hoặc CCCD)
            $khachHang = DB::table('khach_hang')
                ->where('Email', $request->Email)
                ->orWhere('CCCD', $request->CCCD)
                ->first();

            $khachHangID = null;
            if ($khachHang) {
                $khachHangID = $khachHang->KhachHangID;
            } else {
                $khachHangID = DB::table('khach_hang')->insertGetId([
                    'HoTen' => $request->HoTen,
                    'Email' => $request->Email,
                    'DiaChi' => $request->DiaChi,
                    'SoDienThoai' => $request->SoDienThoai,
                    'CCCD' => $request->CCCD,
                    'TaiKhoanID' => $request->TaiKhoanID ?? 3, // Mặc định 3 là khách vãng lai
                    'NgayTao' => now(),
                ]);
            }

            // B. Tính toán tiền
            $days = $checkIn->diffInDays($checkOut);
            if ($days == 0) $days = 1; // Tối thiểu 1 ngày
            
            $phong = DB::table('phong')->where('PhongID', $phongId)->first();
            $tongTien = $phong->GiaPhong * $days;
            
            // Tính tiền cọc (30% nếu thanh toán tại quầy, hoặc full nếu chuyển khoản - tùy logic)
            $tienCoc = ($request->HinhThucThanhToan == 'Tại quầy') ? ($tongTien * 0.3) : 0;

            // C. Tạo Phiếu Đặt Phòng
            $phieuID = DB::table('phieu_dat_phong')->insertGetId([
                'MaPhieu' => 'PDP_' . time(), // Tự sinh mã theo thời gian
                'NgayDat' => now(),
                'KhachHangID' => $khachHangID,
                'NgayCheckIn' => $checkIn,
                'NgayCheckOutDuKien' => $checkOut,
                'NgayTao' => now(),
                'NguoiTaoID' => 1, // Tạm thời hardcode nhân viên ID 1
                'TongTienPhong' => $tongTien,
                'PhiPhuThu' => 0,
                'TienCoc' => $tienCoc,
                'TrangThaiThanhToan' => ($tienCoc > 0) ? 'Đã đặt cọc' : 'Đã thanh toán',
                'MaGiaoDich' => null, // Sẽ cập nhật nếu thanh toán online
            ]);

            // D. Tạo Chi Tiết Phiếu
            DB::table('chi_tiet_phieu_dat_phong')->insert([
                'PhieuDatPhongID' => $phieuID,
                'PhongID' => $phongId,
                'DonGia' => $phong->GiaPhong
            ]);

            // E. Cập nhật trạng thái phòng (Nếu ngày Check-in gần < 4 ngày)
            $diffDate = now()->diffInDays($checkIn, false); // false để lấy số âm dương
            if ($diffDate >= 0 && $diffDate <= 4) {
                DB::table('phong')->where('PhongID', $phongId)->update(['TinhTrang' => 'Đã đặt']);
            }

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Đặt phòng thành công!',
                'phieu_id' => $phieuID
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }
}