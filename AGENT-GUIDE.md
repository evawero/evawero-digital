# Evawero Agent System — Owner Guide

## Overview

You have 4 AI agents running autonomously on Railway. They handle marketing, sales, client delivery, and daily reporting. Everything flows through your Notion workspace, Gmail, and a PostgreSQL database.

---

## Your Agents

### 1. Marketing Agent
**What it does:** Creates content for your brand across platforms.
- Writes LinkedIn posts (English + German), Twitter threads, Instagram captions, blog outlines
- Follows your Brand Bible (tone, messaging, positioning) embedded in its prompt
- Saves all content to the **Content Calendar** Notion database and PostgreSQL
- Content ratio: 70% educational/value, 20% case studies, 10% promotional
- German content targets the DACH market specifically

**What you do:** Review content in the Content Calendar Notion database before publishing. Nothing gets posted automatically.

### 2. Sales Agent
**What it does:** Finds leads and drafts outreach emails.
- Searches the web for potential clients matching your ICP (SMEs needing digital transformation)
- Adds prospects to **CRM: Leads & Contacts** in Notion
- Creates Gmail drafts for outreach — NEVER sends automatically
- Tracks lead status: new → contacted → replied → qualified → proposal → closed
- Market priority: Nigeria first, then Germany/DACH, then rest of Africa
- Checks Gmail for replies to previous outreach

**What you do:** Review Gmail drafts before sending. Update lead status in the CRM as conversations progress.

### 3. Solutions Agent
**What it does:** Plans and scaffolds client project deliverables.
- Triggered when you add a task to **Agent Tasks** in Notion with Status = "Ready"
- Reads the client brief from Notion
- Produces a project plan (deliverables, tech approach, timeline, assumptions)
- Creates project files and README in the codebase
- Drafts a kickoff email to the client (saved as Gmail draft)
- Uses Claude Opus (most capable model) since this is high-stakes work
- Sets status to "In Progress" — never "Delivered". You deliver.

**What you do:**
1. Create a page in **Client Projects** (DB2) with Project Title, Client Name, Brief, and Deadline
2. Set Status = "Briefed" and leave Agent Triggered unchecked
3. Wait for the agent to process (polls every 30 min, or trigger manually from dashboard)
4. Review the project plan, files, and draft kickoff email
5. Deliver to the client yourself

### 4. Manager Agent
**What it does:** Synthesises everything and reports to you.
- Reads logs from all 3 agents, lead pipeline, project status, content calendar
- Sends you a formatted digest email at theherosmind@gmail.com
- Creates alerts for urgent items (lead replied, deadline approaching, agent errors)
- Stores dashboard summary data for the web dashboard

**What you do:** Read your digest email. Act on items in the "NEEDS YOUR ATTENTION" section. Dismiss alerts from the dashboard once handled.

---

## Schedule

All times are UTC. Agents run Monday, Wednesday, Friday only (cost savings).

| Time | Agent | Action |
|------|-------|--------|
| 07:00 Mon/Wed/Fri | Marketing | Creates content batch |
| 08:00 Mon/Wed/Fri | Sales | Prospects + drafts outreach |
| 09:00 Mon/Wed/Fri | Manager | Sends digest email |
| 14:00 Daily | Manager | Quick alert check (no email unless urgent) |
| Every 30 min | Notion Watcher | Polls Agent Tasks for new projects |

**Why Mon/Wed/Fri?** Each agent run costs money (Anthropic API calls). 3x/week balances coverage with cost. You can always trigger agents manually from the dashboard if needed between scheduled runs.

---

## Dashboard

**URL:** Your Railway service URL + `/dashboard`
(e.g. `https://your-service.up.railway.app/dashboard`)

**Login:** Use the `API_SECRET_KEY` value from your environment variables (`addict-language-want`)

**What you see:**
- **Overview** — Total leads, active projects, content pieces (7 days), open alerts
- **Agent Controls** — Buttons to manually trigger any agent
- **Active Alerts** — Urgent items with dismiss buttons
- **Lead Pipeline** — Current leads by status + recent activity
- **Content Calendar** — Recent content pieces
- **Agent Activity Log** — When each agent ran, success/failure, what it did
- **Client Projects** — Active projects with deadlines

**Auto-refresh:** Dashboard refreshes every 60 seconds automatically.

---

## Notion Databases — What Goes Where

| Database | Purpose | Who writes to it |
|----------|---------|------------------|
| CRM: Leads & Contacts | Lead tracking | Sales Agent + you |
| Client Projects | Active project tracking | Solutions Agent + you |
| Content Calendar | All created content | Marketing Agent |
| Agent Logs | Run history for all agents | All agents (automatic) |
| Agent Tasks | Sub-tasks per project | Solutions Agent creates, you track |

### Client Projects — Triggering the Solutions Agent
- **Project Title** (title) — Name of the project
- **Client Name** (rich_text) — Client's name or company
- **Brief** (rich_text) — What the client needs (scope, requirements, details)
- **Deadline** (date) — Target delivery date
- **Status** (status) — Set to `Briefed` to trigger the Solutions Agent
- **Agent Triggered** (checkbox) — Automatically checked after agent processes it
- **Deliverables** (rich_text) — Filled in by the Solutions Agent after processing

Status flow: `Briefed` → `In progress` → `Review` → `Delivered` → `Closed`

### Agent Tasks (DB5) — Sub-task Tracking
When the Solutions Agent processes a client brief, it automatically creates 5-8 sub-tasks here.

