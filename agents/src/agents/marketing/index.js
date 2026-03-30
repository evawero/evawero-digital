const { runAgent } = require('../../core/claude');
const { logRun } = require('../../core/logger');
const { SYSTEM_PROMPT } = require('./prompt');
const { tools } = require('./tools');

// ============================================================
// MARKETING AGENT CONFIGURATION
// To change agent behaviour, edit values in this block only.
// ============================================================
const CONFIG = {
  CONTENT_RATIO: {
    evawero_brand: 2,
    evas_intelligence: 1,
  },
  PLATFORMS: {
    linkedin_english: false,
    linkedin_german: false,
    x_english: false,
    instagram_english: false,
    blog_post: true,
  },
  GERMAN_CONTENT: {
    enabled: true,
    language: 'de',
    target_market: 'Baden-Württemberg — Ostalbkreis region',
    platforms: ['linkedin'],
  },
  TOPIC_LOOKBACK_DAYS: 14,
};

async function run() {
  console.log('[Marketing Agent] Starting run...');

  const today = new Date().toISOString().split('T')[0];

  const enabledPlatforms = Object.entries(CONFIG.PLATFORMS)
    .filter(([, v]) => v)
    .map(([k]) => k)
    .join(', ');

  const userMessage = `
Today is ${today}. Run your daily content creation cycle.

CONFIGURATION:
${JSON.stringify(CONFIG, null, 2)}

TASKS (in order):
1. Search for trending topics in AI, automation, and digital transformation — for both Nigeria and Germany markets.
2. Check recent content from the last ${CONFIG.TOPIC_LOOKBACK_DAYS} days to avoid repeating topics.
3. Generate content for these enabled platforms: ${enabledPlatforms}

Specifically create:
${CONFIG.PLATFORMS.linkedin_english ? '- 1 LinkedIn post (Evawero brand — thought leadership, English)\n- 1 LinkedIn post (Evas Intelligence — use case focused, English)' : ''}
${CONFIG.PLATFORMS.x_english ? '- 1 X thread (3–6 tweets, English)' : ''}
${CONFIG.PLATFORMS.instagram_english ? '- 1 Instagram caption (English)' : ''}
${CONFIG.PLATFORMS.blog_post ? '- 1 full blog post (English, 1200-1800 words) — use publish_blog_post to save to evawerodigital.com as draft' : ''}
${CONFIG.PLATFORMS.linkedin_german && CONFIG.GERMAN_CONTENT.enabled ? '- 1 LinkedIn post in German (Baden-Württemberg/Ostalbkreis angle)' : ''}

4. Save ALL content pieces to the Content Calendar via the save_to_content_calendar tool.
5. Return your results as JSON.

Remember: Follow the Brand Bible exactly. No buzzwords. No fabricated stats. Lead with value.`;

  try {
    const result = await runAgent(SYSTEM_PROMPT, userMessage, tools, 'claude-sonnet-4-6');

    let parsed = {};
    try {
      const jsonMatch = result.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) parsed = JSON.parse(jsonMatch[0]);
    } catch { parsed = { raw_response: result.text }; }

    await logRun('marketing', 'success', parsed.actions_taken || [], parsed, parsed.needs_attention || [], {
      token_usage: result.tokenUsage,
      tool_calls: result.toolCalls.length,
    });

    console.log('[Marketing Agent] Run complete.', {
      content_pieces: result.toolCalls.filter(t => t.name === 'save_to_content_calendar').length,
    });

    return parsed;
  } catch (err) {
    console.error('[Marketing Agent] Error:', err.message);
    await logRun('marketing', 'error', [], {}, [], { error: err.message });
    throw err;
  }
}

module.exports = { run, CONFIG };
