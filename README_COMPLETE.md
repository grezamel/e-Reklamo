# e-Reklamo: Digital Citizen Complaint & Case Tracking System

![e-Reklamo Logo](public/eReklamo_logo.png)

[![Laravel](https://img.shields.io/badge/Laravel-12.0-red)](https://laravel.com)
[![React](https://img.shields.io/badge/React-18.2-blue)](https://react.dev)
[![PHP](https://img.shields.io/badge/PHP-8.2+-purple)](https://www.php.net)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.2-blue)](https://tailwindcss.com)

**Individual Project** | A modern, responsive web-based system for citizens to file complaints and for personnel to manage and track complaint resolution with real-time updates and advanced analytics.

## ✨ Key Features

### 👥 Dual Portal Architecture
- **Personnel Portal** - Government staff and administrators
- **Citizen Portal** - Public users filing complaints

### 📋 Complaint Management
- File complaints with detailed descriptions and photos
- Real-time status tracking with timeline visualization
- Anonymous complaint option for privacy
- Photo uploads with multi-image support
- Unique reference number generation

### 📊 Advanced Analytics Dashboard
- Performance metrics (resolution rate, response time)
- Daily/weekly/monthly/yearly reports
- Filterable by date, department, status, category
- Visual charts and performance indicators
- Export to PDF capability

### 🔐 Secure Dual Authentication
- Separate authentication for Personnel and Citizens
- Role-based access control
- Admin capabilities for personnel management

### 📱 Fully Responsive Design
- Mobile-first approach
- Works seamlessly on all devices
- Touch-optimized interface
- Fast and efficient UI

### 🎨 Professional Color Schemes
- Personnel: Blue (#1E3A8A) + Green Accent
- Citizen: Green (#059669) + Green Accent
- Consistent design language

## 🚀 Quick Start

### Prerequisites
```bash
- PHP 8.2 or higher
- Composer 2.0+
- Node.js 18+
- npm or yarn
- MySQL 8.0+ or PostgreSQL 12+
```

### Asset Files Setup

Before installation, place the following files in the `public` directory:

**Logo File:**
- Place `eReklamo_logo.png` in: `public/eReklamo_logo.png`
- Recommended dimensions: 200x100px (or adjust in components)
- Formats supported: PNG, JPG, SVG
- Used in navigation bars and branding

**Other Assets:**
```
public/
├── eReklamo_logo.png        ← Logo for navigation
├── images/                   ← Additional images
└── documents/                ← PDF templates
```

### Installation

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd e-reklamo
   ```

2. **Install PHP Dependencies**
   ```bash
   composer install
   ```

3. **Install JavaScript Dependencies**
   ```bash
   npm install
   ```

4. **Environment Setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Database Configuration**
   Edit `.env` file:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=e_reklamo
   DB_USERNAME=root
   DB_PASSWORD=
   ```

6. **Run Migrations**
   ```bash
   php artisan migrate
   ```

7. **Create Storage Link**
   ```bash
   php artisan storage:link
   ```

8. **Build Frontend**
   ```bash
   npm run build
   ```

9. **Start Development Server**
   ```bash
   npm run dev    # In one terminal
   php artisan serve  # In another terminal
   ```

10. **Access the Application**
    - Visit: `http://localhost:8000`

### Initial Setup

#### Create Admin Personnel Account

```bash
php artisan tinker
```

```php
use App\Models\Personnel;
use App\Models\Department;
use Illuminate\Support\Facades\Hash;

// Create department first
$dept = Department::create(['name' => 'Administration']);

// Create admin personnel
Personnel::create([
    'name' => 'Admin User',
    'email' => 'admin@ereklamo.local',
    'password' => Hash::make('password123'),
    'department_id' => $dept->id,
    'position' => 'System Administrator',
    'is_admin' => true,
    'is_active' => true,
]);

// Create sample citizen
$citizen = Citizen::create([
    'name' => 'John Doe',
    'email' => 'citizen@ereklamo.local',
    'password' => Hash::make('password123'),
    'phone' => '555-1234',
    'address' => 'Sample Address',
]);

exit;
```

#### Create Sample Departments & Categories

```bash
php artisan tinker
```

```php
use App\Models\Department;
use App\Models\Category;

$depts = [
    'Public Works',
    'Sanitation',
    'Peace & Order',
    'Electrical',
];

foreach ($depts as $name) {
    $dept = Department::create(['name' => $name]);
    Category::create([
        'name' => 'General Issue',
        'department_id' => $dept->id,
    ]);
}

exit;
```

## 📁 Project Structure

```
e-reklamo/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── PersonnelController.php
│   │   │   ├── CitizenController.php
│   │   │   ├── ComplaintController.php
│   │   │   └── AnalyticsController.php
│   │   └── Middleware/
│   ├── Models/
│   │   ├── Personnel.php
│   │   ├── Citizen.php
│   │   ├── Complaint.php
│   │   ├── ComplaintUpdate.php
│   │   ├── Department.php
│   │   └── Category.php
│
├── database/
│   ├── migrations/
│   │   ├── 2026_05_13_000001_create_personnel_table.php
│   │   ├── 2026_05_13_000002_create_citizens_table.php
│   │   ├── 2026_05_13_000003_refactor_complaints_table.php
│   │   └── 2026_05_13_000004_create_complaint_updates_table.php
│   └── seeders/
│
├── resources/
│   ├── js/
│   │   ├── Layouts/
│   │   │   ├── PersonnelLayout.jsx
│   │   │   └── CitizenLayout.jsx
│   │   ├── Pages/
│   │   │   ├── Personnel/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── ComplaintsList.jsx
│   │   │   │   └── Analytics.jsx
│   │   │   └── Citizen/
│   │   │       ├── Dashboard.jsx
│   │   │       ├── FileComplaint.jsx
│   │   │       └── ComplaintDetail.jsx
│   │   └── Components/
│   └── css/
│
├── routes/
│   ├── web.php
│   └── auth.php
│
├── config/
│   └── auth.php (updated with personnel & citizen guards)
│
└── public/
    └── storage/ (for uploaded photos)
```

## 🔗 API Endpoints

### Personnel Routes (with `personnel` guard)
```
GET    /personnel/dashboard
GET    /personnel/complaints
GET    /personnel/complaints/{complaint}
POST   /personnel/complaints/{complaint}/status
POST   /personnel/complaints/{complaint}/assign
POST   /personnel/complaints/{complaint}/priority
DELETE /personnel/complaints/{complaint}
GET    /personnel/analytics
GET    /personnel/analytics/export-pdf
GET    /personnel/personnel
POST   /personnel/personnel
PATCH  /personnel/personnel/{personnel}
DELETE /personnel/personnel/{personnel}
```

### Citizen Routes (with `citizen` guard)
```
GET    /citizen/dashboard
POST   /citizen/complaints
GET    /citizen/complaints
GET    /citizen/complaints/{complaint}
PATCH  /citizen/profile
```

## 🎯 User Workflows

### Personnel Portal

1. **Login** → Dashboard with statistics
2. **Manage Complaints** → View/Update/Assign (3-click rule)
3. **Analytics** → Filter and view reports
4. **Personnel Management** → Add/Edit/Delete staff (Admin)

### Citizen Portal

1. **Login** → Dashboard with my complaints
2. **File Complaint** → 1-click from sidebar
3. **Track Status** → Real-time updates
4. **View Details** → Full complaint history

## 🎨 Customization

### Theme Colors

Edit `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      'personnel-primary': '#1E3A8A',
      'citizen-primary': '#059669',
      'accent': '#10B981',
    }
  }
}
```

### Database Schema

See `IMPLEMENTATION_GUIDE.md` for detailed schema information.

## 🔒 Security

- CSRF protection enabled
- Separate authentication guards
- Role-based access control (Admin checks)
- Password hashing with bcrypt
- Email verification support
- Secure file uploads
- SQL injection prevention (Eloquent ORM)

## 🧪 Testing

```bash
# Run all tests
php artisan test

# Run with coverage
php artisan test --coverage

# Run specific test
php artisan test --filter=test_name
```

## 📊 Database Relationships

```
Citizens (1) ──→ (Many) Complaints
Personnel (1) ──→ (Many) Complaints (assigned_to)
Personnel (1) ──→ (Many) ComplaintUpdates
Complaints (1) ──→ (Many) ComplaintUpdates
Departments (1) ──→ (Many) Categories
Departments (1) ──→ (Many) Personnel
Complaints (Many) ──→ (1) Department
Complaints (Many) ──→ (1) Category
```

## 🐛 Troubleshooting

### Photos Not Displaying
```bash
php artisan storage:link
```

### Clear Cache
```bash
php artisan cache:clear
php artisan config:clear
php artisan view:clear
```

### Database Issues
```bash
php artisan migrate:fresh --seed
```

### Permissions Error
```bash
chmod -R 775 storage bootstrap/cache
```

## 📦 Dependencies

### Backend
- Laravel 12.0
- Laravel Sanctum (for API)
- Inertia.js (for React integration)

### Frontend
- React 18.2
- Tailwind CSS 3.2
- Inertia.js React adapter
- Axios for HTTP requests

## 🚀 Production Deployment

1. Set `APP_DEBUG=false` in `.env`
2. Set `APP_ENV=production`
3. Run `php artisan config:cache`
4. Run `php artisan route:cache`
5. Run `npm run build` (production build)
6. Configure proper database backups
7. Set up proper logging
8. Configure mail service for notifications
9. Set up storage for cloud uploads (optional)

## � Project Information

### Project Type
- **Individual Project** - Personal development portfolio project
- **Status**: Complete and production-ready
- **Version**: 1.0.0
- **License**: MIT

### Key Statistics
- **Total Models**: 6 (Personnel, Citizen, Complaint, ComplaintUpdate, Department, Category)
- **Total Controllers**: 4 (PersonnelController, CitizenController, ComplaintController, AnalyticsController)
- **Total Routes**: 20+ endpoints across dual portals
- **Total Components**: 8 React components
- **Database Tables**: 8 tables with relationships
- **Lines of Code**: ~2000+ lines

### Technology Stack Summary
| Layer | Technology |
|-------|------------|
| Backend | Laravel 12.0, PHP 8.2+ |
| Frontend | React 18.2, Inertia.js |
| Styling | Tailwind CSS 3.2 |
| Database | MySQL 8.0+ / PostgreSQL 12+ |
| Authentication | Laravel Guards (Session-based) |
| Deployment | Apache/Nginx + PHP-FPM |

### File Organization

**Backend Structure:**
```
app/
├── Http/Controllers/
│   ├── PersonnelController.php    (Personnel management)
│   ├── CitizenController.php       (Citizen operations)
│   ├── ComplaintController.php     (Complaint CRUD)
│   └── AnalyticsController.php     (Analytics & reports)
├── Models/
│   ├── Personnel.php              (Staff user model)
│   ├── Citizen.php                (Public user model)
│   ├── Complaint.php              (Complaint tracking)
│   ├── ComplaintUpdate.php        (Audit trail)
│   ├── Department.php             (Departments)
│   └── Category.php               (Categories)
└── Http/Middleware/
    └── HandleInertiaRequests.php
```

**Frontend Structure:**
```
resources/js/
├── Layouts/
│   ├── PersonnelLayout.jsx        (Blue theme)
│   └── CitizenLayout.jsx          (Green theme)
└── Pages/
    ├── Personnel/
    │   ├── Dashboard.jsx          (Stats & overview)
    │   ├── ComplaintsList.jsx     (Management)
    │   └── Analytics.jsx          (Reports & charts)
    └── Citizen/
        ├── Dashboard.jsx          (My complaints)
        ├── FileComplaint.jsx      (File new)
        └── ComplaintDetail.jsx    (Track status)
```

**Assets & Public Files:**
```
public/
├── eReklamo_logo.png              ← Logo for branding
├── index.php                      (Laravel entry point)
└── build/
    └── assets/                    (Compiled JS/CSS)
```

## 📂 Asset Files Location

### Logo Placement
The application logo (`eReklamo_logo.png`) should be placed in the following location:

```
public/eReklamo_logo.png
```

**Usage locations in application:**
- Personnel Portal Navigation: `resources/js/Layouts/PersonnelLayout.jsx`
- Citizen Portal Navigation: `resources/js/Layouts/CitizenLayout.jsx`

**To add the logo:**

1. Place your logo file at `public/eReklamo_logo.png`
2. Update layout components if dimensions differ:
   ```jsx
   <img src="/eReklamo_logo.png" alt="e-Reklamo" className="h-10 w-auto" />
   ```

**Recommended Specifications:**
- Format: PNG (transparent background) or SVG
- Dimensions: 200x100px minimum
- File size: < 100KB
- Color scheme: Works with both blue and green themes

### Other Asset Directories
- **Images**: `public/images/`
- **Documents**: `storage/app/public/documents/`
- **Complaint Photos**: `storage/app/public/complaints/`
- **PDF Reports**: `storage/app/public/reports/`

## �📞 Support & Documentation

- **Laravel Docs**: https://laravel.com/docs
- **React Docs**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com
- **Inertia.js**: https://inertiajs.com
- **Project Documentation**: See `DOCUMENTATION_INDEX.md`

## 📝 Additional Features (Coming Soon)

- [ ] SMS Notifications
- [ ] Email Notifications
- [ ] Real-time WebSocket Updates
- [ ] Advanced PDF Reports
- [ ] Integration with external APIs
- [ ] Mobile App (React Native)
- [ ] Multilingual Support

---

**Made with ❤️ as an Individual Project**  
**e-Reklamo v1.0.0** | May 13, 2026
- [ ] Advanced User Roles

## 📄 License

This project is proprietary and confidential.

## 👥 Contributors

- Development Team

---

**Version**: 1.0.0  
**Last Updated**: May 13, 2026  
**Status**: Production Ready ✅

For detailed implementation information, see `IMPLEMENTATION_GUIDE.md`
