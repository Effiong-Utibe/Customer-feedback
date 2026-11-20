<?php

namespace App\Http\Controllers;

use App\Enums\FeedbackPriority;
use App\Enums\FeedbackStatus;
use App\Http\Requests\AssignFeedbackRequest;
use App\Http\Requests\StoreFeedbackRequest;
use App\Http\Requests\StoreFeedbackResponseRequest;
use App\Http\Requests\UpdateFeedbackRequest;
use App\Models\Feedback;
use App\Models\FeedbackCategory;
use App\Models\User;
use App\Services\FeedbackService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class FeedbackController extends Controller
{
    public function index(Request $request): Response
    {
        abort_unless($request->user()->can('feedback.view'), 403);

        $filters = $request->validate([
            'q' => ['nullable', 'string', 'max:100'],
            'status' => ['nullable', Rule::enum(FeedbackStatus::class)],
            'priority' => ['nullable', Rule::enum(FeedbackPriority::class)],
            'category' => ['nullable', 'integer'],
        ]);

        // Apply record-level visibility in the query so private feedback never reaches the page payload.
        $feedback = Feedback::visibleTo($request->user())
            ->with('category:id,name', 'assignee:id,name')
            ->when($filters['q'] ?? null, fn ($query, $search) => $query->where(fn ($query) => $query
                ->whereRaw('LOWER(subject) LIKE ?', ['%'.mb_strtolower($search).'%'])
                ->orWhereRaw('LOWER(body) LIKE ?', ['%'.mb_strtolower($search).'%'])))
            ->when($filters['status'] ?? null, fn ($query, $status) => $query->where('status', $status))
            ->when($filters['priority'] ?? null, fn ($query, $priority) => $query->where('priority', $priority))
            ->when($filters['category'] ?? null, fn ($query, $category) => $query->where('feedback_category_id', $category))
            ->latest()->paginate(12)->withQueryString();

        return Inertia::render('feedback/index', [
            'feedback' => $feedback,
            'filters' => $filters,
            'categories' => FeedbackCategory::active()->get(['id', 'name']),
            'canManage' => $request->user()->hasAnyRole(['ADMIN', 'STAFF']),
        ]);
    }

    public function create(Request $request): Response
    {
        $this->authorize('create', Feedback::class);

        return Inertia::render('feedback/create', [
            'categories' => FeedbackCategory::active()->get(['id', 'name', 'description']),
        ]);
    }

    public function store(StoreFeedbackRequest $request, FeedbackService $service)
    {
        $feedback = $service->submit(
            $request->user(),
            $request->safe()->except('attachments'),
            $request->file('attachments', []),
        );

        return redirect()->route('feedback.show', $feedback)->with('success', 'Your feedback was submitted.');
    }

    public function show(Request $request, Feedback $feedback): Response
    {
        $this->authorize('view', $feedback);
        $feedback->load(['category:id,name', 'assignee:id,name', 'customer:id,name', 'attachments', 'responses.author:id,name']);

        if ($request->user()->hasRole('CUSTOMER')) {
            $feedback->setRelation('responses', $feedback->responses->where('is_internal', false)->values());
        }

        return Inertia::render('feedback/show', [
            'feedback' => $feedback,
            'staff' => $request->user()->hasRole('ADMIN') ? User::role('STAFF')->where('is_active', true)->orderBy('name')->get(['id', 'name']) : [],
            'canUpdate' => $request->user()->can('update', $feedback),
            'canAssign' => $request->user()->can('feedback.assign'),
        ]);
    }

    public function update(UpdateFeedbackRequest $request, Feedback $feedback, FeedbackService $service)
    {
        $status = FeedbackStatus::from($request->validated('status'));
        $service->changeStatus($feedback, $status, $request->validated('priority'));

        return back()->with('success', 'Feedback status updated.');
    }

    public function assign(AssignFeedbackRequest $request, Feedback $feedback, FeedbackService $service)
    {
        $staff = User::findOrFail($request->validated('assigned_to_id'));
        $service->assign($feedback, $staff);

        return back()->with('success', 'Feedback assigned to '.$staff->name.'.');
    }

    public function respond(StoreFeedbackResponseRequest $request, Feedback $feedback, FeedbackService $service)
    {
        $data = $request->validated();
        $service->respond($feedback, $request->user(), $data['body'], $data['is_internal'] ?? false);

        return back()->with('success', 'Response added.');
    }

    public function download(Request $request, Feedback $feedback, string $attachment)
    {
        $this->authorize('view', $feedback);
        $file = $feedback->attachments()->whereKey($attachment)->firstOrFail();

        return Storage::disk($file->disk)->download($file->path, $file->original_name);
    }
}
