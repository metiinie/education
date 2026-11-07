# Frappe Education - Backend

This directory contains the core **Python backend application** for Frappe Education, built on top of the [Frappe Framework](https://frappeframework.com) and [ERPNext](https://erpnext.com).

> **Architectural Note on Naming:**  
> In the Frappe ecosystem, the backend module folder name (`education/`) matches the Python package name and `app_name = "education"` declared in `hooks.py` and `pyproject.toml`. Frappe dynamically resolves controllers using `import education` and `frappe.get_module("education.education.doctype...")`.

---

## Architecture Overview

```
education/                      # Frappe Python Application Package (Backend)
├── api/                        # Custom REST & RPC API endpoints
│   ├── permissions.py          # App & portal permission checks
│   └── session.py              # User session helpers
├── config/                     # Frappe Desk & module configurations
│   ├── desktop.py              # Desktop icon definition
│   └── docs.py                 # Module documentation settings
├── education/                  # Core domain models and business logic
│   ├── doctype/                # 50+ Frappe DocTypes (Schemas & Python controllers)
│   ├── report/                 # Analytics and tabular reports
│   ├── web_form/               # Portal admission and application forms
│   └── workspace/              # Frappe Desk workspaces and dashboards
├── overrides/                  # DocType event hooks & class overrides
├── patches/                    # Schema and data migration scripts (`patches.txt`)
├── public/                     # Static assets served by the Frappe web server
│   ├── frontend/               # Production build output from the Vue 3 SPA
│   ├── js/                     # Desk JavaScript extensions
│   └── edu-logo.svg            # Education logo
├── templates/                  # Jinja2 web templates
├── translations/               # Multilingual translation dictionaries (CSV)
├── www/                        # Server-rendered portal pages & SPA entry points
│   └── student-portal.html     # Entry point for the Vue 3 Student Portal
├── hooks.py                    # Frappe app lifecycle hooks, routes, and desk configs
├── install.py                  # Post-installation fixtures and setups
└── modules.txt                 # Module list registered with Frappe
```

---

## Domain Models (DocTypes)

The backend exposes over 50 DocTypes categorized into key educational domains:

| Domain | Key DocTypes |
| :--- | :--- |
| **Academic Setup** | `Academic Year`, `Academic Term`, `Academic Plan`, `Intake Year` |
| **Admissions & Students** | `Student`, `Student Admission`, `Admission Register`, `Student Applicant`, `Student Category`, `Guardian`, `Student Guardian` |
| **Programs & Courses** | `Program`, `Course`, `Subject`, `Course Enrollment`, `Subject Registration`, `Topic` |
| **Assessments & Quizzes** | `Assessment Plan`, `Assessment Result`, `Assessment Group`, `Grading Scale`, `Grade Book`, `Quiz`, `Question` |
| **Attendance & Leaves** | `Student Attendance`, `Student Attendance Tool`, `Student Leave Application` |
| **Fee Management** | `Fees`, `Fee Structure`, `Fee Schedule`, `Fee Plan`, `Fee Category`, `Payment Record` |
| **Campus & Facilities** | `Campus`, `Building`, `Floor`, `Room`, `Room Booking`, `Hostel`, `Hostel Allocation` |
| **Faculty & Scheduling** | `Faculty`, `Subject Schedule`, `Subject Scheduling Tool` |

---

## API Endpoints

The backend exposes REST and RPC endpoints consumed by both the Desk and the Vue 3 Frontend SPA:

1. **Authentication & Session:**
   - `POST /api/method/login` - Standard Frappe user authentication.
   - `POST /api/method/logout` - Session invalidation.
   - `GET /api/method/frappe.auth.get_logged_user` - Current logged-in user profile.
2. **Student Portal Resources:**
   - Methods invoked via `frappe-ui` `createResource` and `createListResource` for attendance, fees, schedules, leave applications, and academic reports.
3. **App Permissions:**
   - `education.api.permissions.has_app_permission` - Controls access to the Education Desk workspace.

---

## Development & Testing

### Running Migrations
When adding or updating DocTypes, execute:
```bash
bench --site [site-name] migrate
```

### Running Backend Tests
```bash
bench --site [site-name] run-tests --app education
```

### Code Formatting & Linting
The backend uses **Ruff** for Python formatting and linting:
```bash
ruff check .
ruff format .
```

