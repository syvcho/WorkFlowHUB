<?php

namespace App\Http\Middleware;

use App\Services\SupabaseAuthService;
use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateWithSupabase
{
    public function __construct(private readonly SupabaseAuthService $auth) {}

    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken();

        if ($token === null || $token === '') {
            return $this->unauthorized('Please sign in to continue.');
        }

        $user = $this->auth->userFromToken($token);

        if ($user === null) {
            return $this->unauthorized('Your session expired or could not be verified. Please sign in again.');
        }

        $request->attributes->set('supabase_user', $user);

        return $next($request);
    }

    private function unauthorized(string $message): JsonResponse
    {
        return response()->json([
            'message' => $message,
        ], 401);
    }
}
