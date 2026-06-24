<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class ProfileApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        config([
            'services.supabase.url' => 'https://example-project.supabase.co',
            'services.supabase.anon_key' => 'test-anon-key',
        ]);
    }

    public function test_it_rejects_profile_requests_without_a_supabase_access_token(): void
    {
        $this->getJson('/api/profile')
            ->assertUnauthorized()
            ->assertJson([
                'message' => 'Please sign in to continue.',
            ]);
    }

    public function test_it_creates_and_returns_the_authenticated_users_profile(): void
    {
        Http::fake([
            'https://example-project.supabase.co/auth/v1/user' => Http::response([
                'id' => 'user-123',
                'email' => 'jericho@example.com',
                'user_metadata' => [
                    'name' => 'Jericho',
                ],
            ]),
        ]);

        $this->withToken('valid-token')->getJson('/api/profile')
            ->assertOk()
            ->assertJsonPath('data.supabase_user_id', 'user-123')
            ->assertJsonPath('data.email', 'jericho@example.com')
            ->assertJsonPath('data.name', 'Jericho');

        $this->assertDatabaseHas('profiles', [
            'supabase_user_id' => 'user-123',
            'email' => 'jericho@example.com',
            'name' => 'Jericho',
        ]);
    }

    public function test_it_validates_profile_name_updates(): void
    {
        Http::fake([
            'https://example-project.supabase.co/auth/v1/user' => Http::response([
                'id' => 'user-123',
                'email' => 'jericho@example.com',
            ]),
        ]);

        $this->withToken('valid-token')->patchJson('/api/profile', [
            'name' => '',
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('name');

        $this->withToken('valid-token')->patchJson('/api/profile', [
            'name' => str_repeat('A', 81),
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('name');
    }

    public function test_it_updates_the_authenticated_users_profile_name(): void
    {
        Http::fake([
            'https://example-project.supabase.co/auth/v1/user' => Http::response([
                'id' => 'user-123',
                'email' => 'jericho@example.com',
                'user_metadata' => [
                    'name' => 'Old Name',
                ],
            ]),
        ]);

        $this->withToken('valid-token')->getJson('/api/profile')->assertOk();

        $this->withToken('valid-token')->patchJson('/api/profile', [
            'name' => 'Jericho Santos',
        ])
            ->assertOk()
            ->assertJsonPath('data.supabase_user_id', 'user-123')
            ->assertJsonPath('data.name', 'Jericho Santos');

        $this->assertDatabaseHas('profiles', [
            'supabase_user_id' => 'user-123',
            'name' => 'Jericho Santos',
        ]);
    }
}
