<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();
        $this->call(PermissionSeeder::class);

        $all = PermissionSeeder::PERMISSIONS;
        $staff = [
            'dashboard.view', 'feedback.view', 'feedback.update', 'feedback.respond', 'feedback.resolve',
            'surveys.view', 'reports.view',
        ];
        $customer = ['dashboard.view', 'feedback.create', 'feedback.view', 'surveys.view'];

        foreach (['ADMIN' => $all, 'STAFF' => $staff, 'CUSTOMER' => $customer] as $name => $permissions) {
            Role::findOrCreate($name, 'web')->syncPermissions($permissions);
        }
    }
}
