require('dotenv').config({ path: require('path').join(__dirname, '../evawero-agents.env') });

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const { testConnection, runMigrations } = require('./core/database');
const { startScheduler } = require('./scheduler');
const { startWatcher } = require('./notion-watcher');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 4000;
const API_SECRET = process.env.API_SECRET_KEY || 'addict-language-want';

// ============================================================
// MIDDLEWARE
// ============================================================
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());

// Simple auth for API routes
function authMiddleware(req, res, next) {
  // Dashboard static files don't need auth
  if (req.path.startsWith('/dashboard') || req.path === '/' || req.path === '/health') {
    return next();
  }

  const token = req.headers['x-api-key'] || req.query.key;
  if (token !== API_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// Dashboard password check
function dashboardAuth(req, res, next) {
  // Static assets pass through
  if (req.path.match(/\.(css|js|png|ico|svg)$/)) return next();
  // Login page passes through
  if (req.path === '/dashboard/login') return next();
  // Check session cookie
  const sessionToken = req.cookies?.dashboard_session || req.headers['x-dashboard-token'];
  if (sessionToken === API_SECRET) return next();
  // Redirect to login
  if (req.accepts('html')) {
    return res.redirect('/dashboard/login');
  }
  return res.status(401).json({ error: 'Not authenticated' });
}

// ============================================================
// ROUTES
// ============================================================

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.json({ service: 'Evawero Agent System', status: 'running', version: '1.0.0' });
});

// API routes (require API key)
app.use('/api', authMiddleware, apiRoutes);

// Dashboard (static HTML)
app.use('/dashboard', express.static(path.join(__dirname, '../dashboard')));

// ============================================================
// STARTUP
// ============================================================
async function start() {
  console.log('='.repeat(60));
  console.log(' EVAWERO AGENT SYSTEM');
  console.log('='.repeat(60));

  // Test database
  const dbOk = await testConnection();
  if (!dbOk) {
    console.error('Database connection failed. Exiting.');
    process.exit(1);
  }

  // Run migrations
  await runMigrations();

  // Start Express
  app.listen(PORT, () => {
    console.log(`[Server] Listening on port ${PORT}`);
    console.log(`[Server] Dashboard: http://localhost:${PORT}/dashboard`);
    console.log(`[Server] Health:    http://localhost:${PORT}/health`);
  });

  // Start scheduler and watcher
  startScheduler();
  startWatcher();

  console.log('='.repeat(60));
  console.log(' ALL SYSTEMS GO');
  console.log('='.repeat(60));
}

start().catch(err => {
  console.error('Fatal startup error:', err);
  process.exit(1);
});
