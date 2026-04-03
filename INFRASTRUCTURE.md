# Evawero Digital — Infrastructure Overview

## Services

| Service | Platform | URL | Root Directory | What it does |
|---|---|---|---|---|
| Frontend | Vercel | `evawerodigital.com` | `frontend/` | React website (Vite) |
| Backend API | Railway (`api` service) | `api.evawerodigital.com` | `backend/` | Express API, admin panel, blog posts, contact form |
| Agents | Railway (`evawero-digital` service) | `evawero-digital-production.up.railway.app` | `agents/` | 4 AI agents + dashboard |

All three services share one Railway PostgreSQL database.

---

## Database (Railway PostgreSQL)

Single shared database used by both the backend and agents.

**Backend tables** (created on startup in `server.js`):
- `admin_users`, `services`, `products`, `blog_posts`, `team_members`, `site_settings`

**Agents tables** (from `agents/migrations/001_init.sql`):
- `agent_logs`, `leads`, `projects`, `content_calendar`, `alerts`

Internal connection: `postgresql://postgres:***@postgres.railway.internal:5432/railway`

---

## DNS (Namecheap, evawerodigital.com)

| Type | Host | Target | Purpose |
|---|---|---|---|
| A | `@` | `76.76.21.21` | Vercel (frontend) |
| CNAME | `www` | `*.vercel-dns-017.com` | Vercel (www redirect) |
| CNAME | `api` | `dhyaih3b.up.railway.app` | Railway (backend API) |
| TXT | `_railway-verify.api` | Railway verification | Domain verification |
| TXT | `google._domainkey` | DKIM key | Gmail sending auth |

The domain `evawero.com` is also owned (intended as redirect to evawerodigital.com).

---

## Google Cloud / Gmail OAuth

The OAuth credentials live in a Google Cloud project owned by `theherosmind@gmail.com`. The token grants access to the `info@evawerodigital.com` mailbox (Google Workspace).

```
Google Cloud Console (theherosmind@gmail.com account)
  └── OAuth App "Evawero Email"
        ├── Client ID: 23414334974-...
        ├── Client Secret: GOCSPX-...
        ├── Redirect URI: https://developers.google.com/oauthplayground
        └── Test users: theherosmind@gmail.com, info@evawerodigital.com

GMAIL_REFRESH_TOKEN (in Railway agents service)
  └── Grants access to info@evawerodigital.com mailbox
        ├── Create Gmail drafts (sales agent outreach)
        ├── Send emails (manager agent digests)
        └── Read inbox replies (sales + manager agents)
```

**Required scope:** `https://mail.google.com/` (full access, covers read + compose + send).

**If Gmail breaks:** Regenerate the token using the OAuth Playground or `agents/scripts/gmail-reauth.js`. See Troubleshooting in AGENT-GUIDE.md.

---

## Third-Party APIs

| Service | Env Variable | Used By | Purpose |
|---|---|---|---|
| Anthropic (Claude) | `ANTHROPIC_API_KEY` | All agents | LLM for content, prospecting, planning, digests |
| Notion | `NOTION_API_KEY` | All agents | 5 databases (CRM, Projects, Content, Logs, Tasks) |
| Tavily | `TAVILY_API_KEY` | Marketing + Sales | Web search for trends and prospects |
| Google (Gmail) | `GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`, `GMAIL_REFRESH_TOKEN` | Sales + Manager | Email drafts, digests, reply detection |
| Unsplash | No key needed | Marketing | Blog cover images (public URLs) |

---

## Notion Databases

| Database | Env Variable | Used By |
|---|---|---|
| CRM: Leads & Contacts | `NOTION_CRM_DB_ID` | Sales agent |
| Client Projects | `NOTION_PROJECTS_DB_ID` | Solutions agent |
| Content Calendar | `NOTION_CONTENT_DB_ID` | Marketing + Manager |
| Agent Logs | `NOTION_LOGS_DB_ID` | All agents |
| Agent Tasks | `NOTION_TASKS_DB_ID` | Solutions agent |

