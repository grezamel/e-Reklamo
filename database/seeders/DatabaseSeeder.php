<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Category;
use App\Models\Personnel;
use App\Models\Citizen;
use App\Models\Complaint;
use App\Models\ComplaintUpdate;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ── Departments ──────────────────────────────────────────
        $deptData = [
            ['name' => 'Public Works',  'description' => 'Roads, bridges, and infrastructure'],
            ['name' => 'Sanitation',    'description' => 'Garbage collection and waste management'],
            ['name' => 'Peace & Order', 'description' => 'Security and law enforcement'],
            ['name' => 'Electrical',    'description' => 'Street lights and electrical issues'],
            ['name' => 'Health',        'description' => 'Public health and sanitation'],
            ['name' => 'Environment',   'description' => 'Environmental concerns'],
        ];
        foreach ($deptData as $d) {
            Department::firstOrCreate(['name' => $d['name']], $d);
        }

        // ── Categories ───────────────────────────────────────────
        $catData = [
            'Public Works'  => ['Pothole', 'Broken Road', 'Damaged Bridge', 'Flooding', 'Sidewalk Damage'],
            'Sanitation'    => ['Uncollected Garbage', 'Illegal Dumping', 'Clogged Drain', 'Foul Odor'],
            'Peace & Order' => ['Noise Complaint', 'Illegal Parking', 'Vandalism', 'Suspicious Activity'],
            'Electrical'    => ['Broken Street Light', 'Exposed Wires', 'Power Outage', 'Electrical Hazard'],
            'Health'        => ['Stagnant Water', 'Pest Infestation', 'Food Safety', 'Unsanitary Conditions'],
            'Environment'   => ['Illegal Logging', 'Air Pollution', 'Water Pollution', 'Noise Pollution'],
        ];
        foreach ($catData as $deptName => $cats) {
            $dept = Department::where('name', $deptName)->first();
            if ($dept) {
                foreach ($cats as $cat) {
                    Category::firstOrCreate(['name' => $cat, 'department_id' => $dept->id]);
                }
            }
        }

        // ── Personnel ────────────────────────────────────────────
        $pw   = Department::where('name', 'Public Works')->first();
        $san  = Department::where('name', 'Sanitation')->first();
        $elec = Department::where('name', 'Electrical')->first();
        $env  = Department::where('name', 'Environment')->first();

        $admin = Personnel::firstOrCreate(
            ['email' => 'admin@lgu.gov.ph'],
            [
                'name'          => 'Admin User',
                'password'      => Hash::make('password'),
                'department_id' => $pw?->id,
                'position'      => 'Administrator',
                'is_admin'      => true,
                'is_active'     => true,
            ]
        );

        $officer1 = Personnel::firstOrCreate(
            ['email' => 'officer@lgu.gov.ph'],
            [
                'name'          => 'Juan dela Cruz',
                'password'      => Hash::make('password'),
                'department_id' => $pw?->id,
                'position'      => 'Field Officer',
                'is_admin'      => false,
                'is_active'     => true,
            ]
        );

        $officer2 = Personnel::firstOrCreate(
            ['email' => 'sanitation@lgu.gov.ph'],
            [
                'name'          => 'Rosa Reyes',
                'password'      => Hash::make('password'),
                'department_id' => $san?->id,
                'position'      => 'Sanitation Officer',
                'is_admin'      => false,
                'is_active'     => true,
            ]
        );

        $officer3 = Personnel::firstOrCreate(
            ['email' => 'electrical@lgu.gov.ph'],
            [
                'name'          => 'Pedro Santos',
                'password'      => Hash::make('password'),
                'department_id' => $elec?->id,
                'position'      => 'Electrical Inspector',
                'is_admin'      => false,
                'is_active'     => true,
            ]
        );

        // ── Citizens ─────────────────────────────────────────────
        $citizen1 = Citizen::firstOrCreate(
            ['email' => 'citizen@example.com'],
            [
                'name'       => 'Maria Santos',
                'password'   => Hash::make('password'),
                'phone'      => '09171234567',
                'address'    => 'Elm Ave, Block 12',
                'is_active'  => true,
            ]
        );

        $citizen2 = Citizen::firstOrCreate(
            ['email' => 'jose@example.com'],
            [
                'name'       => 'Jose Rizal',
                'password'   => Hash::make('password'),
                'phone'      => '09281234567',
                'address'    => 'Main St, Block 5',
                'is_active'  => true,
            ]
        );

        $citizen3 = Citizen::firstOrCreate(
            ['email' => 'ana@example.com'],
            [
                'name'       => 'Ana Reyes',
                'password'   => Hash::make('password'),
                'phone'      => '09391234567',
                'address'    => 'Oak Rd, Block 3',
                'is_active'  => true,
            ]
        );

        // ── Complaints ───────────────────────────────────────────
        // Skip if already seeded
        if (Complaint::count() > 0) {
            return;
        }

        $catPothole  = Category::where('name', 'Pothole')->first();
        $catGarbage  = Category::where('name', 'Uncollected Garbage')->first();
        $catLight    = Category::where('name', 'Broken Street Light')->first();
        $catNoise    = Category::where('name', 'Noise Complaint')->first();
        $catWater    = Category::where('name', 'Water Pollution')->first();
        $catDrain    = Category::where('name', 'Clogged Drain')->first();
        $catVandal   = Category::where('name', 'Vandalism')->first();
        $catPest     = Category::where('name', 'Pest Infestation')->first();

        $complaints = [
            // 1 — Resolved
            [
                'reference_number' => 'REK-20260501-001',
                'citizen_id'       => $citizen2->id,
                'department_id'    => $pw?->id,
                'category_id'      => $catPothole?->id,
                'assigned_to'      => $officer1->id,
                'title'            => 'Pothole on Main Street',
                'description'      => 'Large pothole near Block 5 causing damage to vehicles and risk to motorcycles.',
                'location'         => 'Main St, Block 5',
                'status'           => 'resolved',
                'priority'         => 'high',
                'is_anonymous'     => false,
                'remarks'          => 'Pothole has been filled and road surface restored.',
                'acknowledged_at'  => Carbon::now()->subDays(20),
                'resolved_at'      => Carbon::now()->subDays(15),
                'created_at'       => Carbon::now()->subDays(22),
            ],
            // 2 — In Progress
            [
                'reference_number' => 'REK-20260505-002',
                'citizen_id'       => $citizen1->id,
                'department_id'    => $san?->id,
                'category_id'      => $catGarbage?->id,
                'assigned_to'      => $officer2->id,
                'title'            => 'Uncollected Garbage on Elm Ave',
                'description'      => 'Garbage has not been collected for over a week. Foul smell and health hazard.',
                'location'         => 'Elm Ave, Block 12',
                'status'           => 'in-progress',
                'priority'         => 'medium',
                'is_anonymous'     => false,
                'remarks'          => 'Scheduled for collection this week.',
                'acknowledged_at'  => Carbon::now()->subDays(10),
                'resolved_at'      => null,
                'created_at'       => Carbon::now()->subDays(12),
            ],
            // 3 — Pending
            [
                'reference_number' => 'REK-20260510-003',
                'citizen_id'       => $citizen3->id,
                'department_id'    => $elec?->id,
                'category_id'      => $catLight?->id,
                'assigned_to'      => null,
                'title'            => 'Broken Street Light on Oak Rd',
                'description'      => 'Street light at the corner of Oak Rd and Block 3 has been out for 5 days. Very dark at night.',
                'location'         => 'Oak Rd, Block 3',
                'status'           => 'pending',
                'priority'         => 'medium',
                'is_anonymous'     => false,
                'remarks'          => null,
                'acknowledged_at'  => null,
                'resolved_at'      => null,
                'created_at'       => Carbon::now()->subDays(8),
            ],
            // 4 — Acknowledged
            [
                'reference_number' => 'REK-20260512-004',
                'citizen_id'       => $citizen1->id,
                'department_id'    => $pw?->id,
                'category_id'      => $catDrain?->id,
                'assigned_to'      => $officer1->id,
                'title'            => 'Clogged Drainage Causing Flooding',
                'description'      => 'Drainage near the market is clogged. Every rain causes flooding on the street.',
                'location'         => 'Market St, Block 7',
                'status'           => 'acknowledged',
                'priority'         => 'urgent',
                'is_anonymous'     => false,
                'remarks'          => 'Team will inspect this week.',
                'acknowledged_at'  => Carbon::now()->subDays(5),
                'resolved_at'      => null,
                'created_at'       => Carbon::now()->subDays(7),
            ],
            // 5 — Anonymous, Pending
            [
                'reference_number' => 'REK-20260515-005',
                'citizen_id'       => $citizen2->id,
                'department_id'    => $env?->id,
                'category_id'      => $catWater?->id,
                'assigned_to'      => null,
                'title'            => 'Chemical Dumping in River',
                'description'      => 'Suspicious liquid being dumped near the river bank at night. Water has changed color.',
                'location'         => 'River Bank, Barangay 4',
                'status'           => 'pending',
                'priority'         => 'urgent',
                'is_anonymous'     => true,
                'remarks'          => null,
                'acknowledged_at'  => null,
                'resolved_at'      => null,
                'created_at'       => Carbon::now()->subDays(5),
            ],
            // 6 — Resolved
            [
                'reference_number' => 'REK-20260516-006',
                'citizen_id'       => $citizen3->id,
                'department_id'    => $pw?->id,
                'category_id'      => $catNoise?->id,
                'assigned_to'      => $officer1->id,
                'title'            => 'Loud Construction Noise at Night',
                'description'      => 'Construction work happening past midnight near residential area. Residents cannot sleep.',
                'location'         => 'Rizal Ave, Block 2',
                'status'           => 'resolved',
                'priority'         => 'low',
                'is_anonymous'     => false,
                'remarks'          => 'Construction company issued a warning and work hours restricted.',
                'acknowledged_at'  => Carbon::now()->subDays(4),
                'resolved_at'      => Carbon::now()->subDays(2),
                'created_at'       => Carbon::now()->subDays(6),
            ],
            // 7 — Pending
            [
                'reference_number' => 'REK-20260518-007',
                'citizen_id'       => $citizen1->id,
                'department_id'    => $san?->id,
                'category_id'      => $catPest?->id,
                'assigned_to'      => null,
                'title'            => 'Rat Infestation Near School',
                'description'      => 'Large number of rats spotted near the elementary school. Children are at risk.',
                'location'         => 'School St, Block 9',
                'status'           => 'pending',
                'priority'         => 'high',
                'is_anonymous'     => false,
                'remarks'          => null,
                'acknowledged_at'  => null,
                'resolved_at'      => null,
                'created_at'       => Carbon::now()->subDays(3),
            ],
            // 8 — Rejected
            [
                'reference_number' => 'REK-20260519-008',
                'citizen_id'       => $citizen2->id,
                'department_id'    => $pw?->id,
                'category_id'      => $catVandal?->id,
                'assigned_to'      => null,
                'title'            => 'Graffiti on Barangay Hall Wall',
                'description'      => 'Graffiti painted on the barangay hall wall. Looks unprofessional.',
                'location'         => 'Barangay Hall, Block 1',
                'status'           => 'rejected',
                'priority'         => 'low',
                'is_anonymous'     => false,
                'remarks'          => 'This falls under barangay maintenance, not LGU Public Works. Please coordinate with your barangay captain.',
                'acknowledged_at'  => Carbon::now()->subDays(1),
                'resolved_at'      => null,
                'created_at'       => Carbon::now()->subDays(2),
            ],
        ];

        foreach ($complaints as $cData) {
            $complaint = Complaint::create($cData);

            // Initial "submitted" update
            ComplaintUpdate::create([
                'complaint_id'    => $complaint->id,
                'personnel_id'    => null,
                'status'          => 'pending',
                'remarks'         => 'Complaint submitted successfully.',
                'updated_by_name' => 'System',
                'created_at'      => $complaint->created_at,
                'updated_at'      => $complaint->created_at,
            ]);

            // Add follow-up updates based on status
            if (in_array($complaint->status, ['acknowledged', 'in-progress', 'resolved', 'rejected'])) {
                ComplaintUpdate::create([
                    'complaint_id'    => $complaint->id,
                    'personnel_id'    => $admin->id,
                    'status'          => 'acknowledged',
                    'remarks'         => 'Complaint received and under review.',
                    'updated_by_name' => $admin->name,
                    'created_at'      => $complaint->acknowledged_at ?? Carbon::now()->subDays(3),
                    'updated_at'      => $complaint->acknowledged_at ?? Carbon::now()->subDays(3),
                ]);
            }

            if (in_array($complaint->status, ['in-progress', 'resolved'])) {
                $assignee = $complaint->assigned_to
                    ? Personnel::find($complaint->assigned_to)
                    : $admin;
                ComplaintUpdate::create([
                    'complaint_id'    => $complaint->id,
                    'personnel_id'    => $assignee?->id,
                    'status'          => 'in-progress',
                    'remarks'         => 'Assigned and work has begun.',
                    'updated_by_name' => $assignee?->name ?? $admin->name,
                    'created_at'      => Carbon::now()->subDays(2),
                    'updated_at'      => Carbon::now()->subDays(2),
                ]);
            }

            if ($complaint->status === 'resolved') {
                ComplaintUpdate::create([
                    'complaint_id'    => $complaint->id,
                    'personnel_id'    => $admin->id,
                    'status'          => 'resolved',
                    'remarks'         => $complaint->remarks,
                    'updated_by_name' => $admin->name,
                    'created_at'      => $complaint->resolved_at,
                    'updated_at'      => $complaint->resolved_at,
                ]);
            }

            if ($complaint->status === 'rejected') {
                ComplaintUpdate::create([
                    'complaint_id'    => $complaint->id,
                    'personnel_id'    => $admin->id,
                    'status'          => 'rejected',
                    'remarks'         => $complaint->remarks,
                    'updated_by_name' => $admin->name,
                    'created_at'      => Carbon::now()->subDays(1),
                    'updated_at'      => Carbon::now()->subDays(1),
                ]);
            }
        }
    }
}
