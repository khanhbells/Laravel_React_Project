<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\Status;
use App\Http\Controllers\Controller;
use App\Http\Requests\Gemini\StoreGeminiRequest;
use App\Http\Resources\BookingResource;
use App\Http\Resources\DetailDoctorResource;
use App\Http\Resources\GeminiResource;
use App\Http\Resources\HospitalResource;
use App\Http\Resources\PostCatalogueResource;
use App\Http\Resources\SpecialtyResource;
use App\Models\DataGemini;
use App\Models\Gemini;
use App\Services\Gemini\GeminiService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Str;

class GeminiController extends Controller
{
    protected $geminiService;

    public function __construct(GeminiService $geminiService)
    {
        $this->geminiService = $geminiService;
    }

    public function callRepository($model, $isFolder = true)
    {
        $singularModel = Str::singular($model);
        $modelClass = Str::studly($singularModel);
        $folder = Str::studly(current(explode('_', $singularModel)));

        $repository = $isFolder ? "App\Repositories\\{$folder}\\{$modelClass}Repository"
            : "App\Repositories\\{$modelClass}Repository";
        return $repository;
    }

    public function index(Request $request)
    {
        try {
            $geminis = $this->geminiService->paginate($request);
            return response()->json([
                'geminis' =>  method_exists($geminis, 'items') ? GeminiResource::collection($geminis->items()) : $geminis,
                'links' => method_exists($geminis, 'items') ? $geminis->linkCollection() : null,
                'current_page' => method_exists($geminis, 'items') ? $geminis->currentPage() : null,
                'last_page' => method_exists($geminis, 'items') ? $geminis->lastPage() : null,
            ], Response::HTTP_OK);
        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            return response()->json([
                'message' => 'Không có quyền truy cập',
                'tags' => [],
                'code' => Status::ERROR
            ], Response::HTTP_FORBIDDEN);
        }
    }
    public function sendToApiGemeni(Request $request)
    {
        $userMessage = strtolower($request->input('message'));
        $keyword = config('keywordSearch');

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
        $context = !empty($relatedData) ? json_encode($relatedData, JSON_UNESCAPED_UNICODE, JSON_PRETTY_PRINT) : '';
        // 📦 Lấy lịch sử chat trước đó của user (chỉ lấy 5 tin gần nhất)
        $chatHistory = Gemini::latest()->get();
        $historyText = "";
        foreach ($chatHistory as $chat) {
            $historyText .= "User: " . $chat->user_message . "\nBot: " . $chat->bot_response;
        }
        // 📡 Gửi API Gemini kèm lịch sử chat và context
        $apiKey = env('GEMINI_API_KEY');
        $sendMessageToAI =  "\n\Database: " . $context . "\n$historyText\nUser: " . $userMessage;
        // dd($sendMessageToAI);
        $response = Http::timeout(60)->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=$apiKey", [
            'contents' => [['parts' => [['text' => $sendMessageToAI]]]]
        ]);

        $botResponse = $response->json()['candidates'][0]['content']['parts'][0]['text'] ?? '';
        $botResponse = preg_replace('/^Bot:\s*/', '', $botResponse);
        $storeRequest = new StoreGeminiRequest([
            'user_message' => $userMessage,
            'bot_response' => $botResponse
        ]);

        $data = $this->create($storeRequest);
        if ($data['code'] == Status::SUCCESS) {
            return response()->json(['bot_response' => $botResponse]);
        }

        return response()->json([
            'message' => $data['message']
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }

    private function create(StoreGeminiRequest $request)
    {
        $auth = auth('api')->user();
        $data = $this->geminiService->create($request, $auth);

        return $data;
    }

    // 📌 Hàm format dữ liệu
    private function formatData($type, $data)
    {
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
    ) {
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
}
