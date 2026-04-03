const { TavilyClient } = require('tavily');

let _client = null;

function getClient() {
  if (!_client) {
    _client = new TavilyClient({ apiKey: process.env.TAVILY_API_KEY });
  }
  return _client;
}

/**
 * General web search.
 */
async function search(query, options = {}) {
  const client = getClient();
  const res = await client.search(query, {
    maxResults: options.maxResults || 5,
    searchDepth: options.searchDepth || 'basic',
    ...options,
  });
  return res.results || [];
}

/**
 * News-focused search.
 */
async function searchNews(query, maxResults = 5) {
  const client = getClient();
  const res = await client.search(query, {
    maxResults,
    searchDepth: 'basic',
    topic: 'news',
  });
  return res.results || [];
}

module.exports = { search, searchNews };
