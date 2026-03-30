# Client Agent System Deployment Template

**Internal Use Only** -- Evawero Digital Solutions deployment guide for white-label agent systems.

Fill in all `[PLACEHOLDER]` values per client engagement before starting setup.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Folder Structure](#2-folder-structure)
3. [Setup Guide](#3-setup-guide)
4. [Configuration Points](#4-configuration-points)
5. [Dashboard Setup](#5-dashboard-setup)
6. [Post-Deployment Checklist](#6-post-deployment-checklist)
7. [Maintenance Notes](#7-maintenance-notes)

---

## 1. Architecture Overview

The system runs four specialized AI agents coordinated by a manager layer. Each agent operates autonomously on a cron schedule, reads/writes to shared Notion databases, and logs all activity to PostgreSQL.

### Agent Roles

| Agent | Responsibility | Primary Output |
|-------|---------------|----------------|
| **Marketing Agent** | Content research, trend monitoring, post drafting, audience analysis | Draft posts, content calendar entries, research summaries |
| **Sales Agent** | Lead identification, outreach drafting, follow-up sequencing, CRM updates | Lead records, outreach messages, pipeline updates |
| **Solutions/Delivery Agent** | Project tracking, deliverable monitoring, client update drafting, task management | Status reports, task updates, client communications |
| **Manager Agent** | Cross-agent coordination, conflict resolution, priority balancing, performance summaries | Daily digests, priority adjustments, escalation alerts |

### Data Flow

```
External Sources (web, social, email)
        |
        v
  [Marketing Agent] ---> Notion: Content DB, Research DB
  [Sales Agent]     ---> Notion: Leads DB, Outreach DB
  [Solutions Agent] ---> Notion: Projects DB
        |
        v
  [Manager Agent] reads all DBs, writes summaries & adjustments
        |
        v
  PostgreSQL (activity logs, metrics, audit trail)
        |
        v
  Dashboard (read-only view of agent activity & KPIs)
```

Each agent:
- Runs on its own cron schedule
- Has a dedicated system prompt defining its persona, goals, and constraints
- Uses Anthropic Claude as its LLM backbone
- Can call tools (web search via Tavily, Notion API, Gmail API)
- Logs every action to PostgreSQL for auditing

---

## 2. Folder Structure

Create this structure for each new client deployment:

```
[client-slug]-agents/
├── agents/
│   ├── marketing/
│   │   ├── index.ts            # Entry point & cron handler
│   │   ├── prompt.ts           # System prompt
│   │   ├── tools.ts            # Agent-specific tool definitions
│   │   └── config.ts           # Schedule, platform toggles
│   ├── sales/
│   │   ├── index.ts
│   │   ├── prompt.ts
│   │   ├── tools.ts
│   │   └── config.ts
│   ├── solutions/
│   │   ├── index.ts
│   │   ├── prompt.ts
│   │   ├── tools.ts
│   │   └── config.ts
│   └── manager/
│       ├── index.ts
│       ├── prompt.ts
│       ├── tools.ts
│       └── config.ts
├── shared/
│   ├── notion.ts               # Notion client & DB helpers
│   ├── anthropic.ts            # Claude client wrapper
│   ├── tavily.ts               # Web search client
│   ├── gmail.ts                # Gmail OAuth helpers
│   ├── db.ts                   # PostgreSQL connection & queries
│   ├── logger.ts               # Structured logging
│   └── types.ts                # Shared TypeScript types
├── db/
│   ├── migrations/
│   │   ├── 001_create_activity_logs.sql
│   │   ├── 002_create_agent_runs.sql
│   │   └── 003_create_metrics.sql
│   └── seed.sql                # Optional seed data
├── dashboard/
│   ├── src/
│   │   ├── app/                # Next.js app router pages
│   │   ├── components/         # UI components
│   │   └── lib/                # API helpers
│   ├── package.json
│   └── next.config.js
├── scripts/
│   ├── run-agent.ts            # Manual agent trigger
│   ├── migrate.ts              # DB migration runner
│   └── test-notion.ts          # Notion connection test
├── .env.example
├── package.json
├── tsconfig.json
├── Procfile                    # Railway process config
└── railway.toml
```

---

## 3. Setup Guide

### 3.1 Prerequisites

Ensure the following are available before starting:

- [ ] **Node.js** >= 18.x
- [ ] **PostgreSQL** 15+ (Railway provides this, or use local for dev)
- [ ] **Railway account** with a project created for this client
- [ ] **Notion workspace** -- either client's existing workspace or a new one created for them
- [ ] **Notion integration** created at https://www.notion.so/my-integrations with read/write access
- [ ] **Gmail OAuth credentials** -- OAuth 2.0 client ID from Google Cloud Console (for sending/reading email)
- [ ] **Anthropic API key** -- from https://console.anthropic.com
- [ ] **Tavily API key** -- from https://tavily.com (for web search/research)

### 3.2 Notion Database Setup

Create five databases in the client's Notion workspace. Share each with the Notion integration.

#### Database 1: Content

| Property | Type | Notes |
|----------|------|-------|
| Title | Title | Post/content title |
| Status | Select | Options: `Idea`, `Researching`, `Drafted`, `Review`, `Approved`, `Published`, `Archived` |
| Platform | Multi-select | Options: `LinkedIn`, `Twitter/X`, `Blog`, `Email`, `Instagram` (adjust per client) |
| Content Type | Select | Options: `Post`, `Article`, `Thread`, `Newsletter`, `Case Study` |
| Body | Rich text | The actual content |
| Source URL | URL | Research source if applicable |
| Scheduled Date | Date | Target publish date |
| Agent Notes | Rich text | Internal notes from the marketing agent |
| Created By | Select | Options: `Marketing Agent`, `Manual` |
| Engagement Score | Number | Populated post-publish if tracking is enabled |

#### Database 2: Research

| Property | Type | Notes |
|----------|------|-------|
| Title | Title | Research topic or finding |
| Category | Select | Options: `Industry Trend`, `Competitor`, `Market Data`, `Technology`, `Audience Insight` |
| Summary | Rich text | Key findings |
| Source URLs | Rich text | Reference links |
| Relevance Score | Number | 1-10 rated by agent |
| Date Found | Date | When the research was conducted |
| Used In | Relation | Links to Content DB entries that used this research |

#### Database 3: Leads

| Property | Type | Notes |
|----------|------|-------|
| Name | Title | Contact or company name |
| Company | Rich text | Company name if contact-level record |
| Status | Select | Options: `Identified`, `Researching`, `Outreach Sent`, `Replied`, `Qualified`, `Meeting Booked`, `Closed Won`, `Closed Lost`, `Nurture` |
| Source | Select | Options: `Web Research`, `Inbound`, `Referral`, `Event`, `Manual` |
| LinkedIn URL | URL | |
| Email | Email | |
| Industry | Select | Customize options per client's target market |
| Company Size | Select | Options: `1-10`, `11-50`, `51-200`, `201-500`, `500+` |
| Notes | Rich text | Agent research notes |
| Last Contact | Date | |
| Next Action | Rich text | What the sales agent plans to do next |
| Score | Number | Lead quality score 1-100 |

#### Database 4: Outreach

| Property | Type | Notes |
|----------|------|-------|
| Title | Title | Outreach subject/label |
| Lead | Relation | Links to Leads DB |
| Channel | Select | Options: `Email`, `LinkedIn`, `Twitter/X`, `Phone` |
| Type | Select | Options: `Initial`, `Follow-up 1`, `Follow-up 2`, `Follow-up 3`, `Breakup` |
| Status | Select | Options: `Drafted`, `Review`, `Approved`, `Sent`, `Replied`, `Bounced` |
| Message Body | Rich text | The outreach message |
| Sent Date | Date | |
| Response | Rich text | If they replied, capture it here |

#### Database 5: Projects

| Property | Type | Notes |
|----------|------|-------|
| Title | Title | Project name |
| Client | Rich text | Client/account name |
| Status | Select | Options: `Discovery`, `In Progress`, `Review`, `Delivered`, `On Hold`, `Closed` |
| Start Date | Date | |
| Due Date | Date | |
| Health | Select | Options: `On Track`, `At Risk`, `Blocked`, `Completed` |
| Tasks Summary | Rich text | Agent-generated summary of open tasks |
| Last Update | Date | |
| Agent Notes | Rich text | Solutions agent observations |
| Stakeholders | Rich text | Key contacts for this project |

After creating all five databases, record their database IDs (the 32-character hex string in the Notion URL after the workspace name and before the `?v=` parameter).

### 3.3 Environment Variables

Create a `.env` file from the template. Every variable must be populated before deployment.

```env
# --- Core ---
NODE_ENV=production
PORT=3000

# --- Anthropic ---
ANTHROPIC_API_KEY=[obtain from Anthropic console]

# --- Tavily (web search) ---
TAVILY_API_KEY=[obtain from Tavily dashboard]

# --- PostgreSQL ---
DATABASE_URL=[Railway provides this, or use local connection string]
# Format: postgresql://user:password@host:port/dbname

# --- Notion ---
NOTION_API_KEY=[from Notion integration page]
NOTION_CONTENT_DB_ID=[32-char hex ID]
NOTION_RESEARCH_DB_ID=[32-char hex ID]
NOTION_LEADS_DB_ID=[32-char hex ID]
NOTION_OUTREACH_DB_ID=[32-char hex ID]
NOTION_PROJECTS_DB_ID=[32-char hex ID]

# --- Gmail OAuth ---
GMAIL_CLIENT_ID=[from Google Cloud Console]
GMAIL_CLIENT_SECRET=[from Google Cloud Console]
GMAIL_REFRESH_TOKEN=[obtained via OAuth flow]
GMAIL_USER=[client's sending email address]

# --- Agent Scheduling (cron expressions) ---
MARKETING_CRON="0 8 * * 1-5"
SALES_CRON="0 9 * * 1-5"
SOLUTIONS_CRON="0 10 * * 1-5"
MANAGER_CRON="0 17 * * 1-5"

# --- Feature Flags ---
ENABLE_MARKETING_AGENT=true
ENABLE_SALES_AGENT=true
ENABLE_SOLUTIONS_AGENT=true
ENABLE_MANAGER_AGENT=true

# --- Client Identity ---
CLIENT_NAME=[CLIENT_NAME]
CLIENT_DOMAIN=[CLIENT_DOMAIN]
CLIENT_INDUSTRY=[CLIENT_INDUSTRY]
```

### 3.4 Database Migration

Run migrations against the target PostgreSQL instance:

```bash
# Set DATABASE_URL first, then:
npm run migrate

# Or manually:
psql $DATABASE_URL -f db/migrations/001_create_activity_logs.sql
psql $DATABASE_URL -f db/migrations/002_create_agent_runs.sql
psql $DATABASE_URL -f db/migrations/003_create_metrics.sql
```

Core tables created by migrations:

**activity_logs** -- Every action an agent takes:
- `id`, `agent_name`, `action_type`, `description`, `metadata` (JSONB), `created_at`

**agent_runs** -- Each scheduled or manual run:
- `id`, `agent_name`, `started_at`, `finished_at`, `status`, `tokens_used`, `error_message`

**metrics** -- Daily rollup KPIs:
- `id`, `agent_name`, `metric_name`, `metric_value`, `date`, `created_at`

### 3.5 Deployment to Railway

1. **Create Railway project** at https://railway.app -- one project per client.

2. **Provision PostgreSQL** -- add a Postgres plugin to the project. Railway auto-sets `DATABASE_URL`.

3. **Connect repository** -- link the client's agent repo (GitHub) to a Railway service.

4. **Set environment variables** -- paste all variables from Section 3.3 into Railway's service variables panel. `DATABASE_URL` is auto-populated by Railway if using their Postgres plugin.

5. **Configure build**:
   - Build command: `npm install && npm run build`
   - Start command: `npm start`

6. **Deploy** -- push to main branch or trigger manual deploy.

7. **Run migrations** -- use Railway's CLI or shell:
   ```bash
   railway run npm run migrate
   ```

8. **Verify** -- check Railway logs to confirm agents start and cron schedules register. First runs will appear at the scheduled times.

**railway.toml** reference:
```toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "npm start"
healthcheckPath = "/health"
restartPolicyType = "on_failure"
restartPolicyMaxRetries = 3
```

---

## 4. Configuration Points

These are the items that change per client deployment. Review each one during onboarding.

### 4.1 Agent Prompts

Each agent's `prompt.ts` file contains its system prompt. Customize:

| Variable | Where | What to Change |
|----------|-------|----------------|
| Brand voice | All agents | Tone, formality level, vocabulary |
| ICP (Ideal Customer Profile) | Sales agent | Target industries, company sizes, job titles, pain points |
| Market focus | Marketing agent | Topics, platforms, competitor names, hashtags |
| Service offerings | Solutions agent | What the client delivers, typical project types |
| Escalation rules | Manager agent | When to flag issues, thresholds for alerts |

**Prompt template pattern** -- each prompt.ts should export a function that interpolates client config:

```typescript
export function getSystemPrompt(config: ClientConfig): string {
  return `You are a ${config.agentRole} agent working for ${config.clientName}.

  Brand voice: ${config.brandVoice}
  Target market: ${config.targetMarket}
  // ... rest of prompt
  `;
}
```

### 4.2 Schedule

Default schedules (all times UTC, weekdays only):

| Agent | Default Cron | Runs At |
|-------|-------------|---------|
| Marketing | `0 8 * * 1-5` | 8:00 AM Mon-Fri |
| Sales | `0 9 * * 1-5` | 9:00 AM Mon-Fri |
| Solutions | `0 10 * * 1-5` | 10:00 AM Mon-Fri |
| Manager | `0 17 * * 1-5` | 5:00 PM Mon-Fri |

Adjust per client timezone and preferences. Some clients may want:
- Multiple runs per day: `0 8,14 * * 1-5`
- Weekend runs: `0 8 * * *`
- Reduced frequency: `0 8 * * 1,3,5`

### 4.3 Platform Toggles

In each agent's `config.ts`, toggle which platforms/channels are active:

```typescript
export const platformConfig = {
  linkedin: true,
  twitter: false,
  blog: true,
  email: true,
  instagram: false,
};
```

### 4.4 Tool Integrations

Some clients may need additional integrations beyond the base set. Common additions:

| Integration | Use Case | Setup Required |
|-------------|----------|----------------|
| Slack webhook | Real-time alerts to client's Slack | Webhook URL in env vars |
| HubSpot API | CRM sync instead of/alongside Notion | API key + field mapping |
| WordPress API | Direct blog publishing | App password + site URL |
| Calendly | Meeting booking from sales agent | API key + event type |
| Stripe | Revenue tracking in manager reports | Restricted API key |

Add new tool files to the relevant agent's directory and register them in `tools.ts`.

---

## 5. Dashboard Setup

The dashboard is a Next.js app that reads from the shared PostgreSQL database and Notion databases. It gives the team (not the client) visibility into agent performance.

### 5.1 Pages to Include

| Page | Shows |
|------|-------|
| `/` | Overview: agent run counts, success rates, token usage (last 7 days) |
| `/agents/[name]` | Per-agent detail: recent runs, logs, error history |
| `/content` | Content pipeline from Notion Content DB |
| `/leads` | Lead pipeline from Notion Leads DB |
| `/projects` | Project health from Notion Projects DB |
| `/logs` | Searchable activity log from PostgreSQL |
| `/costs` | Token usage and estimated API cost breakdown |

### 5.2 Deployment

Deploy the dashboard as a separate Railway service within the same project. It shares `DATABASE_URL` and Notion credentials.

```bash
# In the dashboard/ directory:
npm install
npm run build
npm start
```

Set `NEXT_PUBLIC_API_URL` if the dashboard calls a separate API service.

Password-protect the dashboard (basic auth or a simple login) -- it exposes operational data that should not be public.

---

## 6. Post-Deployment Checklist

Run through this after the first deploy and first successful agent run cycle.

### Connectivity
- [ ] All four agents start without errors in Railway logs
- [ ] Agents can read from Notion databases (check for 401/403 errors)
- [ ] Agents can write to Notion databases
- [ ] PostgreSQL activity_logs table is receiving entries
- [ ] Gmail OAuth token is valid and sending works (test with a draft, not a live send)
- [ ] Tavily search returns results (check for API key errors)

### Agent Behavior
- [ ] Marketing agent produces content drafts in the Content DB
- [ ] Sales agent identifies leads and writes to the Leads DB
- [ ] Solutions agent reads Projects DB and writes status updates
- [ ] Manager agent produces a daily summary that references the other agents' work
- [ ] No agent is hallucinating database IDs or writing to wrong databases

### Quality
- [ ] Content drafts match the client's brand voice
- [ ] Lead targeting matches the client's ICP
- [ ] Outreach messages are appropriate in tone and do not make false claims
- [ ] Manager summaries are accurate and actionable

### Operations
- [ ] Cron schedules fire at expected times (check `agent_runs` table)
- [ ] Error handling works -- agents recover gracefully from API failures
- [ ] Token usage per run is within acceptable bounds (check `agent_runs.tokens_used`)
- [ ] Dashboard loads and displays current data
- [ ] Railway health check endpoint responds

---

## 7. Maintenance Notes

### 7.1 Monitoring

**Daily (automated):** The manager agent's summary serves as a daily health check. If it stops arriving, investigate.

**Weekly (manual):**
- Review `agent_runs` table for failed runs and recurring errors
- Check token usage trends -- sudden spikes may indicate prompt issues or infinite loops
- Scan Notion databases for low-quality outputs that slipped through
- Verify cron jobs are still registered (Railway can drop them on redeploy)

**Monthly:**
- Review and refresh agent prompts based on output quality
- Update ICP and market focus if client's strategy has shifted
- Rotate API keys if required by client's security policy
- Check for Anthropic model updates and test new models in staging

### 7.2 Cost Management

Primary cost drivers:

| Cost | Source | Control Lever |
|------|--------|---------------|
| LLM tokens | Anthropic API | Prompt length, run frequency, max_tokens setting |
| Web search | Tavily API | Number of searches per agent run |
| Database | Railway PostgreSQL | Retention policy on logs (drop old rows) |
| Compute | Railway service | Instance size, run duration |

**Cost reduction tactics:**
- Use `claude-3-5-haiku` for routine tasks, reserve `claude-sonnet` or `claude-opus` for complex reasoning
- Cache Tavily results in PostgreSQL to avoid duplicate searches
- Set `max_tokens` caps per agent to prevent runaway responses
- Implement log retention: delete `activity_logs` older than 90 days
- Reduce cron frequency if agent output quality is consistent

**Typical monthly cost range per client:** Track and document after the first billing cycle. Initial estimate depends on run frequency and prompt complexity.

### 7.3 Prompt Tuning

Prompts degrade over time as markets shift and agent outputs become stale. Schedule prompt reviews:

- **Week 1-2 post-launch:** Review daily, expect 2-3 prompt revisions
- **Week 3-4:** Review every other day
- **Month 2+:** Weekly review, tune as needed
- **Quarterly:** Full prompt audit across all four agents

**Common prompt issues and fixes:**

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| Generic, bland content | Prompt lacks specificity | Add concrete examples, competitor names, industry jargon |
| Wrong audience targeting | ICP not detailed enough | Add job titles, company characteristics, pain points to sales prompt |
| Repetitive outputs | No variety instructions | Add rotation rules ("alternate between formats", "never repeat a topic within 7 days") |
| Hallucinated facts | No grounding instructions | Add "only cite information found via web search" constraint |
| Overly long outputs | No length constraints | Add explicit word/character limits per output type |

### 7.4 Troubleshooting Quick Reference

| Issue | Check |
|-------|-------|
| Agent not running | Railway logs, cron registration, `ENABLE_*` env vars |
| Notion 401 error | Integration token expired or not shared with database |
| Gmail send failure | OAuth refresh token expired -- re-run OAuth flow |
| Tavily empty results | API key quota, search query too narrow |
| High token usage | Check prompt length, look for retry loops in logs |
| Dashboard blank | `DATABASE_URL` mismatch, CORS issues, build errors |
| Duplicate entries in Notion | Deduplication logic missing, agent ran twice (check cron overlap) |

---

## Appendix: Client Onboarding Information to Collect

Before starting setup, gather from the client:

```
Client Name:          [CLIENT_NAME]
Domain:               [CLIENT_DOMAIN]
Industry:             [CLIENT_INDUSTRY]
Brand Voice:          [e.g., professional but approachable, technical, casual]
Target Platforms:     [e.g., LinkedIn, Twitter/X, Blog]
ICP Description:      [target customer profile -- titles, industries, company size, pain points]
Services/Products:    [what they sell/deliver]
Competitors:          [top 3-5 competitor names]
Existing Notion?:     [yes/no -- if yes, get workspace invite]
Gmail for Sending:    [email address agents will send from]
Timezone:             [for cron schedule alignment]
Agent Run Frequency:  [daily, twice daily, custom]
Dashboard Access:     [who on our team needs access]
```
