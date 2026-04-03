import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';

/* ───────────────────────── SAMPLE DATA ───────────────────────── */

const stats = {
  leadsFound: 12,
  contacted: 7,
  replied: 3,
  contentCreated: 6,
  activeProjects: 2,
  alertsOpen: 2,
};

const leads = [
  { id: 1, name: 'Grandview Hotels', location: 'Victoria Island, Lagos', industry: 'Hospitality', status: 'replied', note: 'Needs branded stationery for 3 hotel branches. Interested in a bulk deal.' },
  { id: 2, name: 'TrueVine Events', location: 'Lekki, Lagos', industry: 'Event Planning', status: 'replied', note: 'Planning a corporate gala in June — needs banners, programmes, and name tags.' },
  { id: 3, name: 'Covenant Academy', location: 'Ikeja, Lagos', industry: 'Education', status: 'contacted', note: 'New school year starts September. Needs prospectus, flyers, and report cards.' },
  { id: 4, name: 'Zenith Logistics', location: 'Apapa, Lagos', industry: 'Logistics', status: 'contacted', note: 'Rebranding — needs new business cards, letterheads, and vehicle wraps.' },
  { id: 5, name: 'Grace Cathedral', location: 'Surulere, Lagos', industry: 'Religious', status: 'contacted', note: 'Weekly bulletins, anniversary programme, and church banners.' },
  { id: 6, name: 'FreshMart Supermarket', location: 'Ajah, Lagos', industry: 'Retail', status: 'identified', note: 'Chain of 5 stores — potential for shelf labels, posters, and promo flyers.' },
  { id: 7, name: 'BuildRight Construction', location: 'Ikoyi, Lagos', industry: 'Construction', status: 'identified', note: 'New housing estate launch — needs hoarding banners and brochures.' },
  { id: 8, name: 'NaijaFit Gym', location: 'Yaba, Lagos', industry: 'Fitness', status: 'contacted', note: 'Opening second location. Needs flyers, membership cards, and wall graphics.' },
  { id: 9, name: 'Bloom Interiors', location: 'Ikoyi, Lagos', industry: 'Interior Design', status: 'identified', note: 'Lookbook and portfolio printing for client presentations.' },
  { id: 10, name: 'KingsPlaza Mall', location: 'Festac, Lagos', industry: 'Retail', status: 'contacted', note: 'Monthly promo materials for 30+ tenant shops.' },
  { id: 11, name: 'AceCode Technologies', location: 'Yaba, Lagos', industry: 'Tech', status: 'identified', note: 'Startup pitch materials — one-pagers, branded folders, rollup banners.' },
  { id: 12, name: 'Heritage Foundation', location: 'Abuja', industry: 'NGO', status: 'replied', note: 'Annual report printing, 500 copies. Needs quotes by Friday.' },
];

const emailDrafts = [
  {
    to: 'info@grandviewhotels.ng',
    subject: 'Branded Stationery for Grandview Hotels — Bulk Pricing Available',
    body: `Dear Grandview Hotels team,

I noticed you recently opened your third branch in Victoria Island — congratulations on the expansion.

Managing a consistent brand across multiple locations is key, and we specialise in exactly that. We can handle your branded stationery (business cards, letterheads, envelopes, key cards) across all three branches with consistent quality and bulk pricing.

Would a quick 15-minute call make sense to discuss your needs?

Best regards,
Tunde Adeyemi
PrintHub Lagos`,
  },
  {
    to: 'events@truevine.ng',
    subject: 'Corporate Gala Print Materials — Banners, Programmes & Name Tags',
    body: `Dear TrueVine Events team,

I came across your upcoming corporate gala scheduled for June and wanted to reach out.

We work with event planners across Lagos to deliver everything from stage banners and step-and-repeat backdrops to printed programmes and custom name tags — all with fast turnaround and on-site delivery.

Would a quick 15-minute call make sense to discuss what you need for the gala?

Best regards,
Tunde Adeyemi
PrintHub Lagos`,
  },
  {
    to: 'admin@heritagefoundation.org',
    subject: 'Annual Report Printing — 500 Copies, Premium Quality',
    body: `Dear Heritage Foundation team,

I understand you're looking for quotes on your annual report printing — 500 copies is a volume we handle regularly for NGOs and corporate clients.

We offer premium paper stock, full-colour printing, and perfect binding with delivery anywhere in Abuja. We can also handle the design layout if needed.

I can have a detailed quote to you by Wednesday. Would it help to jump on a quick call to confirm the specs?

Best regards,
Tunde Adeyemi
PrintHub Lagos`,
  },
];

