<?php

namespace App\Actions\Fortify;

use App\Models\User;
use App\Services\ActivityLogger;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;
use Laravel\Fortify\Contracts\UpdatesUserPasswords as UpdatesUserPasswordsContract;

class UpdateUserPassword implements UpdatesUserPasswordsContract
{
    public function update(User $user, array $input): void
    {
        $data = Validator::make($input, [
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'string', Password::defaults(), 'confirmed'],
        ])->validateWithBag('updatePassword');

        $user->forceFill(['password' => Hash::make($data['password'])])->save();
        app(ActivityLogger::class)->record('user.password_changed', $user);
    }
}
