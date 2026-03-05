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
        Schema::create('don_hang_dich_vu', function (Blueprint $table) {
            $table->id('MaDonHangDV');
            $table->unsignedBigInteger('KhachHangID');
            $table->dateTime('NgayDat');
            $table->string('TrangThai', 50);
            $table->text('GhiChu')->nullable();
            $table->timestamps();

            $table->foreign('KhachHangID')->references('KhachHangID')->on('khach_hang');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('don_hang_dich_vu');
    }
};
