# Evawero Digital Solutions — Company Website

Official website for **Evawero Digital Solutions Limited** — a Nigerian-German digital solutions company offering AI strategy, business process automation, custom web solutions, and brand & digital strategy.

## Tech Stack

- **Frontend:** React (Vite) + Tailwind CSS + Framer Motion — deployed on Vercel
- **Backend:** Node.js + Express + PostgreSQL — deployed on Railway
- **Admin Panel:** Built-in at `/admin` — manage all site content

## Project Structure

```
evawero-digital/
├── frontend/          # React SPA → Vercel
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── lib/api.js
│   │   └── App.jsx
│   └── public/
├── backend/           # Express API + Admin → Railway
│   ├── admin/         # Admin panel (static HTML)
│   ├── server.js      # API + DB schema + seed
│   └── .env.example
└── README.md
```

## Local Development

### Prerequisites
- Node.js 18+
- PostgreSQL running locally

### Backend
```bash
cd backend
cp .env.example .env    # Edit with your local DB credentials
npm install
npm run dev             # Runs on http://localhost:3000
```

### Frontend
```bash
cd frontend
npm install
npm run dev             # Runs on http://localhost:5173
```

The Vite dev server proxies `/api` requests to `localhost:3000`.

## Environment Variables

### Backend (Railway)
| Variable | Description |
|---|---|
| `DATABASE_URI` | PostgreSQL connection string (auto-set by Railway Postgres plugin) |
| `PORT` | Server port (default: 3000) |
| `NODE_ENV` | Set to `production` |
| `JWT_SECRET` | Random 32+ char string for admin auth tokens |
| `ADMIN_EMAIL` | Admin login email |
| `ADMIN_PASSWORD` | Admin login password (only used on first run to create the account) |
| `GMAIL_USER` | Gmail address for sending contact form emails |
| `GMAIL_APP_PASSWORD` | Gmail app password |
| `FRONTEND_URL` | Frontend URL for CORS (e.g. `https://evawerodigital.com`) |

### Frontend (Vercel)
| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API URL (e.g. `https://api.evawerodigital.com`) |

## Deployment

### Vercel (Frontend)
- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`

### Railway (Backend)
- Root directory: `backend`
- Start command: `node server.js`
- Add PostgreSQL plugin from Railway dashboard

## Admin Panel

Access at `https://your-backend-url/admin`. Default credentials are set via `ADMIN_EMAIL` and `ADMIN_PASSWORD` environment variables on first startup.

Manage: Services, Products, Blog Posts, Team Members, Site Settings.
