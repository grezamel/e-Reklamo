<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DepartmentCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            'Public Works/Engineering Office' => ['Road Damage', 'Potholes', 'Broken Sidewalk', 'Drainage Problem', 'Broken Sidewalk', 'Flooding', 'Damaged Waiting Shed', 'Bridge Damage', 'Construction Concern'],
            'Sanitation' => ['Uncollected Garbage', 'Illegal Dumping', 'Foul Odor', 'Burning of Trash', 'Dirty Canal', 'Water Pollution', 'Improper Waste Disposal'],
            'Public Safety' => ['Noise Complaint', 'Illegal Parking', 'Vandalism', 'Public Disturbance', 'Suspicious Activity', 'Street Trouble', 'Curfew Violation'],
            'DRRM' => ['Fallen Tree', 'Flood Emergency', 'Landslide Concern', 'Blocked Evacuation Route', 'Disaster Hazard', 'Unsafe Area'],
            'Health Office' => ['Unsanitary Area', 'Stray Animals', 'Mosquito Breeding Site', 'Health Hazard', 'Contaminated Water', 'Public Health Concern'],
            'Tourism Office' => ['Tourist Disturbance', 'Beach Cleanliness', 'Resort Complaint', 'Tourism Safety Concern', 'Overcrowding', 'Unauthorized Vendor'],
            'Utility/Maintenance Services' => ['Broken Streetlight', 'Water Supply Issue', 'Electrical Hazard', 'Damaged Utility Pole', 'Internet/Cable Hazard'],
        ];

        foreach ($data as $deptName => $categories) {
            $dept = \App\Models\Department::create(['name' => $deptName]);
            foreach ($categories as $catName) {
                \App\Models\Category::create([
                    'department_id' => $dept->id,
                    'name' => $catName
                ]);
            }
        }
    }
}
