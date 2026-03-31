# Evawero Digital — TODO

## High Priority

### ~~Allow Marketing Agent to Publish Blog Posts on evawerodigital.com~~ DONE
Marketing agent writes full blog posts with Unsplash cover images, saves as drafts via agent API endpoint. Owner reviews and publishes from admin panel. Draft-first is a standing instruction.

---

## Medium Priority

### Reactivate Social Media Content Creation
Social media content (LinkedIn, X, Instagram) is currently **paused** — the marketing agent only creates blog posts. To reactivate:
1. Create social media accounts (LinkedIn, X, Instagram)
2. Tell Claude to set platform toggles back to `true` in `agents/src/agents/marketing/index.js`
3. Content will resume on the next scheduled run

Do NOT reactivate until owner confirms accounts are created.

### Connect Social Media APIs (Future)
Once accounts exist and content is reactivated, consider connecting APIs for direct posting:
- LinkedIn API (requires company page admin access)
- X/Twitter API (requires developer account)
- Instagram Graph API (requires Facebook Business account)

### ~~Switch to Domain Email~~ DONE
Switched to info@evawerodigital.com via Google Workspace. OAuth credentials, Railway env vars, and admin login updated. Google Workspace setup guide removed (setup complete).

### ~~Add Language/Market Properties to Content Calendar~~ DONE
Agent code now saves Language and Market to Notion. Requires Language (select: en, de) and Market (select: Nigeria, Germany, Both) properties to exist in the Notion Content Calendar database.

### ~~Admin Panel Blog Editor~~ DONE
Admin panel already has a blog post editor with Add New and edit functionality.

---

### ~~Create Reusable Agent System Template for Clients~~ DONE
See `AGENT-SYSTEM-TEMPLATE.md` in project root.

### Original spec:
Build a white-label version of the 4-agent architecture that can be deployed for clients. Should include:
- Generic scaffolding (no Evawero-specific branding or prompts)
- Configurable agent prompts, schedules, and tool sets
- Setup guide and deployment instructions
- Notion database templates
- Environment variable checklist

### ~~Productify Agent System as an Evawero Service~~ DONE
Added to Products page on evawerodigital.com. Pricing: custom quote.

### Original spec:
Package the agent system as a product offering for Evawero Digital Solutions. Add to the website's services/products.
- Marketing-friendly description (outcomes, not implementation details)
- Tiered pricing (e.g. number of agents, run frequency, customisation level)
- Do NOT expose architecture, tech stack, prompts, or tool implementations — these are trade secrets
- Focus on what it does for the client, not how it works internally
- Consider a demo dashboard or case study showing results

---

## Low Priority

### Agent Tasks (DB5) Automation
Sub-tasks are created by the Solutions Agent but currently just serve as a visual checklist. Future options:
- Auto-assign tasks to team members
- Track time spent per task
- Trigger agent actions based on task status changes

### Dashboard Enhancements
- Add cost tracking (Anthropic API spend per agent per run)
- Add charts/graphs for lead pipeline trends
- Add content performance metrics (if social APIs connected)
- Email digest archive viewer
