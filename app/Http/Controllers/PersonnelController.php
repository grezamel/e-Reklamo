<?php

namespace App\Http\Controllers;

use App\Models\Personnel;
use App\Models\Citizen;
use App\Models\Complaint;
use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class PersonnelController extends Controller
{
    public function dashboard()
    {
        $personnel = Auth::guard('personnel')->user();

        $total = Complaint::count();
        $pending = Complaint::where('status', 'pending')->count();
        $inProgress = Complaint::where('status', 'in-progress')->count();
        $resolved = Complaint::where('status', 'resolved')->count();
        $acknowledged = Complaint::where('status', 'acknowledged')->count();

        $recentComplaints = Complaint::with(['citizen', 'department', 'category'])
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        $departments = Department::withCount([
            'complaints',
            'complaints as resolved_count' => fn($q) => $q->where('status', 'resolved'),
        ])->get();

        return Inertia::render('Personnel/Dashboard', [
            'stats' => [
                'total' => $total,
                'pending' => $pending,
                'in_progress' => $inProgress,
                'resolved' => $resolved,
                'acknowledged' => $acknowledged,
                'resolution_rate' => $total > 0 ? round(($resolved / $total) * 100, 1) : 0,
            ],
            'recentComplaints' => $recentComplaints,
            'departments' => $departments,
            'auth' => ['personnel' => $personnel],
        ]);
    }

    public function index()
    {
        $authPersonnel = Auth::guard('personnel')->user();
        if (!$authPersonnel->is_admin) {
            abort(403, 'Only admins can manage personnel.');
        }

        return Inertia::render('Personnel/ManagePersonnel', [
            'personnelList' => Personnel::with('department')->orderBy('created_at', 'desc')->paginate(20),
            'departments' => Department::all(),
            'auth' => ['personnel' => $authPersonnel],
        ]);
    }

    public function store(Request $request)
    {
        $authPersonnel = Auth::guard('personnel')->user();
        if (!$authPersonnel->is_admin) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:personnel,email',
            'password' => 'required|string|min:8|confirmed',
            'department_id' => 'required|exists:departments,id',
            'position' => 'required|string|max:100',
            'is_admin' => 'boolean',
        ]);

        Personnel::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'department_id' => $validated['department_id'],
            'position' => $validated['position'],
            'is_admin' => $validated['is_admin'] ?? false,
            'is_active' => true,
        ]);

        return back()->with('success', 'Personnel created successfully.');
    }

    public function update(Request $request, Personnel $personnel)
    {
        $authPersonnel = Auth::guard('personnel')->user();
        if (!$authPersonnel->is_admin) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:personnel,email,' . $personnel->id,
            'department_id' => 'nullable|exists:departments,id',
            'position' => 'nullable|string|max:100',
            'is_active' => 'boolean',
            'is_admin' => 'boolean',
        ]);

        $personnel->update($validated);

        return back()->with('success', 'Personnel updated successfully.');
    }

    public function destroy(Personnel $personnel)
    {
        $authPersonnel = Auth::guard('personnel')->user();
        if (!$authPersonnel->is_admin) {
            abort(403);
        }

        if ($personnel->id === $authPersonnel->id) {
            return back()->withErrors(['error' => 'You cannot delete your own account.']);
        }

        $personnel->delete();

        return back()->with('success', 'Personnel deleted.');
    }

    public function citizens()
    {
        $authPersonnel = Auth::guard('personnel')->user();

        $citizens = Citizen::withCount('complaints')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('Personnel/ManageCitizens', [
            'citizens' => $citizens,
            'auth' => ['personnel' => $authPersonnel],
        ]);
    }

    public function updateCitizen(Request $request, Citizen $citizen)
    {
        $validated = $request->validate([
            'is_active' => 'boolean',
        ]);

        $citizen->update($validated);

        return back()->with('success', 'Citizen account updated.');
    }

    public function destroyCitizen(Citizen $citizen)
    {
        $authPersonnel = Auth::guard('personnel')->user();
        if (!$authPersonnel->is_admin) {
            abort(403);
        }

        $citizen->delete();

        return back()->with('success', 'Citizen account deleted.');
    }

    public function editProfile()
    {
        $personnel = Auth::guard('personnel')->user();

        return Inertia::render('Personnel/Profile', [
            'personnel' => $personnel,
            'auth' => ['personnel' => $personnel],
        ]);
    }

    public function updateProfile(Request $request)
    {
        $personnel = Auth::guard('personnel')->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'current_password' => 'nullable|string',
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        if (!empty($validated['current_password'])) {
            if (!Hash::check($validated['current_password'], $personnel->password)) {
                return back()->withErrors(['current_password' => 'Current password is incorrect.']);
            }
        }

        $updateData = ['name' => $validated['name']];

        if (!empty($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        $personnel->update($updateData);

        return back()->with('success', 'Profile updated successfully.');
    }
}
