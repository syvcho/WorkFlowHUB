# WorkFlow Hub Free Deployment Guide

This guide deploys WorkFlow Hub with a free GitHub-based workflow:

- Frontend: Cloudflare Pages
- Backend: Render web service
- Auth and database: Supabase Free

Keep real environment values in provider dashboards only. Do not commit `.env` files.

## 1. Supabase

Use your existing Supabase project or create a new one.

Required Supabase settings:

- Enable Email/Password Auth.
- Copy your project URL.
- Copy your publishable key.
- Copy your Postgres connection string for the Laravel backend.
- After Cloudflare Pages gives you a production URL, add it to Supabase Auth URL settings.

Run Laravel migrations against the production database after the backend env is configured.

## 2. Backend On Render

Create a new Render web service from the GitHub repo.

Recommended settings:

- Root directory: `workflow-hub-api`
- Environment: Docker
- Dockerfile path: `Dockerfile`
- Plan: Free

Set these Render environment variables:

```env
APP_NAME=WorkFlow Hub API
APP_ENV=production
APP_KEY=base64:your-generated-production-key
APP_DEBUG=false
APP_URL=https://your-render-api-domain.onrender.com

DB_CONNECTION=pgsql
DB_URL=postgres://<database-user>:<database-password>@<database-host>:5432/postgres
DB_SSLMODE=require

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_PUBLISHABLE_KEY=your-publishable-key
SUPABASE_SERVICE_ROLE_KEY=

CORS_ALLOWED_ORIGINS=https://your-cloudflare-pages-domain.pages.dev
SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database
```

Generate a production app key locally without committing it:

```bash
cd workflow-hub-api
php artisan key:generate --show
```

After Render deploys, run migrations from the Render shell:

```bash
php artisan migrate --force
```

Smoke test the API:

```bash
curl https://your-render-api-domain.onrender.com/api/profile
```

Expected response without a token:

```json
{"message":"Please sign in to continue."}
```

## 3. Frontend On Cloudflare Pages

Create a Cloudflare Pages project from the GitHub repo.

Recommended settings:

- Framework preset: Vite
- Root directory: `/`
- Build command: `npm run build`
- Build output directory: `dist`

Set these Cloudflare Pages environment variables:

```env
VITE_API_BASE_URL=https://your-render-api-domain.onrender.com/api
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

The `public/_redirects` file makes Vue Router routes such as `/profile` work on refresh.

## 4. Final Checks

- Frontend loads from the Cloudflare Pages URL.
- `/profile` refreshes without a 404.
- Browser network requests call the Render API URL.
- Sign in works through Supabase Auth.
- Create, edit, filter, and delete workflow items.
- Edit profile name and confirm it persists.
- Render API returns `401` for protected endpoints without a token.
- No `.env` files are committed.

## Free Tier Notes

Render free services may sleep when idle and wake slowly on the first request. That is acceptable for a portfolio demo, but mention it if you share the project.
