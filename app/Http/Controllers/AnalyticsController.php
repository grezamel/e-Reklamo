<?php

namespace App\Http\Controllers;

use App\Models\Complaint;
use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Inertia\Inertia;

class AnalyticsController extends Controller
{
    /**
     * Get performance analytics dashboard
     */
    public function dashboard(Request $request)
    {
        $personnel = Auth::guard('personnel')->user();

        // Default to last 30 days
        $dateRange = $request->input('date_range', '30');
        $department = $request->input('department');
        $status = $request->input('status');
        $category = $request->input('category');

        $startDate = match ($dateRange) {
            '7' => Carbon::now()->subDays(7),
            '30' => Carbon::now()->subDays(30),
            '90' => Carbon::now()->subDays(90),
            '365' => Carbon::now()->subDays(365),
            'custom' => Carbon::parse($request->input('start_date')),
            default => Carbon::now()->subDays(30),
        };

        $endDate = $request->has('end_date')
            ? Carbon::parse($request->input('end_date'))
            : Carbon::now();

        $query = Complaint::whereBetween('created_at', [$startDate, $endDate]);

        if ($department) {
            $query->where('department_id', $department);
        }
        if ($status) {
            $query->where('status', $status);
        }
        if ($category) {
            $query->where('category_id', $category);
        }

        // Get all data
        $allComplaints = $query->get();

        // Calculate metrics
        $metrics = [
            'total' => $allComplaints->count(),
            'resolved' => $allComplaints->where('status', 'resolved')->count(),
            'in_progress' => $allComplaints->where('status', 'in-progress')->count(),
            'pending' => $allComplaints->where('status', 'pending')->count(),
            'acknowledged' => $allComplaints->where('status', 'acknowledged')->count(),
            'rejected' => $allComplaints->where('status', 'rejected')->count(),
        ];

        // Calculate rates
        $metrics['resolution_rate'] = $metrics['total'] > 0
            ? round(($metrics['resolved'] / $metrics['total']) * 100, 2)
            : 0;

        // Calculate average response time (in hours)
        $acknowledgedComplaints = $allComplaints->filter(fn($c) => $c->acknowledged_at);
        $metrics['avg_response_time'] = 0;
        if ($acknowledgedComplaints->count() > 0) {
            $totalHours = $acknowledgedComplaints->sum(function ($complaint) {
                return $complaint->created_at->diffInHours($complaint->acknowledged_at);
            });
            $metrics['avg_response_time'] = round($totalHours / $acknowledgedComplaints->count(), 2);
        }

        // Calculate average resolution time (in days)
        $resolvedComplaints = $allComplaints->filter(fn($c) => $c->resolved_at);
        $metrics['avg_resolution_time'] = 0;
        if ($resolvedComplaints->count() > 0) {
            $totalDays = $resolvedComplaints->sum(function ($complaint) {
                return $complaint->created_at->diffInDays($complaint->resolved_at);
            });
            $metrics['avg_resolution_time'] = round($totalDays / $resolvedComplaints->count(), 2);
        }

        // Get complaints by priority
        $byPriority = $allComplaints->groupBy('priority')
            ->map(fn($group) => $group->count())
            ->toArray();

        // Get complaints by status over time (daily)
        $dailyData = $allComplaints->groupBy(function ($complaint) {
            return $complaint->created_at->format('Y-m-d');
        })->map(function ($group) {
            return [
                'date' => $group->first()->created_at->format('Y-m-d'),
                'total' => $group->count(),
                'resolved' => $group->where('status', 'resolved')->count(),
                'pending' => $group->where('status', 'pending')->count(),
            ];
        })->values();

        // Get complaints by department
        $byDepartment = $query->select('department_id')
            ->with('department')
            ->groupBy('department_id')
            ->get()
            ->map(function ($complaint) {
                return [
                    'department' => $complaint->department->name ?? 'Unknown',
                    'count' => Complaint::where('department_id', $complaint->department_id)->count(),
                ];
            });

        return Inertia::render('Personnel/Analytics', [
            'metrics' => $metrics,
            'byPriority' => $byPriority,
            'dailyData' => $dailyData,
            'byDepartment' => $byDepartment,
            'departments' => Department::all(),
            'filters' => [
                'date_range' => $dateRange,
                'department' => $department,
                'status' => $status,
                'category' => $category,
                'start_date' => $startDate->format('Y-m-d'),
                'end_date' => $endDate->format('Y-m-d'),
            ],
        ]);
    }

    /**
     * Export complaints as PDF
     */
    public function exportPDF(Request $request)
    {
        $personnel = Auth::guard('personnel')->user();
        if (!$personnel->is_admin) {
            abort(403);
        }

        $dateRange = $request->input('date_range', '30');
        $startDate = match ($dateRange) {
            '7' => Carbon::now()->subDays(7),
            '30' => Carbon::now()->subDays(30),
            '90' => Carbon::now()->subDays(90),
            '365' => Carbon::now()->subDays(365),
            default => Carbon::now()->subDays(30),
        };

        $complaints = Complaint::whereBetween('created_at', [$startDate, Carbon::now()])
            ->with('citizen', 'department', 'category', 'assignedPersonnel')
            ->orderBy('created_at', 'desc')
            ->get();

        // Generate PDF (you'll need to install dompdf)
        // For now, return as JSON for frontend to handle
        return response()->json([
            'complaints' => $complaints,
            'generated_at' => now(),
            'report_period' => "{$startDate->format('Y-m-d')} to " . Carbon::now()->format('Y-m-d'),
        ]);
    }
}
