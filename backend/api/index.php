<?php
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

echo "<h1>🔍 Trạm kiểm tra Vercel PHP</h1>";

$vendorPath = __DIR__ . '/../vendor/autoload.php';
$publicPath = __DIR__ . '/../public/index.php';

// Kiểm tra 1: Có thư mục vendor không?
if (!file_exists($vendorPath)) {
    echo "<h2 style='color:red'>🚨 LỖI 1: Không tìm thấy thư mục 'vendor'!</h2>";
    echo "<p>Nguyên nhân: Vercel chưa chạy Composer để cài thư viện.</p>";
    exit;
} else {
    echo "<h2 style='color:green'>✅ Đã thấy thư mục vendor.</h2>";
}

// Kiểm tra 2: Có file public/index.php không?
if (!file_exists($publicPath)) {
    echo "<h2 style='color:red'>🚨 LỖI 2: Không tìm thấy public/index.php!</h2>";
    exit;
} else {
    echo "<h2 style='color:green'>✅ Đã thấy public/index.php.</h2>";
}

// Kiểm tra 3: Thử load thư viện
require $vendorPath;
echo "<h2 style='color:blue'>✅ Load thư viện thành công! Nếu dừng ở đây, lỗi là do Laravel không có quyền ghi file vào thư mục Storage.</h2>";
exit;