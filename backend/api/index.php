<?php
// Ép hiện lỗi hệ thống
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

try {
    // Kích hoạt Laravel
    require __DIR__ . '/../public/index.php';
} catch (\Throwable $e) {
    // Nếu Laravel lăn đ ra chết, bắt ngay cái xác lại và khám nghiệm!
    echo "<h1 style='color:red'>🚨 Đã tóm được thủ phạm làm sập server!</h1>";
    echo "<h3>Tên lỗi: " . get_class($e) . "</h3>";
    echo "<p style='font-size: 18px; color: darkred;'><b>Chi tiết:</b> " . $e->getMessage() . "</p>";
    echo "<p><b>Nơi gây án:</b> File <code>" . $e->getFile() . "</code> tại dòng <b>" . $e->getLine() . "</b></p>";
    
    echo "<hr><p><b>Dấu vết (Stack Trace):</b></p>";
    echo "<pre style='background: #f4f4f4; padding: 10px; border-radius: 5px;'>" . $e->getTraceAsString() . "</pre>";
}