# GOONOLOGY Website Implementation Plan

## Project Overview
- **Project Name**: GOONOLOGY
- **Type**: Web Application (SvelteKit 5)
- **Core Functionality**: Landing page with login, user management (admin), and protected dashboard
- **Target Users**: s2 2010 batch members

## Tech Stack
- **Framework**: SvelteKit 5
- **Database**: NeonDB (PostgreSQL)
- **Authentication**: Session-based auth with bcrypt password hashing

## Pages Structure
```
/                    → Landing page (GOONOLOGY -by s2 (2010 batch))
/login               → Login page
/dev/admin           → Admin page (gitignored, for creating users)
/dashboard           → Protected dashboard (requires login)
```

## Implementation Steps

### Step 1: Initialize SvelteKit Project
- Create SvelteKit 5 project with necessary dependencies
- Install: `pg` (NeonDB PostgreSQL driver), `bcryptjs`, `dotenv`

### Step 2: Database Setup
- Create NeonDB PostgreSQL database
- Create `users` table with columns: id, username, password_hash, role, created_at
- Roles: admin, mod, member

### Step 3: Environment & Gitignore
- Create `.env` for DATABASE_URL and SESSION_SECRET
- Create `.gitignore` that ignores `/dev` folder and `.env`

### Step 4: Landing Page (/)
- Simple hero page with title "GOONOLOGY -by s2 (2010 batch)"
- Links to /login and /dashboard

### Step 5: Login Page (/login)
- Username and password form
- On success: create session, redirect to /dashboard
- On failure: show error message

### Step 6: Admin Page (/dev/admin)
- Form to create new users
- Fields: username, password, role (dropdown: admin, mod, member)
- Only accessible (will add protection later if needed)

### Step 7: Dashboard (/dashboard)
- Protected route - redirects to /login if not authenticated
- Shows user info and role

### Step 8: Authentication System
- Session-based auth using cookies
- Auth hooks to protect dashboard route
- Logout functionality

## Files to Create
1. `package.json` - Project config
2. `svelte.config.js` - SvelteKit config
3. `vite.config.js` - Vite config
4. `.gitignore` - Ignores /dev and .env
5. `.env` - Environment variables (template)
6. `src/app.html` - HTML template
7. `src/routes/+layout.svelte` - Main layout
8. `src/routes/+page.svelte` - Landing page
9. `src/routes/login/+page.svelte` - Login page
10. `src/routes/login/+page.server.js` - Login handler
11. `src/routes/dev/admin/+page.svelte` - Admin page
12. `src/routes/dev/admin/+page.server.js` - User creation handler
13. `src/routes/dashboard/+page.svelte` - Dashboard page
14. `src/routes/dashboard/+page.server.js` - Dashboard auth check
15. `src/lib/server/db.js` - Database connection
16. `src/lib/server/auth.js` - Auth utilities
17. `src/hooks.server.js` - Auth hooks

## Gitignore Content
```
/dev
.env
.env.*
!.env.example
node_modules
```

## Database Schema
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'member',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```