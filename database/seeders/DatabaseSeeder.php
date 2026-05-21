<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Category;
use App\Models\Personnel;
use App\Models\Citizen;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Departments
        $departments = [
            ['name' => 'Public Works', 'description' => 'Roads, bridges, and infrastructure'],
            ['name' => 'Sanitation', 'description' => 'Garbage collection and waste management'],
            ['name' => 'Peace & Order', 'description' => 'Security and law enforcement'],
            ['name' => 'Electrical', 'description' => 'Street lights and electrical issues'],
            ['name' => 'Health', 'description' => 'Public health and sanitation'],
            ['name' => 'Environment', 'description' => 'Environmental concerns'],
        ];

        foreach ($departments as $dept) {
            Department::firstOrCreate(['name' => $dept['name']], $dept);
        }

        // Categories per department
        $categories = [
            'Public Works' => ['Pothole', 'Broken Road', 'Damaged Bridge', 'Flooding', 'Sidewalk Damage'],
            'Sanitation' => ['Uncollected Garbage', 'Illegal Dumping', 'Clogged Drain', 'Foul Odor'],
            'Peace & Order' => ['Noise Complaint', 'Illegal Parking', 'Vandalism', 'Suspicious Activity'],
            'Electrical' => ['Broken Street Light', 'Exposed Wires', 'Power Outage', 'Electrical Hazard'],
            'Health' => ['Stagnant Water', 'Pest Infestation', 'Food Safety', 'Unsanitary Conditions'],
            'Environment' => ['Illegal Logging', 'Air Pollution', 'Water Pollution', 'Noise Pollution'],
        ];

        foreach ($categories as $deptName => $cats) {
            $dept = Department::where('name', $deptName)->first();
            if ($dept) {
                foreach ($cats as $cat) {
                    Category::firstOrCreate(
                        ['name' => $cat, 'department_id' => $dept->id]
                    );
                }
            }
        }

        // Admin personnel
        $publicWorks = Department::where('name', 'Public Works')->first();
        Personnel::firstOrCreate(
            ['email' => 'admin@lgu.gov.ph'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'department_id' => $publicWorks?->id,
                'position' => 'Administrator',
                'is_admin' => true,
                'is_active' => true,
            ]
        );

        // Sample personnel
        Personnel::firstOrCreate(
            ['email' => 'officer@lgu.gov.ph'],
            [
                'name' => 'Juan Officer',
                'password' => Hash::make('password'),
                'department_id' => $publicWorks?->id,
                'position' => 'Officer',
                'is_admin' => false,
                'is_active' => true,
            ]
        );

        // Sample citizen
        Citizen::firstOrCreate(
            ['email' => 'citizen@example.com'],
            [
                'name' => 'Maria Santos',
                'password' => Hash::make('password'),
                'phone' => '09171234567',
                'address' => 'Elm Ave, Block 12',
                'is_active' => true,
            ]
        );
    }
}
