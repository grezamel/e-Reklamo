# 🚀 Developer Quick Checklist

## Pre-Development

- [ ] Read `COMPLETION_SUMMARY.md` - Get overview
- [ ] Read `IMPLEMENTATION_GUIDE.md` - Technical details
- [ ] Review `ARCHITECTURE.md` - Component structure
- [ ] Check `NEXT_STEPS.md` - What's left to do

## Installation & Setup

- [ ] Clone repository
- [ ] Run `composer install`
- [ ] Run `npm install`
- [ ] Copy `.env.example` to `.env`
- [ ] Run `php artisan key:generate`
- [ ] Configure database in `.env`
- [ ] Run `php artisan migrate`
- [ ] Run `php artisan storage:link`

## Development Server

- [ ] Terminal 1: `php artisan serve`
- [ ] Terminal 2: `npm run dev`
- [ ] Check `http://localhost:8000`

## Database Seeding (Optional)

```bash
php artisan tinker
# Create departments, categories, admin user
# See NEXT_STEPS.md for script
```

## Authentication Setup (TODO)

- [ ] Create `PersonnelLoginController.php`
- [ ] Create `PersonnelRegisterController.php`
- [ ] Create `CitizenLoginController.php`
- [ ] Create `CitizenRegisterController.php`
- [ ] Create login/register React components
- [ ] Update `routes/auth.php` for both guards
- [ ] Update `Welcome.jsx` with portal links

## Testing Workflows

### Personnel Workflow
1. [ ] Create Personnel account via Tinker
2. [ ] Login to `/personnel/dashboard`
3. [ ] Verify dashboard stats display
4. [ ] Navigate to complaints list
5. [ ] Test filters (status, priority, dept)
6. [ ] Test search functionality
7. [ ] View complaint details
8. [ ] Update complaint status
9. [ ] Assign complaint to personnel
10. [ ] View analytics dashboard
11. [ ] Test date range filters
12. [ ] Verify charts display data

### Citizen Workflow
1. [ ] Create Citizen account via Tinker
2. [ ] Login to `/citizen/dashboard`
3. [ ] Verify dashboard displays stats
4. [ ] Navigate to file complaint
5. [ ] Test form validation
6. [ ] Test photo upload
7. [ ] Test photo preview
8. [ ] Test anonymous checkbox
9. [ ] Submit complaint
10. [ ] Verify reference number generated
11. [ ] Check complaint appears in my list
12. [ ] View complaint details
13. [ ] Verify status timeline displays

## Mobile Testing

- [ ] Test on iPhone (Safari)
- [ ] Test on Android (Chrome)
- [ ] Test on iPad (Safari)
- [ ] Test all breakpoints
- [ ] Verify hamburger menu works
- [ ] Verify touch targets are 44x44+
- [ ] Verify no horizontal scroll
- [ ] Verify images load properly

## Code Quality

- [ ] Run `npm run lint` (if configured)
- [ ] Run `php artisan pint` (code style)
- [ ] Check for console errors
- [ ] Verify all routes work
- [ ] Check database indexes
- [ ] Review error handling

## Feature Checklist

### Personnel Features
- [ ] Dashboard displays correctly
- [ ] Complaints list shows all data
- [ ] Filters work independently
- [ ] Search functionality works
- [ ] Status update with remarks
- [ ] Assign complaint function
- [ ] Priority change function
- [ ] Analytics shows correct metrics
- [ ] Charts render properly
- [ ] Date range filter works
- [ ] Personnel management (admin)
- [ ] Create new personnel
- [ ] Update personnel info
- [ ] Delete personnel
- [ ] Profile settings accessible

### Citizen Features
- [ ] Dashboard shows stats
- [ ] File complaint form validates
- [ ] Department select works
- [ ] Category cascades properly
- [ ] Photo upload works
- [ ] Photo preview displays
- [ ] Photo removal works
- [ ] Anonymous checkbox works
- [ ] Submit creates complaint
- [ ] Reference number generates
- [ ] Complaints list shows all
- [ ] Complaint details display
- [ ] Status timeline shows
- [ ] Update history displays

## Performance Optimization

- [ ] Check database query count (use Laravel Debugbar)
- [ ] Optimize N+1 queries
- [ ] Verify pagination works
- [ ] Check image loading performance
- [ ] Verify CSS is minified
- [ ] Verify JS is minified
- [ ] Check bundle size: `npm run build`

## Security Checklist

- [ ] Verify CSRF token in forms
- [ ] Check authentication guards work
- [ ] Verify admin authorization works
- [ ] Test file upload security
- [ ] Check password hashing
- [ ] Verify email verification (if enabled)
- [ ] Test SQL injection prevention
- [ ] Verify XSS protection

## Deployment Preparation

- [ ] Create `.env.production`
- [ ] Set `APP_DEBUG=false`
- [ ] Set `APP_ENV=production`
- [ ] Run `php artisan config:cache`
- [ ] Run `php artisan route:cache`
- [ ] Run `npm run build` (production)
- [ ] Setup database backups
- [ ] Configure logging
- [ ] Setup error tracking (Sentry, etc.)
- [ ] Configure mail service (if needed)

## Documentation

