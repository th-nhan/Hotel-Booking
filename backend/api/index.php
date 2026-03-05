<?php
// 1. Sửa lỗi 404 và ép JSON
$_SERVER['SCRIPT_NAME'] = '/index.php';
$_SERVER['HTTP_ACCEPT'] = 'application/json';

// 2. Cấu hình quyền ghi vào bộ nhớ đệm /tmp (Giữ nguyên)
putenv('VIEW_COMPILED_PATH=/tmp/storage/framework/views');
putenv('APP_SERVICES_CACHE=/tmp/services.php');
putenv('APP_PACKAGES_CACHE=/tmp/packages.php');
putenv('APP_CONFIG_CACHE=/tmp/config.php');
putenv('APP_ROUTES_CACHE=/tmp/routes.php');

if (!is_dir('/tmp/storage/framework/views')) {
    @mkdir('/tmp/storage/framework/views', 0777, true);
}

// KHÔNG THÊM CÁC DÒNG header('Access-Control-Allow-Origin') Ở ĐÂY NỮA

require __DIR__ . '/../public/index.php';