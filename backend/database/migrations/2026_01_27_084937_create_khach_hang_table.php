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
        Schema::create('khach_hang', function (Blueprint $table) {
            $table->id('KhachHangID');
            $table->string('HoTen', 100);
            $table->string('Email', 100);
            $table->string('DiaChi', 100);
            $table->string('SoDienThoai', 20);
            $table->string('CCCD', 20);
            $table->text('GhiChu')->nullable();
            $table->dateTime('NgayTao')->nullable();
            $table->unsignedBigInteger('TaiKhoanID')->nullable();
            $table->timestamps();

            $table->foreign('TaiKhoanID')->references('TaiKhoanID')->on('tai_khoan')->onDelete('cascade');;
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('khach_hang');
    }
};
