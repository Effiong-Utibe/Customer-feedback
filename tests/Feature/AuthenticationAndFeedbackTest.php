<?php

use App\Enums\FeedbackStatus;
use App\Models\Feedback;
use App\Models\FeedbackCategory;
use App\Models\User;
use Database\Seeders\FeedbackCategorySeeder;
use Database\Seeders\RoleSeeder;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Support\Facades\Notification;

beforeEach(function (): void {
    $this->seed(RoleSeeder::class);
    $this->seed(FeedbackCategorySeeder::class);
});

it('registers public accounts as customers even if a role is submitted', function (): void {
    Notification::fake();

    $this->post('/register', [
        'name' => 'Amina Customer',
        'email' => 'amina@example.com',
        'password' => 'Strong-password-2026',
        'password_confirmation' => 'Strong-password-2026',
        'role' => 'ADMIN',
    ])->assertRedirect('/dashboard');

    $user = User::where('email', 'amina@example.com')->firstOrFail();
    expect($user->hasRole('CUSTOMER'))->toBeTrue()
        ->and($user->hasRole('ADMIN'))->toBeFalse()
        ->and($user->customerProfile)->not->toBeNull();
    Notification::assertSentTo($user, VerifyEmail::class);
});

it('keeps feedback private to its customer', function (): void {
    $owner = User::factory()->create(['email_verified_at' => now()]);
    $owner->assignRole('CUSTOMER');
    $other = User::factory()->create(['email_verified_at' => now()]);
    $other->assignRole('CUSTOMER');

    $feedback = Feedback::create([
        'customer_id' => $owner->id,
        'feedback_category_id' => FeedbackCategory::first()->id,
        'subject' => 'A private concern',
        'body' => 'This message belongs to the submitting customer.',
        'status' => FeedbackStatus::Submitted,
        'priority' => 'MEDIUM',
    ]);

    $this->actingAs($other)->get(route('feedback.show', $feedback))->assertForbidden();
    $this->actingAs($owner)->get(route('feedback.show', $feedback))->assertOk();
});

it('lets staff see only the feedback assigned to them', function (): void {
    $staff = User::factory()->create(['email_verified_at' => now()]);
    $staff->assignRole('STAFF');
    $customer = User::factory()->create(['email_verified_at' => now()]);
    $customer->assignRole('CUSTOMER');
    $categoryId = FeedbackCategory::first()->id;

    $assigned = Feedback::create([
        'customer_id' => $customer->id, 'feedback_category_id' => $categoryId,
        'assigned_to_id' => $staff->id, 'subject' => 'Assigned', 'body' => 'This task is assigned to staff.',
        'status' => 'ASSIGNED', 'priority' => 'HIGH',
    ]);
    $unassigned = Feedback::create([
        'customer_id' => $customer->id, 'feedback_category_id' => $categoryId,
        'subject' => 'Not assigned', 'body' => 'This task belongs to another queue.',
        'status' => 'SUBMITTED', 'priority' => 'LOW',
    ]);

    $this->actingAs($staff)->get(route('feedback.index'))->assertOk()->assertInertia(fn ($page) => $page
        ->component('feedback/index')
        ->has('feedback.data', 1)
        ->where('feedback.data.0.id', $assigned->id));

    $this->actingAs($staff)->get(route('feedback.show', $unassigned))->assertForbidden();
});
