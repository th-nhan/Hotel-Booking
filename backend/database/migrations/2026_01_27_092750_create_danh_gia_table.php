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
        Schema::create('danh_gia', function (Blueprint $table) {
            $table->id('DanhGiaID');
            $table->unsignedBigInteger('KhachHangID');
            $table->unsignedBigInteger('PhongID');
            $table->integer('NoiDung'); // Rating
            $table->text('BinhLuan')->nullable();
            $table->dateTime('NgayDanhGia');
            $table->timestamps();

            $table->foreign('KhachHangID')->references('KhachHangID')->on('khach_hang');
            $table->foreign('PhongID')->references('PhongID')->on('phong');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('danh_gia');
    }
};
