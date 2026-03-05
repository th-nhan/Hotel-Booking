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
        Schema::create('chi_tiet_don_hang_dv', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('MaDonHangDV');
            $table->unsignedBigInteger('DichVuID');
            $table->integer('SoLuong');
            $table->decimal('DonGia', 18, 2);
            $table->decimal('ThanhTien', 18, 2);
            $table->timestamps();

            $table->foreign('MaDonHangDV')->references('MaDonHangDV')->on('don_hang_dich_vu')->onDelete('cascade');
            $table->foreign('DichVuID')->references('DichVuID')->on('dich_vu');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chi_tiet_don_hang_dv');
    }
};
