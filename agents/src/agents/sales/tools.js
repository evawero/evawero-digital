const { search } = require('../../core/search');
const { NOTION_DB, queryDatabase, createPage, updatePage } = require('../../core/notion');
const { createDraft, readEmails } = require('../../core/gmail');
const { q } = require('../../core/database');

const tools = [
  {
    name: 'search_prospects',
    description: 'Search the web for potential business prospects in a specific market and region. Returns company/person info.',
    input_schema: {
      type: 'object',
      properties: {
        market: { type: 'string', description: 'Market: "nigeria" or "germany"' },
        region: { type: 'string', description: 'Region/city to focus on, e.g. "Lagos" or "Ostalbkreis"' },
        query: { type: 'string', description: 'Search query for finding prospects' },
      },
      required: ['market', 'query'],
    },
    handler: async ({ market, region, query }) => {
      const fullQuery = region ? `${query} ${region} ${market}` : `${query} ${market}`;
      const results = await search(fullQuery, { maxResults: 5 });
      return results.map(r => ({ title: r.title, url: r.url, snippet: r.content?.slice(0, 300) }));
    },
  },

  {
    name: 'add_lead_to_crm',
    description: 'Add a new lead to the Notion CRM and PostgreSQL database.',
    input_schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        company: { type: 'string' },
        email: { type: 'string' },
        phone: { type: 'string' },
        market: { type: 'string', description: '"nigeria" or "germany"' },
        region: { type: 'string' },
        source: { type: 'string', description: 'How the lead was found' },
        notes: { type: 'string' },
      },
      required: ['name', 'market'],
    },
    handler: async ({ name, company, email, phone, market, region, source, notes }) => {
      // Add to PostgreSQL
      const { rows } = await q(
        `INSERT INTO leads (name, company, email, phone, market, region, source, status, notes)
         VALUES ($1,$2,$3,$4,$5,$6,$7,'identified',$8) RETURNING id`,
        [name, company || '', email || '', phone || '', market, region || '', source || 'agent-search', notes || '']
      );

      // Add to Notion CRM
      // Capitalise market to match Notion select options: Nigeria, Germany, Other
      const marketName = market ? market.charAt(0).toUpperCase() + market.slice(1).toLowerCase() : 'Other';
      try {
        const properties = {
          'Name': { title: [{ text: { content: name } }] },
          'Company': { rich_text: [{ text: { content: company || '' } }] },
          'Market': { select: { name: marketName } },
          'Status': { status: { name: 'Identified' } },
          'Notes': { rich_text: [{ text: { content: [source ? `Source: ${source}` : '', region ? `Region: ${region}` : '', notes || ''].filter(Boolean).join('. ').slice(0, 2000) } }] },
        };
        if (email) properties['Email'] = { email: email };
        if (phone) properties['Phone'] = { phone_number: phone };
        await createPage(NOTION_DB.CRM, properties);
      } catch (err) {
        console.error('Notion CRM add failed:', err.message);
      }

      return { success: true, id: rows[0].id, message: `Lead "${name}" added to CRM.` };
    },
  },

  {
    name: 'update_lead_status',
    description: 'Update the status and notes of an existing lead.',
    input_schema: {
      type: 'object',
      properties: {
        lead_id: { type: 'number', description: 'PostgreSQL lead ID' },
        status: { type: 'string', description: 'New status: identified, contacted, replied, qualified, call_booked, won, lost' },
        notes: { type: 'string' },
      },
      required: ['lead_id', 'status'],
    },
    handler: async ({ lead_id, status, notes }) => {
      await q(
        'UPDATE leads SET status=$1, notes=COALESCE($2, notes), updated_at=NOW() WHERE id=$3',
        [status, notes || null, lead_id]
      );
      return { success: true, message: `Lead ${lead_id} updated to "${status}".` };
    },
  },

  {
    name: 'get_leads_by_status',
    description: 'Get all leads with a specific status.',
    input_schema: {
      type: 'object',
      properties: {
        status: { type: 'string', description: 'Lead status to filter by' },
      },
      required: ['status'],
    },
    handler: async ({ status }) => {
      const { rows } = await q(
        'SELECT * FROM leads WHERE status=$1 ORDER BY updated_at DESC',
        [status]
      );
      return rows;
    },
  },

  {
    name: 'create_gmail_draft',
    description: 'Create a Gmail draft email. Does NOT send — owner reviews and sends manually.',
    input_schema: {
      type: 'object',
      properties: {
        to: { type: 'string', description: 'Recipient email address' },
        subject: { type: 'string' },
        body: { type: 'string', description: 'Email body in HTML format' },
      },
      required: ['to', 'subject', 'body'],
    },
    handler: async ({ to, subject, body }) => {
      const draft = await createDraft(to, subject, body);
      return { success: true, draft_id: draft.id, message: `Draft created for ${to}. NOT sent — review required.` };
    },
  },

  {
    name: 'check_gmail_replies',
    description: 'Check Gmail for replies to outreach emails since a given date.',
    input_schema: {
      type: 'object',
      properties: {
        since_date: { type: 'string', description: 'Date string, e.g. "2026-03-25"' },
      },
      required: ['since_date'],
    },
    handler: async ({ since_date }) => {
      const query = `is:inbox after:${since_date} -from:me`;
      const emails = await readEmails(query, 20);
      return emails;
    },
  },
];

module.exports = { tools };
