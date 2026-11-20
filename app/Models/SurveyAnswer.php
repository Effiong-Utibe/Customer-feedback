<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SurveyAnswer extends Model
{
    use HasUuids;

    protected $fillable = ['survey_response_id', 'survey_question_id', 'answer', 'question_snapshot'];

    protected function casts(): array
    {
        return ['answer' => 'array', 'question_snapshot' => 'array'];
    }

    public function response(): BelongsTo
    {
        return $this->belongsTo(SurveyResponse::class, 'survey_response_id');
    }

    public function question(): BelongsTo
    {
        return $this->belongsTo(SurveyQuestion::class, 'survey_question_id');
    }
}
