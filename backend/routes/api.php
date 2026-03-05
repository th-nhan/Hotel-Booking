<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PhongController;
use App\Http\Controllers\Api\DatPhongController;
use App\Http\Controllers\Api\TraPhongController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ProfileController;



Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/phongs', [PhongController::class, 'index']);
Route::post('/dat-phong', [DatPhongController::class, 'store']);
Route::post('/tra-phong', [TraPhongController::class, 'checkout']);

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Các route cần đăng nhập mới dùng được thì để trong này
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    // Route::get('/profile', ...);
});


Route::get('/dashboard', [\App\Http\Controllers\Api\DashboardController::class, 'index']);
Route::middleware('auth:sanctum')->get('/my-profile', [\App\Http\Controllers\Api\ProfileController::class, 'getProfile']);
Route::middleware('auth:sanctum')->post('/update-profile', [\App\Http\Controllers\Api\ProfileController::class, 'updateProfile']);