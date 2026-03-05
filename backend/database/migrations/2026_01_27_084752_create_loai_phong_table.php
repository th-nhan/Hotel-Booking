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
        Schema::create('loai_phong', function (Blueprint $table) {
            $table->id('LoaiPhongID');
            $table->string('TenLoai', 100);
            $table->text('MoTa')->nullable();
            $table->decimal('GiaCoBan', 18, 2);
            $table->integer('SoLuongToiDa');
            $table->string('AnhDienDien', 200)->nullable();
            $table->dateTime('NgayTao')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('loai_phong');
    }
};
