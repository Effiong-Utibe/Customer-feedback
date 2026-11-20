<?php

namespace App\Models;

use App\Enums\FeedbackPriority;
use App\Enums\FeedbackStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Feedback extends Model
{
    use HasUuids;

    protected $fillable = [
        'customer_id', 'feedback_category_id', 'assigned_to_id', 'subject', 'body', 'rating', 'status', 'priority', 'resolved_at',
    ];

    protected function casts(): array
    {
        return [
            'status' => FeedbackStatus::class,
            'priority' => FeedbackPriority::class,
            'resolved_at' => 'datetime',
        ];
    }

    public function scopeVisibleTo(Builder $query, User $user): Builder
    {
        if ($user->hasRole('ADMIN')) {
            return $query;
        }

        if ($user->hasRole('STAFF')) {
            return $query->where('assigned_to_id', $user->id);
        }

        return $query->where('customer_id', $user->id);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(FeedbackCategory::class, 'feedback_category_id');
    }

    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to_id');
    }

    public function responses(): HasMany
    {
        return $this->hasMany(FeedbackResponse::class)->orderBy('created_at');
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(FeedbackAttachment::class);
    }
}
