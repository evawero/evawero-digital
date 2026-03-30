# Evawero Digital — Manual Setup Checklist

## URGENT — Do These First

- [ ] **Revoke GitHub token** — The token shared in chat is exposed. Go to https://github.com/settings/tokens, delete `ghp_QrOi...`, create a new one if needed.

## Vercel Setup

- [x] Root directory set to `frontend`
- [x] Git repository connected (auto-deploys on push to main)
- [x] Deployment Protection disabled (site is public)
- [x] Deleted unused Vercel projects (`frontend`, `backend`)
- [x] `evawero-digital` is the main Vercel project (https://evawero-digital.vercel.app)
- [x] **Add custom domain `evawerodigital.com`** — Done, www CNAME verified in Namecheap

## Railway Setup

- [x] Backend deployed and running
- [x] PostgreSQL database provisioned
- [x] All environment variables set
- [x] **Add custom domain `api.evawerodigital.com`** — Done, CNAME + verification TXT in Namecheap
- [x] **Update FRONTEND_URL** — Set to `https://evawerodigital.com`
- [x] **Set Gmail App Password** — App password configured in Railway

## Namecheap DNS Setup

Go to https://www.namecheap.com → Domain List → `evawerodigital.com` → **Advanced DNS**

Current records (all set ✓):

| Type   | Host               | Value                                          | TTL       |
|--------|--------------------|-------------------------------------------------|-----------|
| CNAME  | nwlumzkvrh6n       | gv-k47dnox5znvnfs.dv.googlehosted.com          | Automatic |
| TXT    | google._domainkey  | DKIM key (for Gmail)                            | 1 min     |
| A      | @                  | ~~`216.198.79.1`~~ → **`76.76.21.21`** (Vercel) | Automatic |
| CNAME  | www                | 4b4f61517d7a64a8.vercel-dns-017.com             | Automatic |
| CNAME  | api                | dhyaih3b.up.railway.app                         | Automatic |
| TXT    | _railway-verify.api| railway-verify=d2f0e413c66525d44a4bcaaea633c9f43 | Automatic |

- [x] **Change A record** — Updated `@` to `76.76.21.21` (Vercel IP) — DNS propagated ✓

**Important:** DNS changes can take 5-30 minutes to propagate. Check at https://dnschecker.org

## After evawerodigitalsolutions@gmail.com Is Restored

When the email appeal is resolved:
- [ ] Update Railway env vars: `ADMIN_EMAIL`, `GMAIL_USER` to evawerodigitalsolutions@gmail.com
- [ ] Update `GMAIL_APP_PASSWORD` with the new account's app password
- [ ] Update contact info on the website (Contact page + Footer) — or just edit it in the Admin Panel
- [ ] Update the admin user email in the database via the admin panel

## Optional — evawero.com Domain

Since you also own `evawero.com`, you can set it up to redirect to `evawerodigital.com`:
- In Namecheap: Go to `evawero.com` → **Redirect Domain** → set URL redirect to `https://evawerodigital.com`

## Vercel Trial Reminder

Your Vercel Pro Trial expires in ~10 days (around 2026-04-07). Add a payment method at https://vercel.com/evawero/~/settings/billing to avoid service interruption. The Hobby (free) plan works fine if you don't need team features.
