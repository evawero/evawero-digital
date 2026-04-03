# Evawero Digital SEO Checklist

**Site:** evawerodigital.com
**Search Console:** Connected (April 2026)
**Last Updated:** 2026-04-03

---

## Current State Summary

The site is a React SPA (Vite + React Router) with a reusable SEO component handling meta tags, OG, Twitter Cards, canonical URLs, hreflang, and structured data. Google Analytics (GA4) and Vercel Analytics are installed. A dynamic sitemap and 404 page are in place. Remaining gaps: SPA crawlability, content/keyword optimization, and off-page SEO.

---

## Phase 1: Critical On-Page SEO (Do First)

- [x] **Add Open Graph tags to every page** - og:title, og:description, og:image, og:url, og:type. (SEO component)
- [x] **Add Twitter Card meta tags** - twitter:card, twitter:title, twitter:description, twitter:image. (SEO component)
- [x] **Set canonical URLs on every page** - `<link rel="canonical">` on all pages via SEO component.
- [x] **Add hreflang tags for EN/DE** - `<link rel="alternate" hreflang="en/de/x-default">` on all pages.
- [x] **Add structured data (JSON-LD)** for:
  - `Organization` schema on homepage
  - `WebSite` schema on homepage
  - `Service` schema on the services page
  - `BlogPosting` schema on each blog post
  - `BreadcrumbList` schema on all inner pages
  - `ProfessionalService` on services page
- [x] **Generate dynamic sitemap** - backend endpoint at `/api/sitemap.xml` includes all published blog posts.
- [x] **Submit sitemap in Search Console** - submitted `https://api.evawerodigital.com/api/sitemap.xml`.
- [x] **Create a proper 404 page** - NotFound page with navigation to Home and Contact.
- [x] **Create proper OG image** - branded 1200x630px PNG at `/og-image.png`.
- [x] **Install Google Analytics (GA4)** - tracking ID G-MREV0YXB44.
- [x] **Install Vercel Analytics** - Web Vitals monitoring enabled.

---

## Phase 2: Content and Keyword Optimization

- [ ] **Keyword research** - identify 5-10 primary keywords per page (e.g., "AI consulting for businesses", "digital transformation agency", "business automation services"). Use Search Console data as it builds up.
- [ ] **Optimize H1 tags** - ensure each page has exactly one H1 that includes the primary keyword naturally.
- [x] **Improve meta descriptions** - all pages updated with keyword-rich descriptions and CTAs (EN + DE).
- [ ] **Add internal linking** - link between related pages (e.g., blog posts linking to services, services linking to contact). This distributes page authority.
- [ ] **Optimize URL slugs for blog posts** - ensure slugs are keyword-rich, lowercase, hyphenated.
- [ ] **Add alt text to ALL images** - most are covered, but audit every image. Describe what's shown, include keywords where natural.
- [ ] **Improve blog content depth** - longer, well-structured posts (1500+ words) with proper H2/H3 hierarchy rank better. Target topics your audience searches for.
- [x] **Add FAQ sections to key pages** - Services and Products pages have FAQ sections with FAQ schema markup (EN + DE).

---

## Phase 3: Technical SEO

- [x] **Address SPA crawlability (partial)** - fallback meta tags added to HTML shell for crawlers that don't execute JS. Full SSR requires migrating to Next.js (future consideration).
- [ ] **Optimize Core Web Vitals** - run Lighthouse and fix:
  - LCP (Largest Contentful Paint) - optimize hero images, fonts
  - CLS (Cumulative Layout Shift) - set explicit image dimensions
  - INP (Interaction to Next Paint) - minimize JS bundle
- [ ] **Compress and serve images in WebP/AVIF** - add an image optimization pipeline or use a CDN with auto-conversion.
- [ ] **Add responsive images** - use `srcset` and `sizes` attributes for different screen sizes.
- [ ] **Implement lazy loading consistently** - already on some images, ensure it's on all below-the-fold images.
- [ ] **Minify CSS/JS** - Vite handles this in production, but verify the output.
- [x] **Set up proper redirects** - www to non-www redirect configured in vercel.json.
- [x] **Add security headers** - X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy. Plus asset caching headers.

---

## Phase 4: Off-Page SEO

- [ ] **Google Business Profile** - create/claim your listing. Add services, photos, posts, and keep info consistent with the website.
- [ ] **Build citations** - list Evawero Digital on relevant directories: Clutch, DesignRush, GoodFirms, Crunchbase, LinkedIn Company page.
- [ ] **LinkedIn content strategy** - share blog posts, case studies, and insights regularly. Link back to the website.
- [ ] **Guest posting** - write articles for industry publications (AI, digital transformation, business tech) with backlinks to the site.
- [ ] **Create linkable assets** - original research, infographics, tools, or templates that others want to link to.
- [ ] **Get client testimonials/reviews** - on Google Business Profile, Clutch, and the site itself. Social proof also improves conversion.
- [ ] **Monitor backlinks** - use Search Console's Links report (free) to track who links to you. Disavow spammy links if needed.
- [ ] **Social profiles consistency** - ensure name, description, URL, and branding are identical across all platforms.
- [ ] **Engage in relevant communities** - answer questions on Reddit, Quora, or industry forums where your expertise applies. For visibility, not link dropping.

---

## Phase 5: Ongoing Monitoring

- [ ] **Review Search Console weekly** - check indexing status, crawl errors, search queries, and click-through rates.
- [ ] **Track keyword rankings** - use Search Console's Performance tab. Note which queries bring impressions vs clicks.
- [ ] **Publish blog content consistently** - aim for 2-4 posts per month targeting specific keywords.
- [ ] **Update old content** - refresh blog posts with new data, better keywords, and updated links.
- [ ] **Monitor Core Web Vitals** - Search Console has a dedicated report. Fix issues as they appear.
- [ ] **Build a content calendar** - plan topics around keywords with search volume and business relevance.

---

## Priority Order

1. **Phase 1** - these are foundational. Without them, Google can't properly understand or display your pages.
2. **Phase 3 (SPA crawlability)** - if Google can't render your JS content, nothing else matters.
3. **Phase 2** - once pages are indexable, optimize what's on them.
4. **Phase 4** - build authority and backlinks.
5. **Phase 5** - maintain and improve over time.
