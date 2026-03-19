<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\TaiKhoan;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Exception;

class AuthController extends Controller
{
    // 1. ĐĂNG KÝ
    public function register(Request $request)
    {
        // Kiểm tra dữ liệu đầu vào
        $request->validate([
            'fullname' => 'required|string|max:255',
            'username' => 'required|string|email|max:255|unique:tai_khoan,Email',
            'password' => 'required|string|min:6',
        ], [
            'username.unique' => 'Email này đã được sử dụng.',
            'password.min' => 'Mật khẩu phải có ít nhất 6 ký tự.'
        ]);

        DB::beginTransaction();

        try {

            $taiKhoan = TaiKhoan::create([
                'HoTen' => $request->fullname,
                'Email' => $request->username,
                'MatKhau' => Hash::make($request->password),
                'VaiTroID' => 3,
                'TrangThai' => 1,
                'NgayTao' => now(),
            ]);


            DB::table('khach_hang')->insert([
                'TaiKhoanID' => $taiKhoan->TaiKhoanID,
                'HoTen' => $request->fullname,
                'Email' => $request->username,
                'NgayTao' => now(),


                'DiaChi' => '',
                'SoDienThoai' => '',
                'CCCD' => '',
                'AnhDaiDien' => '',
            ]);

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Đăng ký tài khoản thành công!',
                'user' => $taiKhoan
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            // Trả về chi tiết lỗi để Nhan đọc được trên Console của trình duyệt
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi thực tế: ' . $e->getMessage(),
                'dong' => $e->getLine(),
                'file' => $e->getFile()
            ], 500);
        }
    }

    // 2. ĐĂNG NHẬP
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|email',
            'password' => 'required',
        ]);

        // Tìm tài khoản theo Email
        $user = TaiKhoan::where('Email', $request->username)->first();

        // Kiểm tra mật khẩu (Dùng Hash::check)
        if (!$user || !Hash::check($request->password, $user->MatKhau)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Email hoặc mật khẩu không chính xác!'
            ], 401);
        }

        // Kiểm tra xem tài khoản có bị khóa không
        if ($user->TrangThai == 0) {
            return response()->json([
                'status' => 'error',
                'message' => 'Tài khoản của bạn đã bị khóa!'
            ], 403);
        }
        $khachHang = DB::table('khach_hang')->where('TaiKhoanID', $user->TaiKhoanID)->first();
        // Tạo Token cho phiên đăng nhập (Yêu cầu phải cài đặt Laravel Sanctum)
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Đăng nhập thành công!',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                'id' => $user->TaiKhoanID,
                'KhachHangID' => $khachHang ? $khachHang->KhachHangID : null,
                'name' => $user->HoTen,
                'email' => $user->Email,
                'role' => $user->VaiTroID,
                'phone' => $khachHang ? $khachHang->SoDienThoai : '',
                'address' => $khachHang ? $khachHang->DiaChi : '',
                'cccd' => $khachHang ? $khachHang->CCCD : '',
                'AnhDaiDien' => $khachHang ? $khachHang->AnhDaiDien : null
            ]
        ]);
    }

    // 3. ĐĂNG XUẤT
    public function logout(Request $request)
    {
        // Xóa token hiện tại của user đang gọi API
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Đăng xuất thành công!'
        ]);
    }
}
