const express = require('express');
const { q } = require('../core/database');
const { runDigest, runAlertCheck } = require('../agents/manager');
const { run: runMarketing } = require('../agents/marketing');
const { run: runSales } = require('../agents/sales');
const { run: runSolutions } = require('../agents/solutions');
const { checkForNewTasks } = require('../notion-watcher');
const { isPaused, setPaused } = require('../scheduler');

const router = express.Router();

// ============================================================
// DASHBOARD DATA ENDPOINTS
// ============================================================

// Agent logs
router.get('/logs', async (req, res) => {
  try {
    const since = req.query.since || new Date(Date.now() - 7 * 86400000).toISOString();
    const { rows } = await q(
      'SELECT * FROM agent_logs WHERE run_at >= $1 ORDER BY run_at DESC LIMIT 50',
      [since]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Leads summary
router.get('/leads', async (req, res) => {
  try {
    const { rows: pipeline } = await q(
      'SELECT status, COUNT(*) as count FROM leads GROUP BY status ORDER BY count DESC'
    );
    const { rows: recent } = await q(
      `SELECT * FROM leads ORDER BY updated_at DESC LIMIT 20`
    );
    res.json({ pipeline, recent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Projects
router.get('/projects', async (req, res) => {
  try {
    const { rows } = await q('SELECT * FROM projects ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Content calendar
router.get('/content', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 14;
    const { rows } = await q(
      `SELECT * FROM content_calendar WHERE created_at > NOW() - INTERVAL '1 day' * $1 ORDER BY created_at DESC`,
      [days]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Alerts
router.get('/alerts', async (req, res) => {
  try {
    const { rows } = await q(
      'SELECT * FROM alerts WHERE dismissed = false ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Dismiss alert
router.post('/alerts/:id/dismiss', async (req, res) => {
  try {
    await q('UPDATE alerts SET dismissed = true WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Dashboard summary (latest from agent_logs)
router.get('/dashboard-summary', async (req, res) => {
  try {
    const { rows } = await q(
      `SELECT results FROM agent_logs WHERE agent_name = 'dashboard' AND status = 'summary' ORDER BY run_at DESC LIMIT 1`
    );
    if (rows.length > 0) {
      try {
        res.json(JSON.parse(rows[0].results));
      } catch {
        res.json({ raw: rows[0].results });
      }
    } else {
      res.json({ message: 'No dashboard summary yet. Agents have not run.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// KILL SWITCH
// ============================================================

router.get('/status', (req, res) => {
  res.json({ paused: isPaused(), uptime: process.uptime() });
});

router.post('/pause', (req, res) => {
  setPaused(true);
  res.json({ paused: true, message: 'All agents paused. Scheduled runs will be skipped.' });
});

router.post('/resume', (req, res) => {
  setPaused(false);
  res.json({ paused: false, message: 'Agents resumed. Scheduled runs will proceed.' });
});

// ============================================================
// MANUAL TRIGGER ENDPOINTS (blocked when paused)
// ============================================================

// Guard: block all triggers when paused
router.use('/trigger', (req, res, next) => {
  if (isPaused()) return res.status(403).json({ error: 'Agents are paused. Resume first.' });
  next();
});

router.post('/trigger/marketing', async (req, res) => {
  res.json({ message: 'Marketing agent triggered.' });
  runMarketing().catch(err => console.error('[API] Marketing trigger failed:', err.message));
});

router.post('/trigger/sales', async (req, res) => {
  res.json({ message: 'Sales agent triggered.' });
  runSales().catch(err => console.error('[API] Sales trigger failed:', err.message));
});

router.post('/trigger/solutions', async (req, res) => {
  const { task_id } = req.body;
  if (!task_id) return res.status(400).json({ error: 'task_id required' });
  res.json({ message: `Solutions agent triggered for ${task_id}.` });
  runSolutions(task_id).catch(err => console.error('[API] Solutions trigger failed:', err.message));
});

router.post('/trigger/digest', async (req, res) => {
  res.json({ message: 'Manager digest triggered.' });
  runDigest().catch(err => console.error('[API] Digest trigger failed:', err.message));
});

router.post('/trigger/alert-check', async (req, res) => {
  res.json({ message: 'Alert check triggered.' });
  runAlertCheck().catch(err => console.error('[API] Alert check trigger failed:', err.message));
});

router.post('/trigger/notion-check', async (req, res) => {
  res.json({ message: 'Notion task check triggered.' });
  checkForNewTasks().catch(err => console.error('[API] Notion check trigger failed:', err.message));
});

module.exports = router;
