markdown

Copy code
<div align="center">

# 🏨 **La Maison DTN** – *Luxury Hotel Management & Booking System*

[![Luxury Hotel Banner](https://via.placeholder.com/1200x300/1e3a8a/ffffff?text=La+Maison+DTN+-+5+Star+Luxury)](https://lamaisondtn.com)

</div>

**La Maison DTN** là nền tảng đặt phòng và quản lý khách sạn cao cấp dành cho khách sạn 5 sao phong cách châu Âu tại Việt Nam.

<div align="center">
<img src="https://img.shields.io/badge/Status-Production-brightgreen" alt="Status">
<img src="https://img.shields.io/badge/Frontend-ReactJS-blue" alt="Frontend">
<img src="https://img.shields.io/badge/Backend-Laravel-red" alt="Backend">
<img src="https://img.shields.io/badge/Database-MySQL-blueviolet" alt="Database">
</div>

---

## ✨ **Tính năng nổi bật**

### 👤 **Khách hàng**
✨ Tính năng

📝 Mô tả

Đăng ký/Đăng nhập

Bảo mật JWT Auth

Room Map tương tác

Khám phá phòng trực quan

Đặt phòng nhanh

Check-in/out linh hoạt

Quản lý booking

Xem lịch sử & tải file

Hồ sơ cá nhân

Cập nhật thông tin

🛠 Quản trị viên
Quản lý phòng & giá
Dashboard thống kê
Quản lý khách hàng
Báo cáo doanh thu
🛠 Tech Stack
mermaid

Copy code
graph TB
    A[ReactJS + Tailwind] --> B[Axios API Calls]
    B --> C[Laravel REST API]
    C --> D[MySQL Database]
    E[React Router] --> A
    F[Laravel Auth] --> C
Frontend

Copy code
React 18+ | React Router | Axios | TailwindCSS | Lucide Icons
Backend

Copy code
Laravel 10+ | REST API | JWT Auth | MySQL | Eloquent ORM
🚀 Quick Start
Prerequisites
bash

Copy code
Node.js 18+  PHP 8.1+  Composer  MySQL 8.0+
1. Backend Setup
bash

Copy code
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
2. Frontend Setup
bash

Copy code
cd frontend
npm install
npm run dev
<div align="center">
🌐 **Frontend

🔧 **Backend

http://localhost:3000

http://localhost:8000

</div>
📊 API Endpoints
yaml

Copy code
/auth:
  POST /login
  POST /register
  
/rooms:
  GET /rooms
  GET /rooms/{id}
  
/bookings:
  POST /bookings
  GET /bookings
  GET /bookings/{id}
🤝 Contributing
bash

Copy code
# Fork & Clone
git clone your-fork-url
cd la-maison-dtn

# Install & Run
npm install && composer install
npm run dev & php artisan serve
Fork repository
Create feature branch
Commit changes
Push & PR
📄 License
License: MIT

👨‍💻 Contact

Copy code
👨‍💻 Developer: Đỗ Thành Nhân
📧 Email: dothanhnhan1024@gmail.com
🌐 Demo: [https://lamaisondtn.com](https://hotel-booking-umber-one.vercel.app/)
📱 Hotline: +84 386356750
<div align="center">
⭐ Star us on GitHub if this project helped you!


</div> 
