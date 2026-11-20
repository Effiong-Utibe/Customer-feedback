<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AssignFeedbackRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('feedback.assign') ?? false;
    }

    public function rules(): array
    {
        return ['assigned_to_id' => ['required', 'integer', Rule::exists('users', 'id')->where('is_active', true)]];
    }
}
