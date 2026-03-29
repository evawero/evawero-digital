const { search, searchNews } = require('../../core/search');
const { NOTION_DB, queryDatabase, createPage } = require('../../core/notion');

const tools = [
  {
    name: 'search_trending_topics',
    description: 'Search for trending topics in a specific industry and market. Returns recent articles and news.',
    input_schema: {
      type: 'object',
      properties: {
        industry: { type: 'string', description: 'Industry or topic, e.g. "AI automation", "digital transformation"' },
        market: { type: 'string', description: 'Market focus, e.g. "Nigeria", "Germany Baden-Württemberg"' },
        language: { type: 'string', description: 'Language: "en" or "de"' },
      },
      required: ['industry', 'market'],
    },
    handler: async ({ industry, market, language }) => {
      const query = `${industry} ${market} business 2026`;
      const results = await searchNews(query, 5);
      return results.map(r => ({ title: r.title, url: r.url, snippet: r.content?.slice(0, 300) }));
    },
  },

  {
    name: 'save_to_content_calendar',
    description: 'Save a content piece to the Notion Content Calendar and PostgreSQL.',
    input_schema: {
      type: 'object',
      properties: {
        platform: { type: 'string', description: 'Platform: linkedin, twitter, instagram, blog' },
        title: { type: 'string', description: 'Content title or hook (first line)' },
        content: { type: 'string', description: 'Full content text' },
        scheduled_for: { type: 'string', description: 'ISO date string for when to publish' },
        language: { type: 'string', description: '"en" or "de"' },
        market: { type: 'string', description: 'Target market: "Nigeria", "Germany", "Both"' },
      },
      required: ['platform', 'title', 'content'],
    },
    handler: async ({ platform, title, content, scheduled_for, language, market }) => {
      const { q } = require('../../core/database');

      // Save to PostgreSQL
      await q(
        `INSERT INTO content_calendar (agent, platform, language, market, title, content, scheduled_for, status)
         VALUES ('marketing', $1, $2, $3, $4, $5, $6, 'draft')`,
        [platform, language || 'en', market || 'Both', title, content, scheduled_for || null]
      );

      // Save to Notion
      try {
        await createPage(NOTION_DB.CONTENT, {
          'Title': { title: [{ text: { content: title } }] },
          'Platform': { select: { name: platform } },
          'Language': { select: { name: language || 'en' } },
          'Market': { select: { name: market || 'Both' } },
          'Status': { select: { name: 'Draft' } },
        });
      } catch (err) {
        console.error('Notion content save failed:', err.message);
      }

      return { success: true, message: `Content saved: "${title}" for ${platform} (${language || 'en'})` };
    },
  },

  {
    name: 'get_recent_content',
    description: 'Get content created in the last N days to avoid topic repetition.',
    input_schema: {
      type: 'object',
      properties: {
        days: { type: 'number', description: 'Number of days to look back' },
      },
      required: ['days'],
    },
    handler: async ({ days }) => {
      const { q } = require('../../core/database');
      const { rows } = await q(
        `SELECT platform, title, language, market, created_at FROM content_calendar
         WHERE created_at > NOW() - INTERVAL '1 day' * $1
         ORDER BY created_at DESC`,
        [days]
      );
      return rows;
    },
  },
];

module.exports = { tools };
