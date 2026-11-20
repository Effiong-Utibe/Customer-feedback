<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('customer_profiles', function (Blueprint $table): void {
            $table->foreignId('user_id')->primary()->constrained()->cascadeOnDelete();
            $table->string('phone', 40)->nullable();
            $table->string('organization')->nullable();
            $table->timestamps();
        });

        Schema::create('staff_profiles', function (Blueprint $table): void {
            $table->foreignId('user_id')->primary()->constrained()->cascadeOnDelete();
            $table->string('staff_number', 40)->unique();
            $table->string('job_title')->nullable();
            $table->string('department')->nullable();
            $table->timestamps();
        });

        Schema::create('feedback_categories', function (Blueprint $table): void {
            $table->id();
            $table->string('name')->unique();
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true)->index();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('feedback', function (Blueprint $table): void {
            $table->uuid('id')->primary();
            $table->foreignId('customer_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('feedback_category_id')->nullable()->constrained('feedback_categories')->nullOnDelete();
            $table->foreignId('assigned_to_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('subject', 180);
            $table->text('body');
            $table->unsignedTinyInteger('rating')->nullable();
            $table->string('status', 32)->default('SUBMITTED')->index();
            $table->string('priority', 16)->default('MEDIUM')->index();
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();
            $table->index(['customer_id', 'created_at']);
            $table->index(['assigned_to_id', 'status']);
            $table->index(['feedback_category_id', 'status']);
        });

        Schema::create('feedback_attachments', function (Blueprint $table): void {
            $table->uuid('id')->primary();
            $table->foreignUuid('feedback_id')->constrained('feedback')->cascadeOnDelete();
            $table->foreignId('uploaded_by_id')->constrained('users')->cascadeOnDelete();
            $table->string('original_name');
            $table->string('disk', 40)->default('local');
            $table->string('path');
            $table->string('mime_type', 120);
            $table->unsignedBigInteger('size_bytes');
            $table->timestamps();
        });

        Schema::create('feedback_responses', function (Blueprint $table): void {
            $table->uuid('id')->primary();
            $table->foreignUuid('feedback_id')->constrained('feedback')->cascadeOnDelete();
            $table->foreignId('author_id')->constrained('users')->cascadeOnDelete();
            $table->text('body');
            $table->boolean('is_internal')->default(false);
            $table->timestamps();
            $table->index(['feedback_id', 'created_at']);
        });

        Schema::create('surveys', function (Blueprint $table): void {
            $table->uuid('id')->primary();
            $table->foreignId('created_by_id')->constrained('users')->restrictOnDelete();
            $table->string('title', 180);
            $table->text('description')->nullable();
            $table->text('instructions')->nullable();
            $table->string('status', 20)->default('DRAFT')->index();
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->boolean('is_anonymous')->default(false);
            $table->boolean('allow_multiple_submissions')->default(false);
            $table->timestamp('published_at')->nullable();
            $table->timestamp('archived_at')->nullable();
            $table->timestamp('closing_reminder_sent_at')->nullable();
            $table->timestamps();
            $table->index(['status', 'starts_at', 'ends_at']);
        });

        Schema::create('survey_questions', function (Blueprint $table): void {
            $table->uuid('id')->primary();
            $table->foreignUuid('survey_id')->constrained('surveys')->cascadeOnDelete();
            $table->string('title', 500);
            $table->text('description')->nullable();
            $table->string('question_type', 24);
            $table->boolean('is_required')->default(false);
            $table->unsignedSmallInteger('position')->default(0);
            $table->json('validation_rules')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->index(['survey_id', 'position']);
        });

        Schema::create('survey_question_options', function (Blueprint $table): void {
            $table->uuid('id')->primary();
            $table->foreignUuid('survey_question_id')->constrained('survey_questions')->cascadeOnDelete();
            $table->string('label', 180);
            $table->string('value', 180);
            $table->unsignedSmallInteger('position')->default(0);
            $table->timestamps();
            $table->unique(['survey_question_id', 'value']);
            $table->index(['survey_question_id', 'position']);
        });

        Schema::create('survey_responses', function (Blueprint $table): void {
            $table->uuid('id')->primary();
            $table->foreignUuid('survey_id')->constrained('surveys')->cascadeOnDelete();
            $table->foreignId('respondent_id')->nullable()->constrained('users')->nullOnDelete();
            // Anonymous surveys keep only an HMAC participant key to enforce one response per account.
            $table->char('participant_key', 64)->nullable();
            $table->timestamp('submitted_at')->nullable();
            $table->timestamps();
            $table->unique(['survey_id', 'participant_key']);
            $table->index(['survey_id', 'submitted_at']);
        });

        Schema::create('survey_answers', function (Blueprint $table): void {
            $table->uuid('id')->primary();
            $table->foreignUuid('survey_response_id')->constrained('survey_responses')->cascadeOnDelete();
            $table->foreignUuid('survey_question_id')->nullable()->constrained('survey_questions')->nullOnDelete();
            $table->json('answer')->nullable();
            $table->json('question_snapshot');
            $table->timestamps();
            $table->unique(['survey_response_id', 'survey_question_id']);
        });

        Schema::create('activity_logs', function (Blueprint $table): void {
            $table->uuid('id')->primary();
            $table->foreignId('actor_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('action', 100)->index();
            $table->string('subject_type', 120)->nullable();
            $table->string('subject_id', 64)->nullable();
            $table->text('description')->nullable();
            $table->json('properties')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->timestamps();
            $table->index(['subject_type', 'subject_id']);
            $table->index(['actor_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
        Schema::dropIfExists('survey_answers');
        Schema::dropIfExists('survey_responses');
        Schema::dropIfExists('survey_question_options');
        Schema::dropIfExists('survey_questions');
        Schema::dropIfExists('surveys');
        Schema::dropIfExists('feedback_responses');
        Schema::dropIfExists('feedback_attachments');
        Schema::dropIfExists('feedback');
        Schema::dropIfExists('feedback_categories');
        Schema::dropIfExists('staff_profiles');
        Schema::dropIfExists('customer_profiles');
    }
};
