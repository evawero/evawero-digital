const { q } = require('../../core/database');
const { NOTION_DB, queryDatabase } = require('../../core/notion');
const { sendEmail, readEmails } = require('../../core/gmail');

const tools = [
  {
    name: 'get_agent_logs',
    description: 'Get agent activity logs since a given date.',
    input_schema: {
      type: 'object',
      properties: {
        since: { type: 'string', description: 'ISO date string, e.g. "2026-03-28"' },
      },
      required: ['since'],
    },
    handler: async ({ since }) => {
      const { rows } = await q(
        'SELECT * FROM agent_logs WHERE run_at >= $1 ORDER BY run_at DESC',
        [since]
      );
      return rows;
    },
  },

  {
    name: 'get_leads_summary',
    description: 'Get a summary of the lead pipeline.',
    input_schema: { type: 'object', properties: {} },
    handler: async () => {
      const { rows } = await q(`
        SELECT status, COUNT(*) as count FROM leads GROUP BY status ORDER BY count DESC
      `);
      const { rows: recent } = await q(`
        SELECT name, company, market, region, status, updated_at FROM leads
        WHERE updated_at > NOW() - INTERVAL '7 days' ORDER BY updated_at DESC LIMIT 10
      `);
      return { pipeline: rows, recent_activity: recent };
    },
  },

  {
    name: 'get_projects_summary',
    description: 'Get active client projects from Notion.',
    input_schema: { type: 'object', properties: {} },
    handler: async () => {
      const { rows } = await q(
        `SELECT * FROM projects WHERE status NOT IN ('completed', 'cancelled') ORDER BY deadline ASC`
      );
      return rows;
    },
  },

  {
    name: 'get_content_calendar',
    description: 'Get upcoming content from the content calendar.',
    input_schema: {
      type: 'object',
      properties: {
        days: { type: 'number', description: 'Days to look ahead' },
      },
      required: ['days'],
    },
    handler: async ({ days }) => {
      const { rows } = await q(`
        SELECT platform, title, language, market, status, scheduled_for, created_at
        FROM content_calendar WHERE created_at > NOW() - INTERVAL '1 day' * $1
        ORDER BY created_at DESC LIMIT 20
      `, [days]);
      return rows;
    },
  },

  {
    name: 'get_open_alerts',
    description: 'Get all undismissed alerts.',
    input_schema: { type: 'object', properties: {} },
    handler: async () => {
      const { rows } = await q(
        'SELECT * FROM alerts WHERE dismissed = false ORDER BY created_at DESC'
      );
      return rows;
    },
  },

  {
    name: 'create_alert',
    description: 'Create a new alert for the dashboard.',
    input_schema: {
      type: 'object',
      properties: {
        level: { type: 'string', description: '"urgent", "warning", or "info"' },
        source_agent: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
      },
      required: ['level', 'source_agent', 'title'],
    },
    handler: async ({ level, source_agent, title, description }) => {
      const { rows } = await q(
        `INSERT INTO alerts (level, source_agent, title, description)
         VALUES ($1, $2, $3, $4) RETURNING id`,
        [level, source_agent, title, description || '']
      );
      return { success: true, alert_id: rows[0].id };
    },
  },

  {
    name: 'dismiss_alert',
    description: 'Dismiss an alert by ID.',
    input_schema: {
      type: 'object',
      properties: {
        alert_id: { type: 'number' },
      },
      required: ['alert_id'],
    },
    handler: async ({ alert_id }) => {
      await q('UPDATE alerts SET dismissed = true WHERE id = $1', [alert_id]);
      return { success: true };
    },
  },

  {
    name: 'send_email',
    description: 'Send an email (Manager agent only — for digests and urgent alerts).',
    input_schema: {
      type: 'object',
      properties: {
        to: { type: 'string' },
        subject: { type: 'string' },
        body: { type: 'string', description: 'HTML email body' },
      },
      required: ['to', 'subject', 'body'],
    },
    handler: async ({ to, subject, body }) => {
      await sendEmail(to, subject, body);
      return { success: true, message: `Email sent to ${to}` };
    },
  },

  {
    name: 'check_gmail_replies',
    description: 'Check Gmail for incoming replies since a date.',
    input_schema: {
      type: 'object',
      properties: {
        since_date: { type: 'string' },
      },
      required: ['since_date'],
    },
    handler: async ({ since_date }) => {
      const query = `is:inbox after:${since_date} -from:me`;
      const emails = await readEmails(query, 20);
      return emails;
    },
  },

  {
    name: 'update_dashboard_data',
    description: 'Store summary data for the dashboard to read.',
    input_schema: {
      type: 'object',
      properties: {
        summary: { type: 'string', description: 'JSON string of dashboard summary data' },
      },
      required: ['summary'],
    },
    handler: async ({ summary }) => {
      // Store in agent_logs as a special entry
      await q(
        `INSERT INTO agent_logs (agent_name, status, results, metadata)
         VALUES ('dashboard', 'summary', $1, '{"type":"dashboard_summary"}')`,
        [summary]
      );
      return { success: true };
    },
  },
];

module.exports = { tools };
