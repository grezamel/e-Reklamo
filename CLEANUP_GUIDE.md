# 🗑️ CLEANUP GUIDE - Remove Unused/Duplicate Files

## 📍 LOGO FILE LOCATION - CORRECT PLACEMENT

### Your Current Logo Path ✅
```
C:\Users\ADMIN\e-reklamo\public\images\eReklamo_logo.png
```

### Analysis
**Location**: `public/images/eReklamo_logo.png` ✅ **CORRECT**

This is actually **BETTER** than the originally suggested location!

#### Why this is good:
- ✅ Organized in dedicated `images/` folder
- ✅ Separates branding assets from root
- ✅ Scalable folder structure for future assets
- ✅ Professional project organization
- ✅ Follows best practices

#### Logo appears in:
- Personnel Portal Navigation
- Citizen Portal Navigation
- Both use: `/images/eReklamo_logo.png`

---

## 🗑️ FILES TO DELETE (CLEANUP)

### HIGH PRIORITY - DELETE THESE (4 Files)

#### 1. ❌ `app/Models/User.php` - REMOVE
**Reason**: Completely replaced by `Personnel.php` and `Citizen.php`

**Check Before Deleting**:
- ✅ Only used in config/auth.php as fallback
- ✅ Used in RegisteredUserController.php
- ✅ Used in ProfileUpdateRequest.php
- ✅ Old generic model - replaced by dual system

**Action**: DELETE THIS FILE

---

#### 2. ❌ `database/factories/UserFactory.php` - REMOVE  
**Reason**: Factory for deprecated User model

**Check**: 
- ✅ Personnel.php still references it (need to update)
- ✅ Citizen.php still references it (need to update)
- ✅ No longer needed with separate models

**Action**: DELETE THIS FILE (after updating model imports)

---

#### 3. ❌ `database/migrations/0001_01_01_000000_create_users_table.php` - REMOVE
**Reason**: Creates deprecated `users` table

**Check**:
- ✅ Replaced by `create_personnel_table` and `create_citizens_table`
- ✅ Old migration not needed anymore

**Action**: DELETE THIS FILE

---

#### 4. ❌ `routes/auth.php` (if exists and unused) - REVIEW
**Reason**: May contain old authentication routes

**Check Status**: Need to verify current routes

---

### MEDIUM PRIORITY - CONSIDER REMOVING (2 Controllers)

#### 5. ⚠️ `app/Http/Controllers/Auth/RegisteredUserController.php` - DEPRECATE
**Current Use**: Registers users to generic `User` table

**Should Be Replaced With**:
- `PersonnelRegisteredUserController.php` - For personnel registration
- `CitizenRegisteredUserController.php` - For citizen registration

**Action**: CREATE new auth controllers for each portal, then delete

---

#### 6. ⚠️ `app/Http/Controllers/Auth/ProfileUpdateRequest.php` - DEPRECATE
**Current Use**: Validates User model updates

**Should Be Replaced With**:
- `PersonnelProfileUpdateRequest.php` - For personnel
- `CitizenProfileUpdateRequest.php` - For citizens

**Action**: CREATE new request classes, then delete

---

## 📋 CLEANUP STEP-BY-STEP

### Step 1: Update Model Imports (BEFORE Deleting UserFactory)

**File**: `app/Models/Personnel.php`
```php
// Change FROM:
use Database\Factories\UserFactory;

// Change TO:
use Database\Factories\PersonnelFactory;
```

**File**: `app/Models/Citizen.php`
```php
// Change FROM:
use Database\Factories\UserFactory;

// Change TO:
use Database\Factories\CitizenFactory;
```

---

### Step 2: Create New Auth Controllers

#### Create: `app/Http/Controllers/Auth/PersonnelRegisteredUserController.php`
```php
<?php

namespace App\Http\Controllers\Auth;

use App\Models\Personnel;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class PersonnelRegisteredUserController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/PersonnelRegister');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:personnel',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'department_id' => 'required|exists:departments,id',
            'position' => 'required|string',
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

        return redirect(route('personnel.dashboard', absolute: false));
    }
}
```

