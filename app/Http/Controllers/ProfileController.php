<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function edit(Request $request): Response
    {
        $user = $request->user()->load(['customerProfile', 'staffProfile']);

        return Inertia::render('auth/profile', [
            'profile' => [
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->customerProfile?->phone,
                'organization' => $user->customerProfile?->organization,
                'jobTitle' => $user->staffProfile?->job_title,
                'department' => $user->staffProfile?->department,
            ],
        ]);
    }
}
