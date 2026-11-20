<?php

namespace App\Notifications;

use App\Models\Survey;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class SurveyClosingReminderNotification extends Notification
{
    use Queueable;

    public function __construct(public readonly Survey $survey) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'event' => 'survey.closing_soon',
            'survey_id' => $this->survey->id,
            'title' => $this->survey->title,
            'message' => 'This survey closes soon. Share your response before it ends.',
        ];
    }
}
