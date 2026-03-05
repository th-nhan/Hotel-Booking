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
            
            // <-- MỚI THÊM: Lấy tháng và năm hiện tại
            $currentMonth = Carbon::now()->month;
            $currentYear = Carbon::now()->year;

            // 1. LẤY DỮ LIỆU PHÒNG 
            $phongs = DB::table('phong')
                ->join('loai_phong', 'phong.LoaiPhongID', '=', 'loai_phong.LoaiPhongID')
                ->select('phong.*', 'loai_phong.TenLoai') 
                ->get();

            // 2. <-- MỚI THÊM (Rất quan trọng): Quét tìm những phòng đang có khách đặt trong HÔM NAY để hiện màu lên sơ đồ
            $bookedToday = DB::table('phieu_dat_phong')
                ->join('chi_tiet_phieu_dat_phong', 'phieu_dat_phong.PhieuDatPhongID', '=', 'chi_tiet_phieu_dat_phong.PhieuDatPhongID')
                ->leftJoin('khach_hang', 'phieu_dat_phong.KhachHangID', '=', 'khach_hang.KhachHangID') 
                ->whereDate('phieu_dat_phong.NgayCheckIn', '<=', $today)
                ->whereDate('phieu_dat_phong.NgayCheckOutDuKien', '>=', $today)
                ->where('phieu_dat_phong.TrangThaiThanhToan', '!=', 'Đã hủy') 
                ->select('chi_tiet_phieu_dat_phong.PhongID', 'phieu_dat_phong.NgayCheckIn', 'phieu_dat_phong.NgayCheckOutDuKien', 'khach_hang.HoTen')
                ->get()
                ->keyBy('PhongID');

            $roomsData = [];
            $stats = [
                'totalRooms' => count($phongs),
                'available' => 0,
                'occupied' => 0,
                'cleaning' => 0,
                'revenueToday' => 0,
                'bookingsThisMonth' => 0 // <-- MỚI THÊM: Khởi tạo biến
            ];

            // <-- MỚI THÊM: Truy vấn đếm tổng số phiếu đặt phòng trong tháng này
            $stats['bookingsThisMonth'] = DB::table('phieu_dat_phong')
                ->whereMonth('NgayTao', $currentMonth)
                ->whereYear('NgayTao', $currentYear)
                ->count();

            // 3. Xử lý dữ liệu từng phòng
            foreach ($phongs as $p) {
                $floor = floor((int)$p->TenPhong / 100);
                if ($floor == 0) $floor = 1; 

                $guestName = null;
                $checkIn = null;
                $checkOut = null;
                
                $currentStatus = $p->TinhTrang;

                // <-- MỚI THÊM: Logic ép phòng đổi màu nếu phát hiện hôm nay có người đặt
                if ($bookedToday->has($p->PhongID)) {
                    $booking = $bookedToday->get($p->PhongID);
                    
                    $currentStatus = 'Đã đặt'; // Ghi đè trạng thái ảo để UI đổi màu
                    $guestName = $booking->HoTen ?? 'Khách vãng lai';
                    $checkIn = Carbon::parse($booking->NgayCheckIn)->format('Y-m-d');
                    $checkOut = Carbon::parse($booking->NgayCheckOutDuKien)->format('Y-m-d');
                }

                // Cộng dồn thống kê theo trạng thái mới nhất
                if ($currentStatus === 'Trống') $stats['available']++;
                elseif ($currentStatus === 'Đang dọn') $stats['cleaning']++;
                else $stats['occupied']++;

                $roomsData[] = [
                    'id' => $p->PhongID,
                    'number' => $p->TenPhong,
                    'floor' => $floor,
                    'type' => $p->TenLoai ?? 'Standard',
                    'status' => $currentStatus, 
                    'price' => $p->GiaPhong ?? 0, 
                    'guestName' => $guestName,
                    'checkIn' => $checkIn,
                    'checkOut' => $checkOut
                ];
            }

            // 4. Tính tổng doanh thu hôm nay
            $revenue = DB::table('phieu_dat_phong')
                ->whereDate('NgayCheckIn', '<=', $today)
                ->whereDate('NgayCheckOutDuKien', '>=', $today)
                ->where('TrangThaiThanhToan', '!=', 'Đã hủy')
                ->sum('TongTienPhong');
            
            $stats['revenueToday'] = $revenue ?? 0;
            $stats['occupancyRate'] = $stats['totalRooms'] > 0 ? round(($stats['occupied'] / $stats['totalRooms']) * 100, 1) : 0;

            return response()->json([
                'stats' => $stats,
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