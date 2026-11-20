<?php

namespace App\Models;

use App\Enums\SurveyStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Survey extends Model
{
    use HasUuids;

    protected $fillable = [
        'created_by_id', 'title', 'description', 'instructions', 'status', 'starts_at', 'ends_at',
        'is_anonymous', 'allow_multiple_submissions', 'published_at', 'archived_at',
    ];

    protected function casts(): array
    {
        return [
            'status' => SurveyStatus::class,
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
            'published_at' => 'datetime',
            'archived_at' => 'datetime',
            'closing_reminder_sent_at' => 'datetime',
            'is_anonymous' => 'boolean',
            'allow_multiple_submissions' => 'boolean',
        ];
    }

    public function scopeAvailable(Builder $query): Builder
    {
        $now = now();

        return $query->whereIn('status', [SurveyStatus::Active->value, SurveyStatus::Scheduled->value])
            ->where(fn (Builder $query) => $query->whereNull('starts_at')->orWhere('starts_at', '<=', $now))
            ->where(fn (Builder $query) => $query->whereNull('ends_at')->orWhere('ends_at', '>=', $now));
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_id');
    }

    public function questions(): HasMany
    {
        return $this->hasMany(SurveyQuestion::class)->orderBy('position');
    }

    public function responses(): HasMany
    {
        return $this->hasMany(SurveyResponse::class);
    }

    public function isAvailableNow(): bool
    {
        return in_array($this->status, [SurveyStatus::Active, SurveyStatus::Scheduled], true)
            && (! $this->starts_at || $this->starts_at->isPast())
            && (! $this->ends_at || $this->ends_at->isFuture());
    }
}
