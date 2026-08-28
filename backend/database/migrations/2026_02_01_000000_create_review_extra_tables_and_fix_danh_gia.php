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
        // 1. Sửa PhongID trong bảng danh_gia thành nullable
        Schema::table('danh_gia', function (Blueprint $table) {
            $table->unsignedBigInteger('PhongID')->nullable()->change();
        });

        // 2. Tạo bảng chi_tiet_like nếu chưa có
        if (!Schema::hasTable('chi_tiet_like')) {
            Schema::create('chi_tiet_like', function (Blueprint $table) {
                $table->id('LikeID');
                $table->unsignedBigInteger('DanhGiaID');
                $table->unsignedBigInteger('KhachHangID');
                $table->timestamps();

                $table->foreign('DanhGiaID')->references('DanhGiaID')->on('danh_gia')->onDelete('cascade');
                $table->foreign('KhachHangID')->references('KhachHangID')->on('khach_hang')->onDelete('cascade');
            });
        }

        // 3. Tạo bảng tra_loi_danh_gia nếu chưa có
        if (!Schema::hasTable('tra_loi_danh_gia')) {
            Schema::create('tra_loi_danh_gia', function (Blueprint $table) {
                $table->id('TraLoiID');
                $table->unsignedBigInteger('DanhGiaID');
                $table->unsignedBigInteger('KhachHangID');
                $table->text('NoiDung');
                $table->dateTime('NgayTraLoi')->nullable();
                $table->timestamps();

                $table->foreign('DanhGiaID')->references('DanhGiaID')->on('danh_gia')->onDelete('cascade');
                $table->foreign('KhachHangID')->references('KhachHangID')->on('khach_hang')->onDelete('cascade');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tra_loi_danh_gia');
        Schema::dropIfExists('chi_tiet_like');
    }
};
