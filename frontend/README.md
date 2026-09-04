# 🌐 La Maison DTN — Frontend Application

Ứng dụng Single Page Application (SPA) cao cấp dành cho hệ thống Đặt phòng & Quản lý khách sạn 5 sao **La Maison DTN**, xây dựng trên nền tảng **React 19** và **Vite**.

---

## 🎨 Điểm nhấn & Trải nghiệm người dùng (UX/UI Highlights)

- **Thiết kế phong cách Luxury 5★**: Tông màu trang nhã, hiệu ứng chuyển động mượt mà với `motion` (Framer Motion).
- **Hỗ trợ Đa ngôn ngữ (i18n)**: Chuyển đổi linh hoạt Tiếng Việt (VI) và Tiếng Anh (EN) thông qua `LanguageContext`.
- **Sơ đồ phòng trực quan (Room Map)**: Hiển thị sơ đồ các phòng từ tầng 2 đến tầng 9 theo trạng thái thực tế.
- **Bàn làm việc Lễ tân (Receptionist Desk)**: Thao tác Check-in, Check-out, quản lý và hủy đơn đặt phòng tiện lợi.
- **Trung tâm Quản trị (Admin Dashboard & AI Analytics)**: Thống kê số liệu kinh doanh, tỷ lệ lấp đầy phòng, tích hợp AI phân tích đánh giá của khách hàng và xuất báo cáo.
- **Đánh giá & Phản hồi thời gian thực**: Khách hàng chấm điểm sao, bình luận, tương tác Like và Lễ tân/Admin trả lời phản hồi trực tiếp.

---

## 🛠️ Công nghệ sử dụng (Frontend Stack)

| Công nghệ | Phiên bản | Vai trò |
| :--- | :--- | :--- |
| **React** | `19.2` | Thư viện UI cốt lõi |
| **Vite** | `7.2` | Build tool và Dev Server tốc độ cao |
| **React Router DOM** | `7.13` | Định tuyến điều hướng trang (SPA Routing) |
| **TailwindCSS** | `3.4` | Framework CSS tiện ích cho giao diện responsive |
| **Lucide React** | `0.577` | Bộ biểu tượng vector hiện đại |
| **Framer Motion (`motion`)** | `12.38` | Animation và hiệu ứng tương tác cao cấp |
| **@ant-design/x** | `2.2` | Thành phần giao diện tích hợp AI |
| **Axios** | `1.13` | Xử lý HTTP Request gọi REST API |

---

## 🚀 Hướng dẫn cài đặt & Chạy Frontend

### 1. Yêu cầu môi trường
* **Node.js**: `>= 18.x` (khuyến nghị bản LTS)
* **npm** hoặc **yarn** / **pnpm**

### 2. Cài đặt các gói phụ thuộc
Di chuyển vào thư mục `frontend` và cài đặt dependencies:
```bash
cd frontend
npm install
```

### 3. Cấu hình biến môi trường
Kiểm tra hoặc tạo file `.env` tại thư mục `frontend`:
```env
VITE_API_URL=http://127.0.0.1:8000/api
```
*(Nếu triển khai production, thay đổi thành URL API backend thật của bạn).*

### 4. Khởi chạy Development Server
```bash
npm run dev
```
Mặc định ứng dụng sẽ chạy tại địa chỉ: **`http://localhost:5173`**.

### 5. Build cho môi trường Production
```bash
npm run build
```
Thư mục xuất bản tĩnh sẽ được lưu tại `frontend/dist`.

---

## 📁 Cấu trúc thư mục mã nguồn (`src/`)

```text
frontend/src/
├── assets/                  # Hình ảnh, banner, logo khách sạn
├── components/              # Các UI Component dùng chung
│   ├── layout/              # Navbar, Footer, ScrollToTop...
│   └── modals/              # Hộp thoại xác nhận, thông báo...
├── context/                 # State management toàn cục
│   └── LanguageContext.jsx  # Quản lý chuyển đổi ngôn ngữ (VI/EN)
├── locales/                 # File từ điển dịch thuật
│   ├── vi.js                # Tiếng Việt
│   └── en.js                # English
├── pages/                   # Các màn hình chính
│   ├── auth/                # Login, Register
│   ├── booking/             # RoomMap (Sơ đồ phòng), BookingPage (Đặt phòng)
│   ├── customer/            # ProfileCustomer (Hồ sơ), Review (Đánh giá)
│   ├── receptionist/        # ReceptionistDashboard (Bàn làm việc lễ tân)
│   ├── admin/               # HotelDashboard, AIAnalyzer (Phân tích AI)
│   └── about/               # Heritage (Lịch sử), MenuPreview, ExperienceDetail
├── App.jsx                  # Thiết lập danh sách Route
├── main.jsx                 # Entry point khởi tạo React
└── index.css                # Tùy biến CSS toàn cục và Tailwind directives
```

---

## 🧭 Danh sách các trang chính (Routes)

| Đường dẫn | Thành phần (Component) | Quyền truy cập | Mô tả |
| :--- | :--- | :--- | :--- |
| `/` | `Home.jsx` | Public | Trang chủ giới thiệu khách sạn 5 sao |
| `/login` | `Login.jsx` | Public | Đăng nhập tài khoản |
| `/register` | `Register.jsx` | Public | Đăng ký tài khoản mới |
| `/room-map` | `RoomMap.jsx` | Khách hàng | Xem sơ đồ phòng theo tầng & chọn phòng |
| `/booking-page` | `BookingPage.jsx` | Khách hàng | Điền thông tin và xác nhận đặt phòng |
| `/profile` | `ProfileCustomer.jsx` | Khách hàng (Đã đăng nhập) | Quản lý thông tin cá nhân & lịch sử đặt |
| `/reviews` | `ReviewPage.jsx` | Public / Khách hàng | Xem và gửi đánh giá khách sạn |
| `/receptionist` | `ReceptionistDashboard.jsx` | Lễ tân / Nhân viên | Nghiệp vụ tiếp nhận phòng & trả phòng |
| `/dashboard` | `HotelDashboard.jsx` | Admin | Quản trị toàn diện, doanh thu & AI Analyzer |
| `/heritage` | `Heritage.jsx` | Public | Giới thiệu câu chuyện di sản khách sạn |
| `/menu` | `MenuPreview.jsx` | Public | Thực đơn ẩm thực cao cấp |
| `/experiences` | `ExperienceDetail.jsx` | Public | Dịch vụ Spa, Wellness & trải nghiệm |
