<?php

namespace App\Http\Controllers;

use App\Models\Complaint;
use App\Models\ComplaintUpdate;
use App\Models\Citizen;
use App\Models\Personnel;
use App\Models\Department;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ComplaintController extends Controller
{
    /**
     * Store a newly created complaint from a citizen
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:5000',
            'category_id' => 'required|exists:categories,id',
            'department_id' => 'required|exists:departments,id',
            'location' => 'required|string|max:255',
            'photos' => 'nullable|array',
            'photos.*' => 'file|image|max:5120', // 5MB per image
            'is_anonymous' => 'boolean',
        ]);

        // Generate unique reference number
        $referenceNumber = 'REK-' . date('YmdHis') . '-' . Str::upper(Str::random(3));

        // Handle photo uploads
        $photoPaths = [];
        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $photo) {
                $path = $photo->store('complaints', 'public');
                $photoPaths[] = $path;
            }
        }

        // Get authenticated citizen
        $citizen = Auth::guard('citizen')->user();

        $complaint = Complaint::create([
            'reference_number' => $referenceNumber,
            'citizen_id' => $citizen->id,
            'department_id' => $validated['department_id'],
            'category_id' => $validated['category_id'],
            'title' => $validated['title'],
            'description' => $validated['description'],
            'location' => $validated['location'],
            'photos' => $photoPaths,
            'status' => 'pending',
            'priority' => 'medium',
            'is_anonymous' => $validated['is_anonymous'] ?? false,
        ]);

        // Record initial update
        ComplaintUpdate::create([
            'complaint_id' => $complaint->id,
            'status' => 'pending',
            'remarks' => 'Complaint submitted successfully.',
            'updated_by_name' => 'System',
        ]);

        return redirect()->route('citizen.complaints.index')
            ->with('success', 'Complaint submitted! Reference: ' . $referenceNumber);
    }

    /**
     * Update complaint status (Personnel only)
     */
    public function updateStatus(Request $request, Complaint $complaint)
    {
        // Authorization check
        if (!Auth::guard('personnel')->check()) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'status' => 'required|in:acknowledged,in-progress,resolved,rejected',
            'priority' => 'nullable|in:low,medium,high,urgent',
            'remarks' => 'nullable|string|max:1000',
            'assigned_to' => 'nullable|exists:personnel,id',
        ]);

        $previousStatus = $complaint->status;

        $complaint->update([
            'status' => $validated['status'],
            'priority' => $validated['priority'] ?? $complaint->priority,
            'remarks' => $validated['remarks'] ?? $complaint->remarks,
            'assigned_to' => array_key_exists('assigned_to', $validated)
                ? ($validated['assigned_to'] ?: null)
                : $complaint->assigned_to,
            'acknowledged_at' => $validated['status'] === 'acknowledged' && !$complaint->acknowledged_at
                ? now()
                : $complaint->acknowledged_at,
            'resolved_at' => $validated['status'] === 'resolved' && !$complaint->resolved_at
                ? now()
                : $complaint->resolved_at,
        ]);

        // Record update
        ComplaintUpdate::create([
            'complaint_id' => $complaint->id,
            'personnel_id' => Auth::guard('personnel')->id(),
            'status' => $validated['status'],
            'remarks' => $validated['remarks'] ?? null,
            'updated_by_name' => Auth::guard('personnel')->user()->name,
        ]);

        return redirect()->back()->with('success', 'Complaint status updated successfully.');
    }

    /**
     * Assign complaint to personnel
     */
    public function assign(Request $request, Complaint $complaint)
    {
        if (!Auth::guard('personnel')->check()) {
            abort(403);
        }

        $validated = $request->validate([
            'assigned_to' => 'required|exists:personnel,id',
        ]);

        $complaint->update(['assigned_to' => $validated['assigned_to']]);

        return redirect()->back()->with('success', 'Complaint assigned successfully.');
    }

    /**
     * Change complaint priority
     */
    public function changePriority(Request $request, Complaint $complaint)
    {
        if (!Auth::guard('personnel')->check()) {
            abort(403);
        }

        $validated = $request->validate([
            'priority' => 'required|in:low,medium,high,urgent',
        ]);

        $complaint->update(['priority' => $validated['priority']]);

        return redirect()->back()->with('success', 'Priority updated.');
    }

    /**
     * Get complaint details with updates (Personnel)
     */
    public function show(Complaint $complaint)
    {
        $complaint->load('citizen', 'category', 'department', 'assignedPersonnel', 'updates');

        $personnelList = \App\Models\Personnel::select('id', 'name', 'department_id')->get();

        return Inertia::render('Personnel/ComplaintDetail', [
            'complaint' => $complaint,
            'personnelList' => $personnelList,
            'auth' => ['personnel' => Auth::guard('personnel')->user()],
        ]);
    }

    /**
     * List complaints with filters (Personnel)
     */
    public function index(Request $request)
    {
        $query = Complaint::with('citizen', 'category', 'department', 'assignedPersonnel');

        if ($request->status) {
            $query->where('status', $request->status);
        }
        if ($request->priority) {
            $query->where('priority', $request->priority);
        }
        if ($request->department_id) {
            $query->where('department_id', $request->department_id);
        }
        if ($request->category_id) {
            $query->where('category_id', $request->category_id);
        }
        if ($request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('reference_number', 'like', "%$search%")
                    ->orWhere('title', 'like', "%$search%")
                    ->orWhere('location', 'like', "%$search%");
            });
        }

        $query->orderBy($request->input('sort_by', 'created_at'), $request->input('sort_order', 'desc'));

        $complaints = $query->paginate(15)->withQueryString();

        return Inertia::render('Personnel/ComplaintsList', [
            'complaints' => $complaints,
            'departments' => \App\Models\Department::all(),
            'categories' => \App\Models\Category::all(),
            'filters' => $request->only(['status', 'priority', 'department_id', 'category_id', 'search']),
            'auth' => ['personnel' => Auth::guard('personnel')->user()],
        ]);
    }

    /**
     * Delete complaint (Personnel Admin only)
     */
    public function destroy(Complaint $complaint)
    {
        $personnel = Auth::guard('personnel')->user();
        if (!$personnel->is_admin) {
            abort(403);
        }

        // Delete photos
        if ($complaint->photos) {
            foreach ($complaint->photos as $photo) {
                Storage::disk('public')->delete($photo);
            }
        }

        $complaint->delete();

        return redirect()->back()->with('success', 'Complaint deleted.');
    }
}