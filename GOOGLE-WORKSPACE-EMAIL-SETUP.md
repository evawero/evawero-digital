# Google Workspace Email Setup — info@evawerodigital.com

This guide walks you through configuring the new domain email for both the website backend (contact form) and the agent system (digests, drafts, outreach).

---

## Step 1: Create OAuth2 Credentials in Google Cloud Console

You need new OAuth2 credentials because the Gmail API requires authorization from the account that will send emails.

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with **info@evawerodigital.com** (your Google Workspace account)
3. Create a new project (or reuse an existing one):
   - Project name: `Evawero Digital`
4. Enable the **Gmail API**:
   - Go to **APIs & Services → Library**
   - Search "Gmail API" → click **Enable**
5. Configure the **OAuth consent screen**:
   - Go to **APIs & Services → OAuth consent screen**
   - User type: **Internal** (since this is Google Workspace)
   - App name: `Evawero Digital`
   - User support email: `info@evawerodigital.com`
   - Scopes: add `https://www.googleapis.com/auth/gmail.send` and `https://www.googleapis.com/auth/gmail.compose`
   - Save
6. Create **OAuth2 credentials**:
   - Go to **APIs & Services → Credentials**
   - Click **Create Credentials → OAuth client ID**
   - Application type: **Web application**
   - Name: `Evawero Email`
   - Authorized redirect URIs: add `https://developers.google.com/oauthplayground`
   - Click **Create**
   - Copy the **Client ID** and **Client Secret** — you'll need these below

---

## Step 2: Generate a Refresh Token

1. Go to [OAuth Playground](https://developers.google.com/oauthplayground/)
2. Click the **gear icon** (top right) → check **Use your own OAuth credentials**
3. Enter the **Client ID** and **Client Secret** from Step 1
4. In the left panel, find **Gmail API v1** and select:
   - `https://www.googleapis.com/auth/gmail.send`
   - `https://www.googleapis.com/auth/gmail.compose`
5. Click **Authorize APIs**
6. Sign in with **info@evawerodigital.com** and grant access
7. Click **Exchange authorization code for tokens**
8. Copy the **Refresh Token** — you'll need this below

---

## Step 3: Update Railway Environment Variables

### Backend service (`api`):

| Variable | New Value |
|---|---|
| `GMAIL_USER` | `info@evawerodigital.com` |
| `GMAIL_CLIENT_ID` | *(from Step 1)* |
| `GMAIL_CLIENT_SECRET` | *(from Step 1)* |
| `GMAIL_REFRESH_TOKEN` | *(from Step 2)* |
| `ADMIN_EMAIL` | `info@evawerodigital.com` |

### Agents service (`evawero-digital`):

| Variable | New Value |
|---|---|
| `GMAIL_USER` | `info@evawerodigital.com` |
| `GMAIL_CLIENT_ID` | *(from Step 1)* |
| `GMAIL_CLIENT_SECRET` | *(from Step 1)* |
| `GMAIL_REFRESH_TOKEN` | *(from Step 2)* |
| `OWNER_EMAIL` | `info@evawerodigital.com` |

Both services share the same OAuth2 credentials — use the same Client ID, Client Secret, and Refresh Token for both.

---

## Step 4: Update Admin Login Email

The website admin panel login uses the email in `ADMIN_EMAIL`. After updating Railway:

1. Go to your admin panel: `https://api.evawerodigital.com/admin` (or wherever the admin UI is)
2. The backend seed creates the admin user from `ADMIN_EMAIL` on first boot
3. If you already have an admin account with the old email, you may need to update it in the database:
   - Option A: In the Railway Postgres console, run:
     ```sql
     UPDATE admin_users SET email = 'info@evawerodigital.com' WHERE email = 'theherosmind@gmail.com';
     ```
   - Option B: Delete the old admin user and let the backend re-seed on next deploy

---

## Step 5: Update Contact Info on the Website

The website shows contact email from the `site_settings` database table. Update it:

- Option A: Use the admin panel to change the contact email
- Option B: Run this SQL in Railway Postgres:
  ```sql
  UPDATE site_settings SET contact_email = 'info@evawerodigital.com';
  ```

---

## Step 6: Test Everything

After all variables are updated and both services have redeployed:

- [ ] **Contact form** — Submit a test message at evawerodigital.com/contact → should arrive at info@evawerodigital.com
- [ ] **Agent digest** — Trigger the Manager Agent manually from the dashboard → digest email should arrive at info@evawerodigital.com
- [ ] **Sales drafts** — Trigger the Sales Agent → Gmail drafts should appear in the info@evawerodigital.com inbox
- [ ] **Admin login** — Log in to the admin panel with info@evawerodigital.com
- [ ] **Website display** — Check the Contact page and Footer show info@evawerodigital.com

---

## Notes

- The old `theherosmind@gmail.com` credentials (Client ID, Client Secret, Refresh Token) will stop being used once you update Railway. No need to revoke them unless you want to clean up.
- If you ever need to regenerate the refresh token (e.g. it expires or gets revoked), repeat Step 2 only.
- The `GMAIL_APP_PASSWORD` variable (if it still exists on Railway) is no longer used — the backend uses Gmail OAuth2 API, not SMTP. You can delete it.
