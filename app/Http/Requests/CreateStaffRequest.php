<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateStaffRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('staff.create') ?? false;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'staff_number' => ['required', 'string', 'max:40', 'unique:staff_profiles,staff_number'],
            'job_title' => ['nullable', 'string', 'max:120'],
            'department' => ['nullable', 'string', 'max:120'],
        ];
    }
}
