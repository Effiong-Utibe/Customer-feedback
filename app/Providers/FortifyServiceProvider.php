<?php

namespace App\Providers;

use App\Actions\Fortify\CreateNewUser;
use App\Actions\Fortify\UpdateUserPassword;
use App\Actions\Fortify\UpdateUserProfileInformation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use Laravel\Fortify\Contracts\CreatesNewUsers;
use Laravel\Fortify\Contracts\UpdatesUserPasswords;
use Laravel\Fortify\Contracts\UpdatesUserProfileInformation;
use Laravel\Fortify\Fortify;

class FortifyServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(CreatesNewUsers::class, CreateNewUser::class);
        $this->app->singleton(UpdatesUserProfileInformation::class, UpdateUserProfileInformation::class);
        $this->app->singleton(UpdatesUserPasswords::class, UpdateUserPassword::class);
    }

    public function boot(): void
    {
        Fortify::loginView(fn () => Inertia::render('auth/login'));
        Fortify::registerView(fn () => Inertia::render('auth/register'));
        Fortify::requestPasswordResetLinkView(fn () => Inertia::render('auth/forgot-password'));
        Fortify::resetPasswordView(fn ($request) => Inertia::render('auth/reset-password', [
            'email' => $request->email,
            'token' => $request->route('token'),
        ]));
        Fortify::confirmPasswordView(fn () => Inertia::render('auth/confirm-password'));

        Fortify::authenticateUsing(function (Request $request): ?User {
            $user = User::where('email', $request->email)->first();

            return $user && $user->is_active && Hash::check($request->password, $user->password)
                ? $user
                : null;
        });
    }
}
