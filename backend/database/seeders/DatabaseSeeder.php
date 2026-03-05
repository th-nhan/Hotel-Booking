<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        // 1. Quyền & Vai Trò
        DB::table('quyen')->insert([
            ['MaQuyen' => 1, 'TenQuyen' => 'AdminFull', 'MoTa' => 'Toàn quyền hệ thống'],
            ['MaQuyen' => 2, 'TenQuyen' => 'Receptionist', 'MoTa' => 'Lễ tân đặt phòng'],
        ]);

        DB::table('vai_tro')->insert([
            ['VaiTroID' => 1, 'TenVaiTro' => 'Admin'],
            ['VaiTroID' => 2, 'TenVaiTro' => 'NhanVien'],
            ['VaiTroID' => 3, 'TenVaiTro' => 'KhachHang'],
        ]);

        // 2. Tài Khoản & Quyền Tài Khoản
        DB::table('tai_khoan')->insert([
            ['TaiKhoanID' => 1, 'Email' => 'admin@hotel.com', 'MatKhau' => Hash::make('123456'), 'VaiTroID' => 1, 'TrangThai' => 1, 'HoTen' => 'Admin', 'NgayTao' => $now],
            ['TaiKhoanID' => 2, 'Email' => 'nhanvien@hotel.com', 'MatKhau' => Hash::make('123456'), 'VaiTroID' => 2, 'TrangThai' => 1, 'HoTen' => 'Lễ Tân A', 'NgayTao' => $now],
            ['TaiKhoanID' => 3, 'Email' => 'khachhang@gmail.com', 'MatKhau' => Hash::make('123456'), 'VaiTroID' => 3, 'TrangThai' => 1, 'HoTen' => 'Nguyễn Khách', 'NgayTao' => $now],
        ]);

        DB::table('quyen_tai_khoan')->insert([
            ['TaiKhoanID' => 1, 'MaQuyen' => 1, 'MoTa' => 'Cấp quyền cao nhất'],
            ['TaiKhoanID' => 2, 'MaQuyen' => 2, 'MoTa' => 'Cấp quyền lễ tân'],
        ]);

        // 3. Nhân Viên & Khách Hàng
        DB::table('nhan_vien')->insert([
            ['NhanVienID' => 1, 'HoTen' => 'Lễ Tân A', 'CCCD' => '012345678', 'DiaChi' => 'Hà Nội', 'SoDienThoai' => '0912345678', 'Email' => 'nhanvien@hotel.com', 'TaiKhoanID' => 2, 'NgayTao' => $now],
        ]);

        DB::table('khach_hang')->insert([
            ['KhachHangID' => 1, 'HoTen' => 'Nguyễn Khách', 'Email' => 'khachhang@gmail.com', 'DiaChi' => 'Hải Phòng', 'SoDienThoai' => '0988888888', 'CCCD' => '0011223344', 'TaiKhoanID' => 3, 'NgayTao' => $now],
        ]);

        // 4. Loại Phòng & Phòng
        $now = now();

        DB::table('loai_phong')->insert([
            [
                'LoaiPhongID'    => 1,
                'TenLoai'        => 'Phòng Đơn',
                'MoTa'           => 'Phòng dành cho 1 người, không gian nhỏ gọn, đầy đủ tiện nghi cơ bản.',
                'GiaCoBan'       => 900000,
                'SoLuongToiDa'   => 2,
                'AnhDienDien'    => 'https://krass.vn/wp-content/uploads/2024/01/Mau-phong-ngu-khach-san-sang-trong.jpg',
                'NgayTao'        => $now,
                'created_at'     => $now,
                'updated_at'     => $now,
            ],
            [
                'LoaiPhongID'    => 2,
                'TenLoai'        => 'Phòng Đôi',
                'MoTa'           => 'Phòng dành cho 2 người, phù hợp cho cặp đôi hoặc bạn bè.',
                'GiaCoBan'       => 1600000,
                'SoLuongToiDa'   => 4,
                'AnhDienDien'    => 'https://noithatminhkhoi.com/upload/images/tieu-chuan-giuong-ngu-dep-cho-khach-san-5-sao.jpg',
                'NgayTao'        => $now,
                'created_at'     => $now,
                'updated_at'     => $now,
            ],
            [
                'LoaiPhongID'    => 3,
                'TenLoai'        => 'Phòng Tổng Thống',
                'MoTa'           => 'Phòng cao cấp nhất, không gian rộng rãi, tiện nghi sang trọng.',
                'GiaCoBan'       => 5000000,
                'SoLuongToiDa'   => 6,
                'AnhDienDien'    => 'https://images2.thanhnien.vn/528068263637045248/2023/9/11/biden-16-169441443748282765858.jpg',
                'NgayTao'        => $now,
                'created_at'     => $now,
                'updated_at'     => $now,
            ],
        ]);

        $rooms = [];
        $now = now();

        // Cấu hình tên tòa (Để 'A' nếu muốn tên phòng là A101, để rỗng '' nếu muốn tên phòng là 101)
        $block = ''; // Tôi để rỗng theo giao diện của bạn (hiển thị 901, 801 thay vì A901)

        // Bắt đầu từ tầng 2 đến tầng 9
        for ($floor = 2; $floor <= 9; $floor++) {

            // Mặc định cấu hình
            $loaiPhongId = 1;
            $soLuongPhong = 10;
            $giaPhong = 900000;
            $soLuongKhach = 2;

            // Tầng 2-5: Single Rooms (10 phòng/tầng) - Không cần đổi vì đã lấy mặc định ở trên
            if ($floor >= 2 && $floor <= 5) {
                $loaiPhongId = 1;
                $soLuongPhong = 10;
                $giaPhong = 900000;
                $soLuongKhach = 2; 
            } 
            // Tầng 6-8: Double Rooms (5 phòng/tầng)
            elseif ($floor >= 6 && $floor <= 8) {
                $loaiPhongId = 2;
                $soLuongPhong = 5; // Chỉ lặp 5 lần tạo 5 phòng
                $giaPhong = 1600000;
                $soLuongKhach = 4;
            } 
            // Tầng 9: Presidential Suites (3 phòng lớn)
            elseif ($floor == 9) {
                $loaiPhongId = 3;
                $soLuongPhong = 3; // Chỉ lặp 3 lần tạo 3 phòng
                $giaPhong = 5000000;
                $soLuongKhach = 6;
            }

            // Vòng lặp tạo phòng theo số lượng đã quy định cho từng tầng
            for ($roomNum = 1; $roomNum <= $soLuongPhong; $roomNum++) {
                
                // Định dạng số phòng có 2 chữ số (01, 02...)
                $formattedRoomNum = str_pad($roomNum, 2, '0', STR_PAD_LEFT);
                $tenPhong = $block . $floor . $formattedRoomNum; // Kết quả: 901, 902...

                $rooms[] = [
                    'TenPhong' => $tenPhong,
                    'LoaiPhongID' => $loaiPhongId,
                    'TinhTrang' => 'Trống',
                    'GiaPhong' => $giaPhong,
                    'SoLuongKhach' => $soLuongKhach,
                    'NgayTao' => $now->copy(),
                ];
            }
        }

        // 1. Chèn toàn bộ dữ liệu vào bảng
        DB::table('phong')->insert($rooms);
        // 2. Tạo một vài dữ liệu giả (Đang ở / Đang dọn) để test giao diện lưới
        // DB::table('phong')->where('TenPhong', '902')->update(['TinhTrang' => 'Đã đặt']);
        // DB::table('phong')->where('TenPhong', '801')->update(['TinhTrang' => 'Đang dọn']);
        // DB::table('phong')->where('TenPhong', '602')->update(['TinhTrang' => 'Đã đặt']);
        // DB::table('phong')->where('TenPhong', '204')->update(['TinhTrang' => 'Đang ở']);

        // 5. Dịch Vụ & Đơn Hàng Dịch Vụ
        $now = now();

        DB::table('dich_vu')->insert([
            [
                'DichVuID'    => 1,
                'TenDichVu'   => 'Massage thư giãn',
                'MoTa'        => 'Dịch vụ massage toàn thân tại spa khách sạn.',
                'DonGia'      => 300000,
                'HinhAnh'     => 'massage.jpg',
                'TrangThai'   => 1,
                'NgayTao'     => $now->copy(),
                'created_at'  => $now->copy(),
                'updated_at'  => $now->copy(),
            ],
            [
                'DichVuID'    => 2,
                'TenDichVu'   => 'Nước suối Lavie',
                'MoTa'        => 'Nước suối Lavie chai 500ml.',
                'DonGia'      => 15000,
                'HinhAnh'     => 'lavie.jpg',
                'TrangThai'   => 1,
                'NgayTao'     => $now->copy(),
                'created_at'  => $now->copy(),
                'updated_at'  => $now->copy(),
            ],
            [
                'DichVuID'    => 3,
                'TenDichVu'   => 'Giặt ủi quần áo',
                'MoTa'        => 'Dịch vụ giặt ủi và là quần áo trong ngày.',
                'DonGia'      => 100000,
                'HinhAnh'     => 'giat-ui.jpg',
                'TrangThai'   => 1,
                'NgayTao'     => $now->copy(),
                'created_at'  => $now->copy(),
                'updated_at'  => $now->copy(),
            ],
            [
                'DichVuID'    => 4,
                'TenDichVu'   => 'Ăn sáng buffet',
                'MoTa'        => 'Buffet sáng tại nhà hàng khách sạn.',
                'DonGia'      => 199000,
                'HinhAnh'     => 'buffet.jpg',
                'TrangThai'   => 1,
                'NgayTao'     => $now->copy(),
                'created_at'  => $now->copy(),
                'updated_at'  => $now->copy(),
            ],
        ]);


        DB::table('don_hang_dich_vu')->insert([
            ['MaDonHangDV' => 1, 'KhachHangID' => 1, 'NgayDat' => $now, 'TrangThai' => 'Đã giao'],
        ]);

        DB::table('chi_tiet_don_hang_dv')->insert([
            [
                'MaDonHangDV' => 1,
                'DichVuID'    => 1,
                'SoLuong'     => 1,
                'DonGia'      => 300000,
                'ThanhTien'   => 300000,
            ],
            ['MaDonHangDV' => 1, 'DichVuID' => 2, 'SoLuong' => 2, 'DonGia' => 15000, 'ThanhTien' => 30000],
        ]);


        DB::table('khuyen_mai')->insert([
            ['KhuyenMaiID' => 1, 'MaKhuyenMai' => 'GIAM50', 'TenKhuyenMai' => 'Giảm 50k', 'PhanTramGiam' => 0, 'NgayBatDau' => $now->copy(), 'NgayKetThuc' => $now->copy()->addDays(10)],
        ]);

        DB::table('phieu_dat_phong')->insert([
            [
                'PhieuDatPhongID'        => 1,
                'MaPhieu'               => 'PDP_001',
                'NgayDat'               => $now->copy(),
                'KhachHangID'           => 1,
                'NgayCheckIn'           => $now->copy(),
                'NgayCheckOutDuKien'    => $now->copy()->addDays(2),
                'NgayCheckOutThucTe'    => null,
                'NgayTao'               => $now->copy(),
                'NguoiTaoID'            => 1,
                'TongTienPhong'         => 1800000,
                'PhiPhuThu'             => 0,
                'TienCoc'               => 500000,
                'TrangThaiThanhToan'    => 'Chưa thanh toán',
                'MaGiaoDich'            => null,
                'created_at'            => $now->copy(),
                'updated_at'            => $now->copy(),
            ],
        ]);


        DB::table('chi_tiet_phieu_dat_phong')->insert([
            ['ChiTietID' => 1, 'PhieuDatPhongID' => 1, 'PhongID' => 2, 'DonGia' => 900000],
        ]);

        // 7. Hóa Đơn (Kết quả cuối cùng)
        DB::table('hoa_don')->insert([
            [
                'MaHoaDon' => 1,
                'NgayLap' => $now,
                'KhachHangID' => 1,
                'TongTienPhong' => 1800000,
                'TongTienDV' => 330000,
                'TongTien' => 2130000,
                'HinhThucThanhToan' => 'Tiền mặt',
                'TrangThai' => 'Đã thanh toán',
                'NhanVienLapID' => 1
            ],
        ]);

        // 8. Tương tác: Liên hệ & Đánh giá
        DB::table('lien_he_voi_ctoi')->insert([
            ['LienHeID' => 1, 'KhachHangID' => 1, 'HoTen' => 'Nguyễn Khách', 'Email' => 'khachhang@gmail.com', 'SoDienThoai' => '0988888888', 'NoiDung' => 'Tôi muốn phòng', 'NgayGui' => $now->copy()->subWeek(), 'TrangThai' => 'Mới'],
        ]);

        DB::table('danh_gia')->insert([
            ['DanhGiaID' => 1, 'KhachHangID' => 1, 'PhongID' => 2, 'NoiDung' => 5, 'BinhLuan' => 'Phòng sạch sẽ', 'NgayDanhGia' => $now->copy()->addDays(7)],
        ]);
    }
}
