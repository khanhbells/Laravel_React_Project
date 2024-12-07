<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\UserController;
use App\Http\Controllers\Api\V1\DashboardController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use SebastianBergmann\CodeCoverage\Report\Html\Dashboard;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

// Route::prefix('v1')->group(function () {
//     Route::post('/login', [AuthController::class, 'login']);
// });

Route::group([

    'middleware' => 'jwt',
    'prefix' => 'v1/auth'

], function ($router) {

    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('me', [AuthController::class, 'me']);
});
Route::group([

    'prefix' => 'v1'

], function ($router) {
    // User
    Route::get('users', [UserController::class, 'index']);
    Route::put('users/{id}/status', [UserController::class, 'updateStatusByField']);

    Route::delete('records/delete/batch', [DashboardController::class, 'deleteBatch']);
    Route::put('records/update/batch', [DashboardController::class, 'updateBatch']);
});

Route::post('v1/auth/refresh', [AuthController::class, 'refresh']);
Route::post('v1/auth/login', [AuthController::class, 'login']);
