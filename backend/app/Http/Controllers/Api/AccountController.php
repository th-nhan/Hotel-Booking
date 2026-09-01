<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\TaiKhoan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;
use Exception;

class AccountController extends Controller
{
    /**
     * Lấy danh sách tất cả tài khoản kèm thông tin chi tiết và thống kê
     */
    public function index(Request $request)
    {
        try {
            $search = $request->query('search', '');
            $roleFilter = $request->query('role', 'all');
            $statusFilter = $request->query('status', 'all');

            // Query cơ sở
            $query = DB::table('tai_khoan')
                ->leftJoin('vai_tro', 'tai_khoan.VaiTroID', '=', 'vai_tro.VaiTroID')
                ->leftJoin('khach_hang', 'tai_khoan.TaiKhoanID', '=', 'khach_hang.TaiKhoanID')
                ->leftJoin('nhan_vien', 'tai_khoan.TaiKhoanID', '=', 'nhan_vien.TaiKhoanID')
                ->select(
                    'tai_khoan.TaiKhoanID',
                    'tai_khoan.HoTen',
                    'tai_khoan.Email',
                    'tai_khoan.VaiTroID',
                    'vai_tro.TenVaiTro',
                    'tai_khoan.TrangThai',
                    'tai_khoan.NgayTao',
                    'tai_khoan.created_at',
                    DB::raw('COALESCE(khach_hang.SoDienThoai, nhan_vien.SoDienThoai, "") as SoDienThoai'),
                    DB::raw('COALESCE(khach_hang.CCCD, nhan_vien.CCCD, "") as CCCD'),
                    DB::raw('COALESCE(khach_hang.DiaChi, nhan_vien.DiaChi, "") as DiaChi'),
                    DB::raw('COALESCE(khach_hang.AnhDaiDien, "") as AnhDaiDien'),
                    'khach_hang.KhachHangID',
                    'nhan_vien.NhanVienID'
                )
                ->orderBy('tai_khoan.TaiKhoanID', 'desc');

            // Lọc theo Role
            if ($roleFilter !== 'all' && $roleFilter !== '') {
                $query->where('tai_khoan.VaiTroID', $roleFilter);
            }

            // Lọc theo Trạng thái
            if ($statusFilter !== 'all' && $statusFilter !== '') {
                $query->where('tai_khoan.TrangThai', $statusFilter);
            }

            // Tìm kiếm theo Họ tên, Email, SĐT, CCCD
            if (!empty($search)) {
                $query->where(function ($q) use ($search) {
                    $q->where('tai_khoan.HoTen', 'like', "%{$search}%")
                      ->orWhere('tai_khoan.Email', 'like', "%{$search}%")
                      ->orWhere('khach_hang.SoDienThoai', 'like', "%{$search}%")
                      ->orWhere('nhan_vien.SoDienThoai', 'like', "%{$search}%")
                      ->orWhere('khach_hang.CCCD', 'like', "%{$search}%")
                      ->orWhere('nhan_vien.CCCD', 'like', "%{$search}%");
                });
            }

            $accounts = $query->get();

            // Lấy thông tin thống kê tổng quan
            $allAccounts = DB::table('tai_khoan')->get();
            $stats = [
                'total' => $allAccounts->count(),
                'admins' => $allAccounts->where('VaiTroID', 1)->count(),
                'staff' => $allAccounts->where('VaiTroID', 2)->count(),
                'customers' => $allAccounts->where('VaiTroID', 3)->count(),
                'active' => $allAccounts->where('TrangThai', 1)->count(),
                'locked' => $allAccounts->where('TrangThai', 0)->count(),
            ];

            return response()->json([
                'status' => 'success',
                'stats' => $stats,
                'data' => $accounts
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi tải danh sách tài khoản: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Tạo tài khoản mới từ Dashboard Admin
     */
    public function store(Request $request)
    {
        $request->validate([
            'HoTen' => 'required|string|max:255',
            'Email' => 'required|email|max:255|unique:tai_khoan,Email',
            'MatKhau' => 'required|string|min:6',
            'VaiTroID' => 'required|in:1,2,3',
        ], [
            'Email.unique' => 'Email này đã tồn tại trong hệ thống!',
            'MatKhau.min' => 'Mật khẩu phải có ít nhất 6 ký tự!'
        ]);

        DB::beginTransaction();
        try {
            $taiKhoan = TaiKhoan::create([
                'HoTen' => $request->HoTen,
                'Email' => $request->Email,
                'MatKhau' => Hash::make($request->MatKhau),
                'VaiTroID' => $request->VaiTroID,
                'TrangThai' => $request->has('TrangThai') ? $request->TrangThai : 1,
                'NgayTao' => now(),
            ]);

            // Thêm vào bảng khách hàng hoặc nhân viên tùy vai trò
            if ($request->VaiTroID == 3) {
                DB::table('khach_hang')->insert([
                    'TaiKhoanID' => $taiKhoan->TaiKhoanID,
                    'HoTen' => $request->HoTen,
                    'Email' => $request->Email,
                    'SoDienThoai' => $request->SoDienThoai ?? '',
                    'CCCD' => $request->CCCD ?? '',
                    'DiaChi' => $request->DiaChi ?? '',
                    'AnhDaiDien' => null,
                    'NgayTao' => now(),
                ]);
            } elseif ($request->VaiTroID == 2) {
                DB::table('nhan_vien')->insert([
                    'TaiKhoanID' => $taiKhoan->TaiKhoanID,
                    'HoTen' => $request->HoTen,
                    'Email' => $request->Email,
                    'SoDienThoai' => $request->SoDienThoai ?? '',
                    'CCCD' => $request->CCCD ?? '',
                    'DiaChi' => $request->DiaChi ?? '',
                    'NgayTao' => now(),
                ]);
            }

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Tạo tài khoản thành công!',
                'data' => $taiKhoan
            ], 201);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi tạo tài khoản: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cập nhật thông tin tài khoản
     */
    public function update(Request $request, $id)
    {
        $taiKhoan = TaiKhoan::find($id);
        if (!$taiKhoan) {
            return response()->json([
                'status' => 'error',
                'message' => 'Tài khoản không tồn tại!'
            ], 404);
        }

        $request->validate([
            'HoTen' => 'required|string|max:255',
            'Email' => "required|email|max:255|unique:tai_khoan,Email,{$id},TaiKhoanID",
            'VaiTroID' => 'required|in:1,2,3',
        ]);

        DB::beginTransaction();
        try {
            $updateData = [
                'HoTen' => $request->HoTen,
                'Email' => $request->Email,
                'VaiTroID' => $request->VaiTroID,
            ];

            if ($request->has('TrangThai')) {
                $updateData['TrangThai'] = $request->TrangThai;
            }

            if (!empty($request->MatKhau)) {
                $updateData['MatKhau'] = Hash::make($request->MatKhau);
            }

            DB::table('tai_khoan')->where('TaiKhoanID', $id)->update($updateData);

            // Cập nhật thông tin phụ trong bảng tương ứng
            if ($request->VaiTroID == 3) {
                $exists = DB::table('khach_hang')->where('TaiKhoanID', $id)->first();
                if ($exists) {
                    DB::table('khach_hang')->where('TaiKhoanID', $id)->update([
                        'HoTen' => $request->HoTen,
                        'Email' => $request->Email,
                        'SoDienThoai' => $request->SoDienThoai ?? $exists->SoDienThoai,
                        'CCCD' => $request->CCCD ?? $exists->CCCD,
                        'DiaChi' => $request->DiaChi ?? $exists->DiaChi,
                    ]);
                } else {
                    DB::table('khach_hang')->insert([
                        'TaiKhoanID' => $id,
                        'HoTen' => $request->HoTen,
                        'Email' => $request->Email,
                        'SoDienThoai' => $request->SoDienThoai ?? '',
                        'CCCD' => $request->CCCD ?? '',
                        'DiaChi' => $request->DiaChi ?? '',
                        'NgayTao' => now(),
                    ]);
                }
            } elseif ($request->VaiTroID == 2) {
                $exists = DB::table('nhan_vien')->where('TaiKhoanID', $id)->first();
                if ($exists) {
                    DB::table('nhan_vien')->where('TaiKhoanID', $id)->update([
                        'HoTen' => $request->HoTen,
                        'Email' => $request->Email,
                        'SoDienThoai' => $request->SoDienThoai ?? $exists->SoDienThoai,
                        'CCCD' => $request->CCCD ?? $exists->CCCD,
                        'DiaChi' => $request->DiaChi ?? $exists->DiaChi,
                    ]);
                } else {
                    DB::table('nhan_vien')->insert([
                        'TaiKhoanID' => $id,
                        'HoTen' => $request->HoTen,
                        'Email' => $request->Email,
                        'SoDienThoai' => $request->SoDienThoai ?? '',
                        'CCCD' => $request->CCCD ?? '',
                        'DiaChi' => $request->DiaChi ?? '',
                        'NgayTao' => now(),
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Cập nhật tài khoản thành công!'
            ]);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi cập nhật tài khoản: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Đổi trạng thái Khóa / Kích hoạt tài khoản
     */
    public function toggleStatus($id)
    {
        try {
            $taiKhoan = DB::table('tai_khoan')->where('TaiKhoanID', $id)->first();
            if (!$taiKhoan) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Tài khoản không tồn tại!'
                ], 404);
            }

            $newStatus = $taiKhoan->TrangThai ? 0 : 1;
            DB::table('tai_khoan')->where('TaiKhoanID', $id)->update([
                'TrangThai' => $newStatus,
                'updated_at' => now()
            ]);

            return response()->json([
                'status' => 'success',
                'message' => $newStatus ? 'Đã kích hoạt tài khoản!' : 'Đã khóa tài khoản!',
                'newStatus' => $newStatus
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi cập nhật trạng thái: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Xóa tài khoản
     */
    public function destroy($id)
    {
        DB::beginTransaction();
        try {
            $taiKhoan = DB::table('tai_khoan')->where('TaiKhoanID', $id)->first();
            if (!$taiKhoan) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Tài khoản không tồn tại!'
                ], 404);
            }

            // Xóa quyền liên kết nếu có
            DB::table('quyen_tai_khoan')->where('TaiKhoanID', $id)->delete();
            // Xóa khách hàng / nhân viên liên kết
            DB::table('khach_hang')->where('TaiKhoanID', $id)->delete();
            DB::table('nhan_vien')->where('TaiKhoanID', $id)->delete();
            // Xóa tài khoản
            DB::table('tai_khoan')->where('TaiKhoanID', $id)->delete();

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Đã xóa tài khoản thành công!'
            ]);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Không thể xóa tài khoản do có ràng buộc dữ liệu đặt phòng/đánh giá: ' . $e->getMessage()
            ], 500);
        }
    }
}
