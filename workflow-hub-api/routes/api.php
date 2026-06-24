<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WorkflowController;
use App\Http\Middleware\AuthenticateWithSupabase;
use Illuminate\Support\Facades\Route;

Route::middleware(AuthenticateWithSupabase::class)->group(function (): void {
    Route::get('profile', [ProfileController::class, 'show']);
    Route::patch('profile', [ProfileController::class, 'update']);
    Route::apiResource('workflows', WorkflowController::class);
});
