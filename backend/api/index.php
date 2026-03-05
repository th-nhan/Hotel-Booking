<?php
// 1. Ép Laravel không bao giờ dùng View khi có lỗi (tránh lỗi lặp)
$_SERVER['HTTP_ACCEPT'] = 'application/json';

// 2. Chống lỗi 404 và 419 trên Vercel
$_SERVER['SCRIPT_NAME'] = '/index.php';

// 3. Cấu hình quyền ghi vào bộ nhớ đệm /tmp của Vercel
// Đây là chìa khóa để fix lỗi "Container->build('view')"
putenv('VIEW_COMPILED_PATH=/tmp/storage/framework/views');
putenv('APP_SERVICES_CACHE=/tmp/services.php');
putenv('APP_PACKAGES_CACHE=/tmp/packages.php');
putenv('APP_CONFIG_CACHE=/tmp/config.php');
putenv('APP_ROUTES_CACHE=/tmp/routes.php');

// Tạo cấu trúc thư mục cần thiết trong /tmp
if (!is_dir('/tmp/storage/framework/views')) {
    @mkdir('/tmp/storage/framework/views', 0777, true);
}

// 4. Header CORS (Giữ nguyên)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

require __DIR__ . '/../public/index.php';