<?php

namespace App\Http\Requests;

use App\Models\Feedback;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateFeedbackRequest extends FormRequest
{
    public function authorize(): bool
    {
        $feedback = $this->route('feedback');

        return $feedback instanceof Feedback && ($this->user()?->can('update', $feedback) ?? false);
    }

    public function rules(): array
    {
        return [
            'status' => ['required', Rule::in(['SUBMITTED', 'UNDER_REVIEW', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'])],
            'priority' => ['sometimes', Rule::in(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])],
        ];
    }
}