const contentPosts = [
  {
    platform: 'Blog',
    title: '5 Print Materials Every Lagos Business Needs in 2026',
    excerpt: 'From business cards that make a first impression to branded packaging that keeps customers coming back — here are the print essentials no Lagos business should skip.',
    status: 'Draft',
    date: '2026-03-31',
  },
  {
    platform: 'Blog',
    title: 'Why Your Event Needs Professional Print — Not Just a WhatsApp Flyer',
    excerpt: 'A WhatsApp graphic gets ignored. A printed programme gets kept. Here is why professional print materials still win for corporate events in Nigeria.',
    status: 'Draft',
    date: '2026-04-02',
  },
  {
    platform: 'LinkedIn',
    title: 'The hidden cost of inconsistent branding across branches',
    excerpt: 'When your VI branch uses one shade of blue and your Ikeja branch uses another, customers notice. Here is how we help multi-location businesses stay consistent — starting with print.',
    status: 'Scheduled',
    date: '2026-04-04',
  },
  {
    platform: 'Instagram',
    title: 'Before & After: Covenant Academy Prospectus Redesign',
    excerpt: 'Swipe to see how we transformed a basic Word doc into a professional, full-colour prospectus that parents actually want to read.',
    status: 'Scheduled',
    date: '2026-04-05',
  },
  {
    platform: 'LinkedIn',
    title: 'We printed 2,000 programmes in 48 hours. Here is what we learned.',
    excerpt: 'When TrueVine Events called on Thursday for a Saturday gala, we said yes. Tight deadlines are where our process shines.',
    status: 'Scheduled',
    date: '2026-04-07',
  },
  {
    platform: 'Blog',
    title: 'Wedding Invitation Trends in Nigeria 2026: What Couples Are Printing',
    excerpt: 'From acrylic invitations to letterpress on textured stock — Nigerian weddings are getting more creative with print. Here are the top trends we are seeing.',
    status: 'Draft',
    date: '2026-04-09',
  },
];

const contentCalendar = [
  { day: 'Mon 31 Mar', type: 'Blog', title: '5 Print Materials Every Lagos Business Needs' },
  { day: 'Wed 2 Apr', type: 'Blog', title: 'Why Your Event Needs Professional Print' },
  { day: 'Fri 4 Apr', type: 'LinkedIn', title: 'Inconsistent branding across branches' },
  { day: 'Sat 5 Apr', type: 'Instagram', title: 'Before & After: Prospectus Redesign' },
  { day: 'Mon 7 Apr', type: 'LinkedIn', title: '2,000 programmes in 48 hours' },
  { day: 'Wed 9 Apr', type: 'Blog', title: 'Wedding Invitation Trends 2026' },
];

const projects = [
  {
    name: 'Grandview Hotels — Branded Stationery Package',
    client: 'Grandview Hotels',
    status: 'In Progress',
    tasks: [
      { text: 'Confirm brand guidelines and Pantone colours', done: true },
      { text: 'Design business cards (3 staff title variants)', done: true },
      { text: 'Design letterhead and compliment slip', done: false },
      { text: 'Design envelope templates (DL and C5)', done: false },
      { text: 'Client proof approval', done: false },
      { text: 'Print run — 2,000 business cards, 1,000 letterheads, 500 envelopes per branch', done: false },
      { text: 'Delivery to 3 branches', done: false },
    ],
    kickoffEmail: `Subject: Grandview Hotels — Stationery Package Kickoff

Dear Grandview Hotels team,

Thank you for choosing PrintHub Lagos for your branded stationery. Here is a summary of what we have agreed:

Scope: Business cards (3 title variants), letterheads, compliment slips, and envelopes (DL + C5) for all 3 branches.

Timeline: Design proofs within 5 working days. Print and delivery within 3 working days after approval.

Next step: Please share your brand guidelines pack and any existing templates. If you do not have formal guidelines, we can work from your logo files and website.

We will keep you updated at every stage.

Best regards,
Tunde Adeyemi
PrintHub Lagos`,
  },
  {
    name: 'Heritage Foundation — Annual Report 2025',
    client: 'Heritage Foundation',
    status: 'Quoting',
    tasks: [
      { text: 'Confirm page count and binding preference', done: false },
      { text: 'Receive final PDF or InDesign files', done: false },
      { text: 'Pre-press check and colour proofing', done: false },
      { text: 'Print run — 500 copies, perfect bound', done: false },
      { text: 'Delivery to Abuja office', done: false },
    ],
    kickoffEmail: null,
  },
];

