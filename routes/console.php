<?php

use App\Enums\SurveyStatus;
use App\Models\Survey;
use App\Models\User;
use App\Notifications\SurveyClosingReminderNotification;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::call(function (): void {
    Survey::query()->where('status', SurveyStatus::Scheduled->value)
        ->whereNotNull('starts_at')->where('starts_at', '<=', now())
        ->update(['status' => SurveyStatus::Active->value]);

    Survey::query()->where('status', SurveyStatus::Active->value)
        ->whereNotNull('ends_at')->where('ends_at', '<', now())
        ->update(['status' => SurveyStatus::Closed->value]);

    Survey::query()->where('status', SurveyStatus::Active->value)
        ->whereNotNull('ends_at')->whereBetween('ends_at', [now(), now()->addDay()])
        ->whereNull('closing_reminder_sent_at')->each(function (Survey $survey): void {
            User::role('CUSTOMER')->where('is_active', true)->each(
                fn (User $customer) => $customer->notify(new SurveyClosingReminderNotification($survey)),
            );
            // Mark after sending so every eligible survey sends at most one reminder.
            $survey->update(['closing_reminder_sent_at' => now()]);
        });
})->everyMinute()->name('surveys.update-status-and-remind')->withoutOverlapping();
