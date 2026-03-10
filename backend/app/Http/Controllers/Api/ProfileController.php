<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;
use Exception;

class ProfileController extends Controller
{
    public function getProfile(Request $request)
    {
        try {
            // Lấy user đang đăng nhập từ Token
            $user = $request->user();

            // Lấy thông tin khách hàng tương ứng với Tài Khoản ID
            $customer = DB::table('khach_hang')->where('TaiKhoanID', $user->TaiKhoanID)->first();

            if (!$customer) {
                return response()->json(['error' => true, 'message' => 'Không tìm thấy hồ sơ khách hàng'], 404);
            }

            // Lấy lịch sử các phiếu đặt phòng của khách hàng này
            $bookings = DB::table('phieu_dat_phong')
                ->join('chi_tiet_phieu_dat_phong', 'phieu_dat_phong.PhieuDatPhongID', '=', 'chi_tiet_phieu_dat_phong.PhieuDatPhongID')
                ->join('phong', 'chi_tiet_phieu_dat_phong.PhongID', '=', 'phong.PhongID')
                ->join('loai_phong', 'phong.LoaiPhongID', '=', 'loai_phong.LoaiPhongID')
                ->where('phieu_dat_phong.KhachHangID', $customer->KhachHangID)
                ->orderBy('phieu_dat_phong.NgayTao', 'desc') // Mới nhất xếp trên
                ->select(
                    'phieu_dat_phong.MaPhieu as id',
                    'phieu_dat_phong.TrangThaiThanhToan as status',
                    'phieu_dat_phong.NgayCheckIn as checkIn',
                    'phieu_dat_phong.NgayCheckOutDuKien as checkOut',
                    'phieu_dat_phong.TongTienPhong as amount',
                    'phieu_dat_phong.TienCoc as deposit',
                    'loai_phong.TenLoai as room',
                    'loai_phong.AnhDienDien as AnhDaiDien',
                    'phong.TenPhong as room_name'
                )
                ->get();

            // Format lại dữ liệu cho đẹp để React dễ in ra màn hình
            $formattedBookings = $bookings->map(function ($b) {
                $checkIn = Carbon::parse($b->checkIn)->format('M d');
                $checkOut = Carbon::parse($b->checkOut)->format('M d, Y');

                // Hiển thị tiền cọc hay tổng tiền tùy theo trạng thái
                $amountLabel = 'Total Amount';
                $displayAmount = $b->amount;

                if ($b->status === 'Đã đặt cọc') {
                    $amountLabel = 'Deposit Paid';
                    $displayAmount = $b->deposit;
                }

                // Dịch trạng thái sang tiếng Anh cho sang trọng (hoặc bạn có thể giữ nguyên tiếng Việt)
                $statusEn = 'Processing';
                if ($b->status === 'Đã hoàn thành') $statusEn = 'Completed';
                else if ($b->status === 'Đã hủy') $statusEn = 'Cancelled';
                else if (in_array($b->status, ['Đã thanh toán', 'Đã đặt cọc'])) $statusEn = 'Confirmed';

                return [
                    'id' => $b->id,
                    'room' => $b->room,
                    'room_name' => $b->room_name,
                    'status' => $statusEn,
                    'duration' => $checkIn . ' - ' . $checkOut,
                    'amount' => number_format($displayAmount, 0, ',', '.') . 'đ',
                    'total' => number_format(($displayAmount*100)/30, 0, ',', '.') . 'đ',
                    'amountLabel' => $amountLabel,
                    'image' => $b->AnhDaiDien,
                ];
            });

            return response()->json([
                'profile' => [
                    'name' => $customer->HoTen,
                    'email' => $customer->Email,
                    'phone' => $customer->SoDienThoai,
                    'address' => $customer->DiaChi,
                    'anhdaidien' => $customer->AnhDaiDien,
                    'tier' => 'Silver Member' 
                ],
                'bookings' => $formattedBookings
            ]);
        } catch (Exception $e) {
            return response()->json(['error' => true, 'message' => $e->getMessage()], 500);
        }
    }

    public function updateProfile(Request $request)
    {
        try {
            $user = $request->user();

            $request->validate([
                'name' => 'required|string|max:255',
                'phone' => 'nullable|string|max:20',
                'address' => 'nullable|string|max:500',
                'anhdaidien' => 'nullable|string',
            ]);

            DB::table('khach_hang')
                ->where('TaiKhoanID', $user->TaiKhoanID)
                ->update([
                    'HoTen' => $request->name,
                    'SoDienThoai' => $request->phone, 
                    'DiaChi' => $request->address,  
                    'AnhDaiDien' => $request->anhdaidien,  
                ]);


            $taiKhoanUpdate = ['HoTen' => $request->name];

            // Nếu người dùng có nhập mật khẩu cũ & mới
            if ($request->filled('current_password') && $request->filled('new_password')) {
                // Kiểm tra xem mật khẩu cũ nhập vào có khớp trong DB không
                if (\Illuminate\Support\Facades\Hash::check($request->current_password, $user->MatKhau)) {
                    $taiKhoanUpdate['MatKhau'] = \Illuminate\Support\Facades\Hash::make($request->new_password);
                } else {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Mật khẩu hiện tại không chính xác!'
                    ], 200); // Trả về 200 kèm thông báo lỗi để React in ra alert
                }
            }
            DB::table('tai_khoan')
                ->where('TaiKhoanID', $user->TaiKhoanID)
                ->update($taiKhoanUpdate);

            return response()->json([
                'status' => 'success',
                'message' => 'Cập nhật thông tin thành công!'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi máy chủ: ' . $e->getMessage()
            ], 500);
        }
    }
}
