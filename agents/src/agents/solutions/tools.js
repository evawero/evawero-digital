const { getPage, updatePage, NOTION_DB } = require('../../core/notion');
const { createDraft } = require('../../core/gmail');
const { search } = require('../../core/search');
const { q } = require('../../core/database');
const fs = require('fs');
const path = require('path');

const CLIENT_PROJECTS_DIR = path.join(__dirname, '../../../client-projects');

const tools = [
  {
    name: 'get_notion_task',
    description: 'Read a client project task from Notion by page ID.',
    input_schema: {
      type: 'object',
      properties: {
        task_id: { type: 'string', description: 'Notion page ID' },
      },
      required: ['task_id'],
    },
    handler: async ({ task_id }) => {
      const page = await getPage(task_id);
      const props = page.properties || {};

      // Extract common property types
      const extract = (prop) => {
        if (!prop) return '';
        if (prop.title) return prop.title.map(t => t.plain_text).join('');
        if (prop.rich_text) return prop.rich_text.map(t => t.plain_text).join('');
        if (prop.select) return prop.select?.name || '';
        if (prop.date) return prop.date?.start || '';
        if (prop.email) return prop.email || '';
        if (prop.checkbox !== undefined) return prop.checkbox;
        return JSON.stringify(prop);
      };

      const result = {};
      for (const [key, val] of Object.entries(props)) {
        result[key] = extract(val);
      }
      return result;
    },
  },

  {
    name: 'update_notion_task',
    description: 'Update a client project task in Notion.',
    input_schema: {
      type: 'object',
      properties: {
        task_id: { type: 'string', description: 'Notion page ID' },
        status: { type: 'string', description: 'New status' },
        agent_triggered: { type: 'boolean' },
        deliverables: { type: 'string', description: 'Deliverables summary text' },
      },
      required: ['task_id'],
    },
    handler: async ({ task_id, status, agent_triggered, deliverables }) => {
      const properties = {};
      if (status) properties['Status'] = { status: { name: status } };
      if (agent_triggered !== undefined) properties['Agent Triggered'] = { checkbox: agent_triggered };
      if (deliverables) properties['Deliverables'] = { rich_text: [{ text: { content: deliverables.slice(0, 2000) } }] };

      await updatePage(task_id, properties);

      // Also update PostgreSQL
      if (status) {
        await q(
          `UPDATE projects SET status=$1, last_updated_at=NOW() WHERE notion_task_id=$2`,
          [status, task_id]
        );
      }

      return { success: true, message: `Task ${task_id} updated.` };
    },
  },

  {
    name: 'create_file',
    description: 'Create a file in the client projects directory.',
    input_schema: {
      type: 'object',
      properties: {
        filepath: { type: 'string', description: 'Relative path within the project folder, e.g. "acme-corp-2026-03/README.md"' },
        content: { type: 'string', description: 'File content' },
      },
      required: ['filepath', 'content'],
    },
    handler: async ({ filepath, content }) => {
      const fullPath = path.join(CLIENT_PROJECTS_DIR, filepath);
      const dir = path.dirname(fullPath);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(fullPath, content, 'utf8');
      return { success: true, path: filepath, message: `File created: ${filepath}` };
    },
  },

  {
    name: 'read_file',
    description: 'Read a file from the client projects directory.',
    input_schema: {
      type: 'object',
      properties: {
        filepath: { type: 'string', description: 'Relative path within the project folder' },
      },
      required: ['filepath'],
    },
    handler: async ({ filepath }) => {
      const fullPath = path.join(CLIENT_PROJECTS_DIR, filepath);
      if (!fs.existsSync(fullPath)) return { error: 'File not found' };
      const content = fs.readFileSync(fullPath, 'utf8');
      return { content };
    },
  },

  {
    name: 'create_gmail_draft',
    description: 'Create a Gmail draft for client communication. Does NOT send.',
    input_schema: {
      type: 'object',
      properties: {
        to: { type: 'string' },
        subject: { type: 'string' },
        body: { type: 'string', description: 'Email body in HTML' },
      },
      required: ['to', 'subject', 'body'],
    },
    handler: async ({ to, subject, body }) => {
      const draft = await createDraft(to, subject, body);
      return { success: true, draft_id: draft.id, message: `Kickoff email drafted for ${to}.` };
    },
  },

  {
    name: 'search_documentation',
    description: 'Search the web for technical documentation or best practices.',
    input_schema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Technical search query' },
      },
      required: ['query'],
    },
    handler: async ({ query }) => {
      const results = await search(query, { maxResults: 5 });
      return results.map(r => ({ title: r.title, url: r.url, snippet: r.content?.slice(0, 300) }));
    },
  },
];

module.exports = { tools };
