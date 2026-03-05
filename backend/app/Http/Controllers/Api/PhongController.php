<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Exception;

class PhongController extends Controller
{
    public function index(Request $request)
    {
        try {
            // 1. Tự động dọn phòng
            $motNgayTruoc = Carbon::now()->subDay();
            DB::table('phong')
                ->where('TinhTrang', 'Đang dọn')
                ->where('updated_at', '<=', $motNgayTruoc)
                ->update([
                    'TinhTrang' => 'Trống',
                    'updated_at' => Carbon::now() 
                ]);

            // 2. Nhận tham số ngày lọc từ React gửi lên
            $checkIn = $request->query('check_in');
            $checkOut = $request->query('check_out');

            // 3. Lấy toàn bộ phòng KÈM THEO thông tin loại phòng
            $phongs = DB::table('phong')
                ->join('loai_phong', 'phong.LoaiPhongID', '=', 'loai_phong.LoaiPhongID')
                ->select(
                    'phong.*',
                    'loai_phong.TenLoai',
                    'loai_phong.MoTa',
                    'loai_phong.AnhDienDien',
                    'loai_phong.SoLuongToiDa'
                )
                ->get();

            // 4. Xử lý Lọc trùng lịch (Khóa phòng trên Sơ đồ)
            if ($checkIn && $checkOut) {
                
                // ĐÃ SỬA LẠI ĐÚNG TÊN BẢNG Ở CẢ 3 CHỖ
                $bookedRoomIds = DB::table('phieu_dat_phong')
                    ->join('chi_tiet_phieu_dat_phong', 'phieu_dat_phong.PhieuDatPhongID', '=', 'chi_tiet_phieu_dat_phong.PhieuDatPhongID')
                    ->where(function ($query) use ($checkIn, $checkOut) {
                        $query->where('phieu_dat_phong.NgayCheckIn', '<', $checkOut)
                              ->where('phieu_dat_phong.NgayCheckOutDuKien', '>', $checkIn);
                    })
                    ->pluck('chi_tiet_phieu_dat_phong.PhongID') // Lấy ID phòng từ bảng chi tiết
                    ->toArray();

                // Quét qua từng phòng, nếu ID phòng nằm trong danh sách bận -> Ép thành 'Đã đặt'
                foreach ($phongs as $phong) {
                    if (in_array($phong->PhongID, $bookedRoomIds)) {
                        $phong->TinhTrang = 'Đã đặt'; 
                    }
                }
            }

            return response()->json($phongs);

        } catch (Exception $e) {
            // In lỗi ra rõ ràng để dễ sửa thay vì báo 500
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi Backend: ' . $e->getMessage(),
                'line' => $e->getLine()
            ], 500);
        }
    }
}