const managerDigest = {
  date: 'Wednesday, 2 April 2026',
  needsAttention: [
    'Heritage Foundation requested a quote by Friday — respond today',
    '3 leads have replied to outreach — review email drafts and send',
  ],
  leadPipeline: {
    total: 12,
    identified: 4,
    contacted: 5,
    replied: 3,
    newThisWeek: 4,
    draftsReady: 3,
  },
  clientProjects: [
    { name: 'Grandview Hotels Stationery', status: 'In Progress', progress: '2/7 tasks complete' },
    { name: 'Heritage Foundation Annual Report', status: 'Quoting', progress: 'Awaiting specs' },
  ],
  marketing: {
    postsCreated: 6,
    platforms: ['Blog', 'LinkedIn', 'Instagram'],
    nextScheduled: 'Fri 4 Apr — LinkedIn post',
  },
  agentActivity: [
    { agent: 'Marketing', lastRun: '2 Apr, 06:00', outcome: 'Created 2 posts (Blog + LinkedIn)', status: 'ok' },
    { agent: 'Sales', lastRun: '2 Apr, 06:30', outcome: 'Found 4 new leads, drafted 3 emails', status: 'ok' },
    { agent: 'Solutions', lastRun: '1 Apr, 14:00', outcome: 'Updated Grandview project tasks', status: 'ok' },
    { agent: 'Manager', lastRun: '2 Apr, 07:00', outcome: 'Sent daily digest', status: 'ok' },
  ],
};

const alerts = [
  { type: 'urgent', text: '3 leads replied — review draft responses in Gmail' },
  { type: 'warning', text: 'Heritage Foundation quote due by Friday 4 Apr' },
];

/* ───────────────────────── COMPONENTS ───────────────────────── */

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'sales', label: 'Sales' },
  { key: 'marketing', label: 'Marketing' },
  { key: 'projects', label: 'Projects' },
  { key: 'manager', label: 'Manager' },
];

const statusColor = {
  replied: 'bg-green-100 text-green-800',
  contacted: 'bg-blue-100 text-blue-800',
  identified: 'bg-gray-100 text-gray-700',
};

const platformColor = {
  Blog: 'bg-purple-100 text-purple-800',
  LinkedIn: 'bg-blue-100 text-blue-800',
  Instagram: 'bg-pink-100 text-pink-800',
};

function StatCard({ label, value, accent }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <p className={`text-3xl font-bold ${accent ? 'text-brand' : 'text-brand-dark'}`}>{value}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
  );
}

