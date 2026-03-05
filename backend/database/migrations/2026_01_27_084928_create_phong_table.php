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
        Schema::create('phong', function (Blueprint $table) {
            $table->id('PhongID');
            $table->string('TenPhong', 100);
            $table->unsignedBigInteger('LoaiPhongID');
            $table->text('MoTa')->nullable();
            $table->string('TinhTrang', 50);
            $table->decimal('GiaPhong', 18, 2); 
            $table->integer('SoLuongKhach');
            $table->dateTime('NgayTao')->nullable();
            $table->timestamps();

            $table->foreign('LoaiPhongID')->references('LoaiPhongID')->on('loai_phong');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('phong');
    }
};
