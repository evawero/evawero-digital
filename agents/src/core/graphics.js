const puppeteer = require('puppeteer');
const { q } = require('./database');

/**
 * Render HTML string to a PNG buffer (1080x1080 for Instagram).
 */
async function renderHtmlToImage(html, width = 1080, height = 1080) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width, height, deviceScaleFactor: 2 });
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const buffer = await page.screenshot({ type: 'png', clip: { x: 0, y: 0, width, height } });
    return buffer;
  } finally {
    await browser.close();
  }
}

/**
 * Save a graphic to the content_calendar table and return the record ID.
 */
async function saveGraphic(contentId, imageBuffer) {
  const base64 = imageBuffer.toString('base64');
  await q(
    `UPDATE content_calendar SET image_data = $1 WHERE id = $2`,
    [base64, contentId]
  );
  return contentId;
}

/**
 * Brand constants for generating on-brand graphics.
 */
const BRAND = {
  green: '#1D9E75',
  greenDark: '#0F6E56',
  greenLight: '#e8f7f2',
  white: '#ffffff',
  dark: '#111111',
  mid: '#444444',
  muted: '#888888',
  font: "'Segoe UI', system-ui, -apple-system, sans-serif",
};

/**
 * Generate HTML for common Instagram graphic formats.
 */
const templates = {
  quoteCard: ({ quote, attribution, topic }) => `
    <div style="width:1080px;height:1080px;display:flex;flex-direction:column;justify-content:center;align-items:center;background:${BRAND.green};padding:80px;box-sizing:border-box;font-family:${BRAND.font};">
      <div style="font-size:48px;font-weight:700;color:${BRAND.white};text-align:center;line-height:1.4;margin-bottom:40px;">"${quote}"</div>
      ${attribution ? `<div style="font-size:24px;color:rgba(255,255,255,0.7);text-align:center;">— ${attribution}</div>` : ''}
      <div style="position:absolute;bottom:60px;display:flex;align-items:center;gap:16px;">
        <div style="width:40px;height:40px;background:rgba(255,255,255,0.2);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700;color:white;">ED</div>
        <div style="font-size:18px;color:rgba(255,255,255,0.6);">Evawero Digital</div>
      </div>
    </div>`,

  tipList: ({ title, tips }) => `
    <div style="width:1080px;height:1080px;display:flex;flex-direction:column;background:${BRAND.white};padding:80px;box-sizing:border-box;font-family:${BRAND.font};">
      <div style="font-size:20px;font-weight:600;color:${BRAND.green};text-transform:uppercase;letter-spacing:2px;margin-bottom:16px;">Tips</div>
      <div style="font-size:42px;font-weight:700;color:${BRAND.dark};line-height:1.3;margin-bottom:48px;">${title}</div>
      <div style="flex:1;display:flex;flex-direction:column;gap:24px;">
        ${tips.map((tip, i) => `
          <div style="display:flex;align-items:flex-start;gap:20px;">
            <div style="width:44px;height:44px;background:${BRAND.greenLight};border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:700;color:${BRAND.green};flex-shrink:0;">${i + 1}</div>
            <div style="font-size:26px;color:${BRAND.mid};line-height:1.5;padding-top:6px;">${tip}</div>
          </div>
        `).join('')}
      </div>
      <div style="display:flex;align-items:center;gap:16px;margin-top:40px;">
        <div style="width:40px;height:40px;background:${BRAND.green};border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700;color:white;">ED</div>
        <div style="font-size:18px;color:${BRAND.muted};">evawerodigital.com</div>
      </div>
    </div>`,

  statHighlight: ({ stat, label, description }) => `
    <div style="width:1080px;height:1080px;display:flex;flex-direction:column;justify-content:center;align-items:center;background:${BRAND.dark};padding:80px;box-sizing:border-box;font-family:${BRAND.font};">
      <div style="font-size:140px;font-weight:800;color:${BRAND.green};margin-bottom:16px;">${stat}</div>
      <div style="font-size:36px;font-weight:600;color:${BRAND.white};text-align:center;margin-bottom:24px;">${label}</div>
      <div style="font-size:24px;color:rgba(255,255,255,0.5);text-align:center;max-width:700px;line-height:1.6;">${description}</div>
      <div style="position:absolute;bottom:60px;display:flex;align-items:center;gap:16px;">
        <div style="width:40px;height:40px;background:${BRAND.green};border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700;color:white;">ED</div>
        <div style="font-size:18px;color:rgba(255,255,255,0.4);">Evawero Digital</div>
      </div>
    </div>`,

  announcement: ({ headline, subtext }) => `
    <div style="width:1080px;height:1080px;display:flex;flex-direction:column;justify-content:center;background:linear-gradient(135deg, ${BRAND.greenDark} 0%, ${BRAND.green} 100%);padding:80px;box-sizing:border-box;font-family:${BRAND.font};">
      <div style="font-size:56px;font-weight:800;color:${BRAND.white};line-height:1.3;margin-bottom:32px;">${headline}</div>
      <div style="font-size:28px;color:rgba(255,255,255,0.7);line-height:1.6;max-width:800px;">${subtext}</div>
      <div style="position:absolute;bottom:60px;display:flex;align-items:center;gap:16px;">
        <div style="width:40px;height:40px;background:rgba(255,255,255,0.2);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700;color:white;">ED</div>
        <div style="font-size:18px;color:rgba(255,255,255,0.6);">evawerodigital.com</div>
      </div>
    </div>`,
};

module.exports = { renderHtmlToImage, saveGraphic, templates, BRAND };
