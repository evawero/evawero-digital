const cron = require('node-cron');
const { runDigest, runAlertCheck } = require('./agents/manager');
const { run: runMarketing } = require('./agents/marketing');
const { run: runSales } = require('./agents/sales');

// ============================================================
// KILL SWITCH — in-memory pause flag
// ============================================================
let paused = false;

function isPaused() { return paused; }
function setPaused(value) {
  paused = !!value;
  console.log(`[Scheduler] Agents ${paused ? 'PAUSED' : 'RESUMED'}`);
  return paused;
}

// ============================================================
// SCHEDULE
// Marketing: Monday only
// Sales research (new leads + cold outreach): Monday
// Sales follow-up (check replies + follow-ups): Thursday
// Digest: Monday + Thursday (after sales runs)
// Alert check: Daily
// ============================================================

function startScheduler() {
  console.log('[Scheduler] Starting cron jobs...');

  // Marketing Agent — Monday at 07:00 UTC
  cron.schedule('0 7 * * 1', async () => {
    if (paused) { console.log('[Scheduler] PAUSED — skipping Marketing Agent'); return; }
    console.log('[Scheduler] Triggering Marketing Agent...');
    try {
      await runMarketing();
    } catch (err) {
      console.error('[Scheduler] Marketing agent failed:', err.message);
    }
  });

  // Sales Agent (research) — Monday at 08:00 UTC
  cron.schedule('0 8 * * 1', async () => {
    if (paused) { console.log('[Scheduler] PAUSED — skipping Sales Agent (research)'); return; }
    console.log('[Scheduler] Triggering Sales Agent (research)...');
    try {
      await runSales('research');
    } catch (err) {
      console.error('[Scheduler] Sales agent (research) failed:', err.message);
    }
  });

  // Sales Agent (follow-up) — Thursday at 08:00 UTC
  cron.schedule('0 8 * * 4', async () => {
    if (paused) { console.log('[Scheduler] PAUSED — skipping Sales Agent (follow-up)'); return; }
    console.log('[Scheduler] Triggering Sales Agent (follow-up)...');
    try {
      await runSales('followup');
    } catch (err) {
      console.error('[Scheduler] Sales agent (follow-up) failed:', err.message);
    }
  });

  // Manager Digest — Monday + Thursday at 09:00 UTC (after sales runs)
  cron.schedule('0 9 * * 1,4', async () => {
    if (paused) { console.log('[Scheduler] PAUSED — skipping Manager Digest'); return; }
    console.log('[Scheduler] Triggering Manager Digest...');
    try {
      await runDigest();
    } catch (err) {
      console.error('[Scheduler] Manager digest failed:', err.message);
    }
  });

  // Alert Check — Every day at 14:00 UTC (midday check)
  cron.schedule('0 14 * * *', async () => {
    if (paused) { console.log('[Scheduler] PAUSED — skipping Alert Check'); return; }
    console.log('[Scheduler] Triggering Alert Check...');
    try {
      await runAlertCheck();
    } catch (err) {
      console.error('[Scheduler] Alert check failed:', err.message);
    }
  });

  console.log('[Scheduler] Cron jobs registered:');
  console.log('  Marketing:        Monday 07:00 UTC (09:00 CEST)');
  console.log('  Sales (research): Monday 08:00 UTC (10:00 CEST)');
  console.log('  Sales (follow-up):Thursday 08:00 UTC (10:00 CEST)');
  console.log('  Digest:           Mon + Thu 09:00 UTC (11:00 CEST)');
  console.log('  Alerts:           Daily 14:00 UTC (16:00 CEST)');
}

module.exports = { startScheduler, isPaused, setPaused };
