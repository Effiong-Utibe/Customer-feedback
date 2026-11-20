<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class PasswordConfirmationController extends Controller
{
    public function show(): Response
    {
        return Inertia::render('auth/confirm-password');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate(['password' => ['required', 'string']]);
        if (! Hash::check($data['password'], $request->user()->password)) {
            throw ValidationException::withMessages(['password' => 'The password you entered is incorrect.']);
        }

        $request->session()->put('auth.password_confirmed_at', time());

        return redirect()->intended('/dashboard');
    }
}
