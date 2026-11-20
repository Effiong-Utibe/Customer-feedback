<?php

namespace App\Http\Requests;

use App\Models\Feedback;
use Illuminate\Foundation\Http\FormRequest;

class StoreFeedbackResponseRequest extends FormRequest
{
    public function authorize(): bool
    {
        $feedback = $this->route('feedback');

        return $feedback instanceof Feedback && ($this->user()?->can('respond', $feedback) ?? false);
    }

    public function rules(): array
    {
        return [
            'body' => ['required', 'string', 'min:2', 'max:10000'],
            'is_internal' => ['sometimes', 'boolean'],
        ];
    }
}
