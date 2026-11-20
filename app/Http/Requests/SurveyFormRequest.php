<?php

namespace App\Http\Requests;

use App\Enums\SurveyQuestionType;
use App\Models\Survey;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class SurveyFormRequest extends FormRequest
{
    public function authorize(): bool
    {
        $survey = $this->route('survey');

        return $survey instanceof Survey
            ? ($this->user()?->can('update', $survey) ?? false)
            : ($this->user()?->can('surveys.create') ?? false);
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:180'],
            'description' => ['nullable', 'string', 'max:5000'],
            'instructions' => ['nullable', 'string', 'max:5000'],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date', 'after:starts_at'],
            'is_anonymous' => ['sometimes', 'boolean'],
            'allow_multiple_submissions' => ['sometimes', 'boolean'],
            'questions' => ['required', 'array', 'min:1', 'max:50'],
            'questions.*.id' => ['nullable', 'uuid', Rule::exists('survey_questions', 'id')],
            'questions.*.title' => ['required', 'string', 'max:500'],
            'questions.*.description' => ['nullable', 'string', 'max:1000'],
            'questions.*.question_type' => ['required', Rule::enum(SurveyQuestionType::class)],
            'questions.*.is_required' => ['sometimes', 'boolean'],
            'questions.*.validation_rules' => ['nullable', 'array'],
            'questions.*.options' => ['sometimes', 'array', 'max:50'],
            'questions.*.options.*.label' => ['required', 'string', 'max:180'],
            'questions.*.options.*.value' => ['nullable', 'string', 'max:180'],
        ];
    }

    public function after(): array
    {
        return [function (Validator $validator): void {
            $questions = $this->input('questions', []);
            if (! is_array($questions)) {
                return;
            }
            foreach ($questions as $index => $question) {
                if (! is_array($question)) {
                    continue;
                }
                $typeValue = $question['question_type'] ?? null;
                $type = is_string($typeValue) ? SurveyQuestionType::tryFrom($typeValue) : null;
                $options = is_array($question['options'] ?? null) ? $question['options'] : [];
                if ($type?->usesOptions() && count($options) < 2) {
                    $validator->errors()->add("questions.$index.options", 'Choice questions need at least two options.');
                }
                if ($type?->usesOptions()) {
                    $values = array_map(fn ($option) => is_array($option) ? mb_strtolower(trim($option['value'] ?? $option['label'] ?? '')) : '', $options);
                    if (count($values) !== count(array_unique($values))) {
                        $validator->errors()->add("questions.$index.options", 'Each answer option must be unique.');
                    }
                }
            }
        }];
    }
}
