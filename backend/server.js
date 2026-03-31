require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { Pool } = require('pg');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const path = require('path');

const { google } = require('googleapis');

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.PAYLOAD_SECRET || process.env.JWT_SECRET || 'change-me-in-production';

// ── Database ──────────────────────────────────────────────────────
const dbUrl = process.env.DATABASE_URI || process.env.DATABASE_URL;
console.log('DB URL prefix:', dbUrl ? dbUrl.replace(/:([^@]+)@/, ':***@') : 'NOT SET');
const useSSL = dbUrl && !dbUrl.includes('localhost') && !dbUrl.includes('railway.internal');
const pool = new Pool({
  connectionString: dbUrl,
  ssl: useSSL ? { rejectUnauthorized: false } : false,
  connectionTimeoutMillis: 10000,
});

const q = (text, params) => pool.query(text, params);

// ── Middleware ─────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : null,
  'https://api.evawerodigital.com',
  'http://localhost:5173',
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    // Allow same-origin requests (no origin header) and allowed origins
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    // Allow requests from the API's own domain (admin panel)
    if (origin && origin.includes('evawerodigital.com')) return cb(null, true);
    // Allow Vercel preview deployments
    if (origin && origin.includes('vercel.app')) return cb(null, true);
    console.error('CORS blocked origin:', origin);
    cb(new Error('CORS not allowed'));
  },
  credentials: true,
}));

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Auth Middleware ────────────────────────────────────────────────
function requireAdmin(req, res, next) {
  const token = req.cookies?.admin_token || req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Not authenticated' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// ── Root ──────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    name: 'Evawero Digital Solutions API',
    status: 'running',
    endpoints: {
      health: '/health',
      admin: '/admin',
      api: '/api/services, /api/products, /api/blog-posts, /api/team-members',
    },
  });
});

// ── Health ─────────────────────────────────────────────────────────
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok' });
  } catch (e) {
    res.status(503).json({ status: 'unhealthy' });
  }
});

// ══════════════════════════════════════════════════════════════════
//  PUBLIC API ROUTES (read-only)
// ══════════════════════════════════════════════════════════════════

