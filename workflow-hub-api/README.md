# WorkFlow Hub API

Laravel REST API for the WorkFlow Hub portfolio and learning project. Vue handles the user interface, Supabase handles platform services, and Laravel owns the protected business API.

## Architecture

- Vue 3 + Vite frontend runs separately from this Laravel app.
- Supabase Auth signs users in and issues access tokens.
- Vue sends `Authorization: Bearer <supabase_access_token>` to Laravel.
- Laravel verifies the token with Supabase Auth before allowing workflow CRUD.
- Laravel stores user-owned workflow records in the configured database. For production-style learning, point this app at Supabase Postgres.

## Local Setup

```bash
composer install
copy .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

For Supabase Postgres, copy the Supabase session pooler connection details into `.env`:

```env
DB_CONNECTION=pgsql
DB_URL=postgres://<database-user>:<database-password>@<database-host>:5432/postgres
DB_SSLMODE=require
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_PUBLISHABLE_KEY=your-publishable-key
SUPABASE_SERVICE_ROLE_KEY=server-only-service-role-key
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

Do not put `SUPABASE_SERVICE_ROLE_KEY` in the Vue app.

## API

Protected workflow endpoints:

- `GET /api/workflows`
- `POST /api/workflows`
- `GET /api/workflows/{workflow}`
- `PATCH /api/workflows/{workflow}`
- `DELETE /api/workflows/{workflow}`

Request headers:

```http
Accept: application/json
Authorization: Bearer <supabase_access_token>
```

Workflow payload:

```json
{
  "title": "Build CV project",
  "description": "Create a professional WorkFlow Hub portfolio project.",
  "category": "cv",
  "priority": "high",
  "status": "planned",
  "due_date": "2026-07-01"
}
```

Allowed values:

- `category`: `cv`, `learning`, `backend`, `frontend`, `supabase`
- `priority`: `low`, `medium`, `high`
- `status`: `planned`, `in_progress`, `completed`

## Tests

```bash
php artisan test
```

The workflow feature tests fake Supabase Auth responses, so they do not need real Supabase credentials.
