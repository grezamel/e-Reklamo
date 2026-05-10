<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ComplaintController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

use App\Models\Complaint;

Route::get('/dashboard', function () {
    $user = Auth::user();

    return Inertia::render('Dashboard', [
        // If personnel, get all. If citizen, get only theirs.
        'allComplaints' => $user->role === 'personnel' 
            ? Complaint::with('user')->orderBy('created_at', 'desc')->get() 
            : [],
        'myComplaints' => $user->role === 'citizen' 
            ? Complaint::where('user_id', $user->id)->orderBy('created_at', 'desc')->get() 
            : [],
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {

    Route::post('/complaints', [ComplaintController::class, 'store'])->name('complaints.store');
    Route::patch('/complaints/{complaint}/priority', [ComplaintController::class, 'togglePriority'])
    ->name('complaints.togglePriority');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';