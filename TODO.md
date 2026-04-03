# Evawero Digital — TODO

## High Priority

### ~~Allow Marketing Agent to Publish Blog Posts on evawerodigital.com~~ DONE
Marketing agent writes full blog posts with Unsplash cover images, saves as drafts via agent API endpoint. Owner reviews and publishes from admin panel. Draft-first is a standing instruction.

---

### Investigate Tavily API & Sales Agent Search
Tavily dashboard showed 0/1000 credits used despite TAVILY_API_KEY being set on Railway. Need to confirm:
1. Is the Tavily key actually working? (test it directly)
2. If Tavily is down/broken, what has the sales agent been using to find prospect contact info?
3. Check Railway logs for Tavily-related errors
4. Fix or replace if needed — the sales agent should not be fabricating email addresses

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

### Prepare Agent System Demo for Printing Company (Nigeria)
Build a tailored demo showcasing the sales and marketing agents for a Nigerian printing company prospect. Demo ideas:

**Sales Agent Demo:**
- Pre-load Notion CRM (DB2) with sample printing industry leads (e.g. corporate clients, event planners, schools, churches)
- Show the agent researching a prospect, scoring the lead, and drafting a personalized outreach email
- Show follow-up sequences — agent detects no reply and drafts a follow-up
- Highlight: "Your sales pipeline fills itself while you focus on production"

**Marketing Agent Demo:**
- Configure brand bible with printing company branding (name, services: business cards, banners, flyers, branded merch, large format)
- Have the agent generate 2-3 sample blog posts targeting Nigerian market (e.g. "5 Print Materials Every Lagos Business Needs", "Wedding Invitation Printing Trends in Nigeria 2026")
- Show content calendar in Notion with scheduled posts
- Highlight: "Consistent content marketing without hiring a content team"

**Demo Format Options:**
1. **Live walkthrough** — Screen share the Notion databases + admin panel, trigger a run, show results in real time
2. **Before/after snapshot** — Show empty Notion boards → trigger agents → show filled pipeline + drafted content
3. **Short video/Loom** — Record a 3-5 min demo once, reuse for multiple prospects

**Prep steps:**
- [ ] Create a demo tenant/workspace (separate Notion databases so it doesn't mix with Evawero data)
- [ ] Write printing-industry brand bible and sample prompts
- [ ] Seed 5-10 realistic Nigerian printing leads in the CRM
- [ ] Run agents once to generate demo output
- [ ] Prepare a 1-page "what you're seeing" explainer to share with the prospect

---

### Productize Agent System for Client Deployments
Build the infrastructure needed to deploy agent systems for paying clients:
1. **Template repo** — Stripped-down version of `agents/` with placeholder config, no Evawero branding or prompts
2. **Notion template workspace** — Duplicatable workspace with all 5 databases pre-configured (correct property types, status options, relations)
3. **Setup/onboarding script** — Validates all env vars are filled in, tests connections (Notion, Gmail OAuth, Anthropic key), confirms databases exist
4. **Client onboarding checklist** — Step-by-step guide: create Railway project, set env vars, customize prompts for client's industry/brand, first test run
5. **Prompt customization workflow** — Feed Claude Code the client's brand info and have it rewrite all agent prompts from the template

Client never touches code/GitHub/Railway — they interact through Notion and Gmail only.

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
