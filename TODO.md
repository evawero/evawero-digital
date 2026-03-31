# Evawero Digital — TODO

## High Priority

### Allow Marketing Agent to Publish Blog Posts on evawerodigital.com
The website already has full blog infrastructure (frontend pages, backend API, database table). The marketing agent currently only saves blog outlines to the Content Calendar. It needs to write full posts and publish them directly.

**What exists:**
- `blog_posts` table in PostgreSQL (title, slug, excerpt, content, cover_image, author, category, status)
- Public API: `GET /api/blog-posts`, `GET /api/blog-posts/:slug`
- Admin API: `POST /api/admin/blog-posts` (JWT-protected)
- Frontend: `/blog` listing page, `/blog/:slug` post page, `BlogCard` component
- Navigation already links to `/blog`

**What needs to be done:**
1. Add a `publish_blog_post` tool to the marketing agent (`agents/src/agents/marketing/tools.js`)
   - Calls the backend admin API to create a blog post
   - Sets status to `draft` (owner reviews before publishing) OR `published` (auto-publish)
   - Generates a URL-friendly slug from the title
   - Should write full 1200-1800 word posts, not just outlines
2. Add backend API auth for the agent — either:
   - A shared API key header the agent can use (simpler, recommended)
   - Or generate a JWT token for the agent (more complex)
3. Update the marketing agent prompt to write full blog posts instead of outlines
   - Change "BLOG OUTLINE" section to "BLOG POST" in the Brand Bible
   - Instruct the agent to write complete, SEO-optimised posts
4. Update the marketing agent's CONFIG to include a `blog_auto_publish` flag (default: false)
   - When false: saves as draft, you review in admin panel and publish
   - When true: publishes directly to the live site
5. Update Content Calendar save to include the blog post URL after publishing
6. Test the full flow: agent creates post → appears in admin panel → publish → visible on site

**Decision:** Draft-first. All blog posts save as drafts. Do NOT switch to auto-publish until owner (Evawero) explicitly confirms. This is a standing instruction.

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

### Switch to Domain Email
When domain email is ready (e.g. hello@evawerodigital.com):
- If Google Workspace: re-run OAuth flow with new account, update GMAIL_USER and GMAIL_REFRESH_TOKEN on both Railway services (api + agents)
- If non-Google provider: need different email integration entirely
- Update OWNER_EMAIL on agents service
- Test: contact form, agent digests, sales drafts, solutions kickoff emails

### Add Language/Market Properties to Content Calendar
The Notion Content Calendar doesn't have Language or Market properties. The PostgreSQL table stores them but Notion doesn't. Consider adding:
- Language (select: en, de)
- Market (select: Nigeria, Germany, Both)

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
