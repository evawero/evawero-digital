const { runAgent } = require('../../core/claude');
const { logRun } = require('../../core/logger');
const { SYSTEM_PROMPT } = require('./prompt');
const { tools } = require('./tools');

// ============================================================
// SALES AGENT CONFIGURATION
// Edit values here to change targeting and outreach behaviour.
// ============================================================
const CONFIG = {
  MARKET_PRIORITY: ['nigeria', 'germany'],
  NIGERIA_TARGETS: {
    cities: ['Lagos', 'Abuja', 'Port Harcourt', 'Ibadan', 'Kano'],
    company_sizes: ['individual', 'small', 'medium'],
    industries: ['any'],
  },
  GERMANY_TARGETS: {
    primary_region: 'Ostalbkreis',
    secondary_region: 'Baden-Württemberg',
    fallback_region: 'Germany',
    company_sizes: ['small', 'medium'],
    industries: ['any'],
  },
  LEADS_PER_RUN: 5,
  FOLLOWUP_DAYS: 3,
  CREATE_DRAFTS: true,
  OUTREACH_LANGUAGE: {
    nigeria: 'en',
    germany: 'de',
  },
  EMAIL_TONE: 'professional-warm',
};

/**
 * Run the sales agent.
 * @param {string} mode - 'research' (find leads + cold outreach), 'followup' (check replies + follow-ups), or 'full' (both)
 */
async function run(mode = 'full') {
  console.log(`[Sales Agent] Starting run... (mode: ${mode})`);

  const today = new Date().toISOString().split('T')[0];
  const followupDate = new Date(Date.now() - CONFIG.FOLLOWUP_DAYS * 86400000).toISOString().split('T')[0];

  let tasks;
  if (mode === 'research') {
    tasks = `
TASKS (in order):
1. Research and identify up to ${CONFIG.LEADS_PER_RUN} new potential leads. Start with Nigeria (${CONFIG.NIGERIA_TARGETS.cities.join(', ')}), then Germany (${CONFIG.GERMANY_TARGETS.primary_region} first, then ${CONFIG.GERMANY_TARGETS.secondary_region}).
2. For each new lead: add to CRM and draft a personalised cold outreach email.
3. German leads: write outreach emails in German.`;
  } else if (mode === 'followup') {
    tasks = `
TASKS (in order):
1. Check for Gmail replies since ${followupDate} — for any lead that replied, draft a personalised response and update their status to "replied".
2. Check leads with status "contacted" that were last contacted before ${followupDate} — draft follow-up emails for them.`;
  } else {
    tasks = `
TASKS (in order):
1. Check for Gmail replies since ${followupDate} — for any lead that replied, draft a personalised response and update their status to "replied".
2. Check leads with status "contacted" that were last contacted before ${followupDate} — draft follow-up emails for them.
3. Research and identify up to ${CONFIG.LEADS_PER_RUN} new potential leads. Start with Nigeria (${CONFIG.NIGERIA_TARGETS.cities.join(', ')}), then Germany (${CONFIG.GERMANY_TARGETS.primary_region} first, then ${CONFIG.GERMANY_TARGETS.secondary_region}).
4. For each new lead: add to CRM and draft a personalised cold outreach email.
5. German leads: write outreach emails in German.`;
  }

  const userMessage = `
Today is ${today}. Run your sales cycle (mode: ${mode}).

CONFIGURATION:
${JSON.stringify(CONFIG, null, 2)}

${tasks}

IMPORTANT: Create Gmail DRAFTS only. NEVER send emails.

Return your results as JSON.`;

  try {
    const result = await runAgent(SYSTEM_PROMPT, userMessage, tools, 'claude-sonnet-4-6');

    let parsed = {};
    try {
      const jsonMatch = result.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) parsed = JSON.parse(jsonMatch[0]);
    } catch { parsed = { raw_response: result.text }; }

    await logRun('sales', 'success', parsed.actions_taken || [], parsed, parsed.needs_attention || [], {
      token_usage: result.tokenUsage,
      tool_calls: result.toolCalls.length,
      mode,
    });

    console.log(`[Sales Agent] Run complete.`, {
      mode,
      leads: parsed.new_leads_found?.length || 0,
      drafts: parsed.drafts_created?.length || 0,
    });

    return parsed;
  } catch (err) {
    console.error('[Sales Agent] Error:', err.message);
    await logRun('sales', 'error', [], {}, [], { error: err.message, mode });
    throw err;
  }
}

module.exports = { run, CONFIG };
