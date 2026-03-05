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
        Schema::create('chi_tiet_phieu_dat_phong', function (Blueprint $table) {
            $table->id('ChiTietID');
            $table->unsignedBigInteger('PhieuDatPhongID');
            $table->unsignedBigInteger('PhongID');
            $table->decimal('DonGia', 18, 2);
            $table->timestamps();

            $table->foreign('PhieuDatPhongID')->references('PhieuDatPhongID')->on('phieu_dat_phong')->onDelete('cascade');
            $table->foreign('PhongID')->references('PhongID')->on('phong');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chi_tiet_phieu_dat_phong');
    }
};
