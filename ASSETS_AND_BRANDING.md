# 🎨 e-Reklamo Assets & Branding Guide

Complete guide for managing assets, logos, and branding in the e-Reklamo application.

## 📁 Asset Directory Structure

```
public/
├── eReklamo_logo.png              ← Main logo file
├── favicon.ico                    ← Browser tab icon
├── images/
│   ├── icons/                     ← UI icons
│   ├── illustrations/             ← Decorative images
│   └── backgrounds/               ← Background patterns
└── build/
    └── assets/                    ← Compiled JS/CSS (auto-generated)

storage/
├── app/
│   └── public/
│       ├── complaints/            ← Uploaded complaint photos
│       ├── documents/             ← PDF exports
│       └── reports/               ← Generated reports
└── logs/                          ← Application logs
```

## 🏷️ Logo File Placement

### Primary Logo
**Location**: `public/eReklamo_logo.png`

**Specifications**:
- Format: PNG with transparency, SVG, or JPG
- Recommended Dimensions: 200×100px (minimum)
- File Size: < 100KB
- Color Profile: RGB
- Background: Transparent (PNG) recommended

**Installation Steps**:

1. **Prepare your logo**
   - Create or obtain your logo file
   - Ensure transparent background (PNG) for best results
   - Name it: `eReklamo_logo.png`

2. **Place in public directory**
   ```bash
   cp /path/to/eReklamo_logo.png public/eReklamo_logo.png
   ```

3. **Verify placement**
   ```bash
   ls -la public/eReklamo_logo.png
   ```

### Logo Usage in Components

**Personnel Portal Layout** (`resources/js/Layouts/PersonnelLayout.jsx`):
```jsx
<img 
  src="/eReklamo_logo.png" 
  alt="e-Reklamo" 
  className="h-10 w-auto"
/>
```

**Citizen Portal Layout** (`resources/js/Layouts/CitizenLayout.jsx`):
```jsx
<img 
  src="/eReklamo_logo.png" 
  alt="e-Reklamo" 
  className="h-10 w-auto"
/>
```

**Customizing Logo Size**:
- Change `h-10` (height: 40px) to desired Tailwind height class:
  - `h-8` = 32px
  - `h-10` = 40px (default)
  - `h-12` = 48px
  - `h-16` = 64px

## 🎨 Color Scheme & Branding

### Official Colors

**Personnel Portal Theme**:
- Primary Blue: `#1E3A8A` (dark blue)
- Secondary: `#3B82F6` (medium blue)
- Accent: `#10B981` (green)

**Citizen Portal Theme**:
- Primary Green: `#059669` (dark green)
- Secondary: `#10B981` (medium green)
- Accent: `#06B6D4` (cyan)

### Tailwind CSS Color Usage

**Personnel Theme** (`resources/js/Layouts/PersonnelLayout.jsx`):
```jsx
className="bg-blue-900"      // #1E3A8A
className="bg-blue-500"      // #3B82F6
className="bg-green-500"     // #10B981
```

**Citizen Theme** (`resources/js/Layouts/CitizenLayout.jsx`):
```jsx
className="bg-green-700"     // #059669
className="bg-green-500"     // #10B981
className="bg-cyan-500"      // #06B6D4
```

## 📸 Complaint Photo Uploads

### Storage Configuration

**Directory**: `storage/app/public/complaints/`

**Setup**:

1. **Create storage link** (runs on setup):
   ```bash
   php artisan storage:link
   ```

2. **Verify symlink**:
   ```bash
   ls -la public/storage
   ```

### Photo Upload Process

**In `resources/js/Pages/Citizen/FileComplaint.jsx`**:
```jsx
const handlePhotoUpload = (e) => {
  const files = e.target.files;
  data.photos.push(...files);  // Add to form data
};

const handleSubmit = () => {
  const formData = new FormData();
  data.photos.forEach((photo, index) => {
    formData.append(`photos[${index}]`, photo);
  });
  post(route('citizen.complaints.store'), { forceFormData: true });
};
```

### Photo Storage Paths

- **Uploaded**: `storage/app/public/complaints/`
- **Access URL**: `storage/complaints/{filename}`
- **Max File Size**: 5MB (configure in `config/filesystems.php`)

## 📄 Document & Report Generation

### PDF Storage

**Directory**: `storage/app/public/reports/`

**Controller Method** (`app/Http/Controllers/AnalyticsController.php`):
```php
public function exportPDF(Request $request)
{
    $complaints = Complaint::query()
        ->where('department_id', $request->department_id)
        ->get();

    // Generate PDF using dompdf or similar
    return PDF::view('reports.complaints', [
        'complaints' => $complaints
    ])->download('complaints-report.pdf');
}
```

## 🖼️ Favicon Setup

### Add Favicon

**Location**: `public/favicon.ico`

**Steps**:

1. **Create favicon**
   - Convert your logo to favicon (use favicon generator)
   - Save as `favicon.ico`

2. **Place in public directory**
   ```bash
   cp /path/to/favicon.ico public/favicon.ico
   ```

3. **Add to HTML** (in `resources/views/app.blade.php`):
   ```html
   <link rel="icon" type="image/x-icon" href="/favicon.ico">
   ```

