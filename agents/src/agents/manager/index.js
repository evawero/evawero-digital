const { runAgent } = require('../../core/claude');
const { logRun } = require('../../core/logger');
const { q } = require('../../core/database');
const { SYSTEM_PROMPT } = require('./prompt');
const { tools } = require('./tools');
const { sendDigest, sendAlert } = require('../../core/mailer');

const OWNER_EMAIL = process.env.OWNER_EMAIL || 'info@evawerodigital.com';

// ============================================================
// DAILY DIGEST — runs on schedule (Mon/Wed/Fri)
// ============================================================
async function runDigest() {
  console.log('[Manager Agent] Running daily digest...');

  const today = new Date().toISOString().split('T')[0];
  const threeDaysAgo = new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0];

  const userMessage = `
Generate today's daily digest. Today is ${today}.

STEPS:
1. Use get_agent_logs to check all agent activity since "${threeDaysAgo}".
2. Use get_leads_summary to get the current pipeline state.
3. Use get_projects_summary to check active client projects.
4. Use get_content_calendar with days=7 to see recent and upcoming content.
5. Use get_open_alerts to check for any undismissed alerts.
6. Use check_gmail_replies with since_date="${threeDaysAgo}" to find any incoming replies.
7. Synthesise everything into the daily digest format from your instructions.
8. Use send_email to send the digest to "${OWNER_EMAIL}" with subject "Evawero Daily Digest — ${today}".
9. Use update_dashboard_data to store the summary for the dashboard.
10. If anything triggers an immediate alert (lead replied, deadline within 48h, agent errors), use create_alert.

OUTPUT your analysis as JSON:
{
  "digest_sent": true,
  "alerts_created": [],
  "summary": "brief text summary",
  "needs_attention": []
}`;

  try {
    const result = await runAgent(SYSTEM_PROMPT, userMessage, tools);

    let parsed = {};
    try {
      const jsonMatch = result.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) parsed = JSON.parse(jsonMatch[0]);
    } catch { parsed = { raw_response: result.text }; }

    await logRun('manager', 'success', parsed.actions_taken || ['digest_sent'], parsed, parsed.needs_attention || [], {
      token_usage: result.tokenUsage,
      tool_calls: result.toolCalls.length,
      type: 'digest',
    });

    console.log('[Manager Agent] Digest complete.');
    return parsed;
  } catch (err) {
    console.error('[Manager Agent] Digest error:', err.message);
    await logRun('manager', 'error', [], {}, [], { error: err.message, type: 'digest' });

    // Try to send error alert email directly
    try {
      await sendAlert('Manager Agent Failed', `The manager agent digest failed at ${new Date().toISOString()}.\n\nError: ${err.message}`);
    } catch (emailErr) {
      console.error('[Manager Agent] Could not send error alert email:', emailErr.message);
    }

    throw err;
  }
}

// ============================================================
// ALERT CHECK — runs more frequently to catch urgent items
// ============================================================
async function runAlertCheck() {
  console.log('[Manager Agent] Running alert check...');

  const today = new Date().toISOString().split('T')[0];

  const userMessage = `
Quick alert check. Today is ${today}. This is NOT a full digest — only check for urgent items.

STEPS:
1. Use check_gmail_replies with since_date="${today}" to find any new replies.
2. Use get_projects_summary to check for deadlines within 48 hours.
3. Use get_agent_logs since "${today}" to check for any agent errors.
4. Use get_open_alerts to see current alert state.

IF anything urgent is found:
- Use create_alert for each urgent item.
- Use send_email to notify "${OWNER_EMAIL}" immediately with subject "[URGENT] Evawero Alert — ${today}".

IF nothing urgent: do NOT send an email. Just return quietly.

OUTPUT JSON:
{
  "alerts_found": 0,
  "alerts_created": [],
  "email_sent": false
}`;

  try {
    const result = await runAgent(SYSTEM_PROMPT, userMessage, tools);

    let parsed = {};
    try {
      const jsonMatch = result.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) parsed = JSON.parse(jsonMatch[0]);
    } catch { parsed = { raw_response: result.text }; }

    await logRun('manager', 'success', ['alert_check'], parsed, [], {
      token_usage: result.tokenUsage,
      tool_calls: result.toolCalls.length,
      type: 'alert_check',
    });

    console.log(`[Manager Agent] Alert check complete. Alerts found: ${parsed.alerts_found || 0}`);
    return parsed;
  } catch (err) {
    console.error('[Manager Agent] Alert check error:', err.message);
    await logRun('manager', 'error', [], {}, [], { error: err.message, type: 'alert_check' });
    throw err;
  }
}

module.exports = { runDigest, runAlertCheck };