Property type: All use native `status` type except Agent Tasks (DB5) which uses `select`.

---

## Service-to-Service Connections

```
Frontend (Vercel)
  │
  ├── VITE_API_URL ──► Backend API (Railway)
  │                      api.evawerodigital.com
  │
  └── Static site, no direct DB access

Backend API (Railway)
  │
  ├── DATABASE_URL ──► PostgreSQL (Railway, internal)
  ├── Gmail OAuth ──► Sends contact form notifications
  └── Serves admin panel at /admin

Agents (Railway)
  │
  ├── DATABASE_URL ──► Same PostgreSQL (Railway, internal)
  ├── NOTION_API_KEY ──► Notion (5 databases)
  ├── Gmail OAuth ──► Drafts, digests, reply reading
  ├── ANTHROPIC_API_KEY ──► Claude API
  ├── TAVILY_API_KEY ──► Tavily web search
  └── BACKEND_URL ──► Backend API (for publishing blog posts)
        Uses AGENT_API_KEY for auth (x-agent-key header)
```

---

## Authentication

| Access Point | Method | Who uses it |
|---|---|---|
| Admin Panel (`api.evawerodigital.com/admin`) | Email + password login (JWT cookie) | Owner |
| Agents Dashboard (`/dashboard`) | Password (`API_SECRET_KEY`) | Owner |
| Agent API triggers (`/api/trigger/*`) | `x-api-key` header | Dashboard buttons |
| Agents to Backend (blog publishing) | `x-agent-key` header (`AGENT_API_KEY`) | Marketing agent |

---

## Agent Schedule

| UTC | German Time (CEST) | Days | Agent | Action |
|---|---|---|---|---|
| 07:00 | 09:00 | Mon/Wed/Fri | Marketing | Creates content batch |
| 08:00 | 10:00 | Mon/Wed/Fri | Sales | Prospects + drafts outreach |
| 09:00 | 11:00 | Mon/Wed/Fri | Manager | Full digest email |
| 14:00 | 16:00 | Daily | Manager | Quick alert check |
| Every 30 min | — | Always | Notion Watcher | Polls for new project briefs |

---

## Deployment Flow

**Frontend:** Push to `main` on GitHub triggers Vercel auto-deploy. Builds `frontend/` with Vite.

**Backend:** Push to `main` triggers Railway auto-deploy for the `api` service. Runs `node server.js` from `backend/`.

**Agents:** Push to `main` triggers Railway auto-deploy for the `evawero-digital` service. Runs from `agents/`.

All three deploy automatically on every push to main.

---

## Environment Variables by Service

### Vercel (Frontend)
- `VITE_API_URL` = `https://api.evawerodigital.com`

### Railway — Backend (`api` service)
- `DATABASE_URL`, `PAYLOAD_SECRET` or `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`
- `GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`, `GMAIL_REFRESH_TOKEN`, `GMAIL_USER`
- `FRONTEND_URL` = `https://evawerodigital.com`
- `AGENT_API_KEY` (shared with agents service)

### Railway — Agents (`evawero-digital` service)
- `ANTHROPIC_API_KEY`
- `DATABASE_URL`
- `GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`, `GMAIL_REFRESH_TOKEN`, `GMAIL_USER`
- `NOTION_API_KEY`, `NOTION_CRM_DB_ID`, `NOTION_PROJECTS_DB_ID`, `NOTION_CONTENT_DB_ID`, `NOTION_LOGS_DB_ID`, `NOTION_TASKS_DB_ID`
- `TAVILY_API_KEY`
- `API_SECRET_KEY` (dashboard login)
- `OWNER_EMAIL`
- `AGENT_API_KEY`, `BACKEND_URL`

### Local reference file
- `evawero-agents.env` — local copy of agents env vars for reference. NOT used by Railway. Never commit to GitHub.
