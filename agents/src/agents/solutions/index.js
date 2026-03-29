const { runAgent } = require('../../core/claude');
const { logRun } = require('../../core/logger');
const { q } = require('../../core/database');
const { SYSTEM_PROMPT } = require('./prompt');
const { tools } = require('./tools');

// ============================================================
// SOLUTIONS AGENT CONFIGURATION
// ============================================================
const CONFIG = {
  PREFERRED_STACK: {
    frontend: 'React + Vite',
    backend: 'Node.js + Express',
    database: 'PostgreSQL',
    cms: 'Payload CMS v3',
    hosting: 'Railway (backend) + Vercel (frontend)',
    ai: 'Anthropic SDK (claude-sonnet-4-6)',
    automation: 'Node.js scripts or n8n-compatible workflows',
  },
  OUTPUT_PATH: '/agents/client-projects/',
  DELIVERY_STANDARDS: {
    always_create_readme: true,
    always_draft_kickoff_email: true,
    always_document_assumptions: true,
    set_to_review_not_delivered: true,
  },
};

async function run(notionTaskId) {
  console.log(`[Solutions Agent] Triggered for Notion task: ${notionTaskId}`);

  const userMessage = `
A new client project has been assigned. Your Notion task ID is: ${notionTaskId}

CONFIGURATION:
${JSON.stringify(CONFIG, null, 2)}

TASKS:
1. Use get_notion_task to read the full client brief from Notion task "${notionTaskId}".
2. Analyse the brief and produce a structured project plan: deliverables, tech approach, timeline estimate, assumptions, and questions.
3. Create project files using create_file:
   - Create a folder named after the client and date
   - Create a README.md with the full project plan
   - Scaffold any initial code/config files as appropriate
4. Break the project plan into 5-8 actionable sub-tasks using create_subtask.
   - Each sub-task should be a concrete deliverable or milestone (e.g. "Build landing page", "Set up payment integration", "Create API endpoints")
   - Set the "project" field to the exact Project Title from the client brief
   - Include clear instructions for each sub-task
   - Mark truly time-sensitive tasks as "Urgent", otherwise "Normal"
   - Do NOT create more than 8 sub-tasks. Group small items together if needed.
5. Draft a professional "Project Kickoff" email to the client using create_gmail_draft.
6. Update the Notion task: set Agent Triggered = true, Status = "In progress", add plan summary to Deliverables.
7. Return your results as JSON.

IMPORTANT: Set status to "In progress" not "Delivered". Owner reviews before delivery.`;

  try {
    // Add to PostgreSQL projects table
    await q(
      `INSERT INTO projects (notion_task_id, status, created_at)
       VALUES ($1, 'in_progress', NOW())
       ON CONFLICT (notion_task_id) DO UPDATE SET status='in_progress', last_updated_at=NOW()`,
      [notionTaskId]
    );

    const result = await runAgent(SYSTEM_PROMPT, userMessage, tools, 'claude-opus-4-6');

    let parsed = {};
    try {
      const jsonMatch = result.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) parsed = JSON.parse(jsonMatch[0]);
    } catch { parsed = { raw_response: result.text }; }

    // Update project in DB
    if (parsed.client_name || parsed.project_title) {
      await q(
        `UPDATE projects SET client_name=$1, project_title=$2, brief=$3, deliverables=$4, last_updated_at=NOW()
         WHERE notion_task_id=$5`,
        [parsed.client_name || '', parsed.project_title || '', '', JSON.stringify(parsed.project_plan || {}), notionTaskId]
      );
    }

    await logRun('solutions', 'success', parsed.actions_taken || [], parsed, parsed.needs_attention || [], {
      token_usage: result.tokenUsage,
      tool_calls: result.toolCalls.length,
      notion_task_id: notionTaskId,
    });

    console.log(`[Solutions Agent] Complete for task ${notionTaskId}.`);
    return parsed;
  } catch (err) {
    console.error('[Solutions Agent] Error:', err.message);
    await logRun('solutions', 'error', [], {}, [], { error: err.message, notion_task_id: notionTaskId });
    throw err;
  }
}

module.exports = { run, CONFIG };
