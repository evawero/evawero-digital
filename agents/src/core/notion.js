const { Client } = require('@notionhq/client');

const notion = new Client({ auth: process.env.NOTION_API_KEY });

const NOTION_DB = {
  CRM:      process.env.NOTION_CRM_DB_ID,
  PROJECTS: process.env.NOTION_PROJECTS_DB_ID,
  CONTENT:  process.env.NOTION_CONTENT_DB_ID,
  LOGS:     process.env.NOTION_LOGS_DB_ID,
  TASKS:    process.env.NOTION_TASKS_DB_ID,
};

async function queryDatabase(databaseId, filter, sorts) {
  const params = { database_id: databaseId };
  if (filter) params.filter = filter;
  if (sorts) params.sorts = sorts;

  const response = await notion.databases.query(params);
  return response.results;
}

async function createPage(databaseId, properties) {
  const response = await notion.pages.create({
    parent: { database_id: databaseId },
    properties,
  });
  return response;
}

async function updatePage(pageId, properties) {
  const response = await notion.pages.update({
    page_id: pageId,
    properties,
  });
  return response;
}

async function getPage(pageId) {
  const response = await notion.pages.retrieve({ page_id: pageId });
  return response;
}

module.exports = { notion, NOTION_DB, queryDatabase, createPage, updatePage, getPage };
