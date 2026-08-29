# 🏨 Hotel Booking - Backend API (Laravel)

Hệ thống Backend RESTful API phục vụ quản trị và đặt phòng khách sạn, được xây dựng trên nền tảng **Laravel Framework** (PHP 8.2+).

---

## 📋 Yêu cầu hệ thống (Prerequisites)

Trước khi chạy dự án, hãy đảm bảo máy tính của bạn đã cài đặt:
- **PHP** >= 8.2 (Bật các extension: `pdo_mysql` / `pdo_sqlite`, `mbstring`, `openssl`, `bcmath`, `fileinfo`, `gd`)
- **Composer** >= 2.0
- **MySQL** / **MariaDB** (hoặc SQLite)
- **Node.js** & **npm** (tùy chọn nếu cần build asset)

---

## 🚀 Hướng dẫn cài đặt & Khởi chạy dự án

### Bước 1: Mở terminal và di chuyển vào thư mục backend
```bash
cd backend
```

### Bước 2: Cài đặt các thư viện phụ thuộc (Composer)
```bash
composer install
```

### Bước 3: Tạo file cấu hình môi trường `.env`
- Trên **Windows (CMD / PowerShell)**:
  ```powershell
  copy .env.example .env
  ```
- Hoặc trên **Linux / macOS**:
  ```bash
  cp .env.example .env
  ```

### Bước 4: Tạo Application Key
```bash
php artisan key:generate
```

### Bước 5: Cấu hình Cơ sở dữ liệu
Mở file `.env` và thiết lập thông tin kết nối Database của bạn (ví dụ với MySQL):
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=hotel_booking
DB_USERNAME=root
DB_PASSWORD=
```
> *Lưu ý: Đảm bảo bạn đã tạo Database `hotel_booking` trong MySQL (qua phpMyAdmin, DBeaver, Navicat hoặc dòng lệnh).*

### Bước 6: Chạy Migration và Seed dữ liệu mẫu
Tạo toàn bộ các bảng và nạp dữ liệu mẫu ban đầu:
```bash
php artisan migrate --seed
```
> *Nếu muốn xóa sạch DB và nạp lại từ đầu:*
> ```bash
> php artisan migrate:fresh --seed
> ```

### Bước 7: Khởi chạy Server
Chạy lệnh sau để khởi động Laravel Development Server:
```bash
php artisan serve
```
> ⚠️ **Lưu ý:** Lệnh chuẩn là `php artisan serve` (không phải `php serve artisan`).

Server sẽ mặc định chạy tại: **`http://127.0.0.1:8000`** hoặc **`http://localhost:8000`**.

---

## 👥 Tài khoản thử nghiệm mặc định (Seed Data)

Sau khi chạy `--seed`, bạn có thể dùng các tài khoản sau để đăng nhập:

| Vai trò | Email | Mật khẩu | Mô tả |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@hotel.com` | `123456` | Toàn quyền quản trị hệ thống |
| **Nhân viên / Lễ tân** | `nhanvien@hotel.com` | `123456` | Quản lý nhận/trả phòng, đơn đặt |
| **Khách hàng** | `khachhang@gmail.com` | `123456` | Tài khoản khách hàng mẫu |

---

## 🛠️ Các lệnh hữu ích thường dùng (Artisan & Composer)

- **Khởi động server backend:**
  ```bash
  php artisan serve
  ```
- **Xóa cache hệ thống (khi sửa config hoặc route không nhận):**
  ```bash
  php artisan optimize:clear
  # hoặc xóa từng loại:
  php artisan config:clear
  php artisan route:clear
  php artisan cache:clear
  ```
- **Tạo link lưu trữ hình ảnh/file:**
  ```bash
  php artisan storage:link
  ```
- **Tạo lại toàn bộ CSDL và nạp dữ liệu:**
  ```bash
  php artisan migrate:fresh --seed
  ```

---

## 📡 Danh sách API Endpoints chính

Base URL: `http://localhost:8000/api`

### 1. Xác thực (Authentication) & Tài khoản
- `POST /api/register` - Đăng ký tài khoản mới
- `POST /api/login` - Đăng nhập nhận Sanctum Token
- `POST /api/logout` - Đăng xuất (Cần Bearer Token)
- `GET  /api/my-profile` - Lấy thông tin cá nhân (Cần Bearer Token)
- `POST /api/update-profile` - Cập nhật hồ sơ cá nhân (Cần Bearer Token)

### 2. Quản lý Phòng & Đặt phòng
- `GET  /api/phongs` - Lấy danh sách phòng và trạng thái
- `POST /api/dat-phong` - Đặt phòng
- `POST /api/nhan-phong` - Nhận phòng (Check-in)
- `POST /api/tra-phong` - Trả phòng & tính tiền (Check-out)
- `POST /api/hoan-tat-don` - Hoàn tất đơn đặt phòng

### 3. Đánh giá & Phản hồi (Reviews)
- `GET    /api/review` - Xem danh sách đánh giá
- `POST   /api/review` - Gửi đánh giá mới
- `DELETE /api/review/{id}` - Xóa đánh giá
- `POST   /api/review/{id}/like` - Thả like đánh giá
- `POST   /api/review/{id}/reply` - Phản hồi đánh giá
- `POST   /api/reviews/analyze-export` - Phân tích AI & Xuất báo cáo đánh giá

### 4. Thống kê (Dashboard)
- `GET  /api/dashboard` - Dữ liệu tổng quan doanh thu, số lượng phòng, trạng thái đặt phòng
