<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\User\UserService;
use App\Repositories\User\UserRepository;

class UserController extends Controller
{
    protected $userService;
    protected $userRepository;
    public function __construct(
        UserService $userService,
        UserRepository $userRepository,
    ) {
        $this->userService = $userService;
        $this->userRepository = $userRepository;
    }

    public function index(Request $request)
    {
        $users = $this->userService->paginate($request);
        return response()->json([
            'users' =>  $users->items(),
            'links' => $users->linkCollection(),
            'current_page' => $users->currentPage(),
            'last_page' => $users->lastPage(),
        ]);
    }
}
