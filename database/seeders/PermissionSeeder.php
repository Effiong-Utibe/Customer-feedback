<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    public const PERMISSIONS = [
        'dashboard.view', 'users.view', 'users.create', 'users.update', 'users.delete',
        'staff.view', 'staff.create', 'staff.update', 'staff.delete',
        'customers.view', 'customers.create', 'customers.update', 'customers.delete',
        'feedback.view', 'feedback.create', 'feedback.update', 'feedback.delete', 'feedback.assign', 'feedback.respond', 'feedback.resolve',
        'surveys.view', 'surveys.create', 'surveys.update', 'surveys.delete', 'surveys.publish', 'surveys.close',
        'reports.view', 'reports.export', 'settings.view', 'settings.update', 'audit.view',
    ];

    public function run(): void
    {
        foreach (self::PERMISSIONS as $permission) {
            Permission::findOrCreate($permission, 'web');
        }
    }
}
