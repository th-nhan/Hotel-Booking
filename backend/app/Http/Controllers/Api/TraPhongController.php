<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class TraPhongController extends Controller
{
    public function checkout(Request $request)
    {
        $request->validate([
            'PhongID' => 'required|exists:phong,PhongID',
        ]);

        $phongId = $request->PhongID;
        $now = Carbon::now();

        DB::beginTransaction();
        try {
            // 1. Tìm tất cả các phiếu đặt phòng chưa trả phòng thực tế của phòng này
            $phieuList = DB::table('phieu_dat_phong')
                ->join('chi_tiet_phieu_dat_phong', 'phieu_dat_phong.PhieuDatPhongID', '=', 'chi_tiet_phieu_dat_phong.PhieuDatPhongID')
                ->where('chi_tiet_phieu_dat_phong.PhongID', $phongId)
                ->whereNull('phieu_dat_phong.NgayCheckOutThucTe') // Chưa check-out thực tế
                ->where('phieu_dat_phong.TrangThaiThanhToan', '!=', 'Đã hủy')
                ->select('phieu_dat_phong.PhieuDatPhongID')
                ->get();

            // 2. Cập nhật đóng tất cả các phiếu đang mở của phòng này
            foreach ($phieuList as $phieu) {
                DB::table('phieu_dat_phong')
                    ->where('PhieuDatPhongID', $phieu->PhieuDatPhongID)
                    ->update([
                        'NgayCheckOutThucTe' => $now,
                        'TrangThaiThanhToan' => 'Đã thanh toán',
                        'updated_at' => $now
                    ]);
            }

            // 3. Cập nhật trạng thái phòng sang "Đang dọn"
            DB::table('phong')
                ->where('PhongID', $phongId)
                ->update([
                    'TinhTrang' => 'Đang dọn',
                    'updated_at' => $now 
                ]);

            DB::commit();
            return response()->json([
                'status' => 'success',
                'message' => 'Trả phòng thành công. Phòng đã chuyển sang trạng thái Đang dọn.'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi khi trả phòng: ' . $e->getMessage()
            ], 500);
        }
    }

    public function nhanPhong(Request $request)
    {
        $request->validate([
            'PhongID' => 'required|exists:phong,PhongID',
        ]);

        $phongId = $request->PhongID;
        $now = Carbon::now();

        try {
            DB::table('phong')
                ->where('PhongID', $phongId)
                ->update([
                    'TinhTrang' => 'Đang ở',
                    'updated_at' => $now
                ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Nhận phòng thành công!'
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Lỗi: ' . $e->getMessage()], 500);
        }
    }

    public function hoanTatDon(Request $request)
    {
        $request->validate([
            'PhongID' => 'required|exists:phong,PhongID',
        ]);

        $phongId = $request->PhongID;
        $now = Carbon::now();

        try {
            DB::table('phong')
                ->where('PhongID', $phongId)
                ->update([
                    'TinhTrang' => 'Trống',
                    'updated_at' => $now
                ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Phòng đã sẵn sàng đón khách mới!'
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Lỗi: ' . $e->getMessage()], 500);
        }
    }
}