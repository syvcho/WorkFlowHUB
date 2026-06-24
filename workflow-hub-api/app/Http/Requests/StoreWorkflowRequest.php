<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreWorkflowRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:160'],
            'description' => ['nullable', 'string', 'max:2000'],
            'category' => ['required', 'string', 'in:cv,learning,backend,frontend,supabase'],
            'priority' => ['required', 'string', 'in:low,medium,high'],
            'status' => ['required', 'string', 'in:planned,in_progress,completed'],
            'due_date' => ['nullable', 'date'],
        ];
    }
}
