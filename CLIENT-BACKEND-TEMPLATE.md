# Client Backend + Admin Panel Template

Use this prompt with Claude Code to scaffold a backend API with admin panel for client projects. Copy, fill in the placeholders, and paste as your first message.

---

## THE PROMPT

```
Build a backend API with an admin panel for [CLIENT_NAME]'s website.

## Project Structure

- Frontend is a [React/Vue/Next.js/etc.] app deployed on [Vercel/Netlify/etc.]
- Backend should live in a `/backend` folder in the same repo
- Backend will be deployed on Railway with a Postgres database

## Tech Stack

- Node.js + Express
- PostgreSQL (via `pg` library)
- bcryptjs for password hashing
- jsonwebtoken for admin auth
- nodemailer for contact form emails
- cookie-parser for session management
- cors for cross-origin requests
- express-rate-limit for contact form rate limiting
- dotenv for environment variables

## Database Tables Needed

1. **admin_users** — id, email, password_hash, created_at
2. **[TABLE_1]** — [list columns, e.g. "services — id, title, slug, icon, short_description, full_description, sort_order, created_at"]
3. **[TABLE_2]** — [list columns]
4. **[TABLE_3]** — [list columns]
5. **site_settings** — id, tagline, mission_statement, contact_email, contact_phone, social_links (JSONB), seo_title, seo_description, updated_at

## Features

### Public API Endpoints (read-only, no auth)
- GET /api/[table1] — list all
- GET /api/[table2] — list all
- GET /api/[table3] — list all
- GET /api/[table3]/:slug — get single by slug
- GET /api/globals/site-settings — get site settings
- POST /api/contact — contact form (rate-limited, sends email via Gmail)

### Admin Auth
- POST /api/admin/login — login with email/password, sets httpOnly cookie
- POST /api/admin/logout — clears cookie
- GET /api/admin/me — check current session

### Admin CRUD Endpoints (all require auth)
- Full CRUD (GET list, GET by id, POST create, PUT update, DELETE) for each content table
- GET/PUT for site-settings (upsert pattern)

### Admin Panel (served as static HTML at /admin)
- Single-page HTML file with embedded CSS and JavaScript (no build step)
- Login screen with email/password
- Sidebar navigation: Dashboard, [Table1], [Table2], [Table3], Site Settings
- Dashboard shows count cards for each content type
- Each section has a table view with Add New, Edit, Delete
- Forms auto-generate from field definitions
- Clean, professional design with these CSS variables:
  --brand: [HEX_COLOR]
  --brand-dark: [DARKER_HEX]
  --brand-light: [LIGHTER_HEX]

### Server Startup
- Auto-create all tables (CREATE TABLE IF NOT EXISTS)
- Seed default admin user from ADMIN_EMAIL and ADMIN_PASSWORD env vars
- Sync admin password from env on every restart (so env var is always the source of truth)
- Seed initial content data if tables are empty

### Root & Health
- GET / — returns API info JSON (name, status, available endpoints)
- GET /health — returns { status: "ok" } after DB ping

## Environment Variables Needed

- DATABASE_URI — Postgres connection string (Railway provides this)
- FRONTEND_URL — frontend origin for CORS (e.g. https://clientsite.com)
- ADMIN_EMAIL — admin login email
- ADMIN_PASSWORD — admin login password
- JWT_SECRET — secret for signing tokens
- GMAIL_USER — Gmail address for contact form
- GMAIL_APP_PASSWORD — Gmail app password for contact form
- NODE_ENV — set to "production" on Railway

## Railway Config

Create a `railway.toml` in the backend folder:
- Builder: NIXPACKS
- Start command: node server.js
- Restart policy: ON_FAILURE

## CORS Config

Allow these origins:
- FRONTEND_URL env var
- The API's own domain (for the admin panel)
- localhost:5173 (for local dev)

## Seed Data

[Describe the initial content to seed — services, products, team members, etc. Be specific about titles, descriptions, and any content the client has provided.]

## Important Notes

- Use Express 5 (latest)
- SSL for Postgres only when NOT using railway.internal hostname
- Listen on 0.0.0.0 for Railway compatibility
- Admin panel must work on mobile (responsive sidebar)
- Contact form should include: name, email, phone (optional), message, and [any other fields]
- Rate limit contact form to 5 requests per hour per IP
```

---

## AFTER BUILDING — DEPLOYMENT CHECKLIST

### Railway Setup
1. Create new project on railway.com
2. Add Postgres database service
3. Add new service from GitHub repo
4. Set **Root Directory** to `backend` in service Settings > Source
5. Add all environment variables listed above
6. Set custom domain (e.g. api.clientdomain.com) in Settings > Networking

### Frontend Deployment (Vercel)
1. Import repo to Vercel
2. Set root directory to `frontend`
3. Add environment variable: `VITE_API_URL=https://api.clientdomain.com` (or equivalent)
4. Set custom domain

### DNS (Namecheap or other registrar)
- A/CNAME record for main domain -> Vercel
- CNAME record for api.clientdomain.com -> Railway provided domain

### Post-Deploy
- Test all API endpoints
- Test admin login at api.clientdomain.com/admin
- Test contact form sends email
- Test frontend fetches data from API

---

## EXAMPLE FILLED PROMPT (for reference)

```
Build a backend API with admin panel for "Lagos Fitness Studio" website.

## Database Tables Needed

1. admin_users — id, email, password_hash, created_at
2. classes — id, title, slug, instructor, description, schedule, duration, level (beginner/intermediate/advanced), max_capacity, price, sort_order, created_at
3. trainers — id, name, role, bio, specialties (TEXT[]), photo, certifications (TEXT[]), sort_order, created_at
4. blog_posts — id, title, slug, excerpt, content, cover_image, author, published_date, category, status (draft/published), created_at
5. testimonials — id, client_name, quote, rating (1-5), photo, is_featured (boolean), created_at
6. site_settings — id, tagline, mission_statement, contact_email, contact_phone, address, opening_hours (JSONB), social_links (JSONB), seo_title, seo_description, updated_at

Brand color: #E63946 (red), dark: #B82D38, light: #FDE8EA

Seed data: 4 fitness classes (HIIT, Yoga, Strength Training, Spin), 2 trainers, 3 testimonials.
```

---

## TIPS

- Always list your tables and columns explicitly — the more specific you are, the better the result
- Include seed data descriptions so the admin panel has content to show immediately
- If the client has specific content (services, team bios, etc.), include it in the seed data section
- The admin panel is a single HTML file with no dependencies — easy to maintain and customize
- For clients who need image uploads, you'll need to add a file upload service (Cloudinary, S3, etc.) separately
