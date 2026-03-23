<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PhongController;
use App\Http\Controllers\Api\DatPhongController;
use App\Http\Controllers\Api\TraPhongController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\ReviewController;

use App\Http\Controllers\Api\ReviewAIController;

Route::post('/reviews/analyze-export', [ReviewAIController::class, 'analyzeAndExport']);

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

Route::get('/test', function () {
    return response()->json([
        'status' => 'OK', 
        'message' => 'Backend Vercel đã thông đường 100%!'
    ]);
});

Route::get('/review', [ReviewController::class, 'index']);
Route::post('/review', [ReviewController::class, 'store']);
Route::delete('/review/{id}', [ReviewController::class, 'destroy']);
Route::post('/review/{id}/like', [ReviewController::class, 'toggleLike']);
Route::post('/review/{id}/reply', [ReviewController::class, 'addReply']);