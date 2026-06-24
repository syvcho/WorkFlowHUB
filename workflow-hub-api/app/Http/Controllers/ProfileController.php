<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateProfileRequest;
use App\Http\Resources\ProfileResource;
use App\Models\Profile;
use App\Support\SupabaseUser;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function show(Request $request): ProfileResource
    {
        return ProfileResource::make($this->profileFor($this->supabaseUser($request)));
    }

    public function update(UpdateProfileRequest $request): ProfileResource
    {
        $profile = $this->profileFor($this->supabaseUser($request));

        $profile->update([
            'name' => trim((string) $request->validated('name')),
        ]);

        return ProfileResource::make($profile);
    }

    private function profileFor(SupabaseUser $user): Profile
    {
        return Profile::firstOrCreate(
            ['supabase_user_id' => $user->id],
            [
                'email' => $user->email,
                'name' => $user->name,
            ],
        );
    }

    private function supabaseUser(Request $request): SupabaseUser
    {
        return $request->attributes->get('supabase_user');
    }
}
