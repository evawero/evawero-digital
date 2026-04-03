# Client Agent System — Claude Code Prompt Template

Use this prompt with Claude Code to build a 4-agent AI system for client projects. Copy, fill in the placeholders, and paste as your first message.

---

## THE PROMPT

```
Build a 4-agent AI system for [CLIENT_NAME] ([CLIENT_DOMAIN]).

## About the Client
- Industry: [CLIENT_INDUSTRY]
- Markets: [PRIMARY_MARKET] (primary), [SECONDARY_MARKET] (secondary)
- Services/Products: [WHAT_THEY_SELL]
- Brand voice: [e.g. professional but approachable, technical, casual]
- Target customer: [ICP — titles, industries, company size, pain points]
- Competitors: [TOP 3-5 COMPETITOR NAMES]
- Timezone: [CLIENT_TIMEZONE]
- Contact email: [CLIENT_EMAIL]

## Architecture

Build 4 autonomous AI agents in a /agents folder:

1. Marketing Agent — creates on-brand content (blog posts, social media drafts)
2. Sales Agent — finds leads, drafts outreach emails, manages CRM pipeline
3. Solutions/Delivery Agent — breaks client projects into tasks, scaffolds deliverables, drafts communications
4. Manager Agent — reads all agent activity, sends daily digest email, creates alerts for urgent items

All agents share:
- PostgreSQL database (for logs, leads, content, projects, alerts)
- Notion workspace (for CRM, content calendar, project tracking, agent logs, tasks)
- Gmail OAuth2 (for sending digests, drafting outreach)
- Anthropic SDK (Claude) as the LLM backbone
- Tavily for web search/research

## Tech Stack

- Node.js + Express (single process, serves dashboard)
- PostgreSQL (via pg library)
- @anthropic-ai/sdk for Claude API (use tool_use loop pattern, max 15 iterations)
- @notionhq/client v2 (NOT v5 — v5 breaks databases.query)
- googleapis for Gmail OAuth2
- tavily for web search
- node-cron for scheduling
- helmet + cors for Express security
- dotenv for environment variables

## Folder Structure

agents/
├── src/
│   ├── core/              # Shared infrastructure
│   │   ├── claude.js      # Anthropic SDK with tool_use loop
│   │   ├── database.js    # PostgreSQL pool + migrations
│   │   ├── gmail.js       # Gmail OAuth2 (send, draft, read)
│   │   ├── notion.js      # Notion API client with DB constants
│   │   ├── search.js      # Tavily web search
│   │   ├── logger.js      # Agent run logger (DB + Notion)
│   │   └── mailer.js      # Branded HTML email builder
│   ├── agents/
│   │   ├── marketing/     # index.js, prompt.js, tools.js
│   │   ├── sales/         # index.js, prompt.js, tools.js
│   │   ├── solutions/     # index.js, prompt.js, tools.js
│   │   └── manager/       # index.js, prompt.js, tools.js
│   ├── routes/api.js      # REST API for dashboard + manual triggers
│   ├── scheduler.js       # Cron jobs with pause/resume kill switch
│   ├── notion-watcher.js  # Polls Notion for new project briefs
│   └── server.js          # Express entry point
├── dashboard/
│   └── index.html         # Static HTML dashboard (dark theme, login, live data)
├── migrations/
│   └── 001_init.sql       # PostgreSQL schema
├── .env.example
├── .gitignore
├── package.json
└── README.md

## Database Schema (PostgreSQL)

Create these tables in migrations/001_init.sql:

1. agent_logs — id, agent_name, status, actions_taken(JSON), results(JSON), needs_attention(JSON), metadata(JSON), run_at
2. leads — id, name, company, email, phone, market, region, source, status, notes, created_at, updated_at
3. projects — id, notion_task_id(unique), client_name, project_title, brief, deliverables, status, deadline, created_at, last_updated_at
4. content_calendar — id, agent, platform, language, market, title, content, scheduled_for, status, created_at
5. alerts — id, level(urgent/warning/info), source_agent, title, description, dismissed(bool), created_at

Add indexes on: agent_logs(run_at), leads(status), leads(market), content_calendar(created_at), alerts(dismissed).

## Notion Databases (5 databases)

The client needs these 5 Notion databases. The agent code maps to env vars:
- NOTION_CRM_DB_ID — CRM: Leads & Contacts
- NOTION_PROJECTS_DB_ID — Client Projects
- NOTION_CONTENT_DB_ID — Content Calendar
- NOTION_LOGS_DB_ID — Agent Logs
- NOTION_TASKS_DB_ID — Agent Tasks

IMPORTANT: Check the actual Notion property types before writing integration code.
- If Status is Notion's native "status" type, use { status: { name: '...' } }
- If Status is a "select" type, use { select: { name: '...' } }
- These are NOT interchangeable — using the wrong one causes silent failures.

## Agent Details

### Marketing Agent
- Model: claude-sonnet-4-6
- Schedule: [MARKETING_SCHEDULE, e.g. "Mon/Wed/Fri 07:00 UTC"]
- Creates: blog posts for client website, social media drafts (platform toggles in CONFIG)
- Tools: search_trending_topics, save_to_content_calendar, get_recent_content, publish_blog_post
- Blog posts save as DRAFT to the client's website via API — never auto-publish
- All social content saves to Content Calendar as Draft status
- Embed the client's full brand bible in the system prompt
- CONFIG block should have platform toggles (linkedin, x, instagram, blog) and content ratio

### Sales Agent
- Model: claude-sonnet-4-6
- Schedule: [SALES_SCHEDULE, e.g. "Mon/Wed/Fri 08:00 UTC"]
- Creates: Gmail drafts for outreach (NEVER sends), CRM entries in Notion
- Tools: search_prospects, add_lead_to_crm, update_lead_status, get_leads_by_status, create_gmail_draft, check_gmail_replies
- CONFIG block should have: leads_per_run, followup_after_days, markets, target segments
- CRITICAL: Agent must NEVER send emails directly. Drafts only. Owner reviews and sends.

### Solutions Agent
- Model: claude-opus-4-6 (use best model — this is client-facing work)
- Triggered by: Notion watcher polling Client Projects database for Status = "[TRIGGER_STATUS]" and Agent Triggered = false
- Creates: project plans, README files, code scaffolds, kickoff email drafts, sub-tasks in Agent Tasks DB
- Tools: get_notion_task, update_notion_task, create_file, read_file, create_gmail_draft, search_documentation, create_subtask
- Breaks projects into 5-8 actionable sub-tasks
- Sets status to "In Progress" not "Delivered" — owner delivers

### Manager Agent
- Model: claude-sonnet-4-6
- Schedule: [DIGEST_SCHEDULE, e.g. "Mon/Wed/Fri 09:00 UTC"] + daily alert check at 14:00 UTC
- Two run modes: runDigest() (full summary email) and runAlertCheck() (quick urgent-only check)
- Tools: get_agent_logs, get_leads_summary, get_projects_summary, get_content_calendar, get_open_alerts, create_alert, dismiss_alert, send_email, check_gmail_replies, update_dashboard_data
- Sends branded HTML digest email to owner
- Alert triggers: lead replied, deadline within 48h, agent errors, content flagged

## Dashboard

Static HTML served from Express at /dashboard. Features:
- Password login (uses API_SECRET_KEY)
- Overview stats: total leads, active projects, content pieces, open alerts
- Manual trigger buttons for all agents
- Kill switch: pause/resume all agents (green/red button in header)
- Tables: lead pipeline, content calendar, agent activity log, client projects
- Alerts section with dismiss buttons
- Auto-refresh every 60 seconds
- Dark theme

## API Endpoints

All /api/* routes require x-api-key header.
- GET /health — health check
- GET /api/status — pause state
- POST /api/pause — pause all agents
- POST /api/resume — resume all agents
- GET /api/logs, /api/leads, /api/projects, /api/content, /api/alerts
- POST /api/alerts/:id/dismiss
- POST /api/trigger/{marketing|sales|digest|alert-check|notion-check|solutions}

## Kill Switch

The scheduler must have an in-memory pause flag. When paused:
- All scheduled cron runs are skipped
- All manual trigger endpoints return 403
- The Notion watcher still polls but won't trigger agents
- Pause is in-memory — service restart resumes agents automatically

## Environment Variables

ANTHROPIC_API_KEY, DATABASE_URL, GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN, GMAIL_USER, NOTION_API_KEY, NOTION_CRM_DB_ID, NOTION_PROJECTS_DB_ID, NOTION_CONTENT_DB_ID, NOTION_LOGS_DB_ID, NOTION_TASKS_DB_ID, TAVILY_API_KEY, API_SECRET_KEY, OWNER_EMAIL, NODE_ENV, PORT

## Critical Rules

1. NEVER send emails directly from any agent except the Manager (for digests/alerts). All other agents create DRAFTS only.
2. Solutions Agent NEVER marks work as "Delivered" — only "In Progress" or "Review". Owner delivers.
3. Blog posts always save as DRAFT. Never auto-publish.
4. Use @notionhq/client v2, NOT v5. Version 5 breaks databases.query.
5. Always check Notion property types (status vs select) before writing — they fail silently if wrong.
6. The scheduler must include a kill switch (pause/resume).
7. All agent prompts must embed the client's brand voice, not generic content.

## Deployment

- Deploy to Railway as a single service
- Set root directory to agents/
- Share PostgreSQL with the client's website backend if applicable
- Add all env vars to Railway
- Migrations run automatically on first boot
- Generate a Railway domain for dashboard access
```

