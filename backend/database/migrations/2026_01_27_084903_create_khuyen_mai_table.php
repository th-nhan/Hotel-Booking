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
        Schema::create('khuyen_mai', function (Blueprint $table) {
            $table->id('KhuyenMaiID');
            $table->string('MaKhuyenMai', 50);
            $table->string('TenKhuyenMai', 255);
            $table->integer('PhanTramGiam');
            $table->dateTime('NgayBatDau');
            $table->dateTime('NgayKetThuc');
            $table->text('MoTa')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('khuyen_mai');
    }
};
