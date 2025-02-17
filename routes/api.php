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
use App\Http\Controllers\Api\V1\HospitalController;
use App\Http\Controllers\Api\V1\SpecialtyController;
use App\Http\Controllers\Api\V1\SpecialtyCatalogueController;
use App\Http\Controllers\Api\V1\DoctorController;
use App\Http\Controllers\Api\V1\PatientCatalogueController;
use App\Http\Controllers\Api\V1\PatientController;
use App\Http\Controllers\Api\V1\TimeSlotController;
use App\Http\Controllers\Api\V1\ScheduleController;
use App\Http\Controllers\Api\V1\SystemController;
use App\Http\Controllers\Api\V1\BookingController;
use App\Http\Controllers\Api\V1\AuthPatientController;
use App\Http\Controllers\Api\V1\MedicineCatalogueController;
use App\Http\Controllers\Api\V1\MedicineController;
use App\Http\Controllers\Api\V1\HomePageController;
use App\Http\Controllers\Api\V1\VNPayController;
use App\Http\Controllers\Api\V1\ZaloPayController;
use App\Http\Resources\DoctorResource;
use App\Models\SpecialtyCatalogue;
use Illuminate\Support\Facades\Route;
use SebastianBergmann\CodeCoverage\Report\Html\Dashboard;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

// Route::prefix('v1')->group(function () {
//     Route::post('/login', [AuthController::class, 'login']);
// });

