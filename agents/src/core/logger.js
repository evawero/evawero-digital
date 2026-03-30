const { q } = require('./database');
const { NOTION_DB, createPage } = require('./notion');

/**
 * Log an agent run to PostgreSQL + Notion.
 */
async function logRun(agentName, status, actions, results, needsAttention, metadata) {
  // Write to PostgreSQL
  const { rows } = await q(
    `INSERT INTO agent_logs (agent_name, status, actions, results, needs_attention, metadata)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
    [
      agentName,
      status,
      JSON.stringify(actions || []),
      JSON.stringify(results || {}),
      JSON.stringify(needsAttention || []),
      JSON.stringify(metadata || {}),
    ]
  );

  // Write to Notion Logs database
  // Map internal status to Notion status options: Completed, Failed, Skipped
  const notionStatus = status === 'success' ? 'Completed' : status === 'error' ? 'Failed' : 'Skipped';
  try {
    await createPage(NOTION_DB.LOGS, {
      'Agent': { title: [{ text: { content: agentName } }] },
      'Status': { status: { name: notionStatus } },
      'Run At': { date: { start: new Date().toISOString() } },
      'Summary': { rich_text: [{ text: { content: summarize(actions, results) } }] },
    });
  } catch (err) {
    console.error('Failed to log to Notion:', err.message);
  }

  return rows[0].id;
}

function summarize(actions, results) {
  const actionCount = Array.isArray(actions) ? actions.length : 0;
  const summary = typeof results === 'object' && results
    ? Object.keys(results).map(k => `${k}: ${JSON.stringify(results[k]).slice(0, 80)}`).join('; ')
    : String(results || '');
  return `${actionCount} actions. ${summary}`.slice(0, 2000);
}

module.exports = { logRun };
