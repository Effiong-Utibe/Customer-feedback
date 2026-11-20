<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CustomerProfile extends Model
{
    protected $primaryKey = 'user_id';

    protected $fillable = ['user_id', 'phone', 'organization'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
