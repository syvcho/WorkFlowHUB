# WorkFlow Hub

WorkFlow Hub is a full-stack workflow management portfolio project built to showcase a professional Vue/Vite frontend, a protected Laravel REST API, and Supabase as the authentication and database platform.

The app helps a signed-in user plan work, track progress, update priorities, and manage their profile from a polished dashboard experience.

## Tech Stack

**Frontend**

- Vue 3 with Composition API
- Vite
- PrimeVue and PrimeIcons
- Vue Router
- Supabase JavaScript client

**Backend**

- Laravel REST API
- Laravel API resources, form requests, middleware, and feature tests
- Supabase Auth token verification
- Supabase Postgres-ready database configuration
- PHPUnit

**Platform**

- Supabase Auth for sign-in and account identity
- Supabase Postgres for production-style data storage
- Laravel-owned profile and workflow records

## Portfolio Highlights

- Secure Supabase email/password authentication.
- Laravel-protected REST endpoints using `Authorization: Bearer <supabase_access_token>`.
- User-owned workflow CRUD with validation and consistent JSON responses.
- Dashboard workflow cards with inline status and priority updates.
- Client-side filters for all, planned, in-progress, and completed workflows.
- Database-backed profile display name stored through Laravel.
- Profile page for editing name and changing Supabase Auth password.
- Friendly validation, loading states, empty states, and toast feedback.
- Responsive PrimeVue interface with fixed desktop sidebar and mobile-friendly stacking.
- Feature tests for protected Laravel profile and workflow routes.
- Secret-safe environment setup with placeholder-only example files.

## Architecture

```text
Vue 3 + Vite
  -> Supabase Auth sign-in
  -> receives Supabase access token
  -> calls Laravel REST API with Bearer token
  -> Laravel verifies token with Supabase Auth
  -> Laravel stores profile/workflow data in Postgres
```

The frontend never uses a Supabase service-role key. Any privileged server-only secret belongs on the Laravel side only.

## Project Structure

```text
.
├── src/                  # Vue frontend
├── public/               # Frontend static assets
├── workflow-hub-api/     # Laravel REST API
├── package.json          # Frontend dependencies and scripts
└── README.md
```

## Frontend Setup

```bash
npm install
copy .env.example .env
npm run dev
```

Frontend environment variables:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

## Backend Setup

```bash
cd workflow-hub-api
composer install
copy .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

Backend environment values to configure:

```env
DB_CONNECTION=pgsql
DB_URL=postgres://<database-user>:<database-password>@<database-host>:5432/postgres
DB_SSLMODE=require
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_PUBLISHABLE_KEY=your-publishable-key
SUPABASE_SERVICE_ROLE_KEY=
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

`SUPABASE_SERVICE_ROLE_KEY` is intentionally blank here. Do not expose service-role secrets in frontend files, Git commits, screenshots, or public documentation.

## API Overview

Protected requests require:

```http
Accept: application/json
Authorization: Bearer <supabase_access_token>
```

Profile endpoints:

- `GET /api/profile`
- `PATCH /api/profile`

Workflow endpoints:

- `GET /api/workflows`
- `POST /api/workflows`
- `GET /api/workflows/{workflow}`
- `PATCH /api/workflows/{workflow}`
- `DELETE /api/workflows/{workflow}`

Workflow values:

- `status`: `planned`, `in_progress`, `completed`
- `priority`: `low`, `medium`, `high`
- `category`: `cv`, `learning`, `backend`, `frontend`, `supabase`

## Verification

Frontend:

```bash
npm run build
```

Backend:

```bash
cd workflow-hub-api
php artisan test
```

## Security Notes

- `.env`, `.env.*`, and local Laravel `.env` files are ignored.
- `.env.example` files use placeholders only.
- The Vue app only uses Supabase publishable keys.
- Laravel verifies Supabase user tokens before protected profile/workflow actions.
- Workflow ownership is enforced by `supabase_user_id`.

## Learning Goals Demonstrated

- Vue component architecture and composables
- PrimeVue dashboard UI composition
- REST API client boundaries
- Laravel middleware, resources, requests, and feature tests
- Supabase Auth integration with a custom backend
- Database-backed app profile data
- Secret hygiene for public GitHub repositories
