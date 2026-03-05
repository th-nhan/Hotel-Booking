<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable; // Quan trọng: Kế thừa từ Authenticatable để đăng nhập được
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // Quan trọng: Để tạo Token API

class TaiKhoan extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    // 1. Khai báo tên bảng (Nếu không khai báo, Laravel sẽ tự tìm bảng tên 'tai_khoans')
    protected $table = 'tai_khoan';

    // 2. Khai báo khóa chính (Laravel mặc định là 'id', của bạn là 'TaiKhoanID')
    protected $primaryKey = 'TaiKhoanID';

    // 3. Các cột được phép thêm dữ liệu (Mass Assignment)
    protected $fillable = [
        'TaiKhoanID',
        'Email',
        'MatKhau',
        'HoTen',
        'VaiTroID',
        'TrangThai',
        'NgayTao'
    ];

    // 4. Các cột cần ẩn đi khi trả về API (Bảo mật)
    protected $hidden = [
        'MatKhau',       // Giấu mật khẩu
        'remember_token',
    ];

    // 5. Cấu hình ép kiểu dữ liệu (nếu cần)
    protected $casts = [
        'NgayTao' => 'datetime',
        'TrangThai' => 'boolean', // Chuyển 1/0 thành true/false
    ];

    // 6. QUAN TRỌNG NHẤT: Báo cho Laravel biết cột mật khẩu của bạn tên là 'MatKhau'
    // Mặc định Laravel sẽ tìm cột 'password', nên phải ghi đè hàm này
    public function getAuthPassword()
    {
        return $this->MatKhau;
    }
}