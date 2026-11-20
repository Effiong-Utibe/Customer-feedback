<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAccountStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('users.update') ?? false;
    }

    public function rules(): array
    {
        return ['is_active' => ['required', 'boolean']];
    }
}
