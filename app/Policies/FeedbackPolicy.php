<?php

namespace App\Policies;

use App\Models\Feedback;
use App\Models\User;

class FeedbackPolicy
{
    public function view(User $user, Feedback $feedback): bool
    {
        return $user->hasRole('ADMIN')
            || ($user->hasRole('STAFF') && $feedback->assigned_to_id === $user->id)
            || ($user->hasRole('CUSTOMER') && $feedback->customer_id === $user->id);
    }

    public function create(User $user): bool
    {
        return $user->hasRole('CUSTOMER') && $user->can('feedback.create');
    }

    public function update(User $user, Feedback $feedback): bool
    {
        return $user->hasRole('ADMIN')
            || ($user->hasRole('STAFF') && $feedback->assigned_to_id === $user->id && $user->can('feedback.update'));
    }

    public function assign(User $user): bool
    {
        return $user->hasRole('ADMIN') && $user->can('feedback.assign');
    }

    public function respond(User $user, Feedback $feedback): bool
    {
        return $this->update($user, $feedback) || $user->id === $feedback->customer_id;
    }

    public function delete(User $user, Feedback $feedback): bool
    {
        return $user->hasRole('ADMIN') && $user->can('feedback.delete');
    }
}