Route::group([
    'middleware' => 'jwt:api',
    'prefix' => 'v1/auth'
], function ($router) {
    Route::get('me', [AuthController::class, 'me']);
});
Route::group([
    'middleware' => 'jwt:api',
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
    // Hospital
    Route::get('hospitals', [HospitalController::class, 'index']);
    Route::get('hospitals/{id}', [HospitalController::class, 'show']);
    Route::post('hospitals', [HospitalController::class, 'create']);
    Route::put('hospitals/{id}', [HospitalController::class, 'update']);
    Route::delete('hospitals/{id}', [HospitalController::class, 'destroy']);
    Route::put('hospitals/{id}/status', [HospitalController::class, 'updateStatusByField']);

    // -------------------------------------------------------------------------------
    // Specialty
    Route::get('specialties', [SpecialtyController::class, 'index']);
    Route::get('specialties/{id}', [SpecialtyController::class, 'show']);
    Route::post('specialties', [SpecialtyController::class, 'create']);
    Route::put('specialties/{id}', [SpecialtyController::class, 'update']);
    Route::delete('specialties/{id}', [SpecialtyController::class, 'destroy']);
    Route::put('specialties/{id}/status', [SpecialtyController::class, 'updateStatusByField']);

    // -------------------------------------------------------------------------------
    // SpecialtyCatalogue
    Route::get('specialty_catalogues', [SpecialtyCatalogueController::class, 'index']);
    Route::get('specialty_catalogues/{id}', [SpecialtyCatalogueController::class, 'show']);
    Route::post('specialty_catalogues', [SpecialtyCatalogueController::class, 'create']);
    Route::put('specialty_catalogues/{id}', [SpecialtyCatalogueController::class, 'update']);
    Route::delete('specialty_catalogues/{id}', [SpecialtyCatalogueController::class, 'destroy']);
    Route::put('specialty_catalogues/{id}/status', [SpecialtyCatalogueController::class, 'updateStatusByField']);

    // -------------------------------------------------------------------------------
    // Doctor
    Route::get('doctors', [DoctorController::class, 'index']);
    Route::get('doctors/{id}', [DoctorController::class, 'show']);
    Route::post('doctors', [DoctorController::class, 'create']);
    Route::put('doctors/{id}', [DoctorController::class, 'update']);
    Route::delete('doctors/{id}', [DoctorController::class, 'destroy']);
    Route::put('doctors/{id}/status', [DoctorController::class, 'updateStatusByField']);

    // -------------------------------------------------------------------------------
    // Patient Catalogue
    Route::get('patient_catalogues', [PatientCatalogueController::class, 'index']);
    Route::get('patient_catalogues/{id}', [PatientCatalogueController::class, 'show']);
    Route::post('patient_catalogues', [PatientCatalogueController::class, 'create']);
    Route::put('patient_catalogues/{id}', [PatientCatalogueController::class, 'update']);
    Route::delete('patient_catalogues/{id}', [PatientCatalogueController::class, 'destroy']);
    Route::put('patient_catalogues/{id}/status', [PatientCatalogueController::class, 'updateStatusByField']);

    // -------------------------------------------------------------------------------
    // Patient
    Route::get('patients', [PatientController::class, 'index']);

    Route::post('patients', [PatientController::class, 'create']);
    Route::put('patients/{id}', [PatientController::class, 'update']);
    Route::delete('patients/{id}', [PatientController::class, 'destroy']);

    Route::put('patients/{id}/reset-password', [PatientController::class, 'resetPassword']);
    Route::post('check-email', [PatientController::class, 'create']);
    Route::put('patients/{id}/status', [PatientController::class, 'updateStatusByField']);

    // -------------------------------------------------------------------------------

    // TimeSlot
    Route::get('time_slots', [TimeSlotController::class, 'index']);
    Route::get('time_slots/{id}', [TimeSlotController::class, 'show']);
    Route::post('time_slots', [TimeSlotController::class, 'create']);
    Route::put('time_slots/{id}', [TimeSlotController::class, 'update']);
    Route::delete('time_slots/{id}', [TimeSlotController::class, 'destroy']);
    Route::put('time_slots/{id}/status', [TimeSlotController::class, 'updateStatusByField']);

    // -------------------------------------------------------------------------------
    // Schedule
    Route::get('schedules', [ScheduleController::class, 'index']);
    Route::get('schedules/{id}', [ScheduleController::class, 'show']);
    Route::post('schedules', [ScheduleController::class, 'create']);
    Route::put('schedules/{id}', [ScheduleController::class, 'update']);
    Route::delete('schedules/{id}', [ScheduleController::class, 'destroy']);
    Route::put('schedules/{id}/status', [ScheduleController::class, 'updateStatusByField']);

    // -------------------------------------------------------------------------------
    // System
    Route::get('systems', [SystemController::class, 'index']);
    Route::get('systems/{id}', [SystemController::class, 'show']);
    Route::post('systems', [SystemController::class, 'create']);
    Route::put('systems/{id}', [SystemController::class, 'update']);
    Route::delete('systems/{id}', [SystemController::class, 'destroy']);
    Route::put('systems/{id}/status', [SystemController::class, 'updateStatusByField']);

    // -------------------------------------------------------------------------------
    // Medicine Catalogue
    Route::get('medicine_catalogues', [MedicineCatalogueController::class, 'index']);
    Route::get('medicine_catalogues/{id}', [MedicineCatalogueController::class, 'show']);
    Route::post('medicine_catalogues', [MedicineCatalogueController::class, 'create']);
    Route::put('medicine_catalogues/{id}', [MedicineCatalogueController::class, 'update']);
    Route::delete('medicine_catalogues/{id}', [MedicineCatalogueController::class, 'destroy']);
    Route::put('medicine_catalogues/{id}/status', [MedicineCatalogueController::class, 'updateStatusByField']);

    // -------------------------------------------------------------------------------
    // Medicine
    Route::get('medicines', [MedicineController::class, 'index']);
    Route::get('medicines/{id}', [MedicineController::class, 'show']);
    Route::post('medicines', [MedicineController::class, 'create']);
    Route::put('medicines/{id}', [MedicineController::class, 'update']);
    Route::delete('medicines/{id}', [MedicineController::class, 'destroy']);
    Route::put('medicines/{id}/status', [MedicineController::class, 'updateStatusByField']);

    // -------------------------------------------------------------------------------

    //ALL
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
    //BOOKINGS
    Route::get('bookings', [BookingController::class, 'index']);

    Route::put('bookings/{id}', [BookingController::class, 'update']);
    Route::put('bookings/medicine/{id}', [BookingController::class, 'storeBookingMedicine']);
    //STATISTIC
    Route::get('statistic', [DashboardController::class, 'statistic']);
    //Chart
    Route::get('chart', [DashboardController::class, 'chart']);
    //Analytics
    Route::get('analytics', [DashboardController::class, 'analytics']);
});