#### Create: `app/Http/Controllers/Auth/CitizenRegisteredUserController.php`
```php
<?php

namespace App\Http\Controllers\Auth;

use App\Models\Citizen;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class CitizenRegisteredUserController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/CitizenRegister');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:citizens',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'phone' => 'required|string|max:20',
            'address' => 'required|string|max:255',
        ]);

        $citizen = Citizen::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'address' => $request->address,
            'is_anonymous' => false,
            'is_active' => true,
        ]);

        event(new Registered($citizen));
        Auth::guard('citizen')->login($citizen);

        return redirect(route('citizen.dashboard', absolute: false));
    }
}
```

---

### Step 3: Create New Request Classes

#### Create: `app/Http/Requests/PersonnelProfileUpdateRequest.php`
```php
<?php

namespace App\Http\Requests;

use App\Models\Personnel;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PersonnelProfileUpdateRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(Personnel::class)->ignore($this->user()->id),
            ],
            'position' => ['required', 'string', 'max:255'],
        ];
    }
}
```

#### Create: `app/Http/Requests/CitizenProfileUpdateRequest.php`
```php
<?php

namespace App\Http\Requests;

use App\Models\Citizen;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CitizenProfileUpdateRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(Citizen::class)->ignore($this->user()->id),
            ],
            'phone' => ['required', 'string', 'max:20'],
            'address' => ['required', 'string', 'max:255'],
        ];
    }
}
```

---

### Step 4: Delete Unnecessary Files

After creating the new files above, delete these OLD files:

```bash
# Files to DELETE:

# 1. Old generic User model
rm app/Models/User.php

# 2. Old User factory
rm database/factories/UserFactory.php

# 3. Old migrations
rm database/migrations/0001_01_01_000000_create_users_table.php

# 4. Old Auth controllers (after creating replacements)
rm app/Http/Controllers/Auth/RegisteredUserController.php

# 5. Old Request class
rm app/Http/Requests/ProfileUpdateRequest.php
```

---

## 🗑️ MIGRATIONS TO KEEP vs DELETE

### Keep (Active)
```
✅ 0000_00_00_000000_create_departments_table.php
✅ 0001_01_01_000001_create_cache_table.php
✅ 0001_01_01_000002_create_jobs_table.php
✅ 2026_05_13_000001_create_personnel_table.php
✅ 2026_05_13_000002_create_citizens_table.php
✅ 2026_05_13_000003_refactor_complaints_table.php
✅ 2026_05_13_000004_create_complaint_updates_table.php
✅ 2026_05_12_103914_create_categories_table.php
```

### Delete (Deprecated/Conflicts)
```
❌ 0001_01_01_000000_create_users_table.php (OLD - USE Personnel/Citizen instead)
❌ 2026_05_10_020815_create_complaints_table.php (OLD - REPLACED by 2026_05_13_000003)
❌ 2026_05_10_020825_create_complaint_updates_table.php (OLD - REPLACED by 2026_05_13_000004)
❌ 2026_05_10_075556_add_remarks_to_complaints_table.php (OLD - INTEGRATED into refactor)
❌ 2026_05_12_104003_refactor_complaints_table.php (OLD - REPLACED by 2026_05_13_000003)
```

---

