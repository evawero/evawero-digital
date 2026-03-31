const { google } = require('googleapis');

let _gmail = null;

function getGmail() {
  if (_gmail) return _gmail;

  const oauth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
  );
  oauth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN,
  });

  _gmail = google.gmail({ version: 'v1', auth: oauth2Client });
  return _gmail;
}

/**
 * Send an email.
 */
async function sendEmail(to, subject, body) {
  const gmail = getGmail();
  const raw = buildRawEmail(to, subject, body);
  const res = await gmail.users.messages.send({
    userId: 'me',
    requestBody: { raw },
  });
  return res.data;
}

/**
 * Create a Gmail draft (does NOT send).
 */
async function createDraft(to, subject, body) {
  const gmail = getGmail();
  const raw = buildRawEmail(to, subject, body);
  const res = await gmail.users.drafts.create({
    userId: 'me',
    requestBody: {
      message: { raw },
    },
  });
  return res.data;
}

/**
 * Read emails matching a query.
 */
async function readEmails(query, maxResults = 10) {
  const gmail = getGmail();
  const list = await gmail.users.messages.list({
    userId: 'me',
    q: query,
    maxResults,
  });

  if (!list.data.messages || list.data.messages.length === 0) return [];

  const results = [];
  for (const msg of list.data.messages) {
    const full = await gmail.users.messages.get({
      userId: 'me',
      id: msg.id,
      format: 'metadata',
      metadataHeaders: ['From', 'To', 'Subject', 'Date'],
    });

    const headers = {};
    for (const h of full.data.payload.headers) {
      headers[h.name.toLowerCase()] = h.value;
    }

    results.push({
      id: msg.id,
      threadId: msg.threadId,
      from: headers.from || '',
      to: headers.to || '',
      subject: headers.subject || '',
      date: headers.date || '',
      snippet: full.data.snippet || '',
    });
  }
  return results;
}

/**
 * Get a full thread by ID.
 */
async function getThread(threadId) {
  const gmail = getGmail();
  const res = await gmail.users.threads.get({
    userId: 'me',
    id: threadId,
    format: 'metadata',
    metadataHeaders: ['From', 'To', 'Subject', 'Date'],
  });
  return res.data;
}

function mimeEncodeSubject(subject) {
  // RFC 2047: encode non-ASCII characters in email headers
  if (/^[\x20-\x7E]*$/.test(subject)) return subject;
  return '=?UTF-8?B?' + Buffer.from(subject, 'utf-8').toString('base64') + '?=';
}

function buildRawEmail(to, subject, body) {
  const from = process.env.GMAIL_USER;
  const lines = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${mimeEncodeSubject(subject)}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=utf-8',
    'Content-Transfer-Encoding: base64',
    '',
    Buffer.from(body, 'utf-8').toString('base64'),
  ];
  const raw = Buffer.from(lines.join('\r\n')).toString('base64url');
  return raw;
}

module.exports = { sendEmail, createDraft, readEmails, getThread };
