<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class WorkflowApiTest extends TestCase
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

    public function test_it_rejects_workflow_requests_without_a_supabase_access_token(): void
    {
        $this->getJson('/api/workflows')
            ->assertUnauthorized()
            ->assertJson([
                'message' => 'Please sign in to continue.',
            ]);
    }

    public function test_it_uses_a_friendly_message_for_invalid_supabase_access_tokens(): void
    {
        Http::fake([
            'https://example-project.supabase.co/auth/v1/user' => Http::response([
                'message' => 'JWT expired',
            ], 401),
        ]);

        $this->withToken('expired-token')->getJson('/api/workflows')
            ->assertUnauthorized()
            ->assertJson([
                'message' => 'Your session expired or could not be verified. Please sign in again.',
            ]);
    }

    public function test_it_lets_an_authenticated_supabase_user_manage_only_their_workflows(): void
    {
        Http::fake([
            'https://example-project.supabase.co/auth/v1/user' => Http::sequence()
                ->push([
                    'id' => 'user-123',
                    'email' => 'jericho@example.com',
                ])
                ->push([
                    'id' => 'user-123',
                    'email' => 'jericho@example.com',
                ])
                ->push([
                    'id' => 'other-user',
                    'email' => 'other@example.com',
                ])
                ->push([
                    'id' => 'user-123',
                    'email' => 'jericho@example.com',
                ])
                ->push([
                    'id' => 'user-123',
                    'email' => 'jericho@example.com',
                ]),
        ]);

        $headers = [
            'Authorization' => 'Bearer valid-token',
            'Accept' => 'application/json',
        ];

        $createResponse = $this->withHeaders($headers)->postJson('/api/workflows', [
            'title' => 'Build CV project',
            'description' => 'Create a professional WorkFlow Hub portfolio project.',
            'category' => 'cv',
            'priority' => 'high',
            'status' => 'planned',
            'due_date' => '2026-07-01',
        ]);

        $workflowId = $createResponse
            ->assertCreated()
            ->assertJsonPath('data.title', 'Build CV project')
            ->assertJsonPath('data.supabase_user_id', 'user-123')
            ->json('data.id');

        $this->withHeaders($headers)->getJson('/api/workflows')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $workflowId);

        $this->withHeaders([
            'Authorization' => 'Bearer other-valid-token',
            'Accept' => 'application/json',
        ])->getJson("/api/workflows/{$workflowId}")
            ->assertNotFound();

        $this->withHeaders($headers)->patchJson("/api/workflows/{$workflowId}", [
            'status' => 'completed',
            'priority' => 'medium',
        ])
            ->assertOk()
            ->assertJsonPath('data.status', 'completed')
            ->assertJsonPath('data.priority', 'medium');

        $this->withHeaders($headers)->deleteJson("/api/workflows/{$workflowId}")
            ->assertNoContent();

        $this->assertDatabaseMissing('workflows', [
            'id' => $workflowId,
        ]);
    }
}
