<?php

namespace App\Support;

final readonly class SupabaseUser
{
    public function __construct(
        public string $id,
        public ?string $email = null,
        public ?string $name = null,
    ) {}
}
