<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\Status;
use App\Http\Controllers\Controller;
use App\Http\Resources\BookingResource;
use App\Http\Resources\DetailDoctorResource;
use App\Http\Resources\HospitalResource;
use App\Http\Resources\PostCatalogueResource;
use App\Http\Resources\SpecialtyResource;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Str;

class GeminiController extends Controller
{


    public function __construct(){}

    public function callRepository($model, $isFolder = true)
    {
        $singularModel = Str::singular($model);
        $modelClass = Str::studly($singularModel);
        $folder = Str::studly(current(explode('_', $singularModel)));

        $repository = $isFolder ? "App\Repositories\\{$folder}\\{$modelClass}Repository"
            : "App\Repositories\\{$modelClass}Repository";
        return $repository;
    }

    public function sendToApiGemeni(Request $request) {
        $userMessage = strtolower($request->input('message'));
        $keyword = $this->keyWordSearch();
        
        // 🔍 Tìm từ khóa trong câu hỏi
        $relatedData = [];
        foreach ($keyword as $mainKeyword => $data) {
            foreach ($data['aliases'] as $alias) {
                if (strpos($userMessage, $alias) !== false) {
                    $repoName = $mainKeyword; 
                    $repository = $this->customRepository($repoName);
                    $data = $repository->pagination([...$this->paginateAgrument($request)]);
                    $relatedData[$repoName] = $this->formatData($repoName, $data->items());
                    break;
                }
            }
        }
    
        // 📦 Chỉ gửi dữ liệu liên quan
        $context = !empty($relatedData) ? json_encode($relatedData, JSON_UNESCAPED_UNICODE) : '';
        dd($context);
    
        // 📡 Gửi API Gemini
        $apiKey = env('GEMINI_API_KEY');
        $response = Http::post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=$apiKey", [
            'contents' => [['parts' => [['text' => $userMessage . "\n\n" . $context]]]]
        ]);
    
        return $response->json();
    }


     // 📌 Hàm format dữ liệu
    private function formatData($type, $data) {
        switch ($type) {
            case 'doctors':
                return DetailDoctorResource::collection($data);
            case 'hospitals':
                return HospitalResource::collection($data);
            case 'bookings':
                return BookingResource::collection($data);
            default:
                return $data;
        }
    }


    private function customRepository($model)
    {
        $customRepository = app($this->callRepository($model));
        return $customRepository;
    }
    
    private function paginateAgrument(
        $request, 
        $flag = false, 
        $model = null, 
        $relations = [], 
        $condition = [],
        $join = [],
        $select = ['*'],
        $field  = ['name'],
        $orderBy = ['id', 'desc']
    )
    {
        return [
            'select' => $select,
            'orderBy' => $orderBy,
            'perpage' => 100,
            'keyword' => [
                'search' => $request->input('keyword') ?? '',
                'field' => $field
            ],
            'condition' => $condition,
            'whereHas' => $flag && $model != null ? $this->whereHas($request, $model) : [],
            'relations' => $relations,
            'innerJoin' => $join && count($join) > 0 ? $join : []
        ];
    }

    private function whereHas($request, $model)
    {
        return [
            $model . '_catalogues' => function ($query) use ($request) {
                $query->where('publish', 2);
            }
        ];
    }

    private function keyWordSearch(){
        return [
            'hospitals' => [
                'aliases' => ['bv', 'bệnh viện', 'bviện', 'benhvien', 'hospitals', 'bviện lớn', 'viện', 'bvien', 'benh vien'],
            ],
            'doctors' => [
                'aliases' => ['bs', 'bsi', 'bác sĩ', 'bacsi', 'doctors', 'bsi giỏi', 'bác sỹ', 'bsỹ', 'bac sy', 'bacs', 'bsy', 'doctor'],
            ],
            'bookings' => [
                'aliases' => ['dat lich', 'dl', 'đặt lịch', 'book', 'bookings', 'hẹn khám', 'lịch hẹn', 'dat kham', 'hẹn bác sĩ', 'hẹn giờ', 'dat hen','đơn khám', 'don kham', 'đơn hẹn', 'bác sĩ', 'bac si', 'nổi bật', 'noi bat', 'thanh toan', 'thanh toán', 'đã duyệt', 'đã hủy', 'chưa duyệt', 'tổng tiền','tong tien'],
            ],
            'specialties' => [
                'aliases' => ['ck', 'chuyenkhoa', 'dịch vụ khám', 'dv kham', 'specialties', 'khoa', 'khoa khám', 'chuyên nghành', 'chuyenk', 'chuyên khoa nào', 'khoa nào'],
            ],
            'schedules' => [
                'aliases' => ['lich kham', 'lịch khám', 'lk', 'thời gian', 'tgian', 'time', 'khám', 'kham', 'gio', 'giờ'],
            ],
        ];
    }
}
