<?php

namespace App\Models;

use App\Enums\SurveyQuestionType;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SurveyQuestion extends Model
{
    use HasUuids;

    protected $fillable = ['survey_id', 'title', 'description', 'question_type', 'is_required', 'position', 'validation_rules', 'is_active'];

    protected function casts(): array
    {
        return [
            'question_type' => SurveyQuestionType::class,
            'is_required' => 'boolean',
            'is_active' => 'boolean',
            'validation_rules' => 'array',
        ];
    }

    public function survey(): BelongsTo
    {
        return $this->belongsTo(Survey::class);
    }

    public function options(): HasMany
    {
        return $this->hasMany(SurveyQuestionOption::class)->orderBy('position');
    }

    public function answers(): HasMany
    {
        return $this->hasMany(SurveyAnswer::class, 'survey_question_id');
    }
}
