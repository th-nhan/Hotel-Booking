<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('phieu_dat_phong', function (Blueprint $table) {
            $table->id('PhieuDatPhongID');
            $table->string('MaPhieu', 50);
            $table->dateTime('NgayDat');
            $table->unsignedBigInteger('KhachHangID');
            $table->dateTime('NgayCheckIn');
            $table->dateTime('NgayCheckOutDuKien'); 
            $table->dateTime('NgayCheckOutThucTe')->nullable();
            $table->dateTime('NgayTao')->nullable();
            $table->unsignedBigInteger('NguoiTaoID'); 
            $table->decimal('TongTienPhong', 18, 2);
            $table->decimal('PhiPhuThu', 18, 2)->default(0);
            $table->decimal('TienCoc', 18, 2);
            $table->string('TrangThaiThanhToan', 50);
            $table->string('MaGiaoDich')->nullable();
            $table->timestamps();

            $table->foreign('KhachHangID')->references('KhachHangID')->on('khach_hang');
            $table->foreign('NguoiTaoID')->references('TaiKhoanID')->on('tai_khoan');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('phieu_dat_phong');
    }
};
