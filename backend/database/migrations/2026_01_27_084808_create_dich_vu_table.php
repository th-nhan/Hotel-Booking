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
        Schema::create('dich_vu', function (Blueprint $table) {
            $table->id('DichVuID');
            $table->string('TenDichVu', 250);
            $table->text('MoTa')->nullable();
            $table->decimal('DonGia', 18, 2);
            $table->string('HinhAnh', 255)->nullable();
            $table->boolean('TrangThai')->default(1);
            $table->dateTime('NgayTao')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dich_vu');
    }
};
