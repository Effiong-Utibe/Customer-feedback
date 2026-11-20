<?php

namespace App\Http\Requests;

use App\Enums\SurveyQuestionType;
use App\Models\Survey;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StoreSurveyResponseRequest extends FormRequest
{
    public function authorize(): bool
    {
        $survey = $this->route('survey');

        return $survey instanceof Survey
            && ($this->user()?->hasRole('CUSTOMER') ?? false)
            && $survey->isAvailableNow();
    }

    public function rules(): array
    {
        /** @var Survey $survey */
        $survey = $this->route('survey');
        $requiredAnswers = $survey->questions()->where('is_active', true)->where('is_required', true)->exists();
        $rules = ['answers' => [$requiredAnswers ? 'required' : 'sometimes', 'array']];

        foreach ($survey->questions()->where('is_active', true)->with('options')->get() as $question) {
            $key = 'answers.'.$question->id;
            $required = $question->is_required ? 'required' : 'nullable';
            $type = $question->question_type;

            $rules[$key] = match ($type) {
                SurveyQuestionType::ShortText => [$required, 'string', 'max:500'],
                SurveyQuestionType::LongText => [$required, 'string', 'max:10000'],
                SurveyQuestionType::SingleChoice, SurveyQuestionType::Dropdown => [$required, Rule::in($question->options->pluck('value')->all())],
                SurveyQuestionType::MultipleChoice => [$required, 'array', ...($question->is_required ? ['min:1'] : [])],
                SurveyQuestionType::Rating => [$required, 'integer', 'between:1,5'],
                SurveyQuestionType::LinearScale => [
                    $required, 'integer',
                    'between:'.($question->validation_rules['min'] ?? 1).','.($question->validation_rules['max'] ?? 10),
                ],
                SurveyQuestionType::YesNo => [$required, Rule::in([true, false, 1, 0, '1', '0', 'yes', 'no'])],
                SurveyQuestionType::Date => [$required, 'date_format:Y-m-d'],
            };

            if ($type === SurveyQuestionType::MultipleChoice) {
                $rules[$key.'.*'] = [Rule::in($question->options->pluck('value')->all())];
            }
        }

        return $rules;
    }

    public function after(): array
    {
        return [function (Validator $validator): void {
            /** @var Survey $survey */
            $survey = $this->route('survey');
            $knownIds = $survey->questions()->where('is_active', true)->pluck('id')->all();
            $answers = $this->input('answers', []);
            $submittedIds = is_array($answers) ? array_keys($answers) : [];

            if (array_diff($submittedIds, $knownIds)) {
                $validator->errors()->add('answers', 'The response contains an unknown survey question.');
            }
        }];
    }
}
