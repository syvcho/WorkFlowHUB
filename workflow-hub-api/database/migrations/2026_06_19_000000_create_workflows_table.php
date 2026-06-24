<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('workflows', function (Blueprint $table): void {
            $table->id();
            $table->string('supabase_user_id');
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('category')->default('learning');
            $table->string('priority')->default('medium');
            $table->string('status')->default('planned');
            $table->date('due_date')->nullable();
            $table->timestamps();

            $table->index(['supabase_user_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('workflows');
    }
};