Route::group([
    'prefix' => 'v1'
], function ($router) {
    //TopDoctors
    Route::get('topDoctors', [DashboardController::class, 'topDoctors']);
    // Location
    Route::get('location', [DashboardController::class, 'location']);
    // Patient
    Route::get('patients/{id}', [PatientController::class, 'show']);
    //Bookings
    Route::post('bookings', [BookingController::class, 'create']);
    //VNPAY
    Route::get('vnpay-return', [VNPayController::class, 'vnpay_return']);
    Route::post('zalopay/callback', function (Request $request) {
        Log::info("ZaloPay Callback Received", ['request' => $request->all()]);
        $result = [];
        try {
            $key2 = "Iyz2habzyr7AG8SgvoBCbKwKi3UzlLi3";
            $postdata = file_get_contents('php://input');
            $postdatajson = json_decode($postdata, true);
            $mac = hash_hmac("sha256", $postdatajson["data"], $key2);

            $requestmac = $postdatajson["mac"];

            // kiểm tra callback hợp lệ (đến từ ZaloPay server)
            if (strcmp($mac, $requestmac) != 0) {
                // callback không hợp lệ
                $result["returncode"] = -1;
                $result["returnmessage"] = "mac not equal";
            } else {
                // thanh toán thành công
                // merchant cập nhật trạng thái cho đơn hàng
                $datajson = json_decode($postdatajson["data"], true);
                // echo "update order's status = success where apptransid = ". $dataJson["apptransid"];

                $result["returncode"] = 1;
                $result["returnmessage"] = "success";
            }
        } catch (Exception $e) {
            $result["returncode"] = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
            $result["returnmessage"] = $e->getMessage();
        }

        // thông báo kết quả cho ZaloPay server
        echo json_encode($result);
    });
});

Route::post('v1/auth/refresh', [AuthController::class, 'refresh']);
Route::post('v1/auth/login', [AuthController::class, 'login']);
Route::post('v1/auth/sign_up', [AuthController::class, 'signUp']);
Route::post('v1/auth/forgot_password', [AuthController::class, 'sendResetLinkEmail']);
Route::put('v1/auth/reset_password', [AuthController::class, 'resetPassword'])->name('password.reset');

/*--------------------------------FRONT END--------------------------- */
Route::group([
    'prefix' => 'v1/frontend'
], function ($router) {
    //GET SPECIALTY
    Route::get('specialty_catalogues/{id}', [SpecialtyCatalogueController::class, 'show']);
    Route::get('specialties', [SpecialtyController::class, 'index']);
    Route::get('specialties/{id}', [SpecialtyController::class, 'show']);
    //GET POST
    Route::get('post_catalogues/{id}', [PostCatalogueController::class, 'show']);
    Route::get('posts', [PostController::class, 'index']);
    //GET USER
    Route::get('user_catalogues/{id}', [UserCatalogueController::class, 'show']);
    Route::get('users', [UserController::class, 'index']);
    //GET DOCTOR
    Route::get('doctors', [DoctorController::class, 'index']);
    Route::get('doctors/{id}', [DoctorController::class, 'showDoctor']);
    //GET SCHEDULES
    Route::get('schedules', [ScheduleController::class, 'index']);
    //BOOKINGS
    Route::get('bookings/{id}', [BookingController::class, 'show']);
    //SignUp
    Route::post('patients', [PatientController::class, 'signUp']);
    //MENU
    Route::get('menus', [HomePageController::class, 'menus']);
    //MENU
    Route::get('systems', [HomePageController::class, 'systems']);
    //SEARCH
    Route::get('search', [HomePageController::class, 'search']);
});

Route::group([
    'middleware' => 'jwt:patient',
    'prefix' => 'v1/patient'
], function ($router) {
    Route::get('me', [AuthPatientController::class, 'me']);
    Route::get('logout', [AuthPatientController::class, 'logout']);
    //History
    Route::get('historys', [BookingController::class, 'indexHistory']);
    Route::get('historys/{id}', [BookingController::class, 'show']);
});
Route::post('v1/patient/refresh', [AuthPatientController::class, 'refresh']);
Route::post('v1/patient/login', [AuthPatientController::class, 'login']);
Route::post('v1/patient/forgot_password', [AuthPatientController::class, 'sendResetLinkEmail']);
Route::put('v1/patient/reset_password', [AuthPatientController::class, 'resetPassword'])->name('password.reset');
