# Web routes and page contracts

This application uses authenticated Laravel web routes and Inertia page responses; it does not expose a separate JSON REST API. Inputs are validated by Form Request classes and Inertia receives page props from controllers.

## Route groups

| Prefix | Names | Access | Purpose |
| --- | --- | --- | --- |
| `/` | — | Public | Redirects to login or dashboard |
| `/dashboard` | `dashboard` | Authenticated, verified, active, `dashboard.view` | Role-aware dashboard |
| `/settings/profile` | `profile.edit` | Authenticated, verified, active | Profile settings; Fortify handles the update actions |
| `/feedback` | `feedback.*` | Authenticated, verified, active, then policy/permission checks | Intake, queue, details, replies, assignment, status, private downloads |
| `/reports` | `reports.*` | `reports.view`; exports also require `reports.export` | Filtered metrics and CSV/XLSX/PDF exports |
| `/surveys` | `surveys.*` | Customer role | Survey list, participation, response submission |
| `/admin/surveys` | `surveys.manage.*` | Admin or staff role | Create, edit, publish, close, archive surveys |
| `/admin` | `admin.*` | Admin role | User, customer, staff, and audit-log administration |

Fortify provides login, logout, registration, email verification, password reset, and password confirmation routes. See `php artisan route:list` for the full framework-generated route list.

## Important actions

| Method and path | Route name | Action |
| --- | --- | --- |
| `POST /feedback` | `feedback.store` | Submit feedback and optional attachments |
| `PATCH /feedback/{feedback}` | `feedback.update` | Change feedback status/priority |
| `POST /feedback/{feedback}/assign` | `feedback.assign` | Assign to a staff account |
| `POST /feedback/{feedback}/responses` | `feedback.responses.store` | Add public or internal response |
| `GET /feedback/{feedback}/attachments/{attachment}` | `feedback.attachments.download` | Authorized private download |
| `POST /surveys/{survey}/responses` | `surveys.responses.store` | Submit one survey response |
| `POST /admin/surveys/{survey}/publish` | `surveys.manage.publish` | Publish or schedule a survey |
| `GET /reports/export/{format}` | `reports.export` | Export filtered report data |

## Inertia data

Page components are referenced by names such as `dashboard/index`, `feedback/show`, and `surveys/participate`; Vite resolves these under `resources/js/pages`. Props use camelCase keys in React and serialize Eloquent models/paginators through Inertia. Validation errors are returned through standard Inertia form error props. Do not add private fields or internal replies to customer page payloads.
