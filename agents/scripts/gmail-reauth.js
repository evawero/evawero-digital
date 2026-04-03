/**
 * Gmail OAuth Re-authorisation Script
 *
 * Run this locally to generate a new GMAIL_REFRESH_TOKEN with the correct scopes.
 *
 * Usage:
 *   node agents/scripts/gmail-reauth.js
 *
 * Prerequisites:
 *   - GMAIL_CLIENT_ID and GMAIL_CLIENT_SECRET set in your environment (or .env)
 *
 * Steps:
 *   1. Run this script
 *   2. Open the URL it prints in your browser
 *   3. Sign in with info@evawerodigital.com
 *   4. Grant all requested permissions
 *   5. Copy the authorization code from the redirect URL
 *   6. Paste it back into the terminal
 *   7. Copy the new refresh_token and update GMAIL_REFRESH_TOKEN in Railway env vars
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { google } = require('googleapis');
const readline = require('readline');

const CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:3000/oauth2callback';

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('Missing GMAIL_CLIENT_ID or GMAIL_CLIENT_SECRET in environment.');
  process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Request full Gmail access so both read and compose work
const SCOPES = ['https://mail.google.com/'];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
  prompt: 'consent', // Force consent to get a new refresh token
});

console.log('\n=== Gmail OAuth Re-authorisation ===\n');
console.log('1. Open this URL in your browser:\n');
console.log(authUrl);
console.log('\n2. Sign in with info@evawerodigital.com');
console.log('3. Grant permissions');
console.log('4. You will be redirected to a localhost URL that will fail to load.');
console.log('   That is expected. Copy the "code" parameter from the URL.');
console.log('   It looks like: http://localhost:3000/oauth2callback?code=4/0AXXXXXX...\n');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.question('Paste the authorization code here: ', async (code) => {
  rl.close();
  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log('\n=== SUCCESS ===\n');
    console.log('New refresh_token (copy this):');
    console.log(tokens.refresh_token);
    console.log('\nNew access_token (auto-refreshes, no need to save):');
    console.log(tokens.access_token);
    console.log('\nNext steps:');
    console.log('1. Go to Railway dashboard');
    console.log('2. Update GMAIL_REFRESH_TOKEN with the new refresh_token above');
    console.log('3. Redeploy the agents service');
    console.log('4. The next agent run will use the new token with full Gmail access\n');
  } catch (err) {
    console.error('Failed to exchange code for tokens:', err.message);
  }
});
