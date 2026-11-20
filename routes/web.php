<?php

use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\PasswordConfirmationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportsController;
use App\Http\Controllers\SurveyManagementController;
use App\Http\Controllers\SurveyParticipationController;
use Illuminate\Support\Facades\Route;

Route::get('/', fn () => auth()->check() ? redirect()->route('dashboard') : redirect()->route('login'));

Route::middleware(['auth', 'active'])->group(function (): void {
    Route::get('/dashboard', DashboardController::class)->middleware('can:dashboard.view')->name('dashboard');
    Route::get('/settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');

    Route::get('/feedback', [FeedbackController::class, 'index'])->name('feedback.index');
    Route::get('/feedback/create', [FeedbackController::class, 'create'])->name('feedback.create');
    Route::post('/feedback', [FeedbackController::class, 'store'])->middleware('throttle:feedback-submit')->name('feedback.store');
    Route::get('/feedback/{feedback}', [FeedbackController::class, 'show'])->name('feedback.show');
    Route::patch('/feedback/{feedback}', [FeedbackController::class, 'update'])->name('feedback.update');
    Route::post('/feedback/{feedback}/assign', [FeedbackController::class, 'assign'])->name('feedback.assign');
    Route::post('/feedback/{feedback}/responses', [FeedbackController::class, 'respond'])->name('feedback.responses.store');
    Route::get('/feedback/{feedback}/attachments/{attachment}', [FeedbackController::class, 'download'])->name('feedback.attachments.download');

    Route::get('/reports', [ReportsController::class, 'index'])->middleware('can:reports.view')->name('reports.index');
    Route::get('/reports/export/{format}', [ReportsController::class, 'export'])->middleware('can:reports.export')->name('reports.export');

    Route::get('/confirm-password', [PasswordConfirmationController::class, 'show'])->name('password.confirm');
    Route::post('/confirm-password', [PasswordConfirmationController::class, 'store'])->name('password.confirm.store');

    Route::get('/surveys', [SurveyParticipationController::class, 'index'])->middleware('role:CUSTOMER')->name('surveys.index');
    Route::get('/surveys/{survey}', [SurveyParticipationController::class, 'show'])->middleware('role:CUSTOMER')->name('surveys.show');
    Route::post('/surveys/{survey}/responses', [SurveyParticipationController::class, 'store'])->middleware(['role:CUSTOMER', 'throttle:survey-submit'])->name('surveys.responses.store');

    Route::prefix('admin/surveys')->name('surveys.manage.')->middleware('role:ADMIN|STAFF')->group(function (): void {
        Route::get('/', [SurveyManagementController::class, 'index'])->name('index');
        Route::get('/create', [SurveyManagementController::class, 'create'])->name('create');
        Route::post('/', [SurveyManagementController::class, 'store'])->name('store');
        Route::get('/{survey}/edit', [SurveyManagementController::class, 'edit'])->name('edit');
        Route::patch('/{survey}', [SurveyManagementController::class, 'update'])->name('update');
        Route::post('/{survey}/publish', [SurveyManagementController::class, 'publish'])->name('publish');
        Route::post('/{survey}/close', [SurveyManagementController::class, 'close'])->name('close');
        Route::post('/{survey}/archive', [SurveyManagementController::class, 'archive'])->name('archive');
    });

    Route::prefix('admin')->name('admin.')->middleware('role:ADMIN')->group(function (): void {
        Route::get('/users', [AdminUserController::class, 'users'])->name('users.index');
        Route::get('/users/{user}', [AdminUserController::class, 'show'])->name('users.show');
        Route::patch('/users/{user}/status', [AdminUserController::class, 'updateStatus'])->name('users.status');
        Route::patch('/users/{user}/role', [AdminUserController::class, 'updateRole'])->name('users.role');
        Route::get('/customers', [AdminUserController::class, 'customers'])->name('customers.index');
        Route::get('/staff', [AdminUserController::class, 'staff'])->name('staff.index');
        Route::get('/staff/create', [AdminUserController::class, 'createStaff'])->name('staff.create');
        Route::post('/staff', [AdminUserController::class, 'storeStaff'])->name('staff.store');
        Route::get('/audit-logs', [AuditLogController::class, 'index'])->name('audit-logs.index');
    });
});
