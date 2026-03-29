const cron = require('node-cron');
const { runDigest, runAlertCheck } = require('./agents/manager');
const { run: runMarketing } = require('./agents/marketing');
const { run: runSales } = require('./agents/sales');

// ============================================================
// SCHEDULE — Mon/Wed/Fri to manage API costs
// ============================================================

function startScheduler() {
  console.log('[Scheduler] Starting cron jobs...');

  // Marketing Agent — Mon/Wed/Fri at 07:00 UTC
  cron.schedule('0 7 * * 1,3,5', async () => {
    console.log('[Scheduler] Triggering Marketing Agent...');
    try {
      await runMarketing();
    } catch (err) {
      console.error('[Scheduler] Marketing agent failed:', err.message);
    }
  });

  // Sales Agent — Mon/Wed/Fri at 08:00 UTC
  cron.schedule('0 8 * * 1,3,5', async () => {
    console.log('[Scheduler] Triggering Sales Agent...');
    try {
      await runSales();
    } catch (err) {
      console.error('[Scheduler] Sales agent failed:', err.message);
    }
  });

  // Manager Digest — Mon/Wed/Fri at 09:00 UTC (after other agents run)
  cron.schedule('0 9 * * 1,3,5', async () => {
    console.log('[Scheduler] Triggering Manager Digest...');
    try {
      await runDigest();
    } catch (err) {
      console.error('[Scheduler] Manager digest failed:', err.message);
    }
  });

  // Alert Check — Every day at 14:00 UTC (midday check)
  cron.schedule('0 14 * * *', async () => {
    console.log('[Scheduler] Triggering Alert Check...');
    try {
      await runAlertCheck();
    } catch (err) {
      console.error('[Scheduler] Alert check failed:', err.message);
    }
  });

  console.log('[Scheduler] Cron jobs registered:');
  console.log('  Marketing:  Mon/Wed/Fri 07:00 UTC');
  console.log('  Sales:      Mon/Wed/Fri 08:00 UTC');
  console.log('  Digest:     Mon/Wed/Fri 09:00 UTC');
  console.log('  Alerts:     Daily 14:00 UTC');
}

module.exports = { startScheduler };
