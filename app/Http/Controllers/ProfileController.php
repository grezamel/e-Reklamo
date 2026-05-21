<?php

namespace App\Http\Controllers;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(Request $request): RedirectResponse
    {
        // Handle Personnel profile updates
        if (Auth::guard('personnel')->check()) {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:personnel,email,' . Auth::guard('personnel')->user()->id,
                'position' => 'required|string|max:100',
            ]);
            
            $user = Auth::guard('personnel')->user();
        }
        // Handle Citizen profile updates
        elseif (Auth::guard('citizen')->check()) {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:citizens,email,' . Auth::guard('citizen')->user()->id,
                'phone' => 'nullable|string|max:20',
                'address' => 'nullable|string|max:500',
            ]);
            
            $user = Auth::guard('citizen')->user();
        }
        // Fallback for web guard
        else {
            $user = $request->user();
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email',
            ]);
        }

        $user->fill($validated);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
