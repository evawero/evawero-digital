# Client Onboarding Checklist

Steps to deploy an AI agent system for a paying client. The client interacts only through Notion and Gmail — they never touch code, GitHub, or Railway.

---

## Pre-Sales

- [ ] Create a demo dashboard for the client's industry (see `DEMO-DASHBOARD-GUIDE.md`)
- [ ] Walk the client through the demo — show all 5 tabs
- [ ] Confirm scope: which agents they want (Marketing, Sales, Solutions, Manager)
- [ ] Agree on run schedule (e.g., Mon/Wed/Fri, daily)
- [ ] Collect client info for setup (see below)

---

## Client Info to Collect

| Item | Example | Notes |
|------|---------|-------|
| Company name | PrintHub Lagos | |
| Industry | Printing & Branding | |
| Website/domain | printhublagos.com | |
| Services/products | Business cards, banners, flyers, brochures | Detailed list for brand bible |
| Target customers | Corporates, event planners, schools, churches | For sales agent ICP |
| Markets | Lagos (primary), Abuja (secondary) | Cities/regions |
| Brand voice | Professional but friendly | For marketing agent |
| Competitors | 3-5 names | For sales/marketing differentiation |
| Contact email | tunde@printhublagos.com | For Gmail OAuth setup |
| Timezone | Africa/Lagos | For scheduling |

---

## Setup Steps

### 1. Create Client's Infrastructure

- [ ] Create a new GitHub repo (private) — e.g., `evawero/printhub-agents`
- [ ] Create a Notion workspace or section for the client
- [ ] Create 5 Notion databases with correct property types:
  - DB1: CRM (Leads) — native `status` property
  - DB2: Client Projects — native `status` property
  - DB3: Content Calendar — native `status` property
  - DB4: Agent Logs — native `status` property
  - DB5: Agent Tasks — `select` property (not native status)
- [ ] Note all 5 Notion database IDs

### 2. Build the Agent System

- [ ] Use `AGENT-SYSTEM-TEMPLATE.md` — fill in client info and paste into Claude Code
- [ ] Review and customise the generated prompts (brand bible, ICP, content pillars)
- [ ] Test each agent locally with `node agents/src/test-<agent>.js`

### 3. Set Up Gmail

- [ ] Set up Gmail OAuth for the client's email (or a dedicated outreach email)
- [ ] Get `GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`, `GMAIL_REFRESH_TOKEN`
- [ ] Confirm the refresh token works

### 4. Deploy to Railway

- [ ] Create a new Railway project for the client
- [ ] Add a Postgres database service
- [ ] Add the agent service (link to GitHub repo)
- [ ] Set all environment variables (see env var list below)
- [ ] Set root directory to `agents` (or wherever the agent code lives)
- [ ] Deploy and verify the health check endpoint responds

### 5. Verify

- [ ] Trigger a test run of each agent
- [ ] Check Notion databases — leads, content, logs should populate
- [ ] Check Gmail — drafts should appear (NOT sent)
- [ ] Check Railway logs for errors
- [ ] Run the Manager agent — verify digest email arrives

### 6. Hand Off to Client

- [ ] Share Notion workspace/databases with the client
- [ ] Walk them through what they'll see: leads in CRM, content drafts, digest emails
- [ ] Explain the review workflow: check Gmail drafts → review → send manually
- [ ] Confirm the schedule is correct
- [ ] Set up billing

---

## Environment Variables

```
ANTHROPIC_API_KEY=<your Anthropic API key>
DATABASE_URL=<Railway Postgres connection string>
GMAIL_CLIENT_ID=<Google OAuth client ID>
GMAIL_CLIENT_SECRET=<Google OAuth client secret>
GMAIL_REFRESH_TOKEN=<Google OAuth refresh token>
GMAIL_USER=<client's email address>
NOTION_API_KEY=<Notion integration token>
NOTION_CRM_DB_ID=<DB1 — CRM/Leads>
NOTION_PROJECTS_DB_ID=<DB2 — Client Projects>
NOTION_CONTENT_DB_ID=<DB3 — Content Calendar>
NOTION_LOGS_DB_ID=<DB4 — Agent Logs>
NOTION_TASKS_DB_ID=<DB5 — Agent Tasks>
TAVILY_API_KEY=<Tavily search API key — for sales agent>
OWNER_EMAIL=<email for manager digest — usually client or you>
```

---

## Post-Launch

- [ ] Monitor first 3 scheduled runs for errors
- [ ] Review agent output quality — adjust prompts if needed
- [ ] Check Anthropic API usage — flag if costs are higher than expected
- [ ] Schedule a 1-week check-in with the client