- [ ] Update README with real credentials
- [ ] Document any custom changes
- [ ] Update IMPLEMENTATION_GUIDE.md if needed
- [ ] Create deployment instructions
- [ ] Document any known issues
- [ ] Create user guides (if needed)

## Common Issues & Solutions

### Photos Not Showing
```bash
php artisan storage:link
```

### Routes Not Found
```bash
php artisan route:clear
php artisan route:cache
```

### Database Connection Error
- Check `.env` database credentials
- Verify MySQL/PostgreSQL running
- Check database exists

### Migrations Fail
```bash
php artisan migrate:fresh  # Fresh start
php artisan migrate --step  # Step by step
```

### Component Not Rendering
- Check browser console for errors
- Verify route exists in web.php
- Check component path is correct
- Verify props are passed correctly

### Authentication Issues
- Check guard in middleware
- Verify model is using correct table
- Check password reset tokens table exists
- Verify email verification settings

## File Structure Verification

```
e-reklamo/
├── app/
│   ├── Http/Controllers/
│   │   ├── PersonnelController.php ✅
│   │   ├── CitizenController.php ✅
│   │   ├── ComplaintController.php ✅
│   │   └── AnalyticsController.php ✅
│   ├── Models/
│   │   ├── Personnel.php ✅
│   │   ├── Citizen.php ✅
│   │   ├── Complaint.php ✅
│   │   ├── ComplaintUpdate.php ✅
│   │   ├── Department.php ✅
│   │   └── Category.php ✅
│   └── Http/Middleware/
│       ├── HandleInertiaRequests.php ✅
│       └── CheckRole.php ✅
├── database/migrations/
│   ├── 2026_05_13_000001_create_personnel_table.php ✅
│   ├── 2026_05_13_000002_create_citizens_table.php ✅
│   ├── 2026_05_13_000003_refactor_complaints_table.php ✅
│   └── 2026_05_13_000004_create_complaint_updates_table.php ✅
├── resources/js/
│   ├── Layouts/
│   │   ├── PersonnelLayout.jsx ✅
│   │   └── CitizenLayout.jsx ✅
│   └── Pages/
│       ├── Personnel/
│       │   ├── Dashboard.jsx ✅
│       │   ├── ComplaintsList.jsx ✅
│       │   └── Analytics.jsx ✅
│       └── Citizen/
│           ├── Dashboard.jsx ✅
│           ├── FileComplaint.jsx ✅
│           └── ComplaintDetail.jsx ✅
├── routes/
│   ├── web.php ✅
│   └── auth.php (TODO: update)
├── config/
│   └── auth.php ✅
└── Documentation/
    ├── COMPLETION_SUMMARY.md ✅
    ├── IMPLEMENTATION_GUIDE.md ✅
    ├── ARCHITECTURE.md ✅
    ├── NEXT_STEPS.md ✅
    └── README_COMPLETE.md ✅
```

## Quick Commands Reference

```bash
# Fresh setup
composer install && npm install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan storage:link

# Development
npm run dev              # Run Vite
php artisan serve       # Run Laravel
php artisan tinker      # Interactive shell

# Database
php artisan migrate          # Run migrations
php artisan migrate:fresh    # Reset database
php artisan db:seed          # Run seeders
php artisan tinker           # Create test data

# Maintenance
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Production Build
npm run build               # Build frontend
php artisan config:cache    # Cache config
php artisan route:cache     # Cache routes

# Testing
php artisan test                    # Run tests
npm run lint                        # Lint JS
php artisan pint                    # Format PHP
```

## Emergency Commands

```bash
# Clear everything (dev only!)
php artisan cache:clear && php artisan config:clear && php artisan route:clear && php artisan view:clear

# Reset database
php artisan migrate:fresh --seed

# Restart Laravel
php artisan serve --port=8000

# Fix permissions
chmod -R 775 storage bootstrap/cache

# Rebuild dependencies
composer update && npm install
```

## Performance Tips

1. **Use Eager Loading**: `with()` in queries
2. **Add Pagination**: Don't load all records
3. **Index Database Fields**: For frequently queried columns
4. **Cache Queries**: Use Laravel's cache
5. **Optimize Images**: Compress before upload
6. **Lazy Load Components**: React.lazy() for routes
7. **Monitor Bundle Size**: Keep JS/CSS optimized
8. **Use CDN**: For static assets (optional)

## Getting Help

1. Check error messages in console
2. Look at Laravel logs: `storage/logs/`
3. Check browser DevTools
4. Search documentation files
5. Review code comments
6. Ask team members

## Final Checklist Before Launch

- [ ] All features tested and working
- [ ] Mobile responsiveness verified
- [ ] Database optimized with indexes
- [ ] Error handling implemented
- [ ] Logging configured
- [ ] Security reviewed
- [ ] Performance acceptable
- [ ] Documentation complete
- [ ] Backup strategy in place
- [ ] Monitoring setup (if needed)

---

**Need Help?** Check the documentation files:
- `COMPLETION_SUMMARY.md` - Overview
- `IMPLEMENTATION_GUIDE.md` - Technical details
- `NEXT_STEPS.md` - What to do next
- `ARCHITECTURE.md` - System design

**Status**: ✅ Ready for Development  
**Last Updated**: May 13, 2026
