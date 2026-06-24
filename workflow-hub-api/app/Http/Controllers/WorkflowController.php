<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreWorkflowRequest;
use App\Http\Requests\UpdateWorkflowRequest;
use App\Http\Resources\WorkflowResource;
use App\Models\Workflow;
use App\Support\SupabaseUser;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class WorkflowController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $user = $this->supabaseUser($request);

        return WorkflowResource::collection(
            Workflow::query()
                ->where('supabase_user_id', $user->id)
                ->latest()
                ->get()
        );
    }

    public function store(StoreWorkflowRequest $request): WorkflowResource
    {
        $user = $this->supabaseUser($request);

        $workflow = Workflow::create([
            ...$request->validated(),
            'supabase_user_id' => $user->id,
        ]);

        return WorkflowResource::make($workflow);
    }

    public function show(Request $request, Workflow $workflow): WorkflowResource
    {
        $this->authorizeWorkflow($request, $workflow);

        return WorkflowResource::make($workflow);
    }

    public function update(UpdateWorkflowRequest $request, Workflow $workflow): WorkflowResource
    {
        $this->authorizeWorkflow($request, $workflow);

        $workflow->update($request->validated());

        return WorkflowResource::make($workflow);
    }

    public function destroy(Request $request, Workflow $workflow): Response
    {
        $this->authorizeWorkflow($request, $workflow);

        $workflow->delete();

        return response()->noContent();
    }

    private function authorizeWorkflow(Request $request, Workflow $workflow): void
    {
        abort_if(
            $workflow->supabase_user_id !== $this->supabaseUser($request)->id,
            404
        );
    }

    private function supabaseUser(Request $request): SupabaseUser
    {
        return $request->attributes->get('supabase_user');
    }
}
