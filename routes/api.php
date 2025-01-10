<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\UserController;
use App\Http\Controllers\Api\V1\UserCatalogueController;
use App\Http\Controllers\Api\V1\PostCatalogueController;
use App\Http\Controllers\Api\V1\UploadController;
use App\Http\Controllers\Api\V1\DashboardController;
use App\Http\Controllers\Api\V1\PostController;
use App\Http\Controllers\Api\V1\TagController;
use App\Http\Controllers\Api\V1\PermissionController;
use Illuminate\Support\Facades\Route;
use SebastianBergmann\CodeCoverage\Report\Html\Dashboard;
use Illuminate\Http\Request;

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
    Route::get('me', [AuthController::class, 'me']);
});
Route::group([
    'middleware' => 'jwt',
    'prefix' => 'v1'
], function ($router) {
    //Logout
    Route::get('logout', [AuthController::class, 'logout']);
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
    Route::post('updatePermission', [UserCatalogueController::class, 'updatePermission']);

    // -------------------------------------------------------------------------------
    // Post Catalogue
    Route::get('post_catalogues', [PostCatalogueController::class, 'index']);
    Route::get('post_catalogues/{id}', [PostCatalogueController::class, 'show']);
    Route::post('post_catalogues', [PostCatalogueController::class, 'create']);
    Route::put('post_catalogues/{id}', [PostCatalogueController::class, 'update']);
    Route::delete('post_catalogues/{id}', [PostCatalogueController::class, 'destroy']);
    Route::put('post_catalogues/{id}/status', [PostCatalogueController::class, 'updateStatusByField']);

    // -------------------------------------------------------------------------------
    // Post
    Route::get('posts', [PostController::class, 'index']);
    Route::get('posts/{id}', [PostController::class, 'show']);
    Route::post('posts', [PostController::class, 'create']);
    Route::put('posts/{id}', [PostController::class, 'update']);
    Route::delete('posts/{id}', [PostController::class, 'destroy']);
    Route::put('posts/{id}/status', [PostController::class, 'updateStatusByField']);

    // -------------------------------------------------------------------------------
    // Tag
    Route::get('tags', [TagController::class, 'index']);
    Route::get('tags/{id}', [TagController::class, 'show']);
    Route::post('tags', [TagController::class, 'create']);
    Route::put('tags/{id}', [TagController::class, 'update']);
    Route::delete('tags/{id}', [TagController::class, 'destroy']);
    Route::put('tags/{id}/status', [TagController::class, 'updateStatusByField']);
    // -------------------------------------------------------------------------------

    // Permission
    Route::get('permissions', [PermissionController::class, 'index']);
    Route::get('permissions/{id}', [PermissionController::class, 'show']);
    Route::post('permissions', [PermissionController::class, 'create']);
    Route::put('permissions/{id}', [PermissionController::class, 'update']);
    Route::delete('permissions/{id}', [PermissionController::class, 'destroy']);
    Route::put('permissions/{id}/status', [PermissionController::class, 'updateStatusByField']);

    // -------------------------------------------------------------------------------






    Route::delete('records/delete/batch', [DashboardController::class, 'deleteBatch']);
    Route::put('records/update/batch', [DashboardController::class, 'updateBatch']);


    // Location
    Route::get('location', [DashboardController::class, 'location']);

    //UPLOAD
    Route::post('upload/tempotary', [UploadController::class, 'uploadToTempotary']);
    Route::post('upload/ckeditor', [UploadController::class, 'uploadCkeditor']);
    Route::post('delete/ckeditor', [UploadController::class, 'deleteCkeditor']);

    // COMMON REQUEST
    Route::post('sort', [DashboardController::class, 'sort']);
});

Route::post('v1/auth/refresh', [AuthController::class, 'refresh']);
Route::post('v1/auth/login', [AuthController::class, 'login']);
