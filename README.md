# Thiệp mời sinh nhật — Việt Nam

**Live:** https://vietnam0410.github.io/thiep-moi-sinh-nhat/

## Files
- `index.html` — UI
- `app.js` — logic (horses + fireworks + RSVP)
- `horse.js` — pixel horse sprites
- `GoogleAppsScript.js` — paste into Apps Script, deploy Web App, put URL in `CONFIG.gasEndpoint`

## Google Sheet setup
1. Create Sheet + Apps Script from `GoogleAppsScript.js`
2. Deploy as Web App (Anyone)
3. Set in `app.js`:
   - `CONFIG.gasEndpoint = 'YOUR_WEB_APP_URL'`
   - `CONFIG.sheetUrl = 'YOUR_SHEET_SHARE_LINK'`