## ✅ FINAL PROJECT STRUCTURE (After Cleanup)

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── PersonnelController.php       ✅ Keep
│   │   ├── CitizenController.php         ✅ Keep
│   │   ├── ComplaintController.php       ✅ Keep
│   │   ├── AnalyticsController.php       ✅ Keep
│   │   └── Auth/
│   │       ├── PersonnelRegisteredUserController.php  ✅ NEW
│   │       ├── CitizenRegisteredUserController.php    ✅ NEW
│   │       ├── AuthenticatedSessionController.php     ✅ Keep
│   │       ├── PasswordController.php                 ✅ Keep
│   │       ├── EmailVerificationPromptController.php  ✅ Keep
│   │       ├── EmailVerificationNotificationController.php ✅ Keep
│   │       ├── NewPasswordController.php              ✅ Keep
│   │       ├── PasswordResetLinkController.php        ✅ Keep
│   │       ├── VerifyEmailController.php              ✅ Keep
│   │       └── [DELETE: RegisteredUserController.php]
│   ├── Middleware/
│   └── Requests/
│       ├── PersonnelProfileUpdateRequest.php  ✅ NEW
│       ├── CitizenProfileUpdateRequest.php    ✅ NEW
│       └── [DELETE: ProfileUpdateRequest.php]
├── Models/
│   ├── Personnel.php         ✅ Keep (UPDATED - remove UserFactory)
│   ├── Citizen.php           ✅ Keep (UPDATED - remove UserFactory)
│   ├── Complaint.php         ✅ Keep
│   ├── ComplaintUpdate.php   ✅ Keep
│   ├── Department.php        ✅ Keep
│   ├── Category.php          ✅ Keep
│   └── [DELETE: User.php]

database/
├── factories/
│   ├── PersonnelFactory.php  ✅ NEW (or keep existing)
│   ├── CitizenFactory.php    ✅ NEW (or keep existing)
│   └── [DELETE: UserFactory.php]
├── migrations/
│   ├── 0000_00_00_000000_create_departments_table.php        ✅ Keep
│   ├── 0001_01_01_000001_create_cache_table.php             ✅ Keep
│   ├── 0001_01_01_000002_create_jobs_table.php              ✅ Keep
│   ├── 2026_05_13_000001_create_personnel_table.php         ✅ Keep
│   ├── 2026_05_13_000002_create_citizens_table.php          ✅ Keep
│   ├── 2026_05_13_000003_refactor_complaints_table.php      ✅ Keep
│   ├── 2026_05_13_000004_create_complaint_updates_table.php ✅ Keep
│   ├── 2026_05_12_103914_create_categories_table.php        ✅ Keep
│   ├── [DELETE OLD]
│   └── [DELETE CONFLICTS]
└── seeders/

public/
├── images/
│   └── eReklamo_logo.png     ✅ CORRECT LOCATION
├── favicon.ico
└── index.php
```

---

## 📋 CLEANUP CHECKLIST

### Before Deleting Files
- [ ] Review each file
- [ ] Check for dependencies
- [ ] Update imports if needed
- [ ] Create replacement files first

### Files to Delete (IN ORDER)
1. [ ] Remove UserFactory reference from Personnel.php
2. [ ] Remove UserFactory reference from Citizen.php
3. [ ] Create PersonnelRegisteredUserController.php
4. [ ] Create CitizenRegisteredUserController.php
5. [ ] Create PersonnelProfileUpdateRequest.php
6. [ ] Create CitizenProfileUpdateRequest.php
7. [ ] Delete RegisteredUserController.php
8. [ ] Delete ProfileUpdateRequest.php
9. [ ] Delete User.php
10. [ ] Delete UserFactory.php
11. [ ] Delete create_users_table migration
12. [ ] Delete old complaint migrations (5 files)

### After Deletion
- [ ] Run `composer dump-autoload`
- [ ] Test application
- [ ] Verify routes work
- [ ] Check authentication

---

## 🎯 SUMMARY

### Logo Location: ✅ CORRECT
```
public/images/eReklamo_logo.png
```

### Files to Delete: 7 Total
1. `app/Models/User.php`
2. `database/factories/UserFactory.php`
3. `database/migrations/0001_01_01_000000_create_users_table.php`
4. `app/Http/Controllers/Auth/RegisteredUserController.php`
5. `app/Http/Requests/ProfileUpdateRequest.php`
6. Old complaint migrations (5 files) - optional, keep for history

### Files to Create: 4 New
1. `PersonnelRegisteredUserController.php`
2. `CitizenRegisteredUserController.php`
3. `PersonnelProfileUpdateRequest.php`
4. `CitizenProfileUpdateRequest.php`

### Benefits
- ✅ Removes duplicate User model
- ✅ Cleans up old migrations
- ✅ Proper authentication separation
- ✅ Organized project structure
- ✅ No more confusion

---

**Status**: Ready to cleanup! 🧹
