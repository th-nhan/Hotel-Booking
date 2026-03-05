<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});


// Tuyệt chiêu gom mọi đường link: Bất kể gõ link gì cũng sẽ lọt vào đây
Route::any('{any}', function (Request $request) {
    return response()->json([
        'tin_nhan' => 'Đã tóm được URL thực tế!',
        'url_laravel_dang_hieu_la' => $request->path(),
        'phuong_thuc' => $request->method()
    ]);
})->where('any', '.*');