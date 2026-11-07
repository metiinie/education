# Frappe Education - Frontend (Student Portal)

This directory contains the modern **Single Page Application (SPA)** for the Frappe Education Student Portal, built with **Vue 3**, **Vite**, **Tailwind CSS**, and **Frappe UI** (`frappe-ui`).

---

## Tech Stack

- **Framework**: [Vue 3](https://vuejs.org/) (Composition API, `<script setup>`)
- **UI Components**: [Frappe UI](https://github.com/frappe/frappe-ui)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & Inter font family
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **Routing**: [Vue Router 4](https://router.vuejs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Calendar & Icons**: Qalendar, Feather Icons, Lucide Icons

---

## Directory Structure

```
frontend/
├── public/                 # Vite static assets (favicon, images)
├── src/
│   ├── assets/             # Inter web fonts and global CSS
│   ├── components/         # Reusable Vue components
│   │   ├── AttendanceDetail.vue     # Daily attendance breakdown modal
│   │   ├── Calendar.vue             # Timetable calendar display
│   │   ├── FeesPaymentDialog.vue    # Fee checkout & payment integration
│   │   ├── Navbar.vue               # Top navigation header
│   │   ├── NewLeave.vue             # Leave application modal form
│   │   ├── ProfileModal.vue         # Student profile details dialog
│   │   ├── Sidebar.vue              # Main portal navigation sidebar
│   │   └── UserDropdown.vue         # User profile menu & logout
│   ├── pages/              # Portal page views (Routed)
│   │   ├── Attendance.vue  # Monthly & term attendance overview
│   │   ├── Fees.vue        # Invoices, fee structures, and receipts
│   │   ├── Grades.vue      # Academic report cards & quiz results
│   │   ├── Home.vue        # Student dashboard & announcements
│   │   ├── Leaves.vue      # Submitted leave history & status
│   │   ├── Login.vue       # Authentication login form
│   │   ├── Schedule.vue    # Weekly class & subject schedule
│   │   └── SchoolDiary.vue # Daily notices & homework diary
│   ├── stores/             # Pinia / Reactive state stores
│   │   ├── session.js      # Login/logout authentication state
│   │   ├── student.js      # Student profile & enrollment context
│   │   ├── user.js         # Frappe user record
│   │   └── leave.js        # Leave application management
│   ├── utils/              # Helper utilities and date formatters
│   ├── App.vue             # Root Vue component with main layout
│   ├── index.css           # Tailwind CSS directives & global resets
│   ├── main.js             # Vue app bootstrapping & plugin setup
│   └── router.js           # Client-side route declarations
├── index.html              # HTML shell template
├── package.json            # Node dependencies and build scripts
├── postcss.config.js       # PostCSS configuration for Tailwind
├── tailwind.config.js      # Tailwind theme configuration
├── vite.config.js          # Vite configuration & proxy settings
└── yarn.lock               # Deterministic dependency lockfile
```

---

## Available Pages & Routes

| Route | Page | Description |
| :--- | :--- | :--- |
| `/` | `Home.vue` | Dashboard with upcoming classes, notifications, and overview |
| `/login` | `Login.vue` | Frappe authentication login view |
| `/schedule` | `Schedule.vue` | Weekly schedule and timetable |
| `/attendance` | `Attendance.vue` | Student attendance tracker and percentage metrics |
| `/fees` | `Fees.vue` | Outstanding fees, invoices, and online payment dialog |
| `/grades` | `Grades.vue` | Assessment results, courses, and grade summaries |
| `/leaves` | `Leaves.vue` | Leave applications and status tracking |
| `/diary` | `SchoolDiary.vue` | School diary and announcements |

---

## Development Setup

### 1. Install Dependencies
Always use `yarn` inside this directory:
```bash
cd frontend
yarn
```

### 2. Configure Development Proxy
In development, Vite proxies API requests to your local Frappe server (typically on `http://education.localhost:8000` or `http://localhost:8000`).

Ensure your Frappe site's `site_config.json` contains:
```json
"ignore_csrf": 1
```
This enables authenticated API communication between Vite (port `5173`) and Frappe (port `8000`).

### 3. Run Development Server
```bash
yarn dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Production Build Pipeline

When building for production, the Vite bundle is compiled directly into the backend directory and entry point:

```bash
yarn build
```

This script:
1. Compiles optimized JS/CSS bundles to `../education/public/frontend/` with public path `/assets/education/frontend/`.
2. Copies `index.html` to `../education/www/student-portal.html`.
3. In production, Frappe serves the Single Page Application directly from the `/student-portal` route.
