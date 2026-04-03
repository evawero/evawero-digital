# Demo Dashboard — How to Create a New Client Demo

A reusable demo dashboard that shows prospective clients what the AI agent system would produce for their business. Each demo is an unlisted page on evawerodigital.com — only accessible via direct link.

---

## Architecture

```
frontend/src/
  components/demo/DemoDashboard.jsx   ← Shared UI template (don't modify)
  data/demos/printhub.js              ← Sample: PrintHub Lagos (printing)
  data/demos/<client-slug>.js         ← New client data files go here
  pages/Demo<ClientName>.jsx          ← Thin page wrapper (5 lines)
```

**Live example:** `evawerodigital.com/demo/printhub`

---

## Step-by-Step: Create a New Demo

### 1. Copy the data file

```bash
cp frontend/src/data/demos/printhub.js frontend/src/data/demos/<slug>.js
```

### 2. Update the data

Open the new file and replace every section with industry-specific content:

| Section | What to change | Tips |
|---------|---------------|------|
| `client` | Company name, industry, tagline, date range | Use a fictional but realistic company name |
| `stats` | Lead counts, content counts, project counts | Keep numbers believable (8-15 leads, 4-8 content pieces) |
| `alerts` | Urgent/warning items | 1-2 urgent, 1 warning works well |
| `leads` | Prospect companies | Use real industry types, real city locations, realistic notes |
| `emailDrafts` | 2-3 outreach emails | Personalise to the lead's pain point, keep the CTA consistent |
| `contentPosts` | Blog/social content | Mix platforms (Blog, LinkedIn, Instagram), use industry topics |
| `contentCalendar` | Scheduled content | 5-7 entries across 2 weeks |
| `projects` | Active client projects | 1 in-progress with tasks, 1 in quoting stage |
| `managerDigest` | Daily digest data | Should reference the leads and projects above |

### 3. Create the page wrapper

Create `frontend/src/pages/Demo<ClientName>.jsx`:

```jsx
import DemoDashboard from '../components/demo/DemoDashboard';
import * as data from '../data/demos/<slug>';

export default function Demo<ClientName>() {
  return <DemoDashboard data={data} />;
}
```

### 4. Add the route

In `frontend/src/App.jsx`, add inside the `<Routes>` block (before the `path="*"` route):

```jsx
import Demo<ClientName> from './pages/Demo<ClientName>';

// In the Routes:
<Route path="/demo/<slug>" element={<Demo<ClientName> />} />
```

### 5. Test and deploy

```bash
cd frontend && npm run build    # Verify it compiles
git add . && git commit && git push   # Vercel auto-deploys
```

Share the link: `evawerodigital.com/demo/<slug>`

---

## Data Structure Reference

Every data file must export these named exports:

```js
export const client = {
  name: 'Company Name',           // Display name
  industry: 'Industry Type',      // e.g. "Printing & Branding", "Legal Services"
  tagline: 'AI Agent System — Powered by Evawero Digital',
  dateRange: 'Week of X — Y 2026', // Demo timeframe
};

export const stats = {
  leadsFound: Number,
  contacted: Number,
  replied: Number,
  contentCreated: Number,
  activeProjects: Number,
  alertsOpen: Number,
};

export const alerts = [
  { type: 'urgent' | 'warning', text: '...' },
];

export const leads = [
  { id: Number, name: '...', location: '...', industry: '...', status: 'identified' | 'contacted' | 'replied', note: '...' },
];

export const emailDrafts = [
  { to: '...', subject: '...', body: '...' },
];

export const contentPosts = [
  { platform: 'Blog' | 'LinkedIn' | 'Instagram' | 'X', title: '...', excerpt: '...', status: 'Draft' | 'Scheduled', date: 'YYYY-MM-DD' },
];

export const contentCalendar = [
  { day: 'Mon 1 Apr', type: 'Blog' | 'LinkedIn' | 'Instagram' | 'X', title: '...' },
];

export const projects = [
  { name: '...', client: '...', status: 'In Progress' | 'Quoting', tasks: [{ text: '...', done: Boolean }], kickoffEmail: '...' | null },
];

export const managerDigest = {
  date: 'Day, DD Month YYYY',
  needsAttention: ['...'],
  leadPipeline: { total, identified, contacted, replied, newThisWeek, draftsReady },
  clientProjects: [{ name, status, progress }],
  marketing: { postsCreated, platforms: [], nextScheduled: '...' },
  agentActivity: [{ agent, lastRun, outcome, status: 'ok' }],
};
```

---

## Industry Ideas

| Industry | Demo slug | Leads | Content angles |
|----------|-----------|-------|---------------|
| Printing | `printhub` (done) | Hotels, events, schools, churches | Print tips, branding, seasonal |
| Law firm | `lawfirm` | SMEs, startups, real estate | Legal tips, compliance, contracts |
| Restaurant | `restaurant` | Corporate catering, events, hotels | Food trends, menu design, reviews |
| Real estate | `realestate` | Developers, investors, diaspora | Market trends, investment tips |
| Logistics | `logistics` | E-commerce, manufacturers, retailers | Shipping tips, last-mile, cost |
| Consulting | `consulting` | SMEs, NGOs, government | Strategy, digital transformation |

---

## Notes

- Demos are **not linked** from the navbar, footer, or any page — they're only accessible via direct URL
- Each page has `<meta name="robots" content="noindex, nofollow" />` so search engines won't index them
- All data is hardcoded — no API calls, no backend, no database
- The `DemoDashboard.jsx` template should not be modified per client — only the data files change
- To use Claude Code to generate demo data: give it the client industry, location, and a few example services, then ask it to generate a data file following the structure in `printhub.js`
