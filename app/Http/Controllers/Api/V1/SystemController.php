<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\Status;
use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use App\Http\Resources\SystemResource;
use App\Services\System\SystemService;
use App\Repositories\System\SystemRepository;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Requests\UpdateByFieldRequest;

class SystemController extends Controller
{
    use AuthorizesRequests;
    protected $systemService;
    protected $systemRepository;
    public function __construct(
        SystemService $systemService,
        SystemRepository $systemRepository,
    ) {
        $this->systemService = $systemService;
        $this->systemRepository = $systemRepository;
    }

    public function index(Request $request)
    {
        try {
            // $this->authorize('modules', '/system/index');
            $systems = $this->systemService->paginate($request);
            return response()->json([
                'systems' =>  method_exists($systems, 'items') ? SystemResource::collection($systems->items()) : $systems,
                'links' => method_exists($systems, 'items') ? $systems->linkCollection() : null,
                'current_page' => method_exists($systems, 'items') ? $systems->currentPage() : null,
                'last_page' => method_exists($systems, 'items') ? $systems->lastPage() : null,
            ], Response::HTTP_OK);
        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            return response()->json([
                'message' => 'Không có quyền truy cập',
                'systems' => [],
                'code' => Status::ERROR
            ], Response::HTTP_FORBIDDEN);
        }
    }

    public function create(Request $request)
    {
        $auth = auth()->user();
        $data = $this->systemService->create($request, $auth);
        return $data;
        if ($data['code'] == Status::SUCCESS) {
            return response()->json([
                'message' => 'Thêm mới bản ghi thành công',
                'system' => new SystemResource($data['system'])
            ], Response::HTTP_OK);
        }
        return response()->json([
            'message' => $data['message']
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }
}
