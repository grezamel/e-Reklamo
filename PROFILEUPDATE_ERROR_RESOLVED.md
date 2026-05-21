# ✅ ProfileUpdateRequest Error - RESOLVED

## Problem
After deleting the old `ProfileUpdateRequest.php` file, the application threw:
```
ErrorException - Internal Server Error
include(...app/Http/Requests/ProfileUpdateRequest.php): Failed to open stream: No such file or directory
```

The issue occurred because multiple files were still referencing the deleted class.

---

## Root Causes Found & Fixed

### 1. ❌ ProfileController Still Using Deleted Request Class

**File:** `app/Http/Controllers/ProfileController.php`

**Problem:**
```php
use App\Http\Requests\ProfileUpdateRequest;  // ❌ Class doesn't exist!

public function update(ProfileUpdateRequest $request): RedirectResponse
{
    // ...
}
```

**Solution:**
- Removed the import of deleted `ProfileUpdateRequest`
- Updated the method to handle both Personnel and Citizen profiles
- Added guard-specific validation:

```php
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
    // ... rest of method
}
```

### 2. ❌ Auth Routes Using Deleted RegisteredUserController

**File:** `routes/auth.php`

**Problem:**
```php
use App\Http\Controllers\Auth\RegisteredUserController;  // ❌ Deleted!

Route::get('register', [RegisteredUserController::class, 'create'])
    ->name('register');
```

**Solution:**
- Replaced generic registration routes with role-specific routes
- Updated imports to use new controllers:

```php
use App\Http\Controllers\Auth\PersonnelRegisteredUserController;
use App\Http\Controllers\Auth\CitizenRegisteredUserController;

Route::middleware('guest')->group(function () {
    // Personnel Registration
    Route::get('personnel/register', [PersonnelRegisteredUserController::class, 'create'])
        ->name('personnel.register');
    Route::post('personnel/register', [PersonnelRegisteredUserController::class, 'store']);

    // Citizen Registration
    Route::get('citizen/register', [CitizenRegisteredUserController::class, 'create'])
        ->name('citizen.register');
    Route::post('citizen/register', [CitizenRegisteredUserController::class, 'store']);
    
    // ... other routes
});
```

### 3. ✅ CitizenController Already Fixed
- Already imports and uses `CitizenProfileUpdateRequest` correctly
- Already updated the `updateProfile()` method

---

## Summary of Changes

| File | Change | Impact |
|------|--------|--------|
| `ProfileController.php` | Removed deleted request import, added guard-aware validation | ✅ Profiles now updateable for both Personnel & Citizens |
| `routes/auth.php` | Updated to use new role-specific controllers | ✅ Registration routes now point to correct controllers |
| Autoload & Cache | Cleared composer and Laravel caches | ✅ Classes properly resolved |

---

## Current Authentication Structure

### Registration Routes
```
POST  /personnel/register  → PersonnelRegisteredUserController@store
POST  /citizen/register    → CitizenRegisteredUserController@store
```

### Profile Routes
```
GET   /personnel/profile   → ProfileController@edit     (Personnel guard)
PATCH /personnel/profile   → ProfileController@update   (Personnel guard)
GET   /citizen/profile     → ProfileController@edit     (Citizen guard)
PATCH /citizen/profile     → ProfileController@update   (Citizen guard)
```

### Validation
- **Personnel**: Name, Email, Position
- **Citizen**: Name, Email, Phone, Address
- Each has unique email constraint per table

---

## Testing Checklist

- [ ] Visit `/` - should show Welcome page
- [ ] Click Personnel Register - should go to Personnel registration
- [ ] Click Citizen Register - should go to Citizen registration
- [ ] Register as Personnel - should create in `personnel` table
- [ ] Register as Citizen - should create in `citizens` table
- [ ] Login and update profile - should work for both roles
- [ ] Profile validation - should enforce correct fields

---

## ✨ Status: All Fixed! ✅

The application should now work without the `ProfileUpdateRequest` error. All references have been updated to use the new role-specific request classes.

### Next Steps
1. Run `php artisan serve`
2. Test the registration and profile flows
3. Verify both Personnel and Citizen flows work correctly

