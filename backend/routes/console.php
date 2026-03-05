<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::call(function () {
    $motNgayTruoc = Carbon::now()->subDay(); // Lấy thời điểm cách đây 24h

    // Tìm tất cả các phòng "Đang dọn" mà thời điểm cập nhật (lúc checkout) đã quá 24h
    $affected = DB::table('phong')
        ->where('TinhTrang', 'Đang dọn')
        ->where('updated_at', '<=', $motNgayTruoc) 
        ->update([
            'TinhTrang' => 'Trống',
            'updated_at' => Carbon::now()
        ]);
        
    if ($affected > 0) {
        info("Đã tự động chuyển $affected phòng từ Đang dọn sang Trống.");
    }

})->hourly();