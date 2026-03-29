const { queryDatabase, NOTION_DB } = require('./core/notion');
const { q } = require('./core/database');
const { run: runSolutions } = require('./agents/solutions');

// ============================================================
// NOTION WATCHER — polls Client Projects (DB2) for new briefs
// ============================================================

let lastCheck = new Date().toISOString();

async function checkForNewTasks() {
  console.log('[Notion Watcher] Checking for new client projects...');

  try {
    // Query Client Projects database for briefed but unprocessed projects
    const response = await queryDatabase(NOTION_DB.PROJECTS, {
      and: [
        { property: 'Agent Triggered', checkbox: { equals: false } },
        { property: 'Status', status: { equals: 'Briefed' } },
      ],
    });

    if (!response.results || response.results.length === 0) {
      console.log('[Notion Watcher] No new projects found.');
      return [];
    }

    console.log(`[Notion Watcher] Found ${response.results.length} new project(s).`);

    const triggered = [];

    for (const page of response.results) {
      const taskId = page.id;
      const title = page.properties?.['Project Title']?.title?.[0]?.plain_text || 'Untitled';

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
