<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateWorkflowRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'required', 'string', 'max:160'],
            'description' => ['sometimes', 'nullable', 'string', 'max:2000'],
            'category' => ['sometimes', 'required', 'string', 'in:cv,learning,backend,frontend,supabase'],
            'priority' => ['sometimes', 'required', 'string', 'in:low,medium,high'],
            'status' => ['sometimes', 'required', 'string', 'in:planned,in_progress,completed'],
            'due_date' => ['sometimes', 'nullable', 'date'],
        ];
    }
}
