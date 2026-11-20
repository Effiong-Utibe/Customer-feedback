# Roles and permissions

Every public registration creates a `CUSTOMER` account. Submitted role values are ignored. Staff and administrators are provisioned through controlled bootstrap/admin flows.

| Capability | Customer | Staff | Admin |
| --- | :---: | :---: | :---: |
| View personal dashboard | ✓ | ✓ | ✓ |
| Submit and view own feedback | ✓ | — | ✓ |
| View staff feedback queue | — | ✓ | ✓ |
| Update status and reply to feedback | — | ✓ | ✓ |
| Assign feedback | — | — | ✓ |
| Participate in customer surveys | ✓ | — | — |
| Manage surveys | — | ✓ | ✓ |
| View reports | — | ✓ | ✓ |
| Export reports | — | — | ✓ |
| Manage users, staff, and customers | — | — | ✓ |
| View audit log | — | — | ✓ |

Authorization combines Spatie roles/permissions, route middleware, request authorization, and model policies. Feedback visibility is scoped by customer ownership or staff assignment. Admins can view/manage all feedback. Internal feedback responses are filtered out for customer viewers.

## Account lifecycle

- Email verification is required for protected routes.
- Inactive users are blocked by the `active` middleware.
- Admin-created staff accounts receive an email verification notice and a password reset link, so they set a password themselves.
- Public registration assigns only the customer role.
- Admin account changes prevent self-deactivation/demotion and preserve at least one active administrator.

## Bootstrap the first administrator

Set `INITIAL_ADMIN_NAME`, `INITIAL_ADMIN_EMAIL`, and `INITIAL_ADMIN_PASSWORD` in the environment before running `php artisan db:seed`. If values were unavailable during first startup, set them and run:

```powershell
docker compose up -d app
docker compose exec app php artisan db:seed --force
```

The seeder is idempotent for the account identity and synchronizes the admin role. It does not reset an existing account's password.
