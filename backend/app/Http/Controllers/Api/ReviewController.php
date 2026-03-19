<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ReviewController extends Controller
{
    public function index(Request $request)
    {
        try {
            $khachHangId = $request->query('KhachHangID');

            $danhGiaList = DB::table('danh_gia')
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

            if ($danhGiaList->isEmpty()) {
                return response()->json([]);
            }

            $danhGiaIds = $danhGiaList->pluck('DanhGiaID')->toArray();

            $likesCount = DB::table('chi_tiet_like')
                ->select('DanhGiaID', DB::raw('count(*) as total'))
                ->whereIn('DanhGiaID', $danhGiaIds)
                ->groupBy('DanhGiaID')
                ->pluck('total', 'DanhGiaID')
                ->toArray();

            $userLikes = [];
            if ($khachHangId) {
                $userLikes = DB::table('chi_tiet_like')
                    ->where('KhachHangID', $khachHangId)
                    ->whereIn('DanhGiaID', $danhGiaIds)
                    ->pluck('DanhGiaID')
                    ->toArray();
            }

            $allReplies = DB::table('tra_loi_danh_gia')
                ->leftJoin('khach_hang', 'tra_loi_danh_gia.KhachHangID', '=', 'khach_hang.KhachHangID')
                ->whereIn('DanhGiaID', $danhGiaIds)
                ->select(
                    'tra_loi_danh_gia.DanhGiaID',
                    'tra_loi_danh_gia.NoiDung',
                    'tra_loi_danh_gia.NgayTraLoi',
                    'khach_hang.HoTen as TenNguoiTraLoi'
                )
                ->orderBy('tra_loi_danh_gia.NgayTraLoi', 'asc')
                ->get()
                ->groupBy('DanhGiaID'); 

            foreach ($danhGiaList as $dg) {
                $dg->SoLuotThich = $likesCount[$dg->DanhGiaID] ?? 0;
                
                $dg->DaLike = in_array($dg->DanhGiaID, $userLikes);
                
                $dg->replies = $allReplies->has($dg->DanhGiaID) ? $allReplies[$dg->DanhGiaID] : [];
            }

            return response()->json($danhGiaList);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
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

    public function toggleLike(Request $request, $id)
    {
        try {
            $khachHangId = $request->input('KhachHangID');

            if (!$khachHangId) {
                return response()->json(['message' => 'Lỗi: Không tìm thấy ID Khách Hàng!'], 400);
            }

            $daLike = DB::table('chi_tiet_like')
                ->where('DanhGiaID', $id)
                ->where('KhachHangID', $khachHangId)
                ->first();

            if ($daLike) {

                DB::table('chi_tiet_like')
                    ->where('LikeID', $daLike->LikeID)
                    ->delete();
                
                return response()->json(['message' => 'Đã bỏ thích', 'action' => 'unliked'], 200);
            } else {

                DB::table('chi_tiet_like')->insert([
                    'DanhGiaID' => $id,
                    'KhachHangID' => $khachHangId,
                    'created_at' => \Carbon\Carbon::now()
                ]);

                return response()->json(['message' => 'Đã thả tim', 'action' => 'liked'], 201);
            }
        } catch (\Exception $e) {
            return response()->json(['message' => 'Lỗi Database: ' . $e->getMessage()], 500);
        }
    }

    public function addReply(Request $request, $id)
    {
        try {
            $khachHangId = $request->input('KhachHangID');
            $noiDung = $request->input('NoiDung');

            if (!$khachHangId || !$noiDung) {
                return response()->json(['message' => 'Vui lòng nhập đủ nội dung trả lời!'], 400);
            }

            DB::table('tra_loi_danh_gia')->insert([
                'DanhGiaID'   => $id,
                'KhachHangID' => $khachHangId,
                'NoiDung'     => $noiDung,
                'NgayTraLoi'  => \Carbon\Carbon::now(),
                'created_at'  => \Carbon\Carbon::now(),
                'updated_at'  => \Carbon\Carbon::now()
            ]);

            return response()->json(['message' => 'Đã gửi phản hồi thành công!'], 201);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Lỗi Database: ' . $e->getMessage()], 500);
        }
    }
}
