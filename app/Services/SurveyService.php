<?php

namespace App\Services;

use App\Enums\SurveyQuestionType;
use App\Enums\SurveyStatus;
use App\Models\Survey;
use App\Models\SurveyAnswer;
use App\Models\SurveyQuestion;
use App\Models\SurveyQuestionOption;
use App\Models\SurveyResponse;
use App\Models\User;
use App\Notifications\SurveyPublishedNotification;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class SurveyService
{
    public function __construct(private readonly ActivityLogger $activityLogger) {}

    public function create(User $creator, array $data): Survey
    {
        return DB::transaction(function () use ($creator, $data): Survey {
            $survey = Survey::create([
                ...$this->surveyFields($data),
                'created_by_id' => $creator->id,
                'status' => SurveyStatus::Draft,
            ]);

            $this->syncQuestions($survey, $data['questions'] ?? []);
            $this->activityLogger->record('survey.created', $survey);

            return $survey->load('questions.options');
        });
    }

    public function update(Survey $survey, array $data): Survey
    {
        if ($survey->status === SurveyStatus::Archived) {
            throw ValidationException::withMessages(['survey' => 'Archived surveys cannot be changed.']);
        }

        return DB::transaction(function () use ($survey, $data): Survey {
            $survey->update($this->surveyFields($data));
            $this->syncQuestions($survey, $data['questions'] ?? []);
            $this->activityLogger->record('survey.updated', $survey);

            return $survey->refresh()->load('questions.options');
        });
    }

    public function publish(Survey $survey): Survey
    {
        if (! $survey->questions()->where('is_active', true)->exists()) {
            throw ValidationException::withMessages(['questions' => 'Add at least one question before publishing.']);
        }

        $status = $survey->starts_at && $survey->starts_at->isFuture() ? SurveyStatus::Scheduled : SurveyStatus::Active;
        $survey->update(['status' => $status, 'published_at' => now()]);
        $this->activityLogger->record('survey.published', $survey, ['status' => $status->value]);

        User::role('CUSTOMER')->where('is_active', true)->each(
            fn (User $customer) => $customer->notify(new SurveyPublishedNotification($survey)),
        );

        return $survey->refresh();
    }

    public function close(Survey $survey): Survey
    {
        $survey->update(['status' => SurveyStatus::Closed]);
        $this->activityLogger->record('survey.closed', $survey);

        return $survey->refresh();
    }

    public function archive(Survey $survey): Survey
    {
        $survey->update(['status' => SurveyStatus::Archived, 'archived_at' => now()]);
        $this->activityLogger->record('survey.archived', $survey);

        return $survey->refresh();
    }

    public function submitResponse(Survey $survey, User $respondent, array $answers): SurveyResponse
    {
        // Lock the survey while checking its status and storing answers to prevent close/submit races.
        return DB::transaction(function () use ($survey, $respondent, $answers): SurveyResponse {
            $locked = Survey::query()->lockForUpdate()->findOrFail($survey->id);
            if (! $locked->isAvailableNow()) {
                throw ValidationException::withMessages(['survey' => 'This survey is not currently accepting responses.']);
            }

            // HMAC gives anonymous submissions a stable duplicate key without saving respondent_id.
            $participantKey = $locked->is_anonymous
                ? hash_hmac('sha256', $locked->id.':'.$respondent->id, (string) config('app.key'))
                : (string) $respondent->id;

            if (! $locked->allow_multiple_submissions && $locked->responses()->where('participant_key', $participantKey)->exists()) {
                throw ValidationException::withMessages(['survey' => 'You have already submitted a response.']);
            }

            $response = $locked->responses()->create([
                'respondent_id' => $locked->is_anonymous ? null : $respondent->id,
                'participant_key' => $locked->allow_multiple_submissions ? null : $participantKey,
                'submitted_at' => now(),
            ]);

            $questions = $locked->questions()->where('is_active', true)->with('options')->orderBy('position')->get();
            foreach ($questions as $question) {
                $answer = $answers[$question->id] ?? null;
                SurveyAnswer::create([
                    'survey_response_id' => $response->id,
                    'survey_question_id' => $question->id,
                    'answer' => $answer === null ? null : ['value' => $answer],
                    // Preserve the question as it appeared when answered for later reporting.
                    'question_snapshot' => [
                        'title' => $question->title,
                        'description' => $question->description,
                        'type' => $question->question_type->value,
                        'required' => $question->is_required,
                        'options' => $question->options->map(fn ($option) => ['label' => $option->label, 'value' => $option->value])->all(),
                    ],
                ]);
            }

            $this->activityLogger->record('survey.response_submitted', $locked, ['response_id' => $response->id]);

            return $response;
        });
    }

    private function surveyFields(array $data): array
    {
        return collect($data)->only([
            'title', 'description', 'instructions', 'starts_at', 'ends_at', 'is_anonymous', 'allow_multiple_submissions',
        ])->all();
    }

    /** @param array<int, array<string, mixed>> $questionData */
    private function syncQuestions(Survey $survey, array $questionData): void
    {
        $retained = [];

        foreach ($questionData as $position => $input) {
            $question = isset($input['id'])
                ? $survey->questions()->whereKey($input['id'])->firstOrFail()
                : new SurveyQuestion(['survey_id' => $survey->id]);

            $question->fill([
                'title' => $input['title'],
                'description' => $input['description'] ?? null,
                'question_type' => SurveyQuestionType::from($input['question_type']),
                'is_required' => $input['is_required'] ?? false,
                'position' => $position,
                'validation_rules' => $input['validation_rules'] ?? null,
                'is_active' => true,
            ]);
            $survey->questions()->save($question);
            $retained[] = $question->id;

            $question->options()->delete();
            foreach ($input['options'] ?? [] as $optionPosition => $option) {
                SurveyQuestionOption::create([
                    'survey_question_id' => $question->id,
                    'label' => $option['label'],
                    'value' => $option['value'] ?? $option['label'],
                    'position' => $optionPosition,
                ]);
            }
        }

        $removed = $survey->questions()->whereNotIn('id', $retained)->get();
        foreach ($removed as $question) {
            // Existing answers refer to this question, so deactivate it instead of deleting history.
            if ($question->answers()->exists()) {
                $question->update(['is_active' => false]);
            } else {
                $question->delete();
            }
        }
    }
}
