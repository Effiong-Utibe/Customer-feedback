<?php

namespace App\Http\Controllers;

use App\Enums\FeedbackStatus;
use App\Enums\SurveyStatus;
use App\Exports\FeedbackReportExport;
use App\Models\Feedback;
use App\Models\FeedbackCategory;
use App\Models\Survey;
use App\Models\SurveyAnswer;
use App\Models\SurveyResponse;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportsController extends Controller
{
    public function index(Request $request): InertiaResponse
    {
        abort_unless($request->user()->can('reports.view'), 403);
        $filters = $this->validateFilters($request);
        $query = $this->filteredFeedback($request, $filters);
        $feedback = (clone $query)->with('category:id,name')->get();
        $closed = $feedback->filter(fn (Feedback $item) => in_array($item->status, [FeedbackStatus::Resolved, FeedbackStatus::Closed], true));

        $surveyQuery = Survey::query()->when($filters['survey_id'] ?? null, fn ($builder, $id) => $builder->whereKey($id));
        $selectedSurvey = ($filters['survey_id'] ?? null) ? Survey::with('questions')->find($filters['survey_id']) : null;
        $surveyResponseQuery = SurveyResponse::query()
            ->whereNotNull('submitted_at')
            ->when($filters['survey_id'] ?? null, fn ($builder, $id) => $builder->where('survey_id', $id))
            ->when($filters['from'] ?? null, fn ($builder, $date) => $builder->whereDate('submitted_at', '>=', $date))
            ->when($filters['to'] ?? null, fn ($builder, $date) => $builder->whereDate('submitted_at', '<=', $date));

        return Inertia::render('reports/index', [
            'filters' => $filters,
            'canFilterCustomer' => $request->user()->hasRole('ADMIN'),
            'customers' => $request->user()->hasRole('ADMIN') ? User::role('CUSTOMER')->orderBy('name')->get(['id', 'name']) : [],
            'surveys' => Survey::query()->orderByDesc('created_at')->get(['id', 'title', 'status']),
            'categories' => FeedbackCategory::active()->get(['id', 'name']),
            'feedbackMetrics' => [
                'total' => $feedback->count(),
                'resolved' => $closed->count(),
                'resolutionRate' => $feedback->isEmpty() ? 0 : round($closed->count() * 100 / $feedback->count(), 1),
                'averageRating' => round((float) $feedback->avg('rating'), 1),
            ],
            'feedbackByCategory' => $feedback->groupBy(fn (Feedback $item) => $item->category?->name ?? 'Uncategorized')->map(fn ($items, $name) => ['name' => $name, 'total' => $items->count()])->values(),
            'feedbackByStatus' => $feedback->groupBy(fn (Feedback $item) => $item->status->value)->map(fn ($items, $name) => ['name' => $name, 'total' => $items->count()])->values(),
            'feedbackByPriority' => $feedback->groupBy(fn (Feedback $item) => $item->priority->value)->map(fn ($items, $name) => ['name' => $name, 'total' => $items->count()])->values(),
            'feedbackTrend' => (clone $query)->selectRaw('DATE(created_at) as day, COUNT(*) as total')->groupBy('day')->orderBy('day')->limit(90)->get(),
            'staffPerformance' => User::role('STAFF')->withCount([
                'assignedFeedback as assigned_count',
                'assignedFeedback as resolved_count' => fn (Builder $builder) => $builder->whereIn('status', [FeedbackStatus::Resolved->value, FeedbackStatus::Closed->value]),
            ])->orderByDesc('resolved_count')->limit(20)->get(['id', 'name']),
            'surveyMetrics' => [
                'total' => (clone $surveyQuery)->count(),
                'active' => (clone $surveyQuery)->where('status', SurveyStatus::Active->value)->count(),
                'responses' => (clone $surveyResponseQuery)->count(),
            ],
            'surveyResponseTrend' => (clone $surveyResponseQuery)->selectRaw('DATE(submitted_at) as day, COUNT(*) as total')->groupBy('day')->orderBy('day')->limit(90)->get(),
            'selectedSurvey' => $selectedSurvey,
            'questionAnalysis' => $selectedSurvey ? $this->questionAnalysis($selectedSurvey) : [],
        ]);
    }

    public function export(Request $request, string $format)
    {
        abort_unless($request->user()->can('reports.export'), 403);
        abort_unless(in_array($format, ['csv', 'xlsx', 'pdf'], true), 404);
        $filters = $this->validateFilters($request);
        $rows = $this->filteredFeedback($request, $filters)->with(['category:id,name', 'customer:id,name', 'assignee:id,name'])->latest()->limit(10000)->get();
        $filename = 'ui-ventures-feedback-'.now()->format('Ymd-His');

        if ($format === 'xlsx') {
            return Excel::download(new FeedbackReportExport($rows), $filename.'.xlsx');
        }

        if ($format === 'pdf') {
            return Pdf::loadView('reports.pdf', ['rows' => $rows])->setPaper('a4', 'landscape')->download($filename.'.pdf');
        }

        return new StreamedResponse(function () use ($rows): void {
            $output = fopen('php://output', 'w');
            fputcsv($output, ['ID', 'Customer', 'Category', 'Subject', 'Status', 'Priority', 'Rating', 'Assigned to', 'Submitted at', 'Resolved at']);
            foreach ($rows as $feedback) {
                fputcsv($output, [
                    $feedback->id, $feedback->customer?->name, $feedback->category?->name, $feedback->subject,
                    $feedback->status->value, $feedback->priority->value, $feedback->rating, $feedback->assignee?->name,
                    $feedback->created_at?->toDateTimeString(), $feedback->resolved_at?->toDateTimeString(),
                ]);
            }
            fclose($output);
        }, 200, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="'.$filename.'.csv"',
        ]);
    }

    /** @return array<string, mixed> */
    private function validateFilters(Request $request): array
    {
        $filters = $request->validate([
            'from' => ['nullable', 'date'],
            'to' => ['nullable', 'date', 'after_or_equal:from'],
            'category_id' => ['nullable', 'integer', 'exists:feedback_categories,id'],
            'status' => ['nullable', Rule::in(array_column(FeedbackStatus::cases(), 'value'))],
            'priority' => ['nullable', Rule::in(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])],
            'survey_id' => ['nullable', 'uuid', 'exists:surveys,id'],
            'customer_id' => ['nullable', 'integer', Rule::exists('users', 'id')],
        ]);

        if (! $request->user()->hasRole('ADMIN')) {
            unset($filters['customer_id']);
        }

        return $filters;
    }

    /** @param array<string, mixed> $filters */
    private function filteredFeedback(Request $request, array $filters): Builder
    {
        return Feedback::visibleTo($request->user())
            ->when($filters['from'] ?? null, fn (Builder $query, $date) => $query->whereDate('created_at', '>=', $date))
            ->when($filters['to'] ?? null, fn (Builder $query, $date) => $query->whereDate('created_at', '<=', $date))
            ->when($filters['category_id'] ?? null, fn (Builder $query, $id) => $query->where('feedback_category_id', $id))
            ->when($filters['status'] ?? null, fn (Builder $query, $status) => $query->where('status', $status))
            ->when($filters['priority'] ?? null, fn (Builder $query, $priority) => $query->where('priority', $priority))
            ->when($filters['customer_id'] ?? null, fn (Builder $query, $id) => $query->where('customer_id', $id));
    }

    private function questionAnalysis(Survey $survey): array
    {
        return $survey->questions()->where('is_active', true)->orderBy('position')->get()->map(function ($question): array {
            $answers = SurveyAnswer::query()
                ->where('survey_question_id', $question->id)
                ->whereHas('response', fn (Builder $query) => $query->whereNotNull('submitted_at'))
                ->get(['answer', 'question_snapshot']);
            $isText = in_array($question->question_type->value, ['SHORT_TEXT', 'LONG_TEXT'], true);
            $distribution = $isText ? collect() : $answers
                ->pluck('answer.value')
                ->flatten()
                ->filter(fn ($value) => $value !== null && $value !== '')
                ->countBy()
                ->map(fn ($count, $value) => ['name' => (string) $value, 'total' => $count])
                ->values();

            return [
                'id' => $question->id,
                'title' => $question->title,
                'type' => $question->question_type->value,
                'responses' => $answers->filter(fn ($answer) => data_get($answer->answer, 'value') !== null)->count(),
                'distribution' => $distribution,
            ];
        })->all();
    }
}
