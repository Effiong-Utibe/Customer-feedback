<?php

namespace App\Http\Controllers;

use App\Enums\SurveyStatus;
use App\Http\Requests\SurveyFormRequest;
use App\Models\Survey;
use App\Services\ActivityLogger;
use App\Services\SurveyService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SurveyManagementController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Survey::class);

        return Inertia::render('surveys/manage/index', [
            'surveys' => Survey::with('creator:id,name')->withCount(['questions', 'responses'])->latest()->paginate(12)->withQueryString(),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Survey::class);

        return Inertia::render('surveys/manage/form', ['survey' => null]);
    }

    public function store(SurveyFormRequest $request, SurveyService $service): RedirectResponse
    {
        $survey = $service->create($request->user(), $request->validated());

        return redirect()->route('surveys.manage.edit', $survey)->with('success', 'Survey draft created.');
    }

    public function edit(Survey $survey): Response
    {
        $this->authorize('update', $survey);

        return Inertia::render('surveys/manage/form', ['survey' => $survey->load('questions.options')]);
    }

    public function update(SurveyFormRequest $request, Survey $survey, SurveyService $service): RedirectResponse
    {
        $service->update($survey, $request->validated());

        return back()->with('success', 'Survey saved.');
    }

    public function publish(Survey $survey, Request $request, SurveyService $service): RedirectResponse
    {
        $this->authorize('publish', $survey);
        $service->publish($survey);

        return back()->with('success', 'Survey published.');
    }

    public function close(Survey $survey, SurveyService $service): RedirectResponse
    {
        $this->authorize('update', $survey);
        abort_if($survey->status === SurveyStatus::Archived, 422, 'Archived surveys cannot be changed.');
        $service->close($survey);

        return back()->with('success', 'Survey closed.');
    }

    public function archive(Survey $survey, Request $request, SurveyService $service, ActivityLogger $logger): RedirectResponse
    {
        $this->authorize('update', $survey);
        $service->archive($survey);

        return back()->with('success', 'Survey archived.');
    }
}
