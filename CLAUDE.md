# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Goonology is a SvelteKit 5 web application for s2 2010 batch members. It provides user authentication and a protected dashboard.

## Tech Stack

- **Framework**: SvelteKit 5 with Svelte 5 runes
- **Database**: PostgreSQL (NeonDB) with Drizzle ORM + node-postgres (`pg`)
- **Authentication**: Session-based auth with bcryptjs password hashing
- **Build Tool**: Vite

## Commands

```bash
npm run dev      # Start development server (localhost:5173)
npm run build    # Build for production
npm run preview  # Preview production build
npx drizzle-kit push    # Push schema to database
npx drizzle-kit pull   # Pull schema from database
```

## Architecture

### Database Layer
- `src/lib/server/schema.js` - Drizzle schema definitions (users table)
- `src/lib/server/db.js` - Drizzle client with PostgreSQL connection pool
- `src/lib/server/auth.js` - Auth utilities using Drizzle queries

### Authentication Flow
1. Session stored in HTTP-only cookie (`session` cookie contains user ID)
2. `src/hooks.server.js` - Server hook that reads session cookie and populates `event.locals.user`
3. Protected routes check `locals.user` in their `load` function; redirect to `/login` if missing

### Route Structure
- `src/routes/+page.svelte` - Landing page (public)
- `src/routes/login/+page.svelte` + `+page.server.js` - Login form (POST handles authentication)
- `src/routes/dashboard/+page.svelte` + `+page.server.js` - Protected dashboard (requires auth)
- `src/routes/dev/admin/+page.svelte` + `+page.server.js` - Admin page for creating users (gitignored route)

### Layout
- `src/routes/+layout.svelte` - Global styles and app container
- `src/routes/+layout.server.js` - Exposes `locals.user` to all pages via `data.user`

## Environment Variables

Create a `.env` file (gitignored) with:
```
DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require
SESSION_SECRET=your-random-secret
```

## Key Patterns

- Use `$lib/server/` imports only in `.server.js` files (server-only modules)
- Form actions in `+page.server.js` handle POST requests
- Return `fail(400, {...})` from actions for validation errors
- Use Svelte 5 runes (`$props()`, `$state()`) - this project uses Svelte 5