// Services
app.get('/api/services', async (req, res) => {
  try {
    const { rows } = await q('SELECT * FROM services ORDER BY sort_order ASC');
    res.json({ docs: rows });
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// Products
app.get('/api/products', async (req, res) => {
  try {
    const { rows } = await q('SELECT * FROM products ORDER BY created_at DESC');
    res.json({ docs: rows });
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.get('/api/products/featured', async (req, res) => {
  try {
    const { rows } = await q('SELECT * FROM products WHERE is_featured = true LIMIT 1');
    res.json(rows[0] || null);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch featured product' });
  }
});

// Blog Posts
app.get('/api/blog-posts', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const { rows } = await q(
      "SELECT * FROM blog_posts WHERE status = 'published' ORDER BY published_date DESC LIMIT $1",
      [limit]
    );
    res.json({ docs: rows });
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
});

app.get('/api/blog-posts/:slug', async (req, res) => {
  try {
    const { rows } = await q('SELECT * FROM blog_posts WHERE slug = $1 LIMIT 1', [req.params.slug]);
    if (!rows.length) return res.status(404).json({ error: 'Post not found' });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch blog post' });
  }
});

// Team Members
app.get('/api/team-members', async (req, res) => {
  try {
    const { rows } = await q('SELECT * FROM team_members ORDER BY sort_order ASC');
    res.json({ docs: rows });
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch team members' });
  }
});

// Site Settings (global)
app.get('/api/globals/site-settings', async (req, res) => {
  try {
    const { rows } = await q('SELECT * FROM site_settings LIMIT 1');
    res.json(rows[0] || {});
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// ── Contact Form ──────────────────────────────────────────────────
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { error: 'Too many requests. Please try again later.' },
});

app.post('/api/contact', contactLimiter, async (req, res) => {
  const { name, email, phone, business, service, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET
    );
    oauth2Client.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN });

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    const to = process.env.GMAIL_USER || 'info@evawerodigital.com';
    const subject = `New enquiry from ${name}${service ? ' \u2014 ' + service : ''}`;
    const htmlBody = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
      ${business ? `<p><strong>Business:</strong> ${business}</p>` : ''}
      ${service ? `<p><strong>Service:</strong> ${service}</p>` : ''}
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `;

    const raw = Buffer.from(
      `From: "Evawero Website" <${to}>\r\n` +
      `To: ${to}\r\n` +
      `Reply-To: ${email}\r\n` +
      `Subject: ${subject}\r\n` +
      `Content-Type: text/html; charset=utf-8\r\n\r\n` +
      htmlBody
    ).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    await gmail.users.messages.send({ userId: 'me', requestBody: { raw } });

    res.json({ success: true });
  } catch (e) {
    console.error('Contact email error:', e.message);
    res.status(500).json({ error: 'Failed to send message. Please try again.' });
  }
});

// ══════════════════════════════════════════════════════════════════
//  ADMIN AUTH
// ══════════════════════════════════════════════════════════════════

app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const { rows } = await q('SELECT * FROM admin_users WHERE email = $1', [email]);
    if (!rows.length) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, rows[0].password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: rows[0].id, email: rows[0].email }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({ success: true, email: rows[0].email });
  } catch (e) {
    res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/api/admin/logout', (req, res) => {
  res.clearCookie('admin_token');
  res.json({ success: true });
});

app.get('/api/admin/me', requireAdmin, (req, res) => {
  res.json({ email: req.admin.email });
});

// ══════════════════════════════════════════════════════════════════
//  ADMIN CRUD ENDPOINTS
// ══════════════════════════════════════════════════════════════════

// ── Services CRUD ─────────────────────────────────────────────────
app.get('/api/admin/services', requireAdmin, async (req, res) => {
  const { rows } = await q('SELECT * FROM services ORDER BY sort_order ASC');
  res.json(rows);
});

app.get('/api/admin/services/:id', requireAdmin, async (req, res) => {
  const { rows } = await q('SELECT * FROM services WHERE id = $1', [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
});

app.post('/api/admin/services', requireAdmin, async (req, res) => {
  const { title, slug, icon, short_description, full_description, who_is_it_for, whats_included, sort_order } = req.body;
  const { rows } = await q(
    `INSERT INTO services (title, slug, icon, short_description, full_description, who_is_it_for, whats_included, sort_order)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [title, slug, icon, short_description, full_description, who_is_it_for, whats_included || [], sort_order || 0]
  );
  res.json(rows[0]);
});

app.put('/api/admin/services/:id', requireAdmin, async (req, res) => {
  const { title, slug, icon, short_description, full_description, who_is_it_for, whats_included, sort_order } = req.body;
  const { rows } = await q(
    `UPDATE services SET title=$1, slug=$2, icon=$3, short_description=$4, full_description=$5, who_is_it_for=$6, whats_included=$7, sort_order=$8
     WHERE id=$9 RETURNING *`,
    [title, slug, icon, short_description, full_description, who_is_it_for, whats_included || [], sort_order || 0, req.params.id]
  );
  res.json(rows[0]);
});

app.delete('/api/admin/services/:id', requireAdmin, async (req, res) => {
  await q('DELETE FROM services WHERE id = $1', [req.params.id]);
  res.json({ success: true });
});

// ── Products CRUD ─────────────────────────────────────────────────
app.get('/api/admin/products', requireAdmin, async (req, res) => {
  const { rows } = await q('SELECT * FROM products ORDER BY created_at DESC');
  res.json(rows);
});

app.get('/api/admin/products/:id', requireAdmin, async (req, res) => {
  const { rows } = await q('SELECT * FROM products WHERE id = $1', [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
});

app.post('/api/admin/products', requireAdmin, async (req, res) => {
  const { name, slug, tagline, description, features, link, pricing_free, pricing_pro, badges, is_featured, coming_soon } = req.body;
  const { rows } = await q(
    `INSERT INTO products (name, slug, tagline, description, features, link, pricing_free, pricing_pro, badges, is_featured, coming_soon)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
    [name, slug, tagline, description, features || [], link, pricing_free, pricing_pro, badges || [], is_featured || false, coming_soon || false]
  );
  res.json(rows[0]);
});

app.put('/api/admin/products/:id', requireAdmin, async (req, res) => {
  const { name, slug, tagline, description, features, link, pricing_free, pricing_pro, badges, is_featured, coming_soon } = req.body;
  const { rows } = await q(
    `UPDATE products SET name=$1, slug=$2, tagline=$3, description=$4, features=$5, link=$6, pricing_free=$7, pricing_pro=$8, badges=$9, is_featured=$10, coming_soon=$11
     WHERE id=$12 RETURNING *`,
    [name, slug, tagline, description, features || [], link, pricing_free, pricing_pro, badges || [], is_featured || false, coming_soon || false, req.params.id]
  );
  res.json(rows[0]);
});

app.delete('/api/admin/products/:id', requireAdmin, async (req, res) => {
  await q('DELETE FROM products WHERE id = $1', [req.params.id]);
  res.json({ success: true });
});

// ── Blog Posts CRUD ───────────────────────────────────────────────
app.get('/api/admin/blog-posts', requireAdmin, async (req, res) => {
  const { rows } = await q('SELECT * FROM blog_posts ORDER BY created_at DESC');
  res.json(rows);
});

app.get('/api/admin/blog-posts/:id', requireAdmin, async (req, res) => {
  const { rows } = await q('SELECT * FROM blog_posts WHERE id = $1', [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
});

app.post('/api/admin/blog-posts', requireAdmin, async (req, res) => {
  const { title, slug, excerpt, content, cover_image, author, published_date, category, status } = req.body;
  const { rows } = await q(
    `INSERT INTO blog_posts (title, slug, excerpt, content, cover_image, author, published_date, category, status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
    [title, slug, excerpt, content, cover_image, author, published_date || null, category, status || 'draft']
  );
  res.json(rows[0]);
});

app.put('/api/admin/blog-posts/:id', requireAdmin, async (req, res) => {
  const { title, slug, excerpt, content, cover_image, author, published_date, category, status } = req.body;
  const { rows } = await q(
    `UPDATE blog_posts SET title=$1, slug=$2, excerpt=$3, content=$4, cover_image=$5, author=$6, published_date=$7, category=$8, status=$9
     WHERE id=$10 RETURNING *`,
    [title, slug, excerpt, content, cover_image, author, published_date || null, category, status || 'draft', req.params.id]
  );
  res.json(rows[0]);
});

app.delete('/api/admin/blog-posts/:id', requireAdmin, async (req, res) => {
  await q('DELETE FROM blog_posts WHERE id = $1', [req.params.id]);
  res.json({ success: true });
});

// ── Agent API (API key auth for agent system) ────────────────────
function requireAgentKey(req, res, next) {
  const key = req.headers['x-agent-key'];
  if (!key || key !== process.env.AGENT_API_KEY) {
    return res.status(401).json({ error: 'Invalid agent key' });
  }
  next();
}

app.post('/api/agent/blog-posts', requireAgentKey, async (req, res) => {
  const { title, slug, excerpt, content, author, category } = req.body;
  if (!title || !content) return res.status(400).json({ error: 'title and content required' });
  const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  try {
    const { rows } = await q(
      `INSERT INTO blog_posts (title, slug, excerpt, content, author, published_date, category, status)
       VALUES ($1,$2,$3,$4,$5,NOW(),$6,'draft') RETURNING id, slug, status`,
      [title, finalSlug, excerpt || '', content, author || 'Evawero Digital', category || 'General']
    );
    res.json(rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Slug already exists', slug: finalSlug });
    res.status(500).json({ error: err.message });
  }
});

// ── Team Members CRUD ─────────────────────────────────────────────
app.get('/api/admin/team-members', requireAdmin, async (req, res) => {
  const { rows } = await q('SELECT * FROM team_members ORDER BY sort_order ASC');
  res.json(rows);
});

app.get('/api/admin/team-members/:id', requireAdmin, async (req, res) => {
  const { rows } = await q('SELECT * FROM team_members WHERE id = $1', [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
});

app.post('/api/admin/team-members', requireAdmin, async (req, res) => {
  const { name, role, bio, photo, sort_order } = req.body;
  const { rows } = await q(
    `INSERT INTO team_members (name, role, bio, photo, sort_order)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [name, role, bio, photo, sort_order || 0]
  );
  res.json(rows[0]);
});

app.put('/api/admin/team-members/:id', requireAdmin, async (req, res) => {
  const { name, role, bio, photo, sort_order } = req.body;
  const { rows } = await q(
    `UPDATE team_members SET name=$1, role=$2, bio=$3, photo=$4, sort_order=$5
     WHERE id=$6 RETURNING *`,
    [name, role, bio, photo, sort_order || 0, req.params.id]
  );
  res.json(rows[0]);
});

app.delete('/api/admin/team-members/:id', requireAdmin, async (req, res) => {
  await q('DELETE FROM team_members WHERE id = $1', [req.params.id]);
  res.json({ success: true });
});

// ── Site Settings CRUD ────────────────────────────────────────────
app.get('/api/admin/site-settings', requireAdmin, async (req, res) => {
  const { rows } = await q('SELECT * FROM site_settings LIMIT 1');
  res.json(rows[0] || {});
});

app.put('/api/admin/site-settings', requireAdmin, async (req, res) => {
  const { tagline, mission_statement, why_choose_us, contact_email, contact_phone, social_links, seo_title, seo_description } = req.body;
  // Upsert — update if exists, insert if not
  const existing = await q('SELECT id FROM site_settings LIMIT 1');
  let result;
  if (existing.rows.length) {
    result = await q(
      `UPDATE site_settings SET tagline=$1, mission_statement=$2, why_choose_us=$3, contact_email=$4, contact_phone=$5, social_links=$6, seo_title=$7, seo_description=$8, updated_at=NOW()
       WHERE id=$9 RETURNING *`,
      [tagline, mission_statement, JSON.stringify(why_choose_us || []), contact_email, contact_phone, JSON.stringify(social_links || {}), seo_title, seo_description, existing.rows[0].id]
    );
  } else {
    result = await q(
      `INSERT INTO site_settings (tagline, mission_statement, why_choose_us, contact_email, contact_phone, social_links, seo_title, seo_description)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [tagline, mission_statement, JSON.stringify(why_choose_us || []), contact_email, contact_phone, JSON.stringify(social_links || {}), seo_title, seo_description]
    );
  }
  res.json(result.rows[0]);
});

// ══════════════════════════════════════════════════════════════════
//  ADMIN PANEL (served as static HTML)
// ══════════════════════════════════════════════════════════════════
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// ── Database Schema & Seed ────────────────────────────────────────
const schema = `
  CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    icon TEXT,
    short_description TEXT,
    full_description TEXT,
    who_is_it_for TEXT,
    whats_included TEXT[],
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    tagline TEXT,
    description TEXT,
    features TEXT[],
    link TEXT,
    pricing_free TEXT,
    pricing_pro TEXT,
    badges TEXT[],
    is_featured BOOLEAN DEFAULT false,
    coming_soon BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS blog_posts (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT,
    cover_image TEXT,
    author TEXT,
    published_date TIMESTAMPTZ,
    category TEXT,
    status TEXT DEFAULT 'draft',
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS team_members (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT,
    bio TEXT,
    photo TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS site_settings (
    id SERIAL PRIMARY KEY,
    tagline TEXT,
    mission_statement TEXT,
    why_choose_us JSONB DEFAULT '[]',
    contact_email TEXT,
    contact_phone TEXT,
    social_links JSONB DEFAULT '{}',
    seo_title TEXT,
    seo_description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );
`;

async function seedData() {
  // Create or update admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'info@evawerodigital.com';
  const adminPass = process.env.ADMIN_PASSWORD || 'changeme123';
  const { rows: admins } = await q('SELECT COUNT(*) FROM admin_users WHERE email = $1', [adminEmail]);
  const hash = await bcrypt.hash(adminPass, 12);
  if (parseInt(admins[0].count) === 0) {
    await q('INSERT INTO admin_users (email, password_hash) VALUES ($1, $2)', [adminEmail, hash]);
    console.log(`Default admin created: ${adminEmail}`);
  } else {
    await q('UPDATE admin_users SET password_hash = $1 WHERE email = $2', [hash, adminEmail]);
    console.log(`Admin password synced from env for: ${adminEmail}`);
  }

  // Check if services already seeded
  const { rows } = await q('SELECT COUNT(*) FROM services');
  if (parseInt(rows[0].count) > 0) return;

  console.log('Seeding initial data...');

  // Seed services
  await q(`
    INSERT INTO services (title, slug, icon, short_description, full_description, who_is_it_for, whats_included, sort_order) VALUES
    ('AI Strategy & Integration', 'ai-strategy', 'brain',
     'Develop and implement AI solutions tailored to your business goals.',
     'We help you identify where AI can create the most impact in your business, then design and implement solutions that deliver measurable results. From automated workflows to intelligent data analysis, we bring AI from concept to production.',
     'CEOs, operations managers, and business owners looking to leverage AI for competitive advantage.',
     ARRAY['AI readiness assessment', 'Custom AI solution design', 'Implementation and integration', 'Team training and handover', 'Ongoing optimisation support'],
     1),
    ('Business Process Automation', 'business-automation', 'zap',
     'Streamline operations with intelligent automation that saves time and reduces errors.',
     'We analyse your existing workflows, identify bottlenecks and manual processes, then design automated solutions that free your team to focus on high-value work. Our automation solutions integrate with your existing tools and scale with your business.',
     'Businesses with repetitive manual processes, growing teams that need to scale operations efficiently.',
     ARRAY['Process audit and mapping', 'Automation solution design', 'Tool integration (Zapier, Make, custom)', 'Testing and deployment', 'Documentation and training'],
     2),
    ('Custom Web Solutions', 'web-solutions', 'globe',
     'Modern, responsive web applications built to solve your specific business problems.',
     'From customer-facing platforms to internal tools, we build web applications that are fast, secure, and designed around your users. We use modern technologies and best practices to deliver solutions that are maintainable and scalable.',
     'Businesses needing custom platforms, SaaS products, dashboards, or client portals.',
     ARRAY['Requirements analysis', 'UI/UX design', 'Full-stack development', 'Testing and QA', 'Deployment and hosting setup', 'Post-launch support'],
     3),
    ('Brand & Digital Strategy', 'digital-strategy', 'target',
     'Build a strong digital presence with a clear strategy that drives growth.',
     'We help you define your brand positioning, develop your digital strategy, and create a roadmap for growth. From content strategy to digital marketing, we ensure every touchpoint reinforces your brand and drives results.',
     'Startups, SMEs, and professionals looking to establish or strengthen their digital presence.',
     ARRAY['Brand audit and positioning', 'Digital strategy roadmap', 'Content strategy', 'SEO and analytics setup', 'Social media strategy', 'Performance tracking'],
     4)
  `);

  // Seed featured product
  await q(`
    INSERT INTO products (name, slug, tagline, description, features, link, pricing_free, pricing_pro, badges, is_featured) VALUES
    ('Evas Intelligence', 'evas-intelligence',
     'Your briefing. Already done. Every morning.',
     'AI-powered platform that scans your Gmail and news feeds, then delivers a prioritised intelligence briefing with action steps. Built for CEOs, consultants, and investors across Nigeria and Europe.',
     ARRAY['Inbox Intelligence — AI analysis of your Gmail', 'Market Intelligence — curated RSS and news monitoring', 'Content Creation — AI-assisted content from your signals'],
     'https://app.evaweroukpevo.com',
     '€0 per month',
     '€10 per month',
     ARRAY['AI-Powered', 'Nigeria + Europe', 'Free to start'],
     true)
  `);

  // Seed site settings
  await q(`
    INSERT INTO site_settings (tagline, mission_statement, why_choose_us, contact_email, contact_phone, social_links, seo_title, seo_description) VALUES
    ('From Analysis to AI — Your Digital Growth Partner',
     'Evawero Digital Solutions exists to close the gap between where businesses are and where technology can take them. We combine deep technical expertise with practical business understanding to deliver solutions that create real, measurable impact.',
     '[{"icon":"sync","title":"End-to-End Consulting & Implementation","description":"From strategy to deployment, we handle the full journey — not just advice."},{"icon":"target","title":"Solutions Tailored to Your Business","description":"No cookie-cutter approaches. Every solution is designed around your specific needs and goals."},{"icon":"brain","title":"Expert Support in AI, Automation & Digital Growth","description":"Our team brings deep expertise across AI, process automation, and modern web technologies."},{"icon":"globe","title":"Helping Businesses Stay Competitive","description":"We help businesses across Nigeria and Europe leverage technology to stay ahead in a digital world."}]',
     'info@evawerodigital.com',
     '08082552357',
     '{"linkedin":"#","instagram":"#","twitter":"#"}',
     'Evawero Digital Solutions | From Analysis to AI',
     'AI strategy, business automation, custom web solutions, and digital strategy for businesses across Nigeria and Europe.')
  `);

  console.log('Seed data inserted.');
}

// ── Start Server ──────────────────────────────────────────────────
async function start() {
  try {
    console.log('Connecting to database...');
    await pool.query('SELECT 1');
    console.log('Database connected.');

    console.log('Running schema...');
    await pool.query(schema);
    console.log('Schema ready.');

    console.log('Seeding data...');
    await seedData();

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Evawero Digital API running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Startup failed:', err.message);
    console.error(err.stack);
    process.exit(1);
  }
}

start();
