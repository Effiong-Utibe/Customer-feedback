<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSurveyResponseRequest;
use App\Models\Survey;
use App\Models\SurveyResponse;
use App\Services\SurveyService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SurveyParticipationController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $available = Survey::available()->withCount('questions')->latest('published_at')->paginate(12);
        $completedIds = $user->surveyResponses()->whereNotNull('submitted_at')->pluck('survey_id')->all();

        foreach (Survey::where('is_anonymous', true)->where('allow_multiple_submissions', false)->pluck('id') as $surveyId) {
            $key = hash_hmac('sha256', $surveyId.':'.$user->id, (string) config('app.key'));
            if (SurveyResponse::where('survey_id', $surveyId)->where('participant_key', $key)->exists()) {
                $completedIds[] = $surveyId;
            }
        }

        return Inertia::render('surveys/index', [
            'surveys' => $available,
            'completedSurveyIds' => array_values(array_unique($completedIds)),
            'history' => $user->surveyResponses()->with('survey:id,title,status')->latest('submitted_at')->paginate(8, ['*'], 'history_page'),
        ]);
    }

    public function show(Survey $survey, Request $request): Response
    {
        abort_unless($request->user()->hasRole('CUSTOMER'), 403);
        abort_unless($survey->isAvailableNow(), 404);
        $survey->load(['questions' => fn ($query) => $query->where('is_active', true)->with('options')]);

        return Inertia::render('surveys/participate', ['survey' => $survey]);
    }

    public function store(StoreSurveyResponseRequest $request, Survey $survey, SurveyService $service): RedirectResponse
    {
        $service->submitResponse($survey, $request->user(), $request->validated('answers', []));

        return redirect()->route('surveys.index')->with('success', 'Your survey response has been submitted.');
    }
}
