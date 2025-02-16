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
    public function handle(Request $request, Closure $next, $guard = null): Response
    {
        try {
            $token = $request->cookie($guard === 'patient' ? 'access_patient_token' : 'access_token');
            if ($token) {
                $request->headers->set('Authorization', 'Bearer ' . $token);
                auth($guard)->setToken($token)->authenticate();
            } else {
                throw new \Exception('Không có token');
            }
        } catch (TokenExpiredException $e) {
            return response()->json(['message' => 'Token đã hết hạn'], Response::HTTP_UNAUTHORIZED);
        } catch (JWTException $e) {
            return response()->json(['message' => 'Token không hợp lệ'], Response::HTTP_UNAUTHORIZED);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Không có 123'], Response::HTTP_UNAUTHORIZED);
        }

        return $next($request);
    }
}
