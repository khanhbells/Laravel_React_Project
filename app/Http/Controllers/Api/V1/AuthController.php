<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use App\Http\Requests\AuthRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Resources\UserResource;

class AuthController extends Controller
{
    public function __construct()
    {
        // $this->middleware('auth:api', ['except' => ['login']]);
    }
    public function login(AuthRequest $request)
    {
        $credentials = [
            'email' => $request->input('email'),
            'password' => $request->input('password')
        ];

        if (! $token = auth()->attempt($credentials)) {
            return response()->json(['error' => 'Email hoặc mật khẩu không đúng'], Response::HTTP_UNAUTHORIZED);
        }

        $user = auth()->user();

        $cookie = Cookie::make('access_token', $token, auth()->factory()->getTTL() * 1);
        return $this->respondWithToken($token, $user)->withCookie($cookie);
    }

    protected function respondWithToken($token, $user)
    {
        return response()->json([
            'user' => new UserResource($user),
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 1
        ]);
    }
}
