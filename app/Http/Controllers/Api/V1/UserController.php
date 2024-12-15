<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\UserResource;
use App\Services\User\UserService;
use App\Repositories\User\UserRepository;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Requests\UpdateByFieldRequest;
use App\Http\Controllers\Api\V1\AuthController;


class UserController extends Controller
{
    protected $userService;
    protected $userRepository;
    protected $user;
    public function __construct(
        UserService $userService,
        UserRepository $userRepository,
        AuthController $user,
    ) {
        $this->userService = $userService;
        $this->userRepository = $userRepository;
        $this->user = $user;
    }

    public function index(Request $request)
    {
        $users = $this->userService->paginate($request);
        return response()->json([
            'users' =>  UserResource::collection($users->items()),
            'links' => $users->linkCollection(),
            'current_page' => $users->currentPage(),
            'last_page' => $users->lastPage(),
        ], Response::HTTP_OK);
    }
    public function create(Request $request)
    {
        $user = auth()->user();
        $a = $this->userService->create($request, $user);
        return $a;
        if ($this->userService->create($request)) {
            return response()->json([
                'message' => 'Thêm mới bản ghi thành công'
            ], Response::HTTP_OK);
        }
        return response()->json([
            'message' => 'Có vấn đề xảy ra. Hãy thử lại sau'
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }

    public function updateStatusByField(UpdateByFieldRequest $request, $id)
    {
        $respository = 'App\Repositories\User\UserRepository';
        if ($this->userService->updateByField($request, $id, $respository)) {
            return response()->json([
                'message' =>  'Cập nhật dữ liệu thành công',
            ], Response::HTTP_OK);
        }
        return response()->json([
            'message' =>  'Cập nhật dữ liệu không thành công',
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }
}
