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
        Schema::create('nhan_vien', function (Blueprint $table) {
            $table->id('NhanVienID');
            $table->string('HoTen', 100);
            $table->string('CCCD', 20);
            $table->string('DiaChi', 100);
            $table->string('SoDienThoai', 20);
            $table->string('Email', 100);
            $table->unsignedBigInteger('TaiKhoanID');
            $table->string('GhiChu', 200)->nullable();
            $table->dateTime('NgayTao')->nullable();
            $table->timestamps();

            $table->foreign('TaiKhoanID')->references('TaiKhoanID')->on('tai_khoan');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nhan_vien');
    }
};
