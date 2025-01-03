<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\UserController;
use App\Http\Controllers\Api\V1\UserCatalogueController;
use App\Http\Controllers\Api\V1\PostCatalogueController;
use App\Http\Controllers\Api\V1\UploadController;
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
    'middleware' => 'jwt',
    'prefix' => 'v1'

], function ($router) {
    // User
    Route::get('users', [UserController::class, 'index']);
    Route::get('users/{id}', [UserController::class, 'show']);
    Route::post('users', [UserController::class, 'create']);
    Route::put('users/{id}', [UserController::class, 'update']);
    Route::delete('users/{id}', [UserController::class, 'destroy']);

    Route::put('users/{id}/reset-password', [UserController::class, 'resetPassword']);
    Route::post('check-email', [UserController::class, 'create']);
    Route::put('users/{id}/status', [UserController::class, 'updateStatusByField']);

    // -------------------------------------------------------------------------------

    // User Catalogue
    Route::get('user_catalogues', [UserCatalogueController::class, 'index']);
    Route::get('user_catalogues/{id}', [UserCatalogueController::class, 'show']);
    Route::post('user_catalogues', [UserCatalogueController::class, 'create']);
    Route::put('user_catalogues/{id}', [UserCatalogueController::class, 'update']);
    Route::delete('user_catalogues/{id}', [UserCatalogueController::class, 'destroy']);
    Route::put('user_catalogues/{id}/status', [UserCatalogueController::class, 'updateStatusByField']);

    // -------------------------------------------------------------------------------
    // Post Catalogue
    Route::get('post_catalogues', [PostCatalogueController::class, 'index']);
    Route::get('post_catalogues/{id}', [PostCatalogueController::class, 'show']);
    Route::post('post_catalogues', [PostCatalogueController::class, 'create']);
    Route::put('post_catalogues/{id}', [PostCatalogueController::class, 'update']);
    Route::delete('post_catalogues/{id}', [PostCatalogueController::class, 'destroy']);
    Route::put('post_catalogues/{id}/status', [PostCatalogueController::class, 'updateStatusByField']);

    // -------------------------------------------------------------------------------

    Route::delete('records/delete/batch', [DashboardController::class, 'deleteBatch']);
    Route::put('records/update/batch', [DashboardController::class, 'updateBatch']);


    // Location
    Route::get('location', [DashboardController::class, 'location']);

    //UPLOAD
    Route::post('upload/tempotary', [UploadController::class, 'uploadToTempotary']);
});

Route::post('v1/auth/refresh', [AuthController::class, 'refresh']);
Route::post('v1/auth/login', [AuthController::class, 'login']);
