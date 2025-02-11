<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\Status;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use App\Http\Requests\AuthRequest;
use App\Http\Requests\ForgotAuthRequest;
use App\Http\Requests\User\ChangePasswordUserRequest;
use App\Http\Requests\User\ChangePasswordUserTokenRequest;
use App\Http\Requests\User\StoreUserRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Resources\UserResource;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\User;
use App\Services\User\UserService;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    protected $userService;
    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
        // $this->middleware('auth:api', ['except' => ['login']]);
    }
    public function login(AuthRequest $request)
    {
        $credentials = [
            'email' => $request->input('email'),
            'password' => $request->input('password')
        ];

        if (!$token = auth('api')->attempt($credentials)) {
            return response()->json(['error' => 'Email hoặc mật khẩu không đúng'], Response::HTTP_UNAUTHORIZED);
        }

        $user = auth('api')->user();

        $refreshTokenData = $this->refreshTokenData($user);

        $refresh_token = JWTAuth::getJWTProvider()->encode($refreshTokenData);

        $cookie = $this->setTokenAndRefreshTokenCookie($token, $refresh_token);
        $tokenCookie = $cookie['tokenCookie'];
        $refreshCookie = $cookie['refreshTokenCookie'];

        return $this->respondWithToken($token, $refresh_token, $user)->withCookie($tokenCookie)->withCookie($refreshCookie);
    }

    public function refresh(Request $request)
    {
        try {
            // Kiểm tra token và xác thực người dùng

            if ($request->hasCookie('access_token')) {
                $token = $request->cookie('access_token');
                $request->headers->set('Authorization', 'Bearer ' . $token);
            }
            $user = JWTAuth::parseToken()->authenticate();
            $token = auth()->refresh();
            auth()->invalidate(true);

            $refreshTokenData = $this->refreshTokenData($user);
            $refreshToken = JWTAuth::getJWTProvider()->encode($refreshTokenData);
            $cookie = $this->setTokenAndRefreshTokenCookie($token, $refreshToken);
            $tokenCookie = $cookie['tokenCookie'];
            $refreshCookie = $cookie['refreshTokenCookie'];
            return $this->respondWithToken($token, $refreshToken, $user)->withCookie($tokenCookie)->withCookie($refreshCookie);
        } catch (TokenExpiredException $e) {
            if ($request->hasCookie('refresh_token')) {
                if (!$request->cookie('refresh_token')) {
                    return response()->json(['message' => 'Token đã hết hạn'], Response::HTTP_UNAUTHORIZED);
                }
                $refreshTokenCookie = $request->cookie('refresh_token');
                $refreshTokenDecode = JWTAuth::getJWTProvider()->decode($refreshTokenCookie);
                $user = User::find($refreshTokenDecode['user_id']);
                $token = auth('api')->login($user);

                $refreshTokenData = $this->refreshTokenData($user);

                $refreshToken = JWTAuth::getJWTProvider()->encode($refreshTokenData);

                $cookie = $this->setTokenAndRefreshTokenCookie($token, $refreshToken);
                $tokenCookie = $cookie['tokenCookie'];
                $refreshCookie = $cookie['refreshTokenCookie'];

                return $this->respondWithToken($token, $refreshToken, $user)->withCookie($tokenCookie)->withCookie($refreshCookie);
            }
            return response()->json(['message' => 'Token đã hết hạn'], Response::HTTP_UNAUTHORIZED);
        } catch (JWTException $e) {
            return response()->json(['message' => 'Token không hợp lệ'], Response::HTTP_UNAUTHORIZED);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Không có token'], Response::HTTP_UNAUTHORIZED);
        }
    }

    protected function respondWithToken($token, $refresh_token, $user)
    {
        return response()->json([
            'user' => new UserResource($user),
            'access_token' => $token,
            'refresh_token' => $refresh_token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 1
        ]);
    }

    public function me(Request $request)
    {
        return response()->json([
            'user' => new UserResource(auth('api')->user())
        ]);
    }


    //setup cookie
    private function setTokenAndRefreshTokenCookie($token, $refresh_token)
    {
        $cookie = Cookie::make(
            'access_token',
            $token,
            auth()->factory()->getTTL() * 24, //1ngay
            '/',
            null,
            true,
            true,
            false,
            'None'
        );

        $refreshCookie = Cookie::make(
            'refresh_token',
            $refresh_token,
            config('jwt.refresh_ttl'), //2 tuan
            '/',
            null,
            true,
            true,
            false,
            'None'
        );

        return [
            'tokenCookie' => $cookie,
            'refreshTokenCookie' => $refreshCookie
        ];
    }

    //setup token refresh
    private function refreshTokenData($user)
    {
        return [
            'user_id' => $user->id,
            // 'expires_in' => time() + config('jwt.refresh_ttl'),
            'expires_in' => time() + 1,
            'random' => time() . md5(rand())
        ];
    }

    //logout
    public function logout(Request $request)
    {
        try {
            // Vô hiệu hóa token hiện tại
            auth('api')->logout();

            // Xóa cookie chứa token
            $tokenCookie = Cookie::forget('access_token');
            $refreshTokenCookie = Cookie::forget('refresh_token');

            return response()->json([
                'message' => 'Đăng xuất thành công'
            ], Response::HTTP_OK)->withCookie($tokenCookie)->withCookie($refreshTokenCookie);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra khi đăng xuất',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    //forgot password
    public function sendResetLinkEmail(ForgotAuthRequest $request)
    {
        $status = Password::sendResetLink($request->only('email'));
        return response()->json([
            'message' => $status === Password::RESET_LINK_SENT ? 'Email gửi thành công!' : 'Gửi email thất bại!',
            'status' => $status
        ], $status === Password::RESET_LINK_SENT ? 200 : 400);
    }
    //reset Password
    public function resetPassword(ChangePasswordUserTokenRequest $request)
    {
        $status = Password::reset(
            $request->only('email', 'password', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => bcrypt($password)
                ])->save();
            }
        );
        if ($status === Password::PASSWORD_RESET) {
            return response()->json(
                [
                    'message' => 'Mật khẩu đã được đặt lại thành công!',
                    'code' => Response::HTTP_OK
                ],
                Response::HTTP_OK
            );
        }

        throw ValidationException::withMessages(['email' => [__($status)]]);
    }

    public function signUp(StoreUserRequest $request)
    {
        $auth = $request->input('email');
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
}
