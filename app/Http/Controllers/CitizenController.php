<?php

namespace App\Http\Controllers;

use App\Models\Citizen;
use App\Models\Complaint;
use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class CitizenController extends Controller
{
    public function dashboard()
    {
        $citizen = Auth::guard('citizen')->user();
        $stats = $this->getStats($citizen);

        $complaints = Complaint::where('citizen_id', $citizen->id)
            ->with(['category', 'department'])
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('Citizen/Dashboard', [
            'stats' => $stats,
            'complaints' => $complaints,
        ]);
    }

    public function myComplaints()
    {
        $citizen = Auth::guard('citizen')->user();

        $complaints = Complaint::where('citizen_id', $citizen->id)
            ->with(['category', 'department'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Citizen/MyComplaints', [
            'complaints' => $complaints,
        ]);
    }

    public function createComplaint()
    {
        $departments = Department::with('categories')->get();

        return Inertia::render('Citizen/FileComplaint', [
            'departments' => $departments,
        ]);
    }

    public function destroyComplaint(Complaint $complaint)
    {
        $citizen = Auth::guard('citizen')->user();

        if ($complaint->citizen_id !== $citizen->id) {
            abort(403);
        }

        // Only allow deletion of pending complaints
        if (!in_array($complaint->status, ['pending', 'rejected'])) {
            return back()->withErrors(['error' => 'Only pending or rejected complaints can be deleted.']);
        }

        if ($complaint->photos) {
            foreach ($complaint->photos as $photo) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($photo);
            }
        }

        $complaint->delete();

        return redirect()->route('citizen.complaints.index')
            ->with('success', 'Complaint deleted successfully.');
    }

    public function showComplaint(Complaint $complaint)
    {
        $citizen = Auth::guard('citizen')->user();

        if ($complaint->citizen_id !== $citizen->id) {
            abort(403);
        }

        $complaint->load('category', 'department', 'assignedPersonnel', 'updates');

        return Inertia::render('Citizen/ComplaintDetail', [
            'complaint' => $complaint,
        ]);
    }

    public function editProfile()
    {
        $citizen = Auth::guard('citizen')->user();

        return Inertia::render('Citizen/Profile', [
            'citizen' => $citizen,
        ]);
    }

    public function updateProfile(Request $request)
    {
        $citizen = Auth::guard('citizen')->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'current_password' => 'nullable|string',
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        if (!empty($validated['current_password'])) {
            if (!Hash::check($validated['current_password'], $citizen->password)) {
                return back()->withErrors(['current_password' => 'Current password is incorrect.']);
            }
        }

        $updateData = [
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            'address' => $validated['address'],
        ];

        if (!empty($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        $citizen->update($updateData);

        return back()->with('success', 'Profile updated successfully.');
    }

    private function getStats($citizen)
    {
        $total = Complaint::where('citizen_id', $citizen->id)->count();
        $resolved = Complaint::where('citizen_id', $citizen->id)->where('status', 'resolved')->count();
        $pending = Complaint::where('citizen_id', $citizen->id)->where('status', 'pending')->count();
        $inProgress = Complaint::where('citizen_id', $citizen->id)->where('status', 'in-progress')->count();

        return [
            'total' => $total,
            'resolved' => $resolved,
            'pending' => $pending,
            'in_progress' => $inProgress,
            'resolution_rate' => $total > 0 ? round(($resolved / $total) * 100, 1) : 0,
        ];
    }
}
