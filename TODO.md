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

**Decision needed:** Auto-publish or draft-first? Recommendation: start with draft-first for safety.

---

## Medium Priority

### Connect Social Media APIs (Future)
Currently all content is draft-only. When ready, consider:
- LinkedIn API (requires company page admin access)
- X/Twitter API (requires developer account)
- Instagram Graph API (requires Facebook Business account)

### Add Language/Market Properties to Content Calendar
The Notion Content Calendar doesn't have Language or Market properties. The PostgreSQL table stores them but Notion doesn't. Consider adding:
- Language (select: en, de)
- Market (select: Nigeria, Germany, Both)

### Admin Panel Blog Editor
The admin panel exists but may need a proper blog post editor UI for manual post creation/editing. Currently would need to use the API directly.

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
