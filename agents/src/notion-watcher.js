const { queryDatabase, NOTION_DB } = require('./core/notion');
const { q } = require('./core/database');
const { run: runSolutions } = require('./agents/solutions');

// ============================================================
// NOTION WATCHER — polls for new client project tasks
// ============================================================

let lastCheck = new Date().toISOString();

async function checkForNewTasks() {
  console.log('[Notion Watcher] Checking for new tasks...');

  try {
    // Query Notion TASKS database for unprocessed items
    const response = await queryDatabase(NOTION_DB.TASKS, {
      and: [
        { property: 'Agent Triggered', checkbox: { equals: false } },
        { property: 'Status', select: { equals: 'Ready' } },
      ],
    });

    if (!response.results || response.results.length === 0) {
      console.log('[Notion Watcher] No new tasks found.');
      return [];
    }

    console.log(`[Notion Watcher] Found ${response.results.length} new task(s).`);

    const triggered = [];

    for (const page of response.results) {
      const taskId = page.id;
      const title = page.properties?.Name?.title?.[0]?.plain_text || 'Untitled';

      console.log(`[Notion Watcher] Triggering Solutions Agent for: "${title}" (${taskId})`);

      try {
        await runSolutions(taskId);
        triggered.push({ taskId, title, status: 'success' });
      } catch (err) {
        console.error(`[Notion Watcher] Solutions agent failed for ${taskId}:`, err.message);
        triggered.push({ taskId, title, status: 'error', error: err.message });
      }
    }

    lastCheck = new Date().toISOString();
    return triggered;
  } catch (err) {
    console.error('[Notion Watcher] Error:', err.message);
    return [];
  }
}

// Poll every 30 minutes
function startWatcher() {
  console.log('[Notion Watcher] Starting — polling every 30 minutes.');

  // Check immediately on start
  checkForNewTasks();

  setInterval(checkForNewTasks, 30 * 60 * 1000);
}

module.exports = { startWatcher, checkForNewTasks };