## 🎭 Custom Icons & Illustrations

### Adding Custom Icons

**Directory**: `public/images/icons/`

**Organization**:
```
public/images/
├── icons/
│   ├── check-mark.svg
│   ├── warning.svg
│   ├── error.svg
│   └── success.svg
├── illustrations/
│   ├── empty-state.svg
│   ├── no-data.svg
│   └── welcome.svg
└── backgrounds/
    └── pattern.svg
```

**Usage in Components**:
```jsx
<img src="/images/icons/check-mark.svg" alt="Success" className="w-6 h-6" />
```

## 📱 Responsive Image Optimization

### Image Formats

- **Logo**: PNG (transparent) or SVG (scalable)
- **Icons**: SVG (recommended) or PNG
- **Photos**: JPG (compressed) or WebP
- **Illustrations**: SVG or PNG

### Responsive Images Example

```jsx
<picture>
  <source srcSet="/images/logo-mobile.png" media="(max-width: 640px)" />
  <source srcSet="/images/logo-desktop.png" media="(min-width: 641px)" />
  <img src="/images/logo-desktop.png" alt="e-Reklamo" className="w-auto h-10" />
</picture>
```

## 🔒 Asset Security

### Permissions

**Ensure proper file permissions**:
```bash
# Public directory (readable)
chmod 755 public/

# Public assets (readable)
chmod 644 public/*.png
chmod 644 public/*.ico

# Storage directory (writable)
chmod 755 storage/app/public/
chmod 755 storage/app/public/complaints/
```

### File Upload Validation

**In Controller** (`app/Http/Controllers/ComplaintController.php`):
```php
protected function validatePhotos($request)
{
    $request->validate([
        'photos.*' => 'image|mimes:jpeg,png,jpg,gif|max:5120' // 5MB max
    ]);
}
```

## 📦 Build & Deployment

### Asset Compilation

**Development**:
```bash
npm run dev          # Compile with hot reload
```

**Production**:
```bash
npm run build        # Minify and optimize
```

### Deploying Assets

1. **Upload public files**:
   ```bash
   rsync -avz public/ user@server:/var/www/app/public/
   ```

2. **Set permissions**:
   ```bash
   chmod -R 755 /var/www/app/public/
   chmod -R 644 /var/www/app/public/*
   ```

3. **Create storage symlink** (on server):
   ```bash
   php artisan storage:link
   ```

## 🐛 Troubleshooting Assets

### Logo Not Showing

**Problem**: Logo appears as broken image in navigation

**Solutions**:
1. Verify file exists: `ls -la public/eReklamo_logo.png`
2. Check file permissions: `chmod 644 public/eReklamo_logo.png`
3. Clear browser cache (Ctrl+Shift+Delete)
4. Verify path in layout component matches `src="/eReklamo_logo.png"`

### Photos Not Uploading

**Problem**: Complaint photos fail to upload

**Solutions**:
1. Check storage directory permissions: `chmod 755 storage/app/public/`
2. Verify symlink exists: `ls -la public/storage`
3. Check file size limits in `php.ini`:
   ```ini
   upload_max_filesize = 50M
   post_max_size = 50M
   ```
4. Clear Laravel cache: `php artisan cache:clear`

### PDF Export Not Working

**Problem**: "Class not found" error for PDF generation

**Solutions**:
1. Install dompdf: `composer require barryvdh/laravel-dompdf`
2. Verify controller includes: `use Barryvdh\DomPDF\Facade\Pdf;`
3. Check `storage/logs/laravel.log` for detailed errors

## 📋 Asset Checklist

Before deployment, verify:

- [ ] Logo placed at `public/eReklamo_logo.png`
- [ ] Logo dimensions: 200×100px minimum
- [ ] Favicon placed at `public/favicon.ico`
- [ ] Storage directory writable: `storage/app/public/`
- [ ] Storage symlink created: `php artisan storage:link`
- [ ] File permissions correct: `chmod 755 storage/app/public/`
- [ ] CSS/JS compiled: `npm run build`
- [ ] Assets optimized for production
- [ ] Image formats supported (PNG, JPG, SVG)
- [ ] File size limits configured in `php.ini`

## 🎯 Best Practices

1. **Use SVG for logos** - Scalable and smaller file size
2. **Optimize images** - Use TinyPNG or ImageOptim
3. **Use WebP format** - Better compression for photos
4. **Cache busting** - Add version query strings: `src="/logo.png?v=1.0"`
5. **CDN deployment** - Serve assets from CDN in production
6. **Lazy loading** - Use lazy loading for below-fold images
7. **Alt text** - Always provide descriptive alt text
8. **Accessibility** - Ensure images are accessible

## 📚 References

- [Tailwind CSS Images](https://tailwindcss.com/docs/content/images)
- [Laravel Storage](https://laravel.com/docs/11.x/filesystem)
- [Web Image Optimization](https://web.dev/optimize-images/)
- [SVG Best Practices](https://www.smashingmagazine.com/2019/05/svg-design-coding-gotchas/)

---

**Last Updated**: May 13, 2026  
**Version**: 1.0.0