---

## KNOWN ISSUES & FIXES

Include this section in the client's owner guide (AGENT-GUIDE.md) after deployment.

### Gmail OAuth "insufficient authentication scopes"
**Symptom:** `check_gmail_replies` fails. Drafts still work but the agent cannot read inbox replies.
**Cause:** The `GMAIL_REFRESH_TOKEN` was generated without the `gmail.readonly` scope. Only compose/send was granted.
**Fix:** Regenerate the token using the `agents/scripts/gmail-reauth.js` script with the `https://mail.google.com/` scope. Update the `GMAIL_REFRESH_TOKEN` env var in Railway and redeploy.
**Prevention:** Always use `https://mail.google.com/` (full access) when generating Gmail tokens.

### Tavily Search Returns Nothing (0 credits used)
**Symptom:** Sales agent appears to find prospects but Tavily dashboard shows 0 credits. Agent may fabricate data instead of searching.
**Cause:** The `tavily` npm package changed its export name. Using `const { tavily } = require('tavily')` returns a constants object, not a client.
**Fix:** The import in `agents/src/core/search.js` must use `TavilyClient`:
```js
const { TavilyClient } = require('tavily');
_client = new TavilyClient({ apiKey: process.env.TAVILY_API_KEY });
```
**Prevention:** After updating the tavily package, verify the export: `node -e "console.log(Object.keys(require('tavily')))"`.

