<?php

namespace App\Http\Controllers;

use App\Models\Complaint;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class ComplaintController extends Controller
{
    public function store(Request $request)
    {
        // 1. Validate the incoming data
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|string',
            'location' => 'required|string',
        ]);

        // 2. Generate a Unique Reference Number
        $refNumber = 'REK-' . date('Ymd') . '-' . strtoupper(Str::random(4));

        // 3. Save to Database
        Complaint::create([
            'reference_number' => $refNumber,
            'user_id' => \Illuminate\Support\Facades\Auth::id(),
            'title' => $validated['title'],
            'description' => $validated['description'],
            'category' => $validated['category'],
            'location' => $validated['location'],
            'status' => 'pending',
            'priority' => 'medium',
        ]);

        // 4. Redirect back with a success message
        return redirect()->back()->with('message', 'Complaint submitted successfully! Ref: ' . $refNumber);
    }

    public function updateStatus(Request $request, Complaint $complaint)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,in-progress,resolved,rejected',
            'remarks' => 'nullable|string|max:500', // Add this
        ]);

        $complaint->update([
            'status' => $validated['status'],
            'remarks' => $validated['remarks'] ?? $complaint->remarks,
        ]);

        return redirect()->back();
    }

    public function togglePriority(Complaint $complaint)
    {
        // Security check
        if (Auth::user()->role !== 'personnel') {
            abort(403);
        }

        // Toggle logic: If it's high, make it low. Otherwise, make it high.
        $newPriority = $complaint->priority === 'high' ? 'low' : 'high';
        
        $complaint->update([
            'priority' => $newPriority
        ]);

        return redirect()->back();
    }
}