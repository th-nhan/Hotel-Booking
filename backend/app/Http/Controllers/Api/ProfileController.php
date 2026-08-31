<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Http;
use Carbon\Carbon;
use Exception;

class ProfileController extends Controller
{
    public function getProfile(Request $request)
    {
        try {
            // Lấy user đang đăng nhập từ Token
            $user = $request->user();

            // Lấy thông tin khách hàng tương ứng với Tài Khoản ID hoặc Email
            $customer = DB::table('khach_hang')
                ->where('TaiKhoanID', $user->TaiKhoanID)
                ->orWhere('Email', $user->Email)
                ->first();

            if (!$customer) {
                $khachHangID = DB::table('khach_hang')->insertGetId([
                    'TaiKhoanID' => $user->TaiKhoanID,
                    'HoTen' => $user->HoTen ?? 'Khách hàng',
                    'Email' => $user->Email,
                    'DiaChi' => '',
                    'SoDienThoai' => '',
                    'CCCD' => '',
                    'AnhDaiDien' => null,
                    'NgayTao' => now(),
                ], 'KhachHangID');
                $customer = DB::table('khach_hang')->where('KhachHangID', $khachHangID)->first();
            } elseif (empty($customer->TaiKhoanID)) {
                DB::table('khach_hang')->where('KhachHangID', $customer->KhachHangID)->update(['TaiKhoanID' => $user->TaiKhoanID]);
            }

            $customerIds = DB::table('khach_hang')
                ->where('TaiKhoanID', $user->TaiKhoanID)
                ->orWhere('Email', $user->Email)
                ->pluck('KhachHangID')
                ->toArray();

            $today = Carbon::today()->toDateString();

            // Lấy lịch sử các phiếu đặt phòng của khách hàng này
            $bookings = DB::table('phieu_dat_phong')
                ->join('chi_tiet_phieu_dat_phong', 'phieu_dat_phong.PhieuDatPhongID', '=', 'chi_tiet_phieu_dat_phong.PhieuDatPhongID')
                ->join('phong', 'chi_tiet_phieu_dat_phong.PhongID', '=', 'phong.PhongID')
                ->join('loai_phong', 'phong.LoaiPhongID', '=', 'loai_phong.LoaiPhongID')
                ->whereIn('phieu_dat_phong.KhachHangID', $customerIds)
                ->orderBy('phieu_dat_phong.NgayTao', 'desc') // Mới nhất xếp trên
                ->select(
                    'phieu_dat_phong.MaPhieu as id',
                    'phieu_dat_phong.TrangThaiThanhToan as payment_status',
                    'phieu_dat_phong.NgayCheckIn as checkIn',
                    'phieu_dat_phong.NgayCheckOutDuKien as checkOut',
                    'phieu_dat_phong.NgayCheckOutThucTe as checkOutActual',
                    'phieu_dat_phong.TongTienPhong as amount',
                    'phieu_dat_phong.TienCoc as deposit',
                    'phieu_dat_phong.PhiPhuThu as serviceFee',
                    'loai_phong.TenLoai as room',
                    'loai_phong.AnhDienDien as AnhDaiDien',
                    'phong.TenPhong as room_name',
                    'phong.TinhTrang as room_status'
                )
                ->get();

            // Format lại dữ liệu cho đẹp để React dễ in ra màn hình
            $formattedBookings = $bookings->map(function ($b) use ($today) {
                $checkInDate = Carbon::parse($b->checkIn)->toDateString();
                $checkOutDate = Carbon::parse($b->checkOut)->toDateString();

                $checkInFmt = Carbon::parse($b->checkIn)->format('d/m/Y');
                $checkOutFmt = Carbon::parse($b->checkOut)->format('d/m/Y');

                // Phân biệt chính xác trạng thái lưu trú
                $stayStatus = 'Booked'; // Mặc định là Đã đặt
                if ($b->payment_status === 'Đã hủy') {
                    $stayStatus = 'Cancelled';
                } elseif (!empty($b->checkOutActual) || $today > $checkOutDate || $b->payment_status === 'Đã hoàn thành') {
                    $stayStatus = 'Completed'; // Ở xong rồi / Đã trả phòng
                } elseif ($today >= $checkInDate && $today <= $checkOutDate) {
                    $stayStatus = 'Staying'; // Đang ở
                } else {
                    $stayStatus = 'Booked'; // Đã đặt (Sắp tới)
                }

                // Hiển thị tiền cọc hay tổng tiền tùy theo trạng thái
                $amountLabel = 'Tổng thanh toán';
                $displayAmount = $b->amount;

                if ($b->payment_status === 'Đã đặt cọc') {
                    $amountLabel = 'Đã đặt cọc (30%)';
                    $displayAmount = $b->deposit;
                }

                return [
                    'id' => $b->id,
                    'room' => $b->room,
                    'room_name' => $b->room_name,
                    'status' => $stayStatus, // 'Staying' | 'Booked' | 'Completed' | 'Cancelled'
                    'payment_status' => $b->payment_status,
                    'checkIn' => $checkInFmt,
                    'checkOut' => $checkOutFmt,
                    'checkOutActual' => $b->checkOutActual ? Carbon::parse($b->checkOutActual)->format('d/m/Y H:i') : null,
                    'duration' => $checkInFmt . ' - ' . $checkOutFmt,
                    'amount' => number_format($displayAmount, 0, ',', '.') . ' VNĐ',
                    'total' => number_format($b->amount, 0, ',', '.') . ' VNĐ',
                    'amountLabel' => $amountLabel,
                    'image' => $b->AnhDaiDien,
                    'actions' => $stayStatus === 'Completed' || $stayStatus === 'Staying' ? ['download'] : ['manage']
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

            // Thử tự động nâng cấp cột AnhDaiDien sang longText nếu DB chưa kịp chạy migration
            try {
                Schema::table('khach_hang', function ($table) {
                    $table->longText('AnhDaiDien')->nullable()->change();
                });
            } catch (\Throwable $e) {
                // Bỏ qua nếu DB đã là longText hoặc không hỗ trợ change()
            }

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
                    ], 200);
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

    public function uploadAvatar(Request $request)
    {
        try {
            $user = $request->user();

            $request->validate([
                'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:10240',
                'avatar_base64' => 'nullable|string',
                'anhdaidien' => 'nullable|string',
            ]);

            // Thử tự động nâng cấp cột AnhDaiDien sang longText nếu DB chưa kịp migrate
            try {
                Schema::table('khach_hang', function ($table) {
                    $table->longText('AnhDaiDien')->nullable()->change();
                });
            } catch (\Throwable $e) {
                // Bỏ qua nếu DB đã là longText hoặc không hỗ trợ change()
            }

            $avatarUrl = null;

            if ($request->hasFile('avatar')) {
                $file = $request->file('avatar');
                $extension = strtolower($file->getClientOriginalExtension() ?: 'jpg');
                
                // 1. Thử lưu file vào public_path nếu server cho phép ghi (Local / VPS)
                $savedToFile = false;
                try {
                    $destinationPath = public_path('uploads/avatars');
                    if (!file_exists($destinationPath)) {
                        @mkdir($destinationPath, 0755, true);
                    }
                    if (is_writable($destinationPath) || is_writable(public_path())) {
                        $filename = 'avatar_' . $user->TaiKhoanID . '_' . time() . '.' . $extension;
                        $file->move($destinationPath, $filename);
                        $avatarUrl = url('uploads/avatars/' . $filename);
                        $savedToFile = true;
                    }
                } catch (\Throwable $t) {
                    $savedToFile = false;
                }

                // 2. Nếu không lưu được vào file (Vercel Serverless), đẩy lên ImgBB để lấy URL ngắn dạng VARCHAR
                if (!$savedToFile) {
                    try {
                        $response = Http::asMultipart()->post('https://api.imgbb.com/1/upload?key=6d207e02198a847aa5a0a0a33ea96ffc', [
                            [
                                'name' => 'image',
                                'contents' => fopen($file->getRealPath(), 'r'),
                                'filename' => 'avatar.' . $extension
                            ]
                        ]);
                        if ($response->successful() && isset($response->json()['data']['url'])) {
                            $avatarUrl = $response->json()['data']['url'];
                        }
                    } catch (\Throwable $e) {
                        // ignore
                    }

                    if (!$avatarUrl) {
                        $mimeType = $file->getClientMimeType() ?: 'image/jpeg';
                        $imageData = file_get_contents($file->getRealPath());
                        $avatarUrl = 'data:' . $mimeType . ';base64,' . base64_encode($imageData);
                    }
                }
            } elseif ($request->filled('avatar_base64')) {
                $base64 = $request->avatar_base64;
                try {
                    $cleanBase64 = preg_replace('/^data:image\/[a-z]+;base64,/', '', $base64);
                    $response = Http::asForm()->post('https://api.imgbb.com/1/upload?key=6d207e02198a847aa5a0a0a33ea96ffc', [
                        'image' => $cleanBase64
                    ]);
                    if ($response->successful() && isset($response->json()['data']['url'])) {
                        $avatarUrl = $response->json()['data']['url'];
                    }
                } catch (\Throwable $e) {
                    // ignore
                }
                if (!$avatarUrl) {
                    $avatarUrl = $base64;
                }
            } elseif ($request->filled('anhdaidien')) {
                $avatarUrl = $request->anhdaidien;
            }

            if (!$avatarUrl) {
                return response()->json(['status' => 'error', 'message' => 'Không tìm thấy file hoặc dữ liệu ảnh!'], 400);
            }

            // Cập nhật vào DB khach_hang
            DB::table('khach_hang')
                ->where('TaiKhoanID', $user->TaiKhoanID)
                ->update(['AnhDaiDien' => $avatarUrl]);

            return response()->json([
                'status' => 'success',
                'message' => 'Cập nhật ảnh đại diện thành công!',
                'avatar_url' => $avatarUrl
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi tải ảnh lên: ' . $e->getMessage()
            ], 500);
        }
    }
}
