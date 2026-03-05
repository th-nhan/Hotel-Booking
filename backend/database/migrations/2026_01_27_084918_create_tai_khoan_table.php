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
        Schema::create('tai_khoan', function (Blueprint $table) {
            $table->id('TaiKhoanID');
            $table->string('Email', 50)->unique();
            $table->string('MatKhau', 255);
            $table->unsignedBigInteger('VaiTroID');
            $table->integer('TrangThai');
            $table->string('HoTen', 255);
            $table->dateTime('NgayTao')->nullable();
            $table->timestamps();

            $table->foreign('VaiTroID')->references('VaiTroID')->on('vai_tro');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tai_khoan');
    }
};
