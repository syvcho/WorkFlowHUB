<?php

namespace App\Services;

use App\Support\SupabaseUser;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;

class SupabaseAuthService
{
    public function userFromToken(string $token): ?SupabaseUser
    {
        $url = rtrim((string) config('services.supabase.url'), '/');
        $anonKey = (string) config('services.supabase.anon_key');

        if ($url === '' || $anonKey === '') {
            return null;
        }

        try {
            $response = Http::withHeaders([
                'apikey' => $anonKey,
                'Authorization' => "Bearer {$token}",
            ])->get("{$url}/auth/v1/user");
        } catch (ConnectionException) {
            return null;
        }

        if (! $response->ok()) {
            return null;
        }

        $id = $response->json('id');

        if (! is_string($id) || $id === '') {
            return null;
        }

        $email = $response->json('email');
        $name = $response->json('user_metadata.name');

        return new SupabaseUser(
            id: $id,
            email: is_string($email) ? $email : null,
            name: is_string($name) ? $name : null,
        );
    }
}
