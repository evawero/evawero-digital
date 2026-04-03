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

### Switch Instagram Graphics to Canva API
Replace the current Puppeteer HTML-to-image approach with Canva's API for higher quality, professionally designed Instagram graphics.

**Why:** Current HTML-rendered graphics are functional but lack the polish of proper design tools. Canva templates give professional results with brand consistency.

**What's needed:**

1. **Canva Pro account** (~$13/month) — required for API access
   - Sign up at canva.com
   - Upgrade to Canva Pro or Canva for Teams

2. **Canva Connect API access** — apply at canva.com/developers
   - Create an app in the Canva Developer Portal
   - Get `CANVA_API_KEY` and `CANVA_API_SECRET`
   - API is currently in beta — may need to join waitlist

3. **Design branded templates in Canva** (5-8 templates covering common formats):
   - Quote card (inspirational/educational quote, green brand bg)
   - Tip list (3-5 numbered tips, clean layout)
   - Stat highlight (bold number + context)
   - Announcement (headline + subtext)
   - Before/after comparison
   - Carousel slide (for multi-slide posts)
   - Each template should use Evawero brand colours (#1D9E75, #0F6E56, #111, #fff), fonts, and ED logo

4. **Note each template's Canva design ID** — the API uses these to create new designs from templates

5. **Update the marketing agent:**
   - Replace `core/graphics.js` Puppeteer logic with Canva API calls
   - Agent picks a template ID, sends text content to Canva API
   - Canva renders the design, returns an image URL
   - Save the Canva image URL to `content_calendar.image_url` (no more base64 in DB)
   - Remove Puppeteer dependency from agents/package.json

6. **Add Railway env vars:**
   - `CANVA_API_KEY`
   - `CANVA_API_SECRET`

7. **Migration:** Add `image_url` column to content_calendar (replace `image_data` base64 approach)

**Canva API flow:**
```
Agent decides on content → picks template ID → sends text via Canva API
→ Canva renders design → returns image URL → saved to DB + Notion
```

**Alternative if Canva API waitlist is long:** Use Canva's direct share links — agent saves the text content + template suggestion to Notion, owner manually creates the graphic in Canva using the template. Less automated but still saves time.

**Prep steps:**
- [ ] Sign up for Canva Pro
- [ ] Apply for Canva Connect API access
- [ ] Design 5-8 branded templates in Canva
- [ ] Get API credentials
- [ ] Update agent code to use Canva API
- [ ] Test for 2 runs, then remove Puppeteer fallback

---

### Add German Language Version to evawerodigital.com
Add a language toggle (EN | DE) so visitors can browse the site in German. Two parts: static UI text and dynamic database content.

**Part 1: Static content (frontend i18n)**

1. Install `react-i18next` and `i18next` in `frontend/`
2. Create `frontend/src/locales/en.json` — extract all hardcoded English strings from every page and component (hero text, page descriptions, button labels, nav items, footer text, section headings)
3. Create `frontend/src/locales/de.json` — German translations of all strings (Claude can translate)
4. Wrap the app with `I18nextProvider` in `main.jsx`
5. Replace all hardcoded strings in components with `t('key')` calls
6. Add language toggle button to Navbar (EN | DE), save preference to `localStorage`

**Pages to translate:**
- [ ] Home (hero, all section headings, CTAs)
- [ ] Services (hero, all service titles/descriptions)
- [ ] Products (hero, all product names/taglines/descriptions, "Learn more"/"Show less" buttons)
- [ ] About (hero, all content sections)
- [ ] Blog (hero, listing labels — blog posts themselves are already tagged with language)
- [ ] Contact (hero, form labels, submit button)
- [ ] Navbar (all links, "Book Assessment" CTA)
- [ ] Footer (all text, links)

**Part 2: Dynamic content (database)**

7. Blog posts — already have a `language` field. Update the blog listing page to filter by current language. Show only English posts when EN is selected, German posts when DE is selected.
8. Products — add German versions of product data. Options:
   - a) Add `language` column to products table, duplicate rows with German content
   - b) Add a `translations` JSONB column with `{ de: { name, tagline, description } }`
   - Option (b) is simpler since there are only 3 products
9. Services — same approach as products
10. API endpoints — add `?lang=de` query parameter support, return translated content

**Part 3: Polish**

11. Set `<html lang="de">` when German is active (SEO)
12. Update `<Helmet>` meta descriptions to use translated versions
13. Test all pages in both languages
14. Ensure the demo pages (`/demo/*`) remain English-only (they're client-specific)

**Order of work:** Part 1 first (immediate German UI), then Part 2 (translated dynamic content), then Part 3 (SEO polish).

---

## Low Priority

### Add Lead Scoring to Sales Agent
Currently the sales agent uses Claude's judgement to evaluate prospects. Add a configurable scoring system for more systematic lead qualification.

**What to build:**
- Configurable scoring rules per client (e.g., +10 for target industry, +5 for target city, -20 if company too small)
- Industry match scoring (e.g., hospitality = high priority for a printing client)
- Location match scoring (Lagos = +10, Abuja = +5, other = 0)
- Company size detection where possible
- Minimum score threshold before adding to CRM
- Score stored in the `leads` table and visible in Notion CRM
- Config lives in `sales/index.js` alongside existing CONFIG object

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
