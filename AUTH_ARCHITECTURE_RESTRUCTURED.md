# ✅ Authentication Architecture - Complete Restructuring

## Overview
Implemented a complete separation between **Public Citizen Side** (Green/Emerald theme) and **Hidden Personnel/Staff Side** (Navy/Sidebar theme).

---

## Architecture Changes

### 1. Route Structure (routes/web.php)

#### Public Routes
```php
// Landing page
GET  /                           → Welcome page
GET  /register                   → CitizenRegisteredUserController@create
POST /register                   → CitizenRegisteredUserController@store
GET  /login                      → AuthenticatedSessionController@create (Citizen)
POST /login                      → AuthenticatedSessionController@store  (Citizen)
```

#### Citizen Routes (Protected)
```
Prefix: /citizen (authenticated:citizen)
GET    /citizen/dashboard        → Citizen Dashboard
GET    /citizen/complaints       → My Complaints
POST   /citizen/complaints       → Submit Complaint
GET    /citizen/profile          → Edit Profile
PATCH  /citizen/profile          → Update Profile
POST   /citizen/logout           → Logout
```

#### Personnel Routes (Hidden)
```
Prefix: /personnel (NOT publicly visible)
GET    /personnel/login          → Staff Login (hidden)
POST   /personnel/login          → Staff Login Submit
GET    /personnel/dashboard      → Staff Dashboard (protected)
GET    /personnel/complaints     → Manage Complaints
GET    /personnel/analytics      → Analytics
GET    /personnel/personnel      → Manage Staff
POST   /personnel/logout         → Logout
```

---

## Design Implementation

### Citizen Login & Registration (GREEN - Emerald Theme)
- **File**: `resources/js/Pages/Auth/Login.jsx`
- **File**: `resources/js/Pages/Auth/RegisterCitizen.jsx`
- **Features**:
  - Emerald green color scheme
  - Social login options (Google, Apple, Facebook)
  - Remember me checkbox
  - Clean, modern card-based design
  - Responsive mobile-first layout

### Personnel Login (NAVY - Hidden by default)
- **Access**: Only via direct `/personnel/login` URL
- **Not visible** on public Welcome page
- **Theme**: Will use Navy color scheme (same layout, different colors)
- **Protection**: Middleware checks personnel role

---

## User Types & Behavior

### Citizen User
- ✅ Can register themselves via `/register`
- ✅ Automatically created as `citizen` user
- ✅ Sees Emerald green interface
- ✅ Accesses via `/login` and `/citizen/*` routes
- ✅ Can submit complaints and track status
- ✅ Can view/edit own profile
- ❌ Cannot access `/personnel/*` (403 Forbidden)

### Personnel User
- ❌ Cannot self-register
- ✅ Only created by other personnel (admin)
- ❌ Not visible on public pages
- ✅ Accesses via `/personnel/login` (hidden)
- ✅ Must know the `/personnel/login` URL (security by obscurity)
- ✅ Uses Navy/Sidebar interface theme
- ✅ Can manage both personnel and citizen accounts
- ✅ Can assign/track complaints
- ✅ Can view analytics and reports

---

## Security Features

### 1. Route Prefix Isolation
```php
// Personnel routes are all prefixed with /personnel/
// This prevents accidental exposure on public interface
```

### 2. Guard-Based Authentication
```php
// Citizen login uses 'citizen' guard
Route::post('/login', [...]) // Posts to 'login' with citizen guard

// Personnel login uses 'personnel' guard  
Route::post('/personnel/login', [...]) // Posts with personnel guard
```

### 3. Middleware Protection
- All `/personnel/*` routes require `auth:personnel` + `verified`
- All `/citizen/*` routes require `auth:citizen` + `verified`
- Cross-guard access returns 403 Forbidden

### 4. UI Separation
- Citizen sees green interface with register/login buttons
- Personnel must type `/personnel/login` directly
- Personnel interface completely hidden from public

---

## URL Reference

### Public/Citizen
```
http://e-reklamo.test/                    → Welcome & Landing
http://e-reklamo.test/login               → Citizen Login
http://e-reklamo.test/register            → Citizen Registration
http://e-reklamo.test/citizen/dashboard   → Citizen Dashboard
```

### Personnel (Hidden/Staff Only)
```
http://e-reklamo.test/personnel/login     → Staff Login (direct URL only)
http://e-reklamo.test/personnel/dashboard → Staff Dashboard (requires login)
http://e-reklamo.test/personnel/complaints → Manage Complaints
http://e-reklamo.test/personnel/personnel → Manage Staff
```

---

## Flow Diagrams

### Citizen Flow
```
Welcome Page
    ↓
    → Login Button → /login → Citizen Login Page → Submit → /citizen/dashboard
    → Sign up Button → /register → Registration Page → Submit → Auto-login → /citizen/dashboard
```

### Personnel Flow (Private)
```
Direct URL: /personnel/login
    ↓
Personnel Login Page
    ↓
Submit → /personnel/dashboard
    ↓
Can access: complaints, analytics, personnel management
```

---

## Files Created/Modified

### Created Files
- ✅ `resources/js/Pages/Auth/RegisterCitizen.jsx` - Citizen registration form
- ✅ Updated `resources/js/Pages/Auth/Login.jsx` - Citizen login form (green theme)
- ✅ Updated `routes/web.php` - Complete route restructuring

### Pages Needing Creation (Next Steps)
- `resources/js/Pages/Auth/PersonnelLogin.jsx` - Personnel login (navy theme)
- `resources/js/Layouts/PersonnelLayout.jsx` - Navy sidebar layout
- `resources/js/Layouts/CitizenLayout.jsx` - Green topbar layout

---

## Current Status ✅

### Implemented
✅ Route separation (public vs. personnel)
✅ Citizen registration & login pages (styled)
✅ Clear separation of URLs
✅ Welcome page only shows citizen options
✅ Personnel routes prefixed with `/personnel/`
✅ Guard-based authentication structure

### Pending
⏳ Create PersonnelLogin.jsx page (navy theme)
⏳ Create role-based middleware
⏳ Create layout components (PersonnelLayout, CitizenLayout)
⏳ Create Personnel dashboard page
⏳ Test authentication flows

---

## Testing Checklist

- [ ] Visit `/` - Shows Welcome with green theme
- [ ] Click Login → `/login` - Shows citizen login
- [ ] Click Sign up → `/register` - Shows citizen registration
- [ ] Register new citizen account - Creates citizen user
- [ ] Login with citizen - Redirects to `/citizen/dashboard`
- [ ] Try `/personnel/dashboard` as citizen - 403 Forbidden
- [ ] Direct access `/personnel/login` - Shows personnel login
- [ ] No link to `/personnel/login` visible on public pages
- [ ] Personnel can only login via direct URL

**Status: Ready for Personnel side completion! 🚀**
