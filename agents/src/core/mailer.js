const { sendEmail } = require('./gmail');

/**
 * Build a styled HTML digest email.
 */
function buildDigest(sections) {
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:'Segoe UI',system-ui,sans-serif;background:#f8f8f8;padding:20px;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;">
    <div style="background:#1D9E75;padding:24px 32px;">
      <h1 style="color:#fff;font-size:20px;margin:0;">Evawero Agent Digest</h1>
      <p style="color:rgba(255,255,255,0.8);font-size:13px;margin:8px 0 0;">${new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
    </div>
    <div style="padding:24px 32px;">
      ${sections.map(s => `
        <div style="margin-bottom:24px;">
          <h2 style="font-size:16px;color:#111;margin:0 0 8px;">${s.heading}</h2>
          <div style="font-size:14px;color:#444;line-height:1.6;">${s.body}</div>
        </div>
        <hr style="border:none;border-top:1px solid #eee;">
      `).join('')}
    </div>
    <div style="padding:16px 32px;background:#f8f8f8;font-size:12px;color:#888;">
      Evawero Digital Solutions — Agent System
    </div>
  </div>
</body>
</html>`.trim();

  return html;
}

/**
 * Send the digest email.
 */
async function sendDigest(digestHtml, subject) {
  const to = process.env.OWNER_EMAIL;
  const sub = subject || `Evawero Agent Digest — ${new Date().toLocaleDateString('en-GB')}`;
  return sendEmail(to, sub, digestHtml);
}

/**
 * Send an urgent alert email.
 */
async function sendAlert(title, body) {
  const to = process.env.OWNER_EMAIL;
  const html = buildDigest([{ heading: '🔴 URGENT: ' + title, body }]);
  return sendEmail(to, `[URGENT] ${title}`, html);
}

module.exports = { buildDigest, sendDigest, sendAlert };
