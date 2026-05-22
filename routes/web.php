<?php

use App\Http\Controllers\ComplaintController;
use App\Http\Controllers\PersonnelController;
use App\Http\Controllers\CitizenController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\Auth\CitizenRegisteredUserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\NewPasswordController;
use Illuminate\Support\Facades\Route;

// Root redirects to citizen login
Route::get('/', function () {
    return redirect()->route('login');
});

// CITIZEN AUTH ROUTES (public)
Route::middleware('guest:citizen')->group(function () {
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);
    Route::get('/register', [CitizenRegisteredUserController::class, 'create'])->name('register');
    Route::post('/register', [CitizenRegisteredUserController::class, 'store'])->name('citizen.register');
    Route::get('/forgot-password', [PasswordResetLinkController::class, 'create'])->name('password.request');
    Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])->name('password.email');
    Route::get('/reset-password/{token}', [NewPasswordController::class, 'create'])->name('password.reset');
    Route::post('/reset-password', [NewPasswordController::class, 'store'])->name('password.store');
});

// CITIZEN PROTECTED ROUTES
Route::middleware('auth:citizen')->prefix('citizen')->name('citizen.')->group(function () {
    Route::get('/dashboard', [CitizenController::class, 'dashboard'])->name('dashboard');
    Route::get('/complaints', [CitizenController::class, 'myComplaints'])->name('complaints.index');
    Route::get('/complaints/new', [CitizenController::class, 'createComplaint'])->name('complaints.new');
    Route::post('/complaints', [ComplaintController::class, 'store'])->name('complaints.store');
    Route::get('/complaints/{complaint}', [CitizenController::class, 'showComplaint'])->name('complaints.show');
    Route::delete('/complaints/{complaint}', [CitizenController::class, 'destroyComplaint'])->name('complaints.destroy');
    Route::get('/profile', [CitizenController::class, 'editProfile'])->name('profile.edit');
    Route::patch('/profile', [CitizenController::class, 'updateProfile'])->name('profile.update');
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
});

// PERSONNEL ROUTES - Hidden at /personnel
Route::prefix('personnel')->name('personnel.')->group(function () {
    Route::middleware('guest:personnel')->group(function () {
        Route::get('/login', [AuthenticatedSessionController::class, 'createPersonnel'])->name('login');
        Route::post('/login', [AuthenticatedSessionController::class, 'storePersonnel']);
    });

    Route::middleware('auth:personnel')->group(function () {
        Route::get('/dashboard', [PersonnelController::class, 'dashboard'])->name('dashboard');
        Route::get('/complaints', [ComplaintController::class, 'index'])->name('complaints.index');
        Route::get('/complaints/{complaint}', [ComplaintController::class, 'show'])->name('complaints.show');
        Route::post('/complaints/{complaint}/status', [ComplaintController::class, 'updateStatus'])->name('complaints.updateStatus');
        Route::post('/complaints/{complaint}/assign', [ComplaintController::class, 'assign'])->name('complaints.assign');
        Route::post('/complaints/{complaint}/priority', [ComplaintController::class, 'changePriority'])->name('complaints.changePriority');
        Route::delete('/complaints/{complaint}', [ComplaintController::class, 'destroy'])->name('complaints.destroy');
        Route::get('/analytics', [AnalyticsController::class, 'dashboard'])->name('analytics');
        Route::get('/analytics/export', [AnalyticsController::class, 'exportPDF'])->name('analytics.export');
        Route::get('/users', [PersonnelController::class, 'index'])->name('personnel.index');
        Route::post('/users', [PersonnelController::class, 'store'])->name('personnel.store');
        Route::patch('/users/{personnel}', [PersonnelController::class, 'update'])->name('personnel.update');
        Route::delete('/users/{personnel}', [PersonnelController::class, 'destroy'])->name('personnel.destroy');
        Route::get('/citizens', [PersonnelController::class, 'citizens'])->name('citizens.index');
        Route::patch('/citizens/{citizen}', [PersonnelController::class, 'updateCitizen'])->name('citizens.update');
        Route::delete('/citizens/{citizen}', [PersonnelController::class, 'destroyCitizen'])->name('citizens.destroy');
        Route::get('/profile', [PersonnelController::class, 'editProfile'])->name('profile.edit');
        Route::patch('/profile', [PersonnelController::class, 'updateProfile'])->name('profile.update');
        Route::post('/logout', [AuthenticatedSessionController::class, 'destroyPersonnel'])->name('logout');
    });
});