- **Task** (title) — Short task name, e.g. "Build landing page"
- **Instructions** (rich_text) — Detailed instructions for the sub-task
- **Project** (rich_text) — Links back to the project title in Client Projects
- **Status** (select) — `Pending` → `In Progress` → `Done`
- **Priority** (select) — `Normal` or `Urgent`
- **Assigned To** (select) — Defaults to `Solutions`

You don't create these manually — the agent does. Use this database as a visual checklist to track progress on each project's deliverables.

### CRM — Key Properties the Sales Agent Uses
- **Name** — Contact name
- **Company** — Company name
- **Market** — Nigeria, Germany, etc.
- **Region** — More specific location
- **Status** — new, contacted, replied, qualified, proposal, closed
- **Email** — Contact email
- **Source** — How the lead was found

---

## Brand Bible (Embedded in Marketing Agent)

The Marketing Agent has your full brand identity baked into its system prompt:

- **Company:** Evawero Digital Solutions Limited
- **Tagline:** "Ideas into Digital Reality"
- **Founder:** Evawero Ukpevo
- **Markets:** Nigeria (primary), Germany/DACH (secondary)
- **Services:** Web apps, AI automation, Payload CMS solutions, digital strategy
- **Product:** Evas Intelligence (AI business toolkit) — €10/month Pro tier
- **Tone:** Professional but human, confident not arrogant, clear not jargon-heavy
- **Languages:** English (default), German (DACH content)

To update the brand bible, edit: `agents/src/agents/marketing/prompt.js`

---

## Manual Triggers

### From Dashboard
Click any button in the Agent Controls section. The agent runs in the background — check logs after a few minutes.

### From API
All endpoints require the `x-api-key` header with your API secret.

```
POST /api/trigger/marketing     — Run marketing agent
POST /api/trigger/sales         — Run sales agent
POST /api/trigger/digest        — Run manager digest
POST /api/trigger/alert-check   — Run alert check only
POST /api/trigger/notion-check  — Check Notion for new tasks
POST /api/trigger/solutions     — Run solutions agent (requires {"task_id": "notion-page-id"} in body)
```

---

## Debugging

### Check Railway Logs
Railway dashboard → your agents service → Deployments → click latest → View Logs

**Healthy startup looks like:**
```
Database connected
Migrations applied
[Server] Listening on port XXXX
[Scheduler] Cron jobs registered
[Notion Watcher] Starting — polling every 30 minutes
```

### Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| `Database connection failed` | DATABASE_URL wrong or Postgres down | Check Railway Postgres service is running, verify DATABASE_URL |
| `notion.databases.query is not a function` | Wrong Notion SDK version | Should be v2.x, run `npm install @notionhq/client@2` |
| `Could not find property` | Notion database missing a property | Add the missing property to the correct Notion database |
| `401 Unauthorized` (Anthropic) | Bad API key | Check ANTHROPIC_API_KEY in Railway variables |
| `invalid_grant` (Gmail) | Refresh token expired | Generate a new Gmail refresh token and update GMAIL_REFRESH_TOKEN |
| Agent runs but produces bad content | Prompt needs tuning | Edit the relevant `prompt.js` file |

### Check Agent Logs in Database
From the dashboard, the Agent Activity Log shows recent runs. For deeper debugging, check the Agent Logs Notion database — agents write detailed run records there too.

---

## Cost Management

**Anthropic API** is the main cost driver.
- Marketing + Sales use Sonnet (cheaper, fast)
- Solutions uses Opus (expensive, but high-quality for client work)
- Manager uses Sonnet
- Each agent run can use 5-15 tool calls, each with its own API cost

**How to reduce costs:**
- Current schedule (Mon/Wed/Fri) is already optimised vs daily
- Avoid unnecessary manual triggers
- Solutions Agent only runs when you add a task — no idle cost
- The daily 14:00 alert check is lightweight (Sonnet, few tool calls)

**How to increase coverage:**
- Edit `agents/src/scheduler.js` to change cron expressions
- Example: change `'0 7 * * 1,3,5'` to `'0 7 * * *'` for daily runs

---

## Key Files to Know

| File | When to edit |
|------|-------------|
| `agents/src/agents/marketing/prompt.js` | Update brand bible, tone, platform rules |
| `agents/src/agents/sales/prompt.js` | Change ICP, outreach style, market priority |
| `agents/src/agents/solutions/prompt.js` | Change delivery standards, tech stack |
| `agents/src/agents/manager/prompt.js` | Change digest format, alert triggers |
| `agents/src/scheduler.js` | Change run schedule |
| `agents/src/agents/sales/index.js` | Change leads per run, followup days |
| `agents/src/agents/marketing/index.js` | Change content ratio, platform toggles |

---

## Environment Variables Reference

| Variable | Service | Purpose |
|----------|---------|---------|
| ANTHROPIC_API_KEY | Anthropic | AI model access |
| DATABASE_URL | Railway Postgres | Shared database |
| GMAIL_CLIENT_ID | Google | OAuth2 |
| GMAIL_CLIENT_SECRET | Google | OAuth2 |
| GMAIL_REFRESH_TOKEN | Google | OAuth2 — regenerate if Gmail stops working |
| GMAIL_USER | Google | Your email address |
| NOTION_API_KEY | Notion | API access |
| NOTION_CRM_DB_ID | Notion | CRM database |
| NOTION_PROJECTS_DB_ID | Notion | Client Projects database |
| NOTION_CONTENT_DB_ID | Notion | Content Calendar database |
| NOTION_LOGS_DB_ID | Notion | Agent Logs database |
| NOTION_TASKS_DB_ID | Notion | Agent Tasks database |
| TAVILY_API_KEY | Tavily | Web search for agents |
| API_SECRET_KEY | Internal | Dashboard login + API auth |
| OWNER_EMAIL | Internal | Where digests get sent |
