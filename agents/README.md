# Evawero Agent System

4 autonomous AI agents that handle marketing, sales, solutions delivery, and management for Evawero Digital Solutions.

## Architecture

```
agents/
├── src/
│   ├── core/           # Shared infrastructure
│   │   ├── claude.js   # Anthropic SDK with tool_use loop
│   │   ├── database.js # PostgreSQL pool + migrations
│   │   ├── gmail.js    # Gmail OAuth2 (send, draft, read)
│   │   ├── notion.js   # Notion API client
│   │   ├── search.js   # Tavily web search
│   │   ├── logger.js   # Agent run logger (DB + Notion)
│   │   └── mailer.js   # Branded HTML email builder
│   ├── agents/
│   │   ├── marketing/  # Content creation across platforms
│   │   ├── sales/      # Lead prospecting & outreach drafts
│   │   ├── solutions/  # Client project delivery (Opus)
│   │   └── manager/    # Daily digest & alert monitoring
│   ├── routes/api.js   # REST API for dashboard + triggers
│   ├── scheduler.js    # Cron jobs (Mon/Wed/Fri)
│   ├── notion-watcher.js # Polls Notion for new project tasks
│   └── server.js       # Express entry point
├── dashboard/          # Static HTML dashboard
├── migrations/         # PostgreSQL schema
└── package.json
```

## Agents

| Agent | Schedule | Model | Purpose |
|-------|----------|-------|---------|
| Marketing | Mon/Wed/Fri 07:00 UTC | Sonnet | Content creation, brand building |
| Sales | Mon/Wed/Fri 08:00 UTC | Sonnet | Lead prospecting, outreach drafts |
| Manager | Mon/Wed/Fri 09:00 UTC + daily 14:00 | Sonnet | Digest emails, alert monitoring |
| Solutions | On-demand (Notion trigger) | Opus | Client project delivery |

## Setup

1. Copy `.env.example` to `evawero-agents.env` and fill in all values
2. Run database migrations: `npm start` (auto-runs on first boot)
3. Deploy to Railway with root directory set to `agents`

## API Endpoints

All `/api/*` routes require `x-api-key` header matching `API_SECRET_KEY`.

- `GET /health` — Health check
- `GET /api/logs` — Agent activity logs
- `GET /api/leads` — Lead pipeline
- `GET /api/projects` — Client projects
- `GET /api/content` — Content calendar
- `GET /api/alerts` — Active alerts
- `POST /api/alerts/:id/dismiss` — Dismiss alert
- `POST /api/trigger/{marketing|sales|digest|alert-check|notion-check|solutions}` — Manual triggers

## Dashboard

Access at `/dashboard`. Login with `DASHBOARD_PASSWORD` (actually uses `API_SECRET_KEY`).
