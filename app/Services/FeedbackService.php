<?php

namespace App\Services;

use App\Enums\FeedbackStatus;
use App\Models\Feedback;
use App\Models\FeedbackAttachment;
use App\Models\FeedbackResponse;
use App\Models\User;
use App\Notifications\FeedbackActivityNotification;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class FeedbackService
{
    public function __construct(private readonly ActivityLogger $activityLogger) {}

    /** @param array<int, UploadedFile> $files */
    public function submit(User $customer, array $data, array $files = []): Feedback
    {
        return DB::transaction(function () use ($customer, $data, $files): Feedback {
            $feedback = Feedback::create([
                ...$data,
                'customer_id' => $customer->id,
                'status' => FeedbackStatus::Submitted,
            ]);

            foreach ($files as $file) {
                // Keep customer uploads on the private local disk; downloads are policy checked.
                $path = $file->store('feedback/'.$feedback->id, 'local');
                FeedbackAttachment::create([
                    'feedback_id' => $feedback->id,
                    'uploaded_by_id' => $customer->id,
                    'original_name' => $file->getClientOriginalName(),
                    'disk' => 'local',
                    'path' => $path,
                    'mime_type' => $file->getMimeType() ?: 'application/octet-stream',
                    'size_bytes' => $file->getSize() ?: 0,
                ]);
            }

            $customer->notify(new FeedbackActivityNotification($feedback, 'submitted'));
            $this->activityLogger->record('feedback.submitted', $feedback);

            return $feedback;
        });
    }

    public function assign(Feedback $feedback, User $staff): Feedback
    {
        if (! $staff->hasRole('STAFF') || ! $staff->is_active) {
            throw ValidationException::withMessages(['assigned_to_id' => 'Choose an active staff account.']);
        }

        $previous = $feedback->assigned_to_id;
        $feedback->update(['assigned_to_id' => $staff->id, 'status' => FeedbackStatus::Assigned]);
        $staff->notify(new FeedbackActivityNotification($feedback, 'assigned'));
        $this->activityLogger->record('feedback.assigned', $feedback, ['from' => $previous, 'to' => $staff->id]);

        return $feedback->refresh();
    }

    public function changeStatus(Feedback $feedback, FeedbackStatus $status, ?string $priority = null): Feedback
    {
        $previous = $feedback->status;
        $feedback->update([
            'status' => $status,
            'priority' => $priority ?? $feedback->priority,
            'resolved_at' => in_array($status, [FeedbackStatus::Resolved, FeedbackStatus::Closed], true) ? now() : null,
        ]);

        if ($previous !== $status) {
            $feedback->customer->notify(new FeedbackActivityNotification($feedback, 'status_changed'));
            $this->activityLogger->record('feedback.status_changed', $feedback, ['from' => $previous->value, 'to' => $status->value]);
        }

        return $feedback->refresh();
    }

    public function respond(Feedback $feedback, User $author, string $body, bool $internal = false): FeedbackResponse
    {
        if ($internal && ! $author->hasAnyRole(['ADMIN', 'STAFF'])) {
            throw ValidationException::withMessages(['is_internal' => 'Only staff can add internal notes.']);
        }

        $response = $feedback->responses()->create([
            'author_id' => $author->id,
            'body' => $body,
            'is_internal' => $internal,
        ]);

        if (! $internal) {
            $feedback->customer->notify(new FeedbackActivityNotification($feedback, 'responded'));
        }

        // Internal notes stay in staff history and never trigger a customer notice.
        $this->activityLogger->record('feedback.responded', $feedback, ['response_id' => $response->id, 'internal' => $internal]);

        return $response;
    }
}