function Badge({ text, colorClass }) {
  return <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${colorClass}`}>{text}</span>;
}

function OverviewTab() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard label="Leads Found" value={stats.leadsFound} />
        <StatCard label="Contacted" value={stats.contacted} />
        <StatCard label="Replied" value={stats.replied} accent />
        <StatCard label="Content Created" value={stats.contentCreated} />
        <StatCard label="Active Projects" value={stats.activeProjects} />
        <StatCard label="Open Alerts" value={stats.alertsOpen} accent />
      </div>

      {alerts.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Needs Your Attention</h3>
          {alerts.map((a, i) => (
            <div key={i} className={`rounded-lg p-4 border-l-4 ${a.type === 'urgent' ? 'bg-red-50 border-red-500' : 'bg-amber-50 border-amber-500'}`}>
              <p className="text-sm font-medium text-gray-800">{a.text}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Recent Leads</h3>
          <div className="space-y-3">
            {leads.filter(l => l.status === 'replied').map(l => (
              <div key={l.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm text-gray-900">{l.name}</span>
                  <Badge text={l.status} colorClass={statusColor[l.status]} />
                </div>
                <p className="text-xs text-gray-500">{l.location} &middot; {l.industry}</p>
                <p className="text-sm text-gray-600 mt-2">{l.note}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Upcoming Content</h3>
          <div className="space-y-3">
            {contentCalendar.slice(0, 4).map((c, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 flex items-start gap-3">
                <Badge text={c.type} colorClass={platformColor[c.type]} />
                <div>
                  <p className="text-sm font-medium text-gray-900">{c.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{c.day}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SalesTab() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Pipeline Summary</h3>
        <div className="flex flex-wrap gap-3">
          {[
            { label: 'Identified', count: leads.filter(l => l.status === 'identified').length, color: 'bg-gray-200' },
            { label: 'Contacted', count: leads.filter(l => l.status === 'contacted').length, color: 'bg-blue-200' },
            { label: 'Replied', count: leads.filter(l => l.status === 'replied').length, color: 'bg-green-200' },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-3">
              <span className={`w-3 h-3 rounded-full ${s.color}`} />
              <span className="text-sm font-medium text-gray-700">{s.count} {s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">All Leads</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {leads.map(l => (
            <div key={l.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm text-gray-900">{l.name}</span>
                <Badge text={l.status} colorClass={statusColor[l.status]} />
              </div>
              <p className="text-xs text-gray-500">{l.location} &middot; {l.industry}</p>
              <p className="text-sm text-gray-600 mt-2">{l.note}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Draft Outreach Emails</h3>
        <div className="space-y-4">
          {emailDrafts.map((e, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-5">
              <p className="text-xs text-gray-400 mb-1">To: {e.to}</p>
              <p className="font-semibold text-sm text-gray-900 mb-3">{e.subject}</p>
              <pre className="text-sm text-gray-600 whitespace-pre-wrap font-sans leading-relaxed">{e.body}</pre>
              <div className="mt-4 flex gap-2">
                <span className="text-xs bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full font-medium">Draft — Awaiting Review</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MarketingTab() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Content Calendar</h3>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Platform</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Title</th>
              </tr>
            </thead>
            <tbody>
              {contentCalendar.map((c, i) => (
                <tr key={i} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{c.day}</td>
                  <td className="px-4 py-3"><Badge text={c.type} colorClass={platformColor[c.type]} /></td>
                  <td className="px-4 py-3 text-gray-900">{c.title}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Created Content</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contentPosts.map((p, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center gap-2 mb-2">
                <Badge text={p.platform} colorClass={platformColor[p.platform]} />
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${p.status === 'Draft' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>{p.status}</span>
              </div>
              <h4 className="font-semibold text-sm text-gray-900 mb-2">{p.title}</h4>
              <p className="text-sm text-gray-600 leading-relaxed">{p.excerpt}</p>
              <p className="text-xs text-gray-400 mt-3">{p.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProjectsTab() {
  return (
    <div className="space-y-8">
      {projects.map((p, i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <h3 className="font-semibold text-lg text-gray-900">{p.name}</h3>
            <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${p.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}`}>{p.status}</span>
          </div>

          <div className="mb-6">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Task Breakdown</h4>
            <div className="space-y-2">
              {p.tasks.map((t, j) => (
                <div key={j} className="flex items-start gap-2">
                  <span className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${t.done ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                    {t.done && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                  </span>
                  <span className={`text-sm ${t.done ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{t.text}</span>
                </div>
              ))}
            </div>
          </div>

          {p.kickoffEmail && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Auto-Drafted Kickoff Email</h4>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <pre className="text-sm text-gray-600 whitespace-pre-wrap font-sans leading-relaxed">{p.kickoffEmail}</pre>
                <div className="mt-3">
                  <span className="text-xs bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full font-medium">Draft — Awaiting Review</span>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ManagerTab() {
  const d = managerDigest;
  return (
    <div className="space-y-8">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Daily Digest</h3>
        <p className="text-sm text-gray-400 mb-6">{d.date}</p>

        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-semibold text-red-700 mb-3">NEEDS YOUR ATTENTION</h4>
            <ul className="space-y-2">
              {d.needsAttention.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">LEAD PIPELINE</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-brand-dark">{d.leadPipeline.total}</p>
                <p className="text-xs text-gray-500">Total Leads</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{d.leadPipeline.contacted}</p>
                <p className="text-xs text-gray-500">Contacted</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{d.leadPipeline.replied}</p>
                <p className="text-xs text-gray-500">Replied</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-amber-600">{d.leadPipeline.draftsReady}</p>
                <p className="text-xs text-gray-500">Drafts Ready</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">CLIENT PROJECTS</h4>
            <div className="space-y-2">
              {d.clientProjects.map((p, i) => (
                <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <span className="text-sm font-medium text-gray-800">{p.name}</span>
                  <span className="text-xs text-gray-500">{p.progress}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">MARKETING &amp; BRAND</h4>
            <p className="text-sm text-gray-600">{d.marketing.postsCreated} pieces of content created across {d.marketing.platforms.join(', ')}.</p>
            <p className="text-sm text-gray-600 mt-1">Next scheduled: {d.marketing.nextScheduled}</p>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">AGENT ACTIVITY</h4>
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left px-4 py-2 text-xs font-semibold uppercase text-gray-500">Agent</th>
                    <th className="text-left px-4 py-2 text-xs font-semibold uppercase text-gray-500">Last Run</th>
                    <th className="text-left px-4 py-2 text-xs font-semibold uppercase text-gray-500">Outcome</th>
                  </tr>
                </thead>
                <tbody>
                  {d.agentActivity.map((a, i) => (
                    <tr key={i} className="border-b border-gray-100 last:border-0">
                      <td className="px-4 py-2 font-medium text-gray-800">{a.agent}</td>
                      <td className="px-4 py-2 text-gray-500 whitespace-nowrap">{a.lastRun}</td>
                      <td className="px-4 py-2 text-gray-600">{a.outcome}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── MAIN PAGE ───────────────────────── */

const tabContent = {
  overview: OverviewTab,
  sales: SalesTab,
  marketing: MarketingTab,
  projects: ProjectsTab,
  manager: ManagerTab,
};

export default function DemoPrintHub() {
  const [activeTab, setActiveTab] = useState('overview');
  const ActiveContent = tabContent[activeTab];

  return (
    <>
      <Helmet>
        <title>PrintHub Lagos — AI Agent Dashboard Demo</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-brand-dark text-white">
          <div className="max-w-6xl mx-auto px-6 py-6 md:py-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <p className="text-brand-mid text-xs font-medium uppercase tracking-wider mb-1">Demo Dashboard</p>
                <h1 className="font-display text-2xl md:text-3xl font-bold">PrintHub Lagos</h1>
                <p className="text-white/60 text-sm mt-1">AI Agent System &mdash; Powered by Evawero Digital</p>
              </div>
              <p className="text-white/40 text-xs">Sample data &middot; Week of 31 Mar &ndash; 4 Apr 2026</p>
            </div>
          </div>
        </header>

        {/* Tabs */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-6">
            <nav className="flex gap-1 overflow-x-auto -mb-px">
              {TABS.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                    activeTab === tab.key
                      ? 'border-brand text-brand'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-6 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <ActiveContent />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white">
          <div className="max-w-6xl mx-auto px-6 py-6 text-center">
            <p className="text-sm text-gray-400">
              This is a demo dashboard showing sample AI agent output for a printing company.
            </p>
            <p className="text-sm text-gray-400 mt-1">
              <a href="https://evawerodigital.com/products" className="text-brand hover:underline">Learn more about AI Agent Systems</a> &middot; <a href="https://evawerodigital.com/contact" className="text-brand hover:underline">Book a consultation</a>
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
