# UI Ventures Feedback

A customer feedback and survey management application built with Laravel 13, Inertia.js, React, TypeScript, PostgreSQL, Fortify, and Spatie Permission. It supports customer submissions, private staff workflows, scheduled surveys, reporting, exports, and audit history.

## Run with Docker

Prerequisites: Docker Desktop with Compose enabled.

1. Copy `.env.example` to `.env` if the file does not exist, then create the Laravel app key:

   ```powershell
   Copy-Item .env.example .env
   docker compose run --rm app php artisan key:generate
   ```

   The checked-in development `.env` already has an application key. Do not replace it unless needed.

2. Set `INITIAL_ADMIN_NAME`, `INITIAL_ADMIN_EMAIL`, and a strong `INITIAL_ADMIN_PASSWORD` in `.env` before first startup. The admin seeder intentionally creates no account when those values are missing.

3. Start the app:

   ```powershell
   docker compose up --build
   ```

   Compose starts PostgreSQL, the Laravel app, the Vite dev server, and the scheduler. The app container installs Composer packages, runs migrations and seeders, and serves HTTP on [http://localhost:8000](http://localhost:8000). Vite is available on port 5173.

4. If the database was initialized before adding admin credentials, restart the app and seed again:

   ```powershell
   docker compose up -d app
   docker compose exec app php artisan db:seed --force
   ```

   An existing admin account is not assigned a new password by the seeder. Use the password reset flow if the account already exists.

To stop the stack, press Ctrl+C for a foreground run, or use `docker compose down`. The PostgreSQL data volume remains unless explicitly removed.

## Local development

Use PHP 8.3 or newer, Composer, Node.js 22, and PostgreSQL 17. Copy `.env.example`, set the database and initial admin values, then run:

```powershell
composer install
php artisan key:generate
php artisan migrate --seed
npm install
npm run dev
```

In a second terminal, start Laravel with `php artisan serve`. Set `DB_HOST=127.0.0.1` for a local PostgreSQL server. For production, configure a real mail transport, HTTPS `APP_URL`, secure secrets, persistent private file storage, and a supervised scheduler; set `APP_DEBUG=false`.

## Main capabilities

- Email-verified accounts, password reset, profile and password settings.
- Role-scoped customer, staff, and administrator experiences.
- Feedback intake with categories, priorities, attachments, assignment, internal and customer-visible replies, and status history.
- Survey authoring, scheduling, publishing, anonymous or identified participation, and response reporting.
- Dashboard metrics, filtered reports, CSV/XLSX/PDF exports, and audit logs.
- PostgreSQL migrations, repeatable role/category seeders, Docker Compose development services, and Pest feature tests.

## Project guide

- [Architecture](docs/ARCHITECTURE.md)
- [Database model](docs/DATABASE.md)
- [Development setup](docs/DEVELOPMENT.md)
- [Roles and permissions](docs/USER_ROLES_AND_PERMISSIONS.md)
- [Routes](docs/API_AND_ROUTING.md)
- [Tests](docs/TESTING.md)

## Useful commands

```powershell
php artisan test
php artisan route:list
php artisan schedule:list
npm run typecheck
npm run build
```
