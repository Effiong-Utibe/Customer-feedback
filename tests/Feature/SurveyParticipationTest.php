<?php

use App\Enums\SurveyQuestionType;
use App\Enums\SurveyStatus;
use App\Models\Survey;
use App\Models\SurveyQuestion;
use App\Models\SurveyResponse;
use App\Models\User;
use Database\Seeders\RoleSeeder;

beforeEach(function (): void {
    $this->seed(RoleSeeder::class);
});

function makeSurvey(bool $anonymous = false): array
{
    $admin = User::factory()->create(['email_verified_at' => now()]);
    $admin->assignRole('ADMIN');
    $survey = Survey::create([
        'created_by_id' => $admin->id,
        'title' => 'Service experience',
        'status' => SurveyStatus::Active,
        'is_anonymous' => $anonymous,
        'allow_multiple_submissions' => false,
        'published_at' => now(),
        'starts_at' => now()->subHour(),
        'ends_at' => now()->addDay(),
    ]);
    $question = SurveyQuestion::create([
        'survey_id' => $survey->id,
        'title' => 'What could we improve?',
        'question_type' => SurveyQuestionType::ShortText,
        'is_required' => true,
        'position' => 0,
        'is_active' => true,
    ]);

    return [$survey, $question];
}

it('requires answers for required questions and stores submitted responses', function (): void {
    [$survey, $question] = makeSurvey();
    $customer = User::factory()->create(['email_verified_at' => now()]);
    $customer->assignRole('CUSTOMER');

    $this->actingAs($customer)->post(route('surveys.responses.store', $survey), ['answers' => []])
        ->assertSessionHasErrors(['answers.'.$question->id]);
    expect(SurveyResponse::count())->toBe(0);

    $this->actingAs($customer)->post(route('surveys.responses.store', $survey), [
        'answers' => [$question->id => 'A faster response would help.'],
    ])->assertRedirect(route('surveys.index'));

    expect(SurveyResponse::count())->toBe(1)
        ->and(SurveyResponse::first()->respondent_id)->toBe($customer->id);
});

it('stores anonymous survey responses without a user id and blocks duplicates', function (): void {
    [$survey, $question] = makeSurvey(anonymous: true);
    $customer = User::factory()->create(['email_verified_at' => now()]);
    $customer->assignRole('CUSTOMER');
    $payload = ['answers' => [$question->id => 'Please improve the waiting time.']];

    $this->actingAs($customer)->post(route('surveys.responses.store', $survey), $payload)
        ->assertRedirect(route('surveys.index'));

    $response = SurveyResponse::firstOrFail();
    expect($response->respondent_id)->toBeNull()
        ->and($response->participant_key)->toBeString()
        ->and($response->participant_key)->not->toBe((string) $customer->id);

    $this->actingAs($customer)->post(route('surveys.responses.store', $survey), $payload)
        ->assertSessionHasErrors('survey');
    expect(SurveyResponse::count())->toBe(1);
});
