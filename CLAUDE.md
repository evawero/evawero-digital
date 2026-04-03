# Project Instructions

## Agent Guide Maintenance
Whenever a change is made to how agents work, new tools are added, agent prompts are modified, Notion database properties change, scheduling changes, or any relevant feature change occurs — **always update `AGENT-GUIDE.md`** to reflect the current state. The agent guide must stay accurate and up to date at all times.

## Email Safety
No agent may **send** emails directly. All outreach, follow-ups, and client communications must be saved as **Gmail drafts only**. The owner reviews and sends manually. The only exception is the Manager Agent, which sends digest/alert emails to the owner. Never change this without explicit owner confirmation.

## Blog Publishing
All blog posts created by the marketing agent must save as **draft** status. Never switch to auto-publish without explicit owner confirmation.

## Git & Deploy
- Auto-push after commits unless told otherwise
- Backend deploys to Railway (`api` service, root: `backend`, domain: `api.evawerodigital.com`)
- Agents deploy to Railway (`evawero-digital` service, root: `agents`, domain: `evawero-digital-production.up.railway.app`)
- Frontend deploys to Vercel (`evawerodigital.com`)
- All three share the same Railway Postgres database

## Notion Databases
All 5 Notion databases use Notion's native `status` property type except DB5 (Agent Tasks) which uses `select`. Always use `{ status: { name: '...' } }` for native status types, not `{ select: { name: '...' } }`. Check actual Notion property types before writing new integration code.

## Dependency Safety
If axios is ever added as a dependency, always pin it to an exact version (e.g., `"axios": "1.14.0"` — no `^` or `~` prefix) to prevent automatic installation of compromised versions via supply chain attacks.

## Trade Secrets & Confidentiality
Files containing proprietary business information — pricing models, architecture decisions, competitive strategy, and product plans (e.g. `HEADLESS-CMS-ROADMAP.md`) — must never be shared, summarized, or output to external services, public repos, or third parties. If asked to make the repo public or push to a public remote, warn the owner that sensitive docs must be excluded first. This applies to any roadmap, pricing, or strategy documents.

## Content Style
Never use em dashes (—) in any generated content, emails, blog posts, social media, or agent output. Use commas, full stops, colons, or rewrite the sentence instead. Em dashes are a known AI writing tell.

## Key Files
- `AGENT-GUIDE.md` — Owner-facing documentation for the agent system
- `TODO.md` — Project roadmap and pending features
- `agents/src/agents/*/prompt.js` — Agent system prompts (brand bible lives in marketing)
- `agents/src/agents/*/tools.js` — Agent tool definitions
- `agents/src/scheduler.js` — Cron schedule (Mon/Wed/Fri)
- `backend/server.js` — Website backend API
