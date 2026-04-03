/**
 * PrintHub Lagos — Demo Data
 *
 * To create a new demo for a different client type:
 * 1. Copy this file and rename (e.g., lawfirm.js, restaurant.js)
 * 2. Update the `client` object with the new company details
 * 3. Replace leads, emailDrafts, contentPosts, contentCalendar, projects, and managerDigest
 *    with realistic data for that industry
 * 4. Create a thin page wrapper (see pages/DemoPrintHub.jsx as example)
 * 5. Add a route in App.jsx
 */

export const client = {
  name: 'PrintHub Lagos',
  industry: 'Printing & Branding',
  tagline: 'AI Agent System — Powered by Evawero Digital',
  dateRange: 'Week of 31 Mar – 4 Apr 2026',
};

export const stats = {
  leadsFound: 12,
  contacted: 7,
  replied: 3,
  contentCreated: 6,
  activeProjects: 2,
  alertsOpen: 2,
};

export const alerts = [
  { type: 'urgent', text: '3 leads replied — review draft responses in Gmail' },
  { type: 'warning', text: 'Heritage Foundation quote due by Friday 4 Apr' },
];

export const leads = [
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

export const emailDrafts = [
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

export const contentPosts = [
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

export const contentCalendar = [
  { day: 'Mon 31 Mar', type: 'Blog', title: '5 Print Materials Every Lagos Business Needs' },
  { day: 'Wed 2 Apr', type: 'Blog', title: 'Why Your Event Needs Professional Print' },
  { day: 'Fri 4 Apr', type: 'LinkedIn', title: 'Inconsistent branding across branches' },
  { day: 'Sat 5 Apr', type: 'Instagram', title: 'Before & After: Prospectus Redesign' },
  { day: 'Mon 7 Apr', type: 'LinkedIn', title: '2,000 programmes in 48 hours' },
  { day: 'Wed 9 Apr', type: 'Blog', title: 'Wedding Invitation Trends 2026' },
];

export const projects = [
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

export const managerDigest = {
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
