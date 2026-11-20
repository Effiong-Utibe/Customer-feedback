<?php

namespace Database\Seeders;

use App\Models\FeedbackCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class FeedbackCategorySeeder extends Seeder
{
    public function run(): void
    {
        $names = [
            'Service Quality', 'Customer Service', 'Product Quality', 'Pricing', 'Staff Behaviour',
            'Facilities', 'General Suggestions', 'Complaints', 'Other',
        ];

        foreach ($names as $index => $name) {
            FeedbackCategory::updateOrCreate(
                ['slug' => Str::slug($name)],
                ['name' => $name, 'is_active' => true, 'sort_order' => $index],
            );
        }
    }
}
