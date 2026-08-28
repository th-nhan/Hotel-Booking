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
            $timeRange = $request->query('time_range', 'all');

            $query = DB::table('danh_gia')
                ->leftJoin('khach_hang', 'danh_gia.KhachHangID', '=', 'khach_hang.KhachHangID')
                ->leftJoin('tai_khoan', 'khach_hang.TaiKhoanID', '=', 'tai_khoan.TaiKhoanID')
                ->select(
                    'danh_gia.DanhGiaID',
                    'danh_gia.NoiDung as SoSao',
                    'danh_gia.BinhLuan',
                    'danh_gia.NgayDanhGia',
                    DB::raw('COALESCE(khach_hang.HoTen, tai_khoan.HoTen, "Khách hàng ẩn danh") as TenKhachHang'),
                    'khach_hang.AnhDaiDien'
                );

            if ($timeRange === '1') {
                $query->where('danh_gia.NgayDanhGia', '>=', Carbon::now()->subMonth());
            } elseif ($timeRange === '3') {
                $query->where('danh_gia.NgayDanhGia', '>=', Carbon::now()->subMonths(3));
            }

            $danhGiaList = $query->orderBy('danh_gia.NgayDanhGia', 'desc')->get();

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
                ->leftJoin('tai_khoan', 'khach_hang.TaiKhoanID', '=', 'tai_khoan.TaiKhoanID')
                ->whereIn('DanhGiaID', $danhGiaIds)
                ->select(
                    'tra_loi_danh_gia.DanhGiaID',
                    'tra_loi_danh_gia.NoiDung',
                    'tra_loi_danh_gia.NgayTraLoi',
                    DB::raw('COALESCE(khach_hang.HoTen, tai_khoan.HoTen, "Khách") as TenNguoiTraLoi')
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

    private function getOrResolveKhachHangId(Request $request)
    {
        $taiKhoanId = $request->input('TaiKhoanID');
        $khachHangId = $request->input('KhachHangID');
        $hoTen = $request->input('HoTen');

        // 1. Nếu có TaiKhoanID, ưu tiên tìm khách hàng tương ứng theo TaiKhoanID
        if ($taiKhoanId) {
            $khachHang = DB::table('khach_hang')->where('TaiKhoanID', $taiKhoanId)->first();
            if ($khachHang) {
                return $khachHang->KhachHangID;
            }

            $taiKhoan = DB::table('tai_khoan')->where('TaiKhoanID', $taiKhoanId)->first();
            return DB::table('khach_hang')->insertGetId([
                'TaiKhoanID' => $taiKhoanId,
                'HoTen' => $taiKhoan ? $taiKhoan->HoTen : ($hoTen ?? 'Khách hàng'),
                'Email' => $taiKhoan ? $taiKhoan->Email : 'guest@hotel.com',
                'NgayTao' => now(),
            ], 'KhachHangID');
        }

        // 2. Nếu có KhachHangID
        if ($khachHangId) {
            $khachHang = DB::table('khach_hang')->where('KhachHangID', $khachHangId)->first();
            if ($khachHang) {
                return $khachHang->KhachHangID;
            }
        }

        // 3. Fallback tạo khách vãng lai
        return DB::table('khach_hang')->insertGetId([
            'HoTen' => $hoTen ?? 'Khách hàng',
            'Email' => 'guest@hotel.com',
            'NgayTao' => now(),
        ], 'KhachHangID');
    }

    public function store(Request $request)
    {
        try {
            $finalKhachHangId = $this->getOrResolveKhachHangId($request);

            DB::table('danh_gia')->insert([
                'KhachHangID' => $finalKhachHangId,
                'PhongID'     => null, 
                'NoiDung'     => $request->input('SoSao', 5),
                'BinhLuan'    => $request->input('BinhLuan'),
                'NgayDanhGia' => \Carbon\Carbon::now(),
                'created_at'  => \Carbon\Carbon::now(),
                'updated_at'  => \Carbon\Carbon::now(),
            ]);

            return response()->json(['message' => 'Đánh giá thành công!'], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Lỗi Database: ' . $e->getMessage()], 500);
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
            return response()->json(['message' => 'Lỗi Database: ' . $e->getMessage()], 500);
        }
    }

    public function toggleLike(Request $request, $id)
    {
        try {
            $finalKhachHangId = $this->getOrResolveKhachHangId($request);

            $daLike = DB::table('chi_tiet_like')
                ->where('DanhGiaID', $id)
                ->where('KhachHangID', $finalKhachHangId)
                ->first();

            if ($daLike) {
                DB::table('chi_tiet_like')
                    ->where('LikeID', $daLike->LikeID)
                    ->delete();
                
                return response()->json(['message' => 'Đã bỏ thích', 'action' => 'unliked'], 200);
            } else {
                DB::table('chi_tiet_like')->insert([
                    'DanhGiaID' => $id,
                    'KhachHangID' => $finalKhachHangId,
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
            $noiDung = $request->input('NoiDung');

            if (!$noiDung) {
                return response()->json(['message' => 'Vui lòng nhập đủ nội dung trả lời!'], 400);
            }

            $finalKhachHangId = $this->getOrResolveKhachHangId($request);

            DB::table('tra_loi_danh_gia')->insert([
                'DanhGiaID'   => $id,
                'KhachHangID' => $finalKhachHangId,
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
