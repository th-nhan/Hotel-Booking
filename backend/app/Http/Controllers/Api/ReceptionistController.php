<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Exception;

class ReceptionistController extends Controller
{
    /**
     * Lấy danh sách tất cả các phiếu đặt phòng (Cả từ App và Tại quầy) kèm thông tin chi tiết
     */
    public function getBookings(Request $request)
    {
        try {
            $search = $request->query('search', '');
            $filter = $request->query('filter', 'all'); // all, app, walk_in, today_checkin, today_checkout, staying
            $today = Carbon::today()->toDateString();

            $query = DB::table('phieu_dat_phong')
                ->join('chi_tiet_phieu_dat_phong', 'phieu_dat_phong.PhieuDatPhongID', '=', 'chi_tiet_phieu_dat_phong.PhieuDatPhongID')
                ->join('phong', 'chi_tiet_phieu_dat_phong.PhongID', '=', 'phong.PhongID')
                ->join('loai_phong', 'phong.LoaiPhongID', '=', 'loai_phong.LoaiPhongID')
                ->leftJoin('khach_hang', 'phieu_dat_phong.KhachHangID', '=', 'khach_hang.KhachHangID')
                ->select(
                    'phieu_dat_phong.PhieuDatPhongID',
                    'phieu_dat_phong.MaPhieu',
                    'phieu_dat_phong.NgayDat',
                    'phieu_dat_phong.NgayCheckIn',
                    'phieu_dat_phong.NgayCheckOutDuKien',
                    'phieu_dat_phong.NgayCheckOutThucTe',
                    'phieu_dat_phong.TongTienPhong',
                    'phieu_dat_phong.TienCoc',
                    'phieu_dat_phong.PhiPhuThu',
                    'phieu_dat_phong.TrangThaiThanhToan',
                    'phieu_dat_phong.MaGiaoDich',
                    'phieu_dat_phong.NguoiTaoID',
                    'khach_hang.KhachHangID',
                    'khach_hang.HoTen as TenKhachHang',
                    'khach_hang.SoDienThoai',
                    'khach_hang.Email',
                    'khach_hang.CCCD',
                    'khach_hang.DiaChi',
                    'phong.PhongID',
                    'phong.TenPhong',
                    'phong.GiaPhong',
                    'phong.TinhTrang as TrangThaiPhong',
                    'loai_phong.TenLoai'
                )
                ->orderBy('phieu_dat_phong.PhieuDatPhongID', 'desc');

            // Lọc theo tìm kiếm
            if (!empty($search)) {
                $query->where(function ($q) use ($search) {
                    $q->where('khach_hang.HoTen', 'like', "%{$search}%")
                      ->orWhere('khach_hang.SoDienThoai', 'like', "%{$search}%")
                      ->orWhere('khach_hang.Email', 'like', "%{$search}%")
                      ->orWhere('khach_hang.CCCD', 'like', "%{$search}%")
                      ->orWhere('phieu_dat_phong.MaPhieu', 'like', "%{$search}%")
                      ->orWhere('phong.TenPhong', 'like', "%{$search}%");
                });
            }

            // Lọc theo mục tiêu ca trực của lễ tân
            if ($filter === 'today_checkin') {
                $query->whereDate('phieu_dat_phong.NgayCheckIn', $today)
                      ->whereNull('phieu_dat_phong.NgayCheckOutThucTe')
                      ->where('phieu_dat_phong.TrangThaiThanhToan', '!=', 'Đã hủy');
            } elseif ($filter === 'today_checkout') {
                $query->whereDate('phieu_dat_phong.NgayCheckOutDuKien', $today)
                      ->whereNull('phieu_dat_phong.NgayCheckOutThucTe')
                      ->where('phieu_dat_phong.TrangThaiThanhToan', '!=', 'Đã hủy');
            } elseif ($filter === 'staying') {
                $query->whereNull('phieu_dat_phong.NgayCheckOutThucTe')
                      ->where('phieu_dat_phong.TrangThaiThanhToan', '!=', 'Đã hủy')
                      ->where('phong.TinhTrang', 'Đang ở');
            } elseif ($filter === 'app') {
                // Đặt qua App thường có email hoặc khách hàng có tài khoản
                $query->where('phieu_dat_phong.TrangThaiThanhToan', 'Đã thanh toán')
                      ->orWhere('phieu_dat_phong.MaGiaoDich', '!=', null);
            } elseif ($filter === 'walk_in') {
                $query->where('phieu_dat_phong.TrangThaiThanhToan', 'Đã đặt cọc')
                      ->orWhere('khach_hang.DiaChi', 'like', '%Tại khách sạn%');
            }

            $rawBookings = $query->get();

            // Tính toán bổ sung trạng thái & nguồn đặt cho từng phiếu
            $processedBookings = $rawBookings->map(function ($b) use ($today) {
                $checkInDate = Carbon::parse($b->NgayCheckIn)->format('Y-m-d');
                $checkOutDate = Carbon::parse($b->NgayCheckOutDuKien)->format('Y-m-d');
                
                // Xác định nguồn đặt (Qua App hay Tại quầy)
                $isApp = (!empty($b->MaGiaoDich) || $b->TrangThaiThanhToan === 'Đã thanh toán' || ($b->DiaChi !== 'Tại khách sạn' && !empty($b->Email) && !str_contains($b->Email, '@lamaison.hotel')));
                $source = $isApp ? 'App Online' : 'Tại quầy';

                // Trạng thái hiển thị cho Lễ tân
                $statusLabel = 'Chờ nhận phòng';
                $statusColor = 'blue';

                if ($b->TrangThaiThanhToan === 'Đã hủy') {
                    $statusLabel = 'Đã hủy';
                    $statusColor = 'red';
                } elseif (!empty($b->NgayCheckOutThucTe)) {
                    $statusLabel = 'Đã hoàn tất (Check-out)';
                    $statusColor = 'gray';
                } elseif ($b->TrangThaiPhong === 'Đang ở') {
                    $statusLabel = 'Đang lưu trú';
                    $statusColor = 'gold';
                } elseif ($today >= $checkInDate) {
                    $statusLabel = 'Khách đến hôm nay (Cần Check-in)';
                    $statusColor = 'green';
                }

                return [
                    'PhieuDatPhongID' => $b->PhieuDatPhongID,
                    'MaPhieu' => $b->MaPhieu,
                    'TenKhachHang' => $b->TenKhachHang ?? 'Khách vãng lai',
                    'SoDienThoai' => $b->SoDienThoai ?? '—',
                    'Email' => $b->Email ?? '—',
                    'CCCD' => $b->CCCD ?? '—',
                    'DiaChi' => $b->DiaChi ?? '—',
                    'PhongID' => $b->PhongID,
                    'TenPhong' => $b->TenPhong,
                    'TenLoai' => $b->TenLoai,
                    'GiaPhong' => $b->GiaPhong,
                    'TrangThaiPhong' => $b->TrangThaiPhong,
                    'NgayCheckIn' => $checkInDate,
                    'NgayCheckOutDuKien' => $checkOutDate,
                    'NgayCheckOutThucTe' => $b->NgayCheckOutThucTe ? Carbon::parse($b->NgayCheckOutThucTe)->format('Y-m-d H:i') : null,
                    'TongTienPhong' => (float)$b->TongTienPhong,
                    'TienCoc' => (float)$b->TienCoc,
                    'PhiPhuThu' => (float)$b->PhiPhuThu,
                    'TrangThaiThanhToan' => $b->TrangThaiThanhToan,
                    'NguonDat' => $source,
                    'StatusLabel' => $statusLabel,
                    'StatusColor' => $statusColor
                ];
            });

            // Thống kê nhanh ca trực
            $allActive = DB::table('phieu_dat_phong')
                ->where('TrangThaiThanhToan', '!=', 'Đã hủy')
                ->whereNull('NgayCheckOutThucTe')
                ->get();

            $rooms = DB::table('phong')->get();

            $stats = [
                'checkInToday' => $allActive->where('NgayCheckIn', '>=', $today . ' 00:00:00')->where('NgayCheckIn', '<=', $today . ' 23:59:59')->count(),
                'checkOutToday' => $allActive->where('NgayCheckOutDuKien', '>=', $today . ' 00:00:00')->where('NgayCheckOutDuKien', '<=', $today . ' 23:59:59')->count(),
                'stayingRooms' => $rooms->where('TinhTrang', 'Đang ở')->count(),
                'availableRooms' => $rooms->where('TinhTrang', 'Trống')->count(),
                'cleaningRooms' => $rooms->where('TinhTrang', 'Đang dọn')->count(),
                'totalBookings' => DB::table('phieu_dat_phong')->count()
            ];

            return response()->json([
                'status' => 'success',
                'stats' => $stats,
                'data' => $processedBookings
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi tải dữ liệu Lễ tân: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Hủy phiếu đặt phòng và cập nhật trạng thái phòng
     */
    public function cancelBooking($id)
    {
        DB::beginTransaction();
        try {
            $phieu = DB::table('phieu_dat_phong')->where('PhieuDatPhongID', $id)->first();
            if (!$phieu) {
                return response()->json(['status' => 'error', 'message' => 'Phiếu đặt phòng không tồn tại!'], 404);
            }

            // Cập nhật trạng thái phiếu sang Đã hủy
            DB::table('phieu_dat_phong')->where('PhieuDatPhongID', $id)->update([
                'TrangThaiThanhToan' => 'Đã hủy',
                'updated_at' => now()
            ]);

            // Lấy phòng và giải phóng trạng thái phòng về Trống nếu không còn phiếu nào đang giữ
            $chiTiet = DB::table('chi_tiet_phieu_dat_phong')->where('PhieuDatPhongID', $id)->first();
            if ($chiTiet) {
                $otherActive = DB::table('phieu_dat_phong')
                    ->join('chi_tiet_phieu_dat_phong', 'phieu_dat_phong.PhieuDatPhongID', '=', 'chi_tiet_phieu_dat_phong.PhieuDatPhongID')
                    ->where('chi_tiet_phieu_dat_phong.PhongID', $chiTiet->PhongID)
                    ->where('phieu_dat_phong.PhieuDatPhongID', '!=', $id)
                    ->where('phieu_dat_phong.TrangThaiThanhToan', '!=', 'Đã hủy')
                    ->whereNull('phieu_dat_phong.NgayCheckOutThucTe')
                    ->exists();

                if (!$otherActive) {
                    DB::table('phong')->where('PhongID', $chiTiet->PhongID)->update(['TinhTrang' => 'Trống']);
                }
            }

            DB::commit();
            return response()->json(['status' => 'success', 'message' => 'Đã hủy phiếu đặt phòng thành công!']);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['status' => 'error', 'message' => 'Lỗi hủy phiếu: ' . $e->getMessage()], 500);
        }
    }
}
