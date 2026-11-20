<?php

namespace App\Services;

use App\Models\ActivityLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class ActivityLogger
{
    public function record(string $action, ?Model $subject = null, array $properties = [], ?string $description = null): ActivityLog
    {
        return ActivityLog::create([
            'actor_id' => auth()->id(),
            'action' => $action,
            'subject_type' => $subject?->getMorphClass(),
            'subject_id' => $subject?->getKey(),
            'description' => $description,
            'properties' => $properties ?: null,
            'ip_address' => app()->bound('request') ? app(Request::class)->ip() : null,
        ]);
    }
}
