<?php
// 1. Sửa lỗi 404: Ép Laravel nhận đúng gốc tọa độ
$_SERVER['SCRIPT_NAME'] = '/index.php';

// 2. Sửa lỗi 419: Ép Laravel hiểu đây là yêu cầu API (JSON)
$_SERVER['HTTP_ACCEPT'] = 'application/json';

// 3. Sửa lỗi CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-XSRF-TOKEN');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

// 4. Các cấu hình chống sập cho Vercel (đã làm ở bước trước)
putenv('LOG_CHANNEL=stderr');
putenv('SESSION_DRIVER=cookie');
putenv('CACHE_STORE=array');
putenv('VIEW_COMPILED_PATH=/tmp/views');
@mkdir('/tmp/views', 0777, true);

// 5. Khởi động Laravel
require __DIR__ . '/../public/index.php';