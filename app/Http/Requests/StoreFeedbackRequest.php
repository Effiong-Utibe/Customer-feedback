<?php

namespace App\Http\Requests;

use App\Models\Feedback;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreFeedbackRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', Feedback::class) ?? false;
    }

    public function rules(): array
    {
        return [
            'feedback_category_id' => ['required', 'integer', Rule::exists('feedback_categories', 'id')->where('is_active', true)],
            'subject' => ['required', 'string', 'max:180'],
            'body' => ['required', 'string', 'min:10', 'max:10000'],
            'rating' => ['nullable', 'integer', 'between:1,5'],
            'attachments' => ['sometimes', 'array', 'max:5'],
            'attachments.*' => ['file', 'max:5120', 'mimes:pdf,jpg,jpeg,png,webp,txt,doc,docx'],
        ];
    }
}
