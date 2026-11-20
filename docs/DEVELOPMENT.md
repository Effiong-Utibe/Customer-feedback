# Development setup

## Docker Compose (recommended)

1. Ensure `.env` exists and contains an app key. Set the three `INITIAL_ADMIN_*` values before the first seed if an administrator should be created.
2. Start the stack with `docker compose up --build`.
3. Open [http://localhost:8000](http://localhost:8000). Vite serves development assets on port 5173.

Services:

| Service | Purpose | Port |
| --- | --- | --- |
| `app` | Laravel server, migrations, seeders | 8000 |
| `postgres` | PostgreSQL 17 | 5435 on the host; 5432 inside Docker |
| `vite` | Node 22 asset dev server | 5173 |
| `scheduler` | Laravel scheduled survey lifecycle tasks | — |

Useful commands:

```powershell
docker compose logs -f app
docker compose exec app php artisan migrate:status
docker compose exec app php artisan db:seed --force
docker compose exec app php artisan test
docker compose exec vite npm run typecheck
docker compose exec vite npm run build
```

`docker compose down` stops services while preserving named database/dependency volumes. For a clean database, remove the `postgres_data` volume deliberately with `docker compose down -v` (this erases local database contents).

## Running without Docker

Install PHP 8.3+, Composer, Node.js 22+, and PostgreSQL 17. Configure `.env` for the local PostgreSQL instance, then:

```powershell
composer install
php artisan key:generate
php artisan migrate --seed
npm install
npm run dev
```

Run `php artisan serve` in a second terminal. Set an appropriate mail driver to test email verification, password reset, and notifications. The default `log` mailer writes messages to the Laravel log.

## Configuration

Important environment values:

| Variable | Purpose |
| --- | --- |
| `APP_KEY` | Encryption and signed application data |
| `APP_URL` | Public application origin used in links |
| `APP_TIMEZONE` | Application timezone; development default is `Africa/Lagos` |
| `DB_*` | PostgreSQL connection values |
| `INITIAL_ADMIN_NAME`, `INITIAL_ADMIN_EMAIL`, `INITIAL_ADMIN_PASSWORD` | Optional first admin account bootstrap |
| `MAIL_*` | Email verification, reset, and survey notifications |

The repository `.env` is for local development only. Use separate secrets and database credentials outside a developer machine. Never commit production secrets.

## Adding a schema change

Create a migration with `php artisan make:migration ...`, update or add the corresponding model and request/service code, and add a feature test for the behavior. Keep migrations compatible with both PostgreSQL and the test SQLite connection when practical.
