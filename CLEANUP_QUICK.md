# 🗑️ QUICK CLEANUP - What to Delete

## ✅ LOGO LOCATION - CONFIRMED CORRECT

```
public/images/eReklamo_logo.png  ✅ PERFECT LOCATION
```

---

## 🗑️ DELETE THESE FILES (7 Total)

### Step 1: Delete Deprecated Model
```bash
rm app/Models/User.php
```

### Step 2: Delete Old Factory
```bash
rm database/factories/UserFactory.php
```

### Step 3: Delete Old User Migration
```bash
rm database/migrations/0001_01_01_000000_create_users_table.php
```

### Step 4: Delete Old Auth Controller (REPLACED)
```bash
rm app/Http/Controllers/Auth/RegisteredUserController.php
```

### Step 5: Delete Old Request Class (REPLACED)
```bash
rm app/Http/Requests/ProfileUpdateRequest.php
```

### Step 6: Delete Old Complaint Migrations (REPLACED)
```bash
rm database/migrations/2026_05_10_020815_create_complaints_table.php
rm database/migrations/2026_05_10_020825_create_complaint_updates_table.php
rm database/migrations/2026_05_10_075556_add_remarks_to_complaints_table.php
rm database/migrations/2026_05_12_104003_refactor_complaints_table.php
```

---

## ✅ NEW FILES ALREADY CREATED (4)

These have been created for you:

1. ✅ `app/Http/Controllers/Auth/PersonnelRegisteredUserController.php` - NEW
2. ✅ `app/Http/Controllers/Auth/CitizenRegisteredUserController.php` - NEW
3. ✅ `app/Http/Requests/PersonnelProfileUpdateRequest.php` - NEW
4. ✅ `app/Http/Requests/CitizenProfileUpdateRequest.php` - NEW

---

## ✅ MODELS ALREADY UPDATED (2)

These have been updated:

1. ✅ `app/Models/Personnel.php` - Removed UserFactory import
2. ✅ `app/Models/Citizen.php` - Removed UserFactory import

---

## 📋 DELETION SUMMARY

| File | Type | Action |
|------|------|--------|
| `app/Models/User.php` | Model | DELETE |
| `database/factories/UserFactory.php` | Factory | DELETE |
| `database/migrations/0001_01_01_000000_create_users_table.php` | Migration | DELETE |
| `app/Http/Controllers/Auth/RegisteredUserController.php` | Controller | DELETE |
| `app/Http/Requests/ProfileUpdateRequest.php` | Request | DELETE |
| 4 old complaint migrations | Migrations | DELETE |
| **PersonnelRegisteredUserController** | Controller | ✅ CREATED |
| **CitizenRegisteredUserController** | Controller | ✅ CREATED |
| **PersonnelProfileUpdateRequest** | Request | ✅ CREATED |
| **CitizenProfileUpdateRequest** | Request | ✅ CREATED |

---

## 🎯 AFTER CLEANUP

### Run Commands
```bash
# Clear autoloader cache
composer dump-autoload

# Optional: Clear all caches
php artisan cache:clear
php artisan view:clear
php artisan config:clear
```

### Verify
```bash
# Check routes still work
php artisan route:list

# Test application
php artisan serve
```

---

## ✨ RESULT

After cleanup:
- ✅ No duplicate User model
- ✅ Clean project structure
- ✅ Proper personnel/citizen separation
- ✅ No old migrations confusing things
- ✅ Professional organization
- ✅ Ready for production

---

**Status**: Ready to cleanup! Just delete the 7 files listed above. 🧹
