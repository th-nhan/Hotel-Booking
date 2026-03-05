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
        Schema::create('hoa_don', function (Blueprint $table) {
            $table->id('MaHoaDon');
            $table->dateTime('NgayLap');
            $table->unsignedBigInteger('KhachHangID');
            $table->decimal('TongTienPhong', 18, 2);
            $table->decimal('TongTienDV', 18, 2);
            $table->decimal('TongTien', 18, 2);
            $table->string('HinhThucThanhToan', 50);
            $table->string('TrangThai', 50);
            $table->unsignedBigInteger('NhanVienLapID'); // FK NhanVienID
            $table->timestamps();

            $table->foreign('KhachHangID')->references('KhachHangID')->on('khach_hang');
            $table->foreign('NhanVienLapID')->references('NhanVienID')->on('nhan_vien');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hoa_don');
    }
};
