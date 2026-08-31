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
            ->where('phieu_dat_phong.NgayCheckIn', '<', $checkOut)
            ->where('phieu_dat_phong.NgayCheckOutDuKien', '>', $checkIn)
            // Chỉ tính những phiếu chưa bị hủy hoặc chưa check-out xong
            ->whereNotIn('phieu_dat_phong.TrangThaiThanhToan', ['Đã hủy'])
            ->whereNull('phieu_dat_phong.NgayCheckOutThucTe')
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
                        ->where('NgayCheckOutDuKien', '>', $checkIn)
                        ->whereNotIn('phieu_dat_phong.TrangThaiThanhToan', ['Đã hủy'])
                        ->whereNull('phieu_dat_phong.NgayCheckOutThucTe');
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
            // Ưu tiên tìm theo TaiKhoanID nếu có, sau đó tìm theo Email / CCCD
            $khachHang = null;
            if ($request->filled('TaiKhoanID')) {
                $khachHang = DB::table('khach_hang')->where('TaiKhoanID', $request->TaiKhoanID)->first();
            }
            if (!$khachHang) {
                $khachHang = DB::table('khach_hang')
                    ->where('Email', $request->Email)
                    ->orWhere('CCCD', $request->CCCD)
                    ->first();
            }

            $khachHangID = null;
            if ($khachHang) {
                $khachHangID = $khachHang->KhachHangID;
                
                // Đồng bộ cập nhật thông tin khách hàng
                $updateCustomer = [];
                if ($request->filled('HoTen')) $updateCustomer['HoTen'] = $request->HoTen;
                if ($request->filled('SoDienThoai')) $updateCustomer['SoDienThoai'] = $request->SoDienThoai;
                if ($request->filled('CCCD')) $updateCustomer['CCCD'] = $request->CCCD;
                if ($request->filled('DiaChi')) $updateCustomer['DiaChi'] = $request->DiaChi;
                if ($request->filled('TaiKhoanID') && empty($khachHang->TaiKhoanID)) {
                    $updateCustomer['TaiKhoanID'] = $request->TaiKhoanID;
                }
                
                if (!empty($updateCustomer)) {
                    DB::table('khach_hang')->where('KhachHangID', $khachHangID)->update($updateCustomer);
                }
            } else {
                $khachHangID = DB::table('khach_hang')->insertGetId([
                    'HoTen' => $request->HoTen,
                    'Email' => $request->Email,
                    'DiaChi' => $request->DiaChi ?? 'Tại khách sạn',
                    'SoDienThoai' => $request->SoDienThoai,
                    'CCCD' => $request->CCCD,
                    'TaiKhoanID' => $request->TaiKhoanID ?? 3, // Mặc định 3 là khách vãng lai
                    'NgayTao' => now(),
                ], 'KhachHangID');
            }

            // B. Tính toán tiền
            $days = $checkIn->diffInDays($checkOut);
            if ($days == 0) $days = 1; // Tối thiểu 1 ngày
            
            $phong = DB::table('phong')->where('PhongID', $phongId)->first();
            $tongTien = $phong->GiaPhong * $days;
            
            // Tính tiền cọc (30% nếu thanh toán tại quầy)
            $tienCoc = ($request->HinhThucThanhToan == 'Tại quầy') ? ($tongTien * 0.3) : 0;
            
            // Xác định trạng thái thanh toán ban đầu (Tuyệt đối không để 'Đã hủy')
            $trangThaiThanhToan = 'Đã đặt cọc';
            if ($request->HinhThucThanhToan == 'Tại quầy') {
                $trangThaiThanhToan = ($tienCoc > 0) ? 'Đã đặt cọc' : 'Chưa thanh toán';
            } else {
                $trangThaiThanhToan = 'Đã thanh toán';
            }

            // C. Tạo Phiếu Đặt Phòng
            $phieuID = DB::table('phieu_dat_phong')->insertGetId([
                'MaPhieu' => 'PDP_' . time(), // Tự sinh mã theo thời gian
                'NgayDat' => now(),
                'KhachHangID' => $khachHangID,
                'NgayCheckIn' => $checkIn,
                'NgayCheckOutDuKien' => $checkOut,
                'NgayTao' => now(),
                'NguoiTaoID' => 1, // Mặc định ID nhân viên hệ thống
                'TongTienPhong' => $tongTien,
                'PhiPhuThu' => 0,
                'TienCoc' => $tienCoc,
                'TrangThaiThanhToan' => $trangThaiThanhToan,
                'MaGiaoDich' => null, // Sẽ cập nhật nếu thanh toán online
            ], 'PhieuDatPhongID');

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