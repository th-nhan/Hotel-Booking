# 🏨 La Maison DTN — Backend RESTful API

Hệ thống Backend RESTful API phục vụ nghiệp vụ quản trị và đặt phòng khách sạn **La Maison DTN**, xây dựng trên nền tảng **Laravel Framework** (PHP 8.2+).

---

## 📋 Yêu cầu hệ thống (Prerequisites)

Trước khi chạy dự án, hãy đảm bảo môi trường phát triển của bạn đáp ứng:
- **PHP**: `>= 8.2` (Bật các extension: `pdo_mysql`, `mbstring`, `openssl`, `bcmath`, `fileinfo`, `gd`, `curl`)
- **Composer**: `>= 2.2`
- **MySQL / MariaDB**: `>= 8.0`
- **Node.js & npm** *(Tùy chọn, cần khi build assets backend)*

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
Mở file `.env` và thiết lập kết nối Database (ví dụ với MySQL):
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=hotel_booking
DB_USERNAME=root
DB_PASSWORD=
```
> ⚠️ **Lưu ý:** Đảm bảo bạn đã tạo Database `hotel_booking` trong MySQL (thông qua phpMyAdmin, HeidiSQL, DBeaver hoặc MySQL CLI).

### Bước 6: Chạy Migration và Seed dữ liệu mẫu
Tạo toàn bộ cấu trúc bảng và nạp dữ liệu demo ban đầu (tài khoản, loại phòng, danh sách phòng từ tầng 2-9):
```bash
php artisan migrate --seed
```
> 💡 *Nếu muốn xóa sạch DB và nạp lại từ đầu:*
> ```bash
> php artisan migrate:fresh --seed
> ```

### Bước 7: Tạo symbolic link cho thư mục lưu trữ ảnh (Storage Link)
```bash
php artisan storage:link
```

### Bước 8: Khởi chạy Server Backend
```bash
php artisan serve
```
Server API sẽ lắng nghe tại: **`http://127.0.0.1:8000`** (Base API: `http://127.0.0.1:8000/api`).

---

## 👥 Tài khoản thử nghiệm mặc định (Seed Data)

Sau khi chạy `migrate --seed`, hệ thống khởi tạo sẵn các tài khoản sau:

| Vai trò (Role) | Email | Mật khẩu | Quyền hạn & Mô tả |
| :--- | :--- | :--- | :--- |
| **👑 Admin** | `admin@hotel.com` | `123456` | Toàn quyền quản trị hệ thống, xem dashboard doanh thu, AI Analytics |
| **🛎️ Lễ tân (Receptionist)** | `nhanvien@hotel.com` | `123456` | Quản lý nhận/trả phòng, tiếp nhận đặt phòng và hủy đơn |
| **👤 Khách hàng (Customer)** | `khachhang@gmail.com` | `123456` | Tài khoản khách hàng mẫu để đặt phòng và đánh giá |

---

## 📡 Danh sách API Endpoints chi tiết

Base API URL: `http://127.0.0.1:8000/api`

### 1. Xác thực (Authentication) & Tài khoản cá nhân
| Method | Endpoint | Yêu cầu Auth | Mô tả |
| :--- | :--- | :---: | :--- |
| `POST` | `/register` | Không | Đăng ký tài khoản khách hàng mới |
| `POST` | `/login` | Không | Đăng nhập nhận Sanctum Token & thông tin User |
| `POST` | `/logout` | Có (Bearer) | Thu hồi Token và đăng xuất |
| `GET` | `/my-profile` | Có (Bearer) | Lấy thông tin tài khoản hiện tại |
| `POST` | `/update-profile` | Có (Bearer) | Cập nhật họ tên, SĐT, CCCD, địa chỉ... |
| `POST` | `/upload-avatar` | Có (Bearer) | Cập nhật ảnh đại diện người dùng |

### 2. Nghiệp vụ Phòng & Đặt phòng
| Method | Endpoint | Yêu cầu Auth | Mô tả |
| :--- | :--- | :---: | :--- |
| `GET` | `/phongs` | Không | Danh sách phòng theo tầng, loại phòng và tình trạng |
| `POST` | `/dat-phong` | Tùy chọn | Đặt phòng (chọn phòng, ngày check-in/out, thông tin khách) |
| `POST` | `/nhan-phong` | Có (Nhân viên) | Tiếp nhận nhận phòng (Check-in) |
| `POST` | `/tra-phong` | Có (Nhân viên) | Trả phòng và tính toán tổng tiền (Check-out) |
| `POST` | `/hoan-tat-don` | Có (Nhân viên) | Xác nhận hoàn thành đơn đặt phòng |

### 3. Nghiệp vụ Bàn Lễ tân (Receptionist)
| Method | Endpoint | Yêu cầu Auth | Mô tả |
| :--- | :--- | :---: | :--- |
| `GET` | `/receptionist/bookings` | Tùy chọn | Danh sách đặt phòng chi tiết cho bàn lễ tân |
| `POST` | `/receptionist/bookings/{id}/cancel` | Tùy chọn | Hủy đơn đặt phòng theo ID |

### 4. Đánh giá & Phân tích AI (Reviews & AI Sentiment)
| Method | Endpoint | Yêu cầu Auth | Mô tả |
| :--- | :--- | :---: | :--- |
| `GET` | `/review` | Không | Lấy danh sách đánh giá từ khách hàng |
| `POST` | `/review` | Không | Gửi đánh giá mới kèm điểm sao |
| `DELETE` | `/review/{id}` | Có | Xóa đánh giá |
| `POST` | `/review/{id}/like` | Không | Thả like/unlike đánh giá |
| `POST` | `/review/{id}/reply` | Không | Gửi phản hồi bình luận |
| `POST` | `/reviews/analyze-export` | Có | AI phân tích cảm xúc đánh giá & xuất file Excel báo cáo |

### 5. Quản trị hệ thống (Admin Management & Dashboard)
| Method | Endpoint | Yêu cầu Auth | Mô tả |
| :--- | :--- | :---: | :--- |
| `GET` | `/dashboard` | Không | Số liệu thống kê doanh thu, tỷ lệ phòng, đơn đặt |
| `GET` | `/accounts` | Có (Admin) | Danh sách toàn bộ tài khoản trong hệ thống |
| `POST` | `/accounts` | Có (Admin) | Tạo tài khoản nhân viên / quản trị mới |
| `PUT` | `/accounts/{id}` | Có (Admin) | Chỉnh sửa thông tin tài khoản |
| `PATCH` | `/accounts/{id}/toggle-status` | Có (Admin) | Khóa hoặc kích hoạt tài khoản |
| `DELETE` | `/accounts/{id}` | Có (Admin) | Xóa tài khoản |

---

## 🛠️ Các lệnh Artisan hữu ích thường dùng

* **Khởi động server backend:**
  ```bash
  php artisan serve
  ```
* **Xóa sạch cache hệ thống (khi sửa config hoặc routes không nhận):**
  ```bash
  php artisan optimize:clear
  ```
* **Làm mới hoàn toàn cơ sở dữ liệu và seed dữ liệu:**
  ```bash
  php artisan migrate:fresh --seed
  ```
* **Tạo liên kết thư mục public cho file upload:**
  ```bash
  php artisan storage:link
  ```
