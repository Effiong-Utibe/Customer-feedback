<?php

namespace App\Http\Controllers;

use App\Enums\FeedbackStatus;
use App\Enums\SurveyStatus;
use App\Models\ActivityLog;
use App\Models\Feedback;
use App\Models\Survey;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();
        abort_unless($user->can('dashboard.view'), 403);

        // Each role receives only the metrics and records its matching dashboard needs.
        if ($user->hasRole('ADMIN')) {
            return Inertia::render('dashboard/index', [
                'role' => 'ADMIN',
                'metrics' => [
                    'customers' => User::role('CUSTOMER')->count(),
                    'staff' => User::role('STAFF')->count(),
                    'feedback' => Feedback::count(),
                    'pendingFeedback' => Feedback::whereNotIn('status', [FeedbackStatus::Resolved->value, FeedbackStatus::Closed->value])->count(),
                    'resolvedFeedback' => Feedback::whereIn('status', [FeedbackStatus::Resolved->value, FeedbackStatus::Closed->value])->count(),
                    'surveys' => Survey::count(),
                    'activeSurveys' => Survey::where('status', SurveyStatus::Active->value)->count(),
                    'surveyResponses' => DB::table('survey_responses')->whereNotNull('submitted_at')->count(),
                    'averageRating' => round((float) Feedback::whereNotNull('rating')->avg('rating'), 1),
                ],
                'feedbackTrend' => Feedback::query()->selectRaw('DATE(created_at) as day, COUNT(*) as total')
                    ->where('created_at', '>=', now()->subDays(6)->startOfDay())->groupBy('day')->orderBy('day')->get(),
                'recentActivity' => ActivityLog::with('actor:id,name')->latest()->limit(8)->get(),
            ]);
        }

        if ($user->hasRole('STAFF')) {
            $assigned = Feedback::where('assigned_to_id', $user->id);

            return Inertia::render('dashboard/index', [
                'role' => 'STAFF',
                'metrics' => [
                    'assignedFeedback' => (clone $assigned)->count(),
                    'pendingTasks' => (clone $assigned)->whereNotIn('status', [FeedbackStatus::Resolved->value, FeedbackStatus::Closed->value])->count(),
                    'resolvedFeedback' => (clone $assigned)->whereIn('status', [FeedbackStatus::Resolved->value, FeedbackStatus::Closed->value])->count(),
                ],
                'recentFeedback' => (clone $assigned)->with('category:id,name', 'customer:id,name')->latest()->limit(6)->get(),
                'notifications' => $user->unreadNotifications()->latest()->limit(5)->get(),
            ]);
        }

        $own = Feedback::where('customer_id', $user->id);

        return Inertia::render('dashboard/index', [
            'role' => 'CUSTOMER',
            'metrics' => [
                'submittedFeedback' => (clone $own)->count(),
                'pendingFeedback' => (clone $own)->whereNotIn('status', [FeedbackStatus::Resolved->value, FeedbackStatus::Closed->value])->count(),
                'resolvedFeedback' => (clone $own)->whereIn('status', [FeedbackStatus::Resolved->value, FeedbackStatus::Closed->value])->count(),
                'availableSurveys' => Survey::available()->count(),
                'completedSurveys' => $user->surveyResponses()->whereNotNull('submitted_at')->count(),
            ],
            'recentFeedback' => (clone $own)->with('category:id,name')->latest()->limit(6)->get(),
            'availableSurveys' => Survey::available()->withCount('questions')->latest('published_at')->limit(4)->get(),
        ]);
    }
}
