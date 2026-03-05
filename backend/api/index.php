<?php
$_SERVER['HTTP_ACCEPT'] = 'application/json';
// --- TRỊ DỨT ĐIỂM CORS ---
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-XSRF-TOKEN');

// Nếu là request kiểm tra (OPTIONS) của trình duyệt, trả về OK (200) luôn và dừng lại
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}
// --------------------------------------------------------
// 1. Chuyển Log ra màn hình quản lý của Vercel (thay vì ghi vào file laravel.log)
putenv('LOG_CHANNEL=stderr');

// 2. Không dùng file để lưu Session và Cache nữa (tránh ghi file)
putenv('SESSION_DRIVER=cookie');
putenv('CACHE_STORE=array');

// 3. Chuyển toàn bộ các thư mục cần GHI của Laravel sang thư mục /tmp của Vercel
putenv('VIEW_COMPILED_PATH=/tmp/views');
putenv('APP_SERVICES_CACHE=/tmp/services.php');
putenv('APP_PACKAGES_CACHE=/tmp/packages.php');
putenv('APP_CONFIG_CACHE=/tmp/config.php');
putenv('APP_ROUTES_CACHE=/tmp/routes.php');
putenv('APP_EVENTS_CACHE=/tmp/events.php');

// Tạo sẵn thư mục chứa giao diện tạm
@mkdir('/tmp/views', 0777, true);

// 4. Khởi động Laravel bình thường
require __DIR__ . '/../public/index.php';