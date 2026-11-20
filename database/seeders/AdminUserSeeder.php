<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $email = env('INITIAL_ADMIN_EMAIL');
        $password = env('INITIAL_ADMIN_PASSWORD');

        if (! $email || ! $password) {
            $this->command?->warn('Initial admin not created: set INITIAL_ADMIN_EMAIL and INITIAL_ADMIN_PASSWORD in the environment.');

            return;
        }

        $admin = User::firstOrCreate(
            ['email' => $email],
            [
                'name' => env('INITIAL_ADMIN_NAME', 'UI Ventures Administrator'),
                'password' => Hash::make($password),
                'email_verified_at' => now(),
                'is_active' => true,
            ],
        );

        $admin->syncRoles(['ADMIN']);
    }
}
