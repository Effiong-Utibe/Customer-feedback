<?php

namespace App\Actions\Fortify;

use App\Models\User;
use App\Services\ActivityLogger;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Laravel\Fortify\Contracts\UpdatesUserProfileInformation as UpdatesUserProfileInformationContract;

class UpdateUserProfileInformation implements UpdatesUserProfileInformationContract
{
    public function update(User $user, array $input): void
    {
        $data = Validator::make($input, [
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
        ])->validateWithBag('updateProfileInformation');

        $emailChanged = mb_strtolower($data['email']) !== mb_strtolower($user->email);
        $user->forceFill([
            'name' => $data['name'],
            'email' => mb_strtolower($data['email']),
        ])->save();

        app(ActivityLogger::class)->record('user.profile_updated', $user, ['email_changed' => $emailChanged]);
    }
}
