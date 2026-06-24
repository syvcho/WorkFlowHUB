<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private array $tables = [
        'cache',
        'cache_locks',
        'failed_jobs',
        'job_batches',
        'jobs',
        'migrations',
        'password_reset_tokens',
        'profiles',
        'sessions',
        'users',
        'workflows',
    ];

    public function up(): void
    {
        if (DB::getDriverName() !== 'pgsql') {
            return;
        }

        foreach ($this->tables as $table) {
            if (Schema::hasTable($table)) {
                DB::statement("ALTER TABLE public.{$table} ENABLE ROW LEVEL SECURITY");
            }
        }
    }

    public function down(): void
    {
        if (DB::getDriverName() !== 'pgsql') {
            return;
        }

        foreach ($this->tables as $table) {
            if (Schema::hasTable($table)) {
                DB::statement("ALTER TABLE public.{$table} DISABLE ROW LEVEL SECURITY");
            }
        }
    }
};
