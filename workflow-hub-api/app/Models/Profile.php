<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    protected $fillable = [
        'supabase_user_id',
        'email',
        'name',
    ];
}
