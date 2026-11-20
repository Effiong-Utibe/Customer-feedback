<?php

namespace App\Policies;

use App\Models\Survey;
use App\Models\User;

class SurveyPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['ADMIN', 'STAFF']) && $user->can('surveys.view');
    }

    public function view(User $user, Survey $survey): bool
    {
        return $user->hasAnyRole(['ADMIN', 'STAFF']) && $user->can('surveys.view');
    }

    public function create(User $user): bool
    {
        return $user->hasAnyRole(['ADMIN', 'STAFF']) && $user->can('surveys.create');
    }

    public function update(User $user, Survey $survey): bool
    {
        return $user->hasRole('ADMIN') && $user->can('surveys.update');
    }

    public function publish(User $user, Survey $survey): bool
    {
        return $user->hasRole('ADMIN') && $user->can('surveys.publish');
    }
}
