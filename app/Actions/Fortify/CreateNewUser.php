<?php

namespace App\Actions\Fortify;

use App\Models\CustomerProfile;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;
use Laravel\Fortify\Contracts\CreatesNewUsers;
use Spatie\Permission\Models\Role;

class CreateNewUser implements CreatesNewUsers
{
    public function create(array $input): User
    {
        Validator::make($input, [
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ])->validate();

        // Create the account, customer role, and profile together so registration cannot leave partial records.
        return DB::transaction(function () use ($input): User {
            $customerRole = Role::findOrCreate('CUSTOMER', 'web');
            $user = User::create([
                'name' => $input['name'],
                'email' => $input['email'],
                'password' => Hash::make($input['password']),
                'is_active' => true,
            ]);

            $user->assignRole($customerRole);
            CustomerProfile::create(['user_id' => $user->id]);

            return $user;
        });
    }
}