### Notion Status Sync Fails ("Invalid status option")
**Symptom:** Updating a Notion entry's Status returns "Invalid status option".
**Cause:** The status name in the code does not exactly match the option name in the Notion database (case-sensitive).
**Fix:** Open the Notion database, check the exact Status option names, and update the code to match.
**Prevention:** After renaming status options in Notion, search the codebase: `grep -r "status.*name" agents/src/`.

### Notion Property Type Mismatch (status vs select)
**Symptom:** Notion API errors like "select is not a property type" or silent write failures.
**Cause:** Code uses `{ status: { name: '...' } }` but the property is a `select`, or vice versa.
**Fix:** Check the property type in Notion and match the API syntax. Native status uses `{ status: { name } }`, select uses `{ select: { name } }`.
**Prevention:** Document which databases use which property types. Currently: all databases use native `status` except Agent Tasks (DB5) which uses `select`.

---

## CLIENT ONBOARDING — Information to Collect

Before starting, gather from the client:

```
Client Name:
Domain:
Industry:
Brand Voice:        [professional/casual/technical/etc.]
Target Platforms:    [LinkedIn, X, Instagram, Blog — which ones?]
ICP:                [target customer — titles, industries, company size, pain points]
Services/Products:  [what they sell/deliver]
Competitors:        [top 3-5]
Notion Workspace:   [existing or create new?]
Gmail for Sending:  [email address]
Timezone:           [for schedule alignment]
Run Frequency:      [daily, 3x/week, custom]
Website Backend:    [URL if blog publishing needed]
```

---

## POST-DEPLOYMENT CHECKLIST

After first deploy, verify:

- [ ] All 4 agents start without errors in Railway logs
- [ ] Database connected + migrations applied
- [ ] Cron jobs registered at correct times
- [ ] Notion Watcher polling without errors
- [ ] Dashboard loads and login works
- [ ] Kill switch (pause/resume) works
- [ ] Trigger each agent manually from dashboard
- [ ] Marketing: content appears in Content Calendar (Notion + PostgreSQL)
- [ ] Sales: leads appear in CRM, Gmail drafts created
- [ ] Manager: digest email received, alerts created
- [ ] Solutions: test with a project brief — plan created, sub-tasks generated
- [ ] All Notion databases receiving data without property type errors
- [ ] Blog posts save as draft on client website (if applicable)
