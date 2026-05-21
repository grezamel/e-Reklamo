<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Personnel;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class PersonnelRegisteredUserController extends Controller
{
    /**
     * Display the personnel registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/RegisterPersonnel');
    }

    /**
     * Handle an incoming personnel registration request.
     *
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:personnel',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'department_id' => 'required|integer|exists:departments,id',
            'position' => 'required|string|max:255',
        ]);

        $personnel = Personnel::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'department_id' => $request->department_id,
            'position' => $request->position,
            'is_admin' => false,
            'is_active' => true,
        ]);

        event(new Registered($personnel));

        Auth::guard('personnel')->login($personnel);

        return redirect()->route('personnel.dashboard');
    }
}
