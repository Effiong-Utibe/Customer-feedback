<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        RateLimiter::for('feedback-submit', fn (Request $request) => Limit::perMinute(5)->by((string) ($request->user()?->id ?? $request->ip())));
        RateLimiter::for('survey-submit', fn (Request $request) => Limit::perMinute(10)->by((string) ($request->user()?->id ?? $request->ip())));
        RateLimiter::for('login', fn (Request $request) => Limit::perMinute(5)->by(mb_strtolower((string) $request->input('email')).'|'.$request->ip()));
    }
}
