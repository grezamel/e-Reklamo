# e-Reklamo Architecture & Component Structure

## 🏗️ System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION ENTRY                        │
│              (routes/web.php - Route Definition)            │
└────────────────┬────────────────────────────┬───────────────┘
                 │                            │
    ┌────────────▼──────────┐    ┌────────────▼──────────┐
    │   PERSONNEL PORTAL    │    │   CITIZEN PORTAL      │
    │    (Blue #1E3A8A)     │    │   (Green #059669)     │
    └────────────┬──────────┘    └────────────┬──────────┘
                 │                            │
         ┌───────┴────────┬──────────────────┼─────────────┐
         │                │                  │             │
    ┌────▼────┐    ┌─────▼──┐        ┌──────▼──┐    ┌────▼────┐
    │Dashboard│    │Analytics│        │Dashboard│    │FileForm │
    └────┬────┘    └─────┬──┘        └──────┬──┘    └────┬────┘
         │                │                  │            │
         ├─→ Complaints   ├─→ Performance    ├─→ MyCompts ├─→ Submit
         ├─→ Personnel    ├─→ Filters        ├─→ Track   ├─→ Upload
         └─→ Profile      └─→ Export PDF     └─→ Details └─→ Anon Opt
```

## 📁 Component Hierarchy

### Personnel Portal Structure

```
PersonnelLayout.jsx (Main Wrapper)
├── Navigation Bar
│   ├── Logo & Brand
│   ├── User Menu
│   └── Logout Button
├── Sidebar Navigation
│   ├── Dashboard Link
│   ├── Complaints Link
│   ├── Analytics Link
│   └── Personnel Link (Admin)
└── Main Content Area
    ├── Personnel/Dashboard.jsx
    │   ├── Stats Cards (4)
    │   └── Quick Action Cards (3)
    ├── Personnel/ComplaintsList.jsx
    │   ├── Filter Section (5 filters)
    │   └── Complaints Table
    │       ├── Reference Column
    │       ├── Title Column
    │       ├── Complainant Column
    │       ├── Status Badge
    │       ├── Priority Badge
    │       ├── Department Column
    │       ├── Date Column
    │       └── Actions (View Button)
    ├── Personnel/Analytics.jsx
    │   ├── Filter Section
    │   ├── Key Metrics Cards (3)
    │   ├── Status Distribution Cards (6)
    │   ├── Charts Section
    │   │   ├── Priority Distribution Chart
    │   │   ├── Department Performance Chart
    │   │   └── Daily Trend Chart
    │   └── Export Button
    └── Personnel/ComplaintDetail.jsx (placeholder)
        ├── Header with Ref Number
        ├── Status & Priority Badges
        ├── Basic Info Grid
        ├── Description Section
        ├── Photos Gallery
        ├── Status Timeline
        └── Remarks/Updates Section
```

### Citizen Portal Structure

```
CitizenLayout.jsx (Main Wrapper)
├── Navigation Bar
│   ├── Logo & Brand
│   ├── User Menu
│   └── Logout Button
├── Sidebar Navigation
│   ├── Dashboard Link
│   ├── My Complaints Link
│   └── File Complaint Button (CTA)
└── Main Content Area
    ├── Citizen/Dashboard.jsx
    │   ├── Header with CTA Button
    │   ├── Stats Cards (4)
    │   └── Recent Complaints Table
    │       ├── Reference Column
    │       ├── Title Column
    │       ├── Status Badge
    │       ├── Department Column
    │       ├── Date Column
    │       └── View Action
    ├── Citizen/FileComplaint.jsx
    │   ├── Anonymous Option (Checkbox)
    │   ├── Title Input
    │   ├── Description Textarea
    │   ├── Department Select
    │   │   └── Cascades to Category
    │   ├── Category Select
    │   ├── Location Input
    │   ├── Photo Upload
    │   │   ├── Drag & Drop Area
    │   │   └── Photo Preview Grid
    │   ├── Preview Gallery (Dynamic)
    │   ├── Remove Button Per Photo
    │   └── Submit & Cancel Buttons
    └── Citizen/ComplaintDetail.jsx
        ├── Back Button
        ├── Header Section
        │   ├── Title
        │   ├── Reference Number
        │   ├── Status Badge
        │   └── Priority Badge
        ├── Basic Info Grid
        ├── Anonymous Notice (if applicable)
        ├── Description Section
        ├── Photos Gallery (Multiple Images)
        ├── Status Timeline (4 Steps)
        │   ├── Submitted
        │   ├── Acknowledged
        │   ├── In Progress
        │   └── Resolved
        └── Remarks Section
```

## 🔗 Data Flow

### Complaint Filing Flow

```
User Input (FileComplaint.jsx)
    ↓
Form Validation
    ↓
POST /citizen/complaints
    ↓
ComplaintController::store()
    ↓
Generate Reference Number
    ↓
Handle Photo Uploads
    ↓
Create Complaint Record
    ↓
Create Initial Update Record
    ↓
Redirect with Success Message
```

### Complaint Status Update Flow

```
Personnel View (ComplaintsList.jsx)
    ↓
Click View → ComplaintDetail.jsx
    ↓
Update Status Form
    ↓
POST /personnel/complaints/{id}/status
    ↓
ComplaintController::updateStatus()
    ↓
Validate Request
    ↓
Update Complaint Record
    ↓
Update Timestamps
    ↓
Create Update Record (Audit Trail)
    ↓
Redirect with Success
```

### Analytics Flow

```
Personnel Dashboard
    ↓
Navigate to Analytics
    ↓
GET /personnel/analytics
    ↓
AnalyticsController::dashboard()
    ↓
Parse Filters (date, dept, status, category)
    ↓
Query Complaints Table
    ↓
Calculate Metrics
    ├─→ Resolution Rate
    ├─→ Response Time
    └─→ Resolution Time
    ↓
Group Data for Charts
    ├─→ By Priority
    ├─→ By Department
    └─→ By Daily Trend
    ↓
Render Analytics.jsx
    ↓
Display Charts & Metrics
```

## 🗄️ Database Schema Relationships

```
┌──────────────┐         ┌──────────────┐
│  Personnel   │ 1   ∞   │  Complaints  │
│              │◄────────┤ (assigned_to)│
│  id          │         │              │
│  email       │         │  id          │
│  name        │         │  citizen_id  │
│  dept_id     │         │  ref_number  │
└──────────────┘         └──────┬───────┘
       │                        │
       │ (1)                    │ (∞)
       │                        │
       │                   ┌────▼───────┐
       │                   │  Complaint  │
       │                   │  Updates    │
       │                   │             │
       │                   │  id         │
       └──────────┬────────┤  personnel  │
                  │        │  complaint  │
                  └────────┤  status     │
                   Foreign │  remarks    │
                   Keys    └─────────────┘

┌──────────────┐         ┌──────────────┐
│  Citizens    │ 1   ∞   │  Complaints  │
│              │◄────────┤ (citizen_id) │
│  id          │         │              │
│  email       │         │  id          │
│  name        │         │  title       │
│  phone       │         │  status      │
│  address     │         │  priority    │
└──────────────┘         └──────┬───────┘
                                │
                           (1) ┌┴──────────┐
                               │ (∞)       │
                          ┌────▼──┐  ┌────▼───┐
                          │Dept   │  │Category │
                          │(fk)   │  │ (fk)    │
                          └───────┘  └─────────┘
```

## 🎯 State Management

### React State Usage

```
ComplaintsList.jsx
├── filters (useState)
│   ├── status
│   ├── priority
│   ├── department
│   └── search
└── Filterable Results

FileComplaint.jsx
├── data (useForm)
│   ├── title
│   ├── description
│   ├── category_id
│   ├── department_id
│   ├── location
│   ├── photos[]
│   └── is_anonymous
├── photoPreview (useState)
├── categories (useState)
└── Form Actions

Analytics.jsx
├── data (useForm)
│   ├── date_range
│   ├── department
│   ├── status
│   └── category
├── Props Data
│   ├── metrics
│   ├── byPriority
│   ├── dailyData
│   └── byDepartment
└── Computed Values
    ├── Charts Data
    └── Filtered Results
```

## 🎨 Theming System

```
Global Theme Variables
├── Personnel Portal
│   ├── Primary Color: #1E3A8A (Blue)
│   ├── Accent Color: #10B981 (Green)
│   └── Applied to:
│       ├── Navigation
│       ├── Buttons
│       ├── Links
│       └── Focus States
├── Citizen Portal
│   ├── Primary Color: #059669 (Green)
│   ├── Accent Color: #10B981 (Green)
│   └── Applied to:
│       ├── Navigation
│       ├── Buttons
│       ├── Links
│       └── Focus States
└── Neutral Theme
    ├── Backgrounds: #F9FAFB
    ├── Text: #1F2937
    ├── Borders: #E5E7EB
    └── Applied Globally

Status Badge Colors
├── Pending: Red (#EF4444)
├── Acknowledged: Blue (#3B82F6)
├── In Progress: Yellow (#FBBF24)
├── Resolved: Green (#10B981)
└── Rejected: Gray (#6B7280)

Priority Indicator Colors
├── Low: Blue (#3B82F6)
├── Medium: Yellow (#FBBF24)
├── High: Orange (#F97316)
└── Urgent: Red (#EF4444)
```

## 📱 Responsive Breakpoints

```
Mobile (< 768px)
├── Single Column Layout
├── Hamburger Menu
├── Stacked Forms
├── Full-width Buttons
└── Vertical Tables

Tablet (768px - 1024px)
├── Two Column Layout
├── Sidebar Visible
├── Multi-column Forms
├── Responsive Grid
└── Horizontal Scrolling Tables

Desktop (> 1024px)
├── Multi-column Layout
├── Visible Sidebar
├── Optimized Spacing
├── Full-size Components
└── Horizontal Tables
```

## 🔐 Authentication Flow

```
┌─────────────┐
│ User Visits │
│  Homepage   │
└──────┬──────┘
       │
       ├─→ Redirect to /login
       │
       ├─→ Select Portal
       │   ├─→ Personnel Login
       │   │   ├─→ POST /login (guard: personnel)
       │   │   ├─→ Verify against Personnel table
       │   │   └─→ Redirect to /personnel/dashboard
       │   │
       │   └─→ Citizen Login
       │       ├─→ POST /login (guard: citizen)
       │       ├─→ Verify against Citizen table
       │       └─→ Redirect to /citizen/dashboard
       │
       └─→ Middleware Checks
           ├─→ auth:personnel
           ├─→ auth:citizen
           └─→ verified (if required)
```

## 📊 API Endpoint Groups

```
Personnel Routes (/personnel/*)
├── Dashboard
│   └── GET /personnel/dashboard
├── Complaints
│   ├── GET /personnel/complaints
│   ├── GET /personnel/complaints/{id}
│   ├── POST /personnel/complaints/{id}/status
│   ├── POST /personnel/complaints/{id}/assign
│   ├── POST /personnel/complaints/{id}/priority
│   └── DELETE /personnel/complaints/{id}
├── Analytics
│   ├── GET /personnel/analytics
│   └── GET /personnel/analytics/export-pdf
├── Personnel (Admin)
│   ├── GET /personnel/personnel
│   ├── POST /personnel/personnel
│   ├── PATCH /personnel/personnel/{id}
│   └── DELETE /personnel/personnel/{id}
└── Profile
    ├── GET /personnel/profile
    ├── PATCH /personnel/profile
    └── DELETE /personnel/profile

Citizen Routes (/citizen/*)
├── Dashboard
│   └── GET /citizen/dashboard
├── Complaints
│   ├── POST /citizen/complaints
│   ├── GET /citizen/complaints
│   └── GET /citizen/complaints/{id}
├── Profile
│   ├── GET /citizen/profile
│   ├── PATCH /citizen/profile
│   └── DELETE /citizen/profile
└── Statistics
    └── GET /citizen/stats
```

## 🔄 Component Communication

```
Parent Components (Pages)
├── Pass Props Down
│   ├── data
│   ├── stats
│   ├── filters
│   └── callbacks
└── Receive Events Up
    ├── onFilterChange
    ├── onSubmit
    ├── onUpdate
    └── onDelete

Layouts (PersonnelLayout, CitizenLayout)
├── Provide
│   ├── Navigation
│   ├── Sidebar
│   ├── Theme Context
│   └── User Session
└── Render
    └── {children}

Controllers (Backend)
├── Receive
│   ├── Request Data
│   ├── User Info
│   └── Query Params
└── Return
    ├── Inertia::render()
    ├── JSON Response
    └── Redirects
```

---

**This architecture ensures:**
- ✅ Clean separation of concerns
- ✅ Scalable component structure
- ✅ Easy to test and maintain
- ✅ Responsive across all devices
- ✅ Professional user experience
- ✅ Secure authentication
- ✅ Efficient data flow
