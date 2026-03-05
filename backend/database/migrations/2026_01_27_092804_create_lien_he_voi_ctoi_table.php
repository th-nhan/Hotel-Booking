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
        Schema::create('lien_he_voi_ctoi', function (Blueprint $table) {
            $table->id('LienHeID');
            $table->unsignedBigInteger('KhachHangID')->nullable();
            $table->unsignedBigInteger('TaiKhoanID')->nullable();
            $table->string('HoTen', 100);
            $table->string('Email', 200);
            $table->string('SoDienThoai', 20);
            $table->text('NoiDung');
            $table->dateTime('NgayGui');
            $table->string('TrangThai', 50);
            $table->text('GhiChu')->nullable();
            $table->timestamps();

            $table->foreign('KhachHangID')->references('KhachHangID')->on('khach_hang');
            $table->foreign('TaiKhoanID')->references('TaiKhoanID')->on('tai_khoan');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lien_he_voi_ctoi');
    }
};
