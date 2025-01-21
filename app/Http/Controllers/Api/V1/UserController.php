<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\Status;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\UserResource;
use App\Services\User\UserService;
use App\Repositories\User\UserRepository;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Requests\UpdateByFieldRequest;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\ChangePasswordUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class UserController extends Controller
{
    use AuthorizesRequests;

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
        try {
            if ($request->input('user_catalogue_id') == null) {
                $this->authorize('modules', '/user/index');
            }
            $auth = auth()->user();
            $users = $this->userService->paginate($request, $auth);
            return response()->json([
                'users' =>  UserResource::collection($users->items()),
                'links' => $users->linkCollection(),
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
            ], Response::HTTP_OK);
        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            return response()->json([
                'message' => 'Không có quyền truy cập',
                'tags' => [],
                'code' => Status::ERROR
            ], Response::HTTP_FORBIDDEN);
        }
    }
    public function create(StoreUserRequest $request)
    {
        $auth = auth()->user();
        $data = $this->userService->create($request, $auth);
        if ($data['code'] == Status::SUCCESS) {
            return response()->json([
                'message' => 'Thêm mới bản ghi thành công',
                'user' => new UserResource($data['user'])
            ], Response::HTTP_OK);
        }
        return response()->json([
            'message' => $data['message']
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }

    public function update(UpdateUserRequest $request, $id)
    {
        return $this->baseUpdate($request, $id);
    }

    public function resetPassword(ChangePasswordUserRequest $request, $id)
    {
        return $this->baseUpdate($request, $id);
    }

    public function show(Request $request, $id)
    {
        if (empty($id) || $id < 0) {
            return $this->returnIfIdValidateFail();
        }
        $user = $this->userRepository->findById($id);


        if (!$user) {
            return response()->json([
                'code' => Status::ERROR,
                'message' => 'Không có dữ liệu phù hợp'
            ], Response::HTTP_NOT_FOUND);
        } else {
            return response()->json(
                new UserResource($user)
            );
        }
    }

    public function destroy($id, Request $request)
    {
        if (empty($id) || $id < 0) {
            return $this->returnIfIdValidateFail();
        }
        $user = $this->userRepository->findById($id);

        if (!$user) {
            return response()->json([
                'message' => 'Không tìm thấy bản ghi cần xóa',
                'code' => Status::SUCCESS
            ], Response::HTTP_NOT_FOUND);
        }

        if ($this->userService->delete($id)) {
            return response()->json([
                'message' => 'Xóa bản ghi thành công',
                'code' => Status::SUCCESS
            ], Response::HTTP_OK);
        }
        return response()->json([
            'message' => 'Network Error',
            'code' => Status::ERROR
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

    private function returnIfIdValidateFail()
    {
        return response()->json([
            'message' => 'Mã ID không hợp lệ',
            'code' => Status::ERROR
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }

    private function baseUpdate($request, $id)
    {
        $auth = auth()->user();
        $data = $this->userService->update($request, $id, $auth);

        if ($data['code'] == Status::SUCCESS) {
            return response()->json([
                'message' => 'Cập nhật bản ghi thành công',
                'user' => new UserResource($data['user']),
                'code' => Response::HTTP_OK
            ], Response::HTTP_OK);
        }
    }
}
