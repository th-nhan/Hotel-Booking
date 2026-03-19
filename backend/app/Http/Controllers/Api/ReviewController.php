<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ReviewController extends Controller
{
    public function index()
    {
        $danhGia = DB::table('danh_gia')
            ->join('khach_hang', 'danh_gia.KhachHangID', '=', 'khach_hang.KhachHangID')
            ->select(
                'danh_gia.DanhGiaID',
                'danh_gia.NoiDung as SoSao',
                'danh_gia.BinhLuan',
                'danh_gia.NgayDanhGia',
                'khach_hang.HoTen as TenKhachHang',
                'khach_hang.AnhDaiDien',
            )
            ->orderBy('danh_gia.NgayDanhGia', 'desc')
            ->get();

        return response()->json($danhGia);
    }


    public function store(Request $request)
    {

        try {
            DB::table('danh_gia')->insert([
                'KhachHangID' => $request->input('KhachHangID'),
                'PhongID'     => null, 
                'NoiDung'     => $request->input('SoSao'),
                'BinhLuan'    => $request->input('BinhLuan'),
                'NgayDanhGia' => \Carbon\Carbon::now(),
                'created_at'  => \Carbon\Carbon::now(),
                'updated_at'  => \Carbon\Carbon::now(),
            ]);

            return response()->json(['message' => 'Đánh giá thành công!'], 201);
        } catch (\Exception $e) {
            
            return response()->json([
                'message' => 'Lỗi Database: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            // Lấy ID từ URL và thực hiện xóa
            $deleted = DB::table('danh_gia')->where('DanhGiaID', $id)->delete();

            if ($deleted) {
                return response()->json(['message' => 'Đã xóa đánh giá thành công!'], 200);
            }

            return response()->json(['message' => 'Không tìm thấy đánh giá này!'], 404);
            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Lỗi Database: ' . $e->getMessage()
            ], 500);
        }
    }
}
