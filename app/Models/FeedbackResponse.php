<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FeedbackResponse extends Model
{
    use HasUuids;

    protected $fillable = ['feedback_id', 'author_id', 'body', 'is_internal'];

    protected function casts(): array
    {
        return ['is_internal' => 'boolean'];
    }

    public function feedback(): BelongsTo
    {
        return $this->belongsTo(Feedback::class);
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}
