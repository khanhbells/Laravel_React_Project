<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Facades\JWTAuth;

class Jwt
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        try {
            // Kiểm tra token và xác thực người dùng
            if ($request->hasCookie('access_token')) {
                $token = $request->cookie('access_token');
                $request->headers->set('Authorization', 'Bearer ' . $token);
            }
            // $user = auth()->userOrFail();
            $user = JWTAuth::parseToken()->authenticate();
        } catch (TokenExpiredException $e) {
            // Token đã hết hạn
            return response()->json(['message' => 'Token đã hết hạn'], 401);
        } catch (JWTException $e) {
            // Token không hợp lệ
            return response()->json(['message' => 'Token không hợp lệ'], 401);
        } catch (\Exception $e) {
            // Lỗi khác (ví dụ: không có token)
            return response()->json(['message' => 'Không có token'], 401);
        }
        return $next($request);
    }
}
