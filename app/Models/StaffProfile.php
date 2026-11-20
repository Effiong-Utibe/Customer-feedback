<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StaffProfile extends Model
{
    protected $primaryKey = 'user_id';

    protected $fillable = ['user_id', 'staff_number', 'job_title', 'department'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
