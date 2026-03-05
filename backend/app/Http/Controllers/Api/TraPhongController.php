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
            // 1. Tìm phiếu đặt phòng đang hoạt động của phòng này
            // (Phiếu chưa thanh toán hoặc chưa có ngày check-out thực tế)
            $phieu = DB::table('phieu_dat_phong')
                ->join('chi_tiet_phieu_dat_phong', 'phieu_dat_phong.PhieuDatPhongID', '=', 'chi_tiet_phieu_dat_phong.PhieuDatPhongID')
                ->where('chi_tiet_phieu_dat_phong.PhongID', $phongId)
                ->whereNull('NgayCheckOutThucTe') // Chưa check-out
                ->select('phieu_dat_phong.*')
                ->first();

            if (!$phieu) {
                return response()->json(['message' => 'Không tìm thấy phiếu đặt phòng đang hoạt động cho phòng này.'], 404);
            }

            // 2. Cập nhật thông tin phiếu đặt phòng (Đóng phiếu)
            DB::table('phieu_dat_phong')
                ->where('PhieuDatPhongID', $phieu->PhieuDatPhongID)
                ->update([
                    'NgayCheckOutThucTe' => $now,
                    'TrangThaiThanhToan' => 'Đã thanh toán', // Giả sử trả phòng là thanh toán luôn
                    'updated_at' => $now
                ]);

            // 3. Cập nhật trạng thái phòng sang "Đang dọn"
            // Lưu ý: updated_at ở đây rất quan trọng, nó đánh dấu thời điểm bắt đầu dọn
            DB::table('phong')
                ->where('PhongID', $phongId)
                ->update([
                    'TinhTrang' => 'Đang dọn',
                    'updated_at' => $now 
                ]);

            DB::commit();
            return response()->json(['message' => 'Trả phòng thành công. Phòng đang được dọn dẹp (1 ngày).']);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Lỗi: ' . $e->getMessage()], 500);
        }
    }
}