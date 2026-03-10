<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Exception;

class DashboardController extends Controller
{
    public function index()
    {
        try {
            $today = Carbon::today()->toDateString();

            // Lấy tháng và năm hiện tại để tính thống kê
            $currentMonth = Carbon::now()->month;
            $currentYear = Carbon::now()->year;

            // 1. LẤY DỮ LIỆU TẤT CẢ CÁC PHÒNG TỪ BẢNG 'phong' VÀ 'loai_phong'
            $phongs = DB::table('phong')
                ->join('loai_phong', 'phong.LoaiPhongID', '=', 'loai_phong.LoaiPhongID')
                ->select('phong.*', 'loai_phong.TenLoai')
                ->get();

            // 2. LẤY TẤT CẢ PHIẾU ĐẶT PHÒNG ĐANG CÓ HIỆU LỰC (CheckOut >= Hôm nay)
            $activeBookings = DB::table('phieu_dat_phong')
                ->join('chi_tiet_phieu_dat_phong', 'phieu_dat_phong.PhieuDatPhongID', '=', 'chi_tiet_phieu_dat_phong.PhieuDatPhongID')
                ->leftJoin('khach_hang', 'phieu_dat_phong.KhachHangID', '=', 'khach_hang.KhachHangID')
                ->whereDate('phieu_dat_phong.NgayCheckOutDuKien', '>=', $today)
                ->where('phieu_dat_phong.TrangThaiThanhToan', '!=', 'Đã hủy')
                ->orderBy('phieu_dat_phong.NgayCheckIn', 'desc') // Sắp xếp lấy phiếu mới nhất nếu có trùng
                ->select(
                    'chi_tiet_phieu_dat_phong.PhongID',
                    'phieu_dat_phong.NgayCheckIn',
                    'phieu_dat_phong.NgayCheckOutDuKien',
                    'phieu_dat_phong.TienCoc',  
                    'phieu_dat_phong.PhiPhuThu',
                    'khach_hang.HoTen'
                )
                ->get()
                ->keyBy('PhongID');
            $roomsData = [];

            // Khởi tạo các biến đếm KPI
            $stats = [
                'totalRooms' => count($phongs),
                'available' => 0,
                'occupied' => 0,
                'cleaning' => 0,
                'revenueToday' => 0,
                'bookingsThisMonth' => DB::table('phieu_dat_phong')
                    ->whereMonth('NgayTao', $currentMonth)
                    ->whereYear('NgayTao', $currentYear)
                    ->count()
            ];

            // 3. XỬ LÝ DỮ LIỆU TỪNG PHÒNG ĐỂ GỬI LÊN GIAO DIỆN
            foreach ($phongs as $p) {
                // Tính tầng dựa trên tên phòng (VD: 501 -> Tầng 5)
                $floor = floor((int)$p->TenPhong / 100);
                if ($floor == 0) $floor = 1;

                $guestName = null;
                $checkIn = null;
                $checkOut = null;

                // Lấy trạng thái gốc từ Database
                $currentStatus = $p->TinhTrang;

                // NẾU PHÒNG NÀY ĐANG NẰM TRONG DANH SÁCH KHÁCH ĐẶT/Ở
                if ($activeBookings->has($p->PhongID)) {
                    $booking = $activeBookings->get($p->PhongID);

                    $guestName = $booking->HoTen ?? 'Khách vãng lai';
                    $checkIn = Carbon::parse($booking->NgayCheckIn)->format('Y-m-d');
                    $checkOut = Carbon::parse($booking->NgayCheckOutDuKien)->format('Y-m-d');

                    // AUTO CHECK-IN: Tự động đổi 'Đã đặt' thành 'Đang ở' nếu hôm nay >= ngày Check-in
                    if ($today >= $checkIn) {
                        $currentStatus = 'Đang ở';
                    } else {
                        $currentStatus = 'Đã đặt';
                    }
                }
                // AUTO FIX LỖI DB: Trạng thái DB ghi là "Đã đặt/Đang ở" nhưng không có phiếu nào thực tế -> Ép về "Trống"
                elseif ($currentStatus === 'Đã đặt' || $currentStatus === 'Đang ở') {
                    $currentStatus = 'Trống';
                }

                // CỘNG DỒN THỐNG KÊ (Dựa theo trạng thái chuẩn đã nấu xong)
                if ($currentStatus === 'Trống') {
                    $stats['available']++;
                } elseif ($currentStatus === 'Đang dọn') {
                    $stats['cleaning']++;
                } else {
                    $stats['occupied']++; // Cả 'Đã đặt' và 'Đang ở' đều tính là có người chiếm giữ
                }

                // Đẩy phòng đã hoàn thiện vào mảng
                $roomsData[] = [
                    'id' => $p->PhongID,
                    'number' => $p->TenPhong,
                    'floor' => $floor,
                    'type' => $p->TenLoai ?? 'Standard',
                    'status' => $currentStatus,
                    'price' => $p->GiaPhong ?? 0,
                    'guestName' => $guestName,
                    'checkIn' => $checkIn,
                    'checkOut' => $checkOut,
                    'deposit' => isset($booking) ? ($booking->TienCoc ?? 0) : 0, 
                    'serviceFee' => isset($booking) ? ($booking->PhuThu ?? 0) : 0
                ];
            }

            // 4. TÍNH TỔNG DOANH THU HÔM NAY (Phòng đang ở)
            $revenue = DB::table('phieu_dat_phong')
                ->whereDate('NgayCheckIn', '<=', $today)
                ->whereDate('NgayCheckOutDuKien', '>=', $today)
                ->where('TrangThaiThanhToan', '!=', 'Đã hủy')
                ->sum('TongTienPhong');

            $stats['revenueToday'] = $revenue ?? 0;

            // TÍNH TỶ LỆ LẤP ĐẦY (%)
            $stats['occupancyRate'] = $stats['totalRooms'] > 0
                ? round(($stats['occupied'] / $stats['totalRooms']) * 100, 1)
                : 0;

            // 5. TRẢ VỀ JSON CHO REACT
            return response()->json([
                'stats' => $stats,
                // Sắp xếp tầng từ cao xuống thấp (Tầng 5 nằm trên tầng 1)
                'rooms' => collect($roomsData)->sortByDesc('floor')->values()->all()
            ]);
        } catch (Exception $e) {
            return response()->json([
                'error' => true,
                'message' => 'Lỗi SQL: ' . $e->getMessage(),
                'line' => $e->getLine()
            ], 500);
        }
    }
}
