<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the citizen login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Display the personnel login view.
     */
    public function createPersonnel(): Response
    {
        return Inertia::render('Auth/PersonnelLogin', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle citizen login.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (!Auth::guard('citizen')->attempt(
            $request->only('email', 'password'),
            $request->boolean('remember')
        )) {
            throw ValidationException::withMessages([
                'email' => trans('auth.failed'),
            ]);
        }

        $request->session()->regenerate();

        return redirect()->intended(route('citizen.dashboard'));
    }

    /**
     * Handle personnel login.
     */
    public function storePersonnel(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (!Auth::guard('personnel')->attempt(
            $request->only('email', 'password'),
            $request->boolean('remember')
        )) {
            throw ValidationException::withMessages([
                'email' => trans('auth.failed'),
            ]);
        }

        $request->session()->regenerate();

        return redirect()->intended(route('personnel.dashboard'));
    }

    /**
     * Destroy citizen session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('citizen')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/');
    }

    /**
     * Destroy personnel session.
     */
    public function destroyPersonnel(Request $request): RedirectResponse
    {
        Auth::guard('personnel')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect(route('personnel.login'));
    }
}
