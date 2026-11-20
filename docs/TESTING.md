# Testing

Backend tests use Pest with Laravel's test helpers and refresh the database for each test. The test environment uses SQLite in memory and disables Vite asset lookup.

## Commands

Local PHP environment:

```powershell
php artisan test
```

Inside the Compose app container:

```powershell
docker compose exec app php artisan test
```

Frontend checks inside the Vite container:

```powershell
docker compose exec vite npm run typecheck
docker compose exec vite npm run build
```

## Current coverage

- Public registration assigns customer role despite attempted role injection and sends verification mail.
- Customers are restricted to their own feedback; staff queue access is scoped to assigned work.
- Required survey answers are enforced and valid response data is persisted.
- Anonymous survey responses do not store a user ID and duplicate submissions are blocked.
- Root routing and basic app response are checked.

When adding a workflow, cover both the allowed path and its privacy/authorization boundary. Avoid relying solely on UI hiding for access control.
