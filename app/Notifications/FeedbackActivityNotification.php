<?php

namespace App\Notifications;

use App\Models\Feedback;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class FeedbackActivityNotification extends Notification
{
    use Queueable;

    public function __construct(public readonly Feedback $feedback, public readonly string $event) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'event' => $this->event,
            'feedback_id' => $this->feedback->id,
            'subject' => $this->feedback->subject,
            'message' => match ($this->event) {
                'submitted' => 'Your feedback has been submitted.',
                'assigned' => 'A feedback item has been assigned to you.',
                'responded' => 'There is a new response to your feedback.',
                'status_changed' => 'The status of your feedback has changed to '.$this->feedback->status->value.'.',
                default => 'Your feedback has been updated.',
            },
        ];
    }
}
