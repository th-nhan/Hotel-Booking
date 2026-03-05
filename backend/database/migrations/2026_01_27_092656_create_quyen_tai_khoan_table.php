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
        Schema::create('quyen_tai_khoan', function (Blueprint $table) {
            $table->unsignedBigInteger('TaiKhoanID');
            $table->unsignedBigInteger('MaQuyen');
            $table->string('MoTa', 500)->nullable();
            $table->primary(['TaiKhoanID', 'MaQuyen']);
            $table->foreign('TaiKhoanID')->references('TaiKhoanID')->on('tai_khoan')->onDelete('cascade');
            $table->foreign('MaQuyen')->references('MaQuyen')->on('quyen')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quyen_tai_khoan');
    }
};
