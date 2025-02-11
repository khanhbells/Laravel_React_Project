<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use App\Http\Requests\AuthRequest;
use App\Http\Requests\ForgotPatientRequest;
use App\Http\Requests\Patient\ChangePasswordPatientRequest;
use App\Http\Requests\Patient\ChangePasswordPatientTokenRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Resources\PatientResource;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\Patient;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;

class AuthPatientController extends Controller
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

        if (!$token = auth('patient')->attempt($credentials)) {
            return response()->json(['message' => 'Email hoặc mật khẩu không đúng'], Response::HTTP_UNAUTHORIZED);
        }

        $patient = auth('patient')->user();

        $refreshTokenData = $this->refreshTokenData($patient);

        $refresh_patient_token = JWTAuth::getJWTProvider()->encode($refreshTokenData);

        $cookie = $this->setTokenAndRefreshTokenCookie($token, $refresh_patient_token);
        $tokenCookie = $cookie['tokenCookie'];
        $refreshCookie = $cookie['refreshTokenCookie'];

        return $this->respondWithToken($token, $refresh_patient_token, $patient)->withCookie($tokenCookie)->withCookie($refreshCookie);
    }

    public function refresh(Request $request)
    {
        try {

            // Kiểm tra token và xác thực người dùng
            if ($request->hasCookie('access_patient_token')) {

                $token = $request->cookie('access_patient_token');

                $request->headers->set('Authorization', 'Bearer ' . $token);
                // dd($request);
            }



            $patient = JWTAuth::setToken($token)->setTTL(60)->toUser();
            $token = auth('patient')->refresh();

            auth('patient')->invalidate(true);

            $refreshTokenData = $this->refreshTokenData($patient);

            // dd($refreshTokenData);
            $refreshToken = JWTAuth::getJWTProvider()->encode($refreshTokenData);

            $cookie = $this->setTokenAndRefreshTokenCookie($token, $refreshToken);
            $tokenCookie = $cookie['tokenCookie'];
            $refreshCookie = $cookie['refreshTokenCookie'];
            return $this->respondWithToken($token, $refreshToken, $patient)->withCookie($tokenCookie)->withCookie($refreshCookie);
        } catch (JWTException $e) {
            return response()->json(['message' => 'Token không hợp lệ'], Response::HTTP_UNAUTHORIZED);
        } catch (\Exception $e) {
            if ($request->hasCookie('refresh_patient_token')) {

                if (!$request->cookie('refresh_patient_token')) {
                    return response()->json(['message' => 'Token đã hết hạn'], Response::HTTP_UNAUTHORIZED);
                }
                $refreshTokenCookie = $request->cookie('refresh_patient_token');
                $refreshTokenDecode = JWTAuth::getJWTProvider()->decode($refreshTokenCookie);
                $patient = Patient::find($refreshTokenDecode['patient_id']);
                $token = auth('patient')->login($patient);

                $refreshTokenData = $this->refreshTokenData($patient);

                $refreshToken = JWTAuth::getJWTProvider()->encode($refreshTokenData);

                $cookie = $this->setTokenAndRefreshTokenCookie($token, $refreshToken);
                $tokenCookie = $cookie['tokenCookie'];
                $refreshCookie = $cookie['refreshTokenCookie'];

                return $this->respondWithToken($token, $refreshToken, $patient)->withCookie($tokenCookie)->withCookie($refreshCookie);
            }
            return response()->json(['message' => 'Token đã hết hạn'], Response::HTTP_UNAUTHORIZED);
        }
    }

    protected function respondWithToken($token, $refresh_patient_token, $patient)
    {
        return response()->json([
            'patient' => new PatientResource($patient),
            'access_patient_token' => $token,
            'refresh_patient_token' => $refresh_patient_token,
            'token_type' => 'bearer',
            'expires_in' => auth('patient')->factory()->getTTL() * 1
        ]);
    }

    public function me(Request $request)
    {
        // dd(auth()->user());
        return response()->json([
            'patient' => new PatientResource(auth('patient')->user())
        ]);
    }


    //setup cookie
    private function setTokenAndRefreshTokenCookie($token, $refresh_patient_token)
    {
        $cookie = Cookie::make(
            'access_patient_token',
            $token,
            auth('patient')->factory()->getTTL() * 24, //1ngay
            '/',
            null,
            true,
            true,
            false,
            'None'
        );

        $refreshCookie = Cookie::make(
            'refresh_patient_token',
            $refresh_patient_token,
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
    private function refreshTokenData($patient)
    {
        return [
            'patient_id' => $patient->id,
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
            auth('patient')->logout();

            // Xóa cookie chứa token
            $tokenCookie = Cookie::forget('access_patient_token');
            $refreshTokenCookie = Cookie::forget('refresh_patient_token');

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
    public function sendResetLinkEmail(ForgotPatientRequest $request)
    {
        $status = Password::broker('patients')->sendResetLink($request->only('email'));
        return response()->json([
            'message' => $status === Password::RESET_LINK_SENT ? 'Email gửi thành công!' : 'Gửi email thất bại!',
            'status' => $status
        ], $status === Password::RESET_LINK_SENT ? 200 : 400);
    }
    //reset Password
    public function resetPassword(ChangePasswordPatientTokenRequest $request)
    {
        $status = Password::broker('patients')->reset(
            $request->only('email', 'password', 'token'),
            function ($patient, $password) {
                $patient->forceFill([
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
}
