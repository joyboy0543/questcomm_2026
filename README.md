
# QR Treasure Hunt — Police Case (5 Levels)

A lightweight, installable web app with a thief–police investigation theme. It auto-saves progress locally and logs **participation only** (no leaderboard).

## Features
- 5 themed puzzles (riddle, Caesar cipher, logic code, anagram, sequence)
- Robust modal + reload behavior (one-shot `?reset=1`)
- LocalStorage schema with migration
- PWA: manifest + service worker
- Optional Google Apps Script endpoint for participation counts (events: `start`, `finished`)

## Files
- `index.html` — single-page app with puzzle engine
- `manifest.json` — PWA manifest
- `sw.js` — service worker for offline caching
- `icons/icon-192.png`, `icons/icon-512.png` — app icons

## Deploy
Serve the folder over HTTPS (service worker requires HTTPS) — GitHub Pages, Netlify, Vercel, or any static host.

## Participation Logging (optional)
Update `LOG_URL` in `index.html` to your Apps Script Web App URL. Only `start` and `finished` events are posted, with `runId`, `team`, `name`.

**Apps Script example** (`Code.gs`):
```js
function doPost(e) {
  const body = JSON.parse(e.postData.contents || '{}');
  const ss = SpreadsheetApp.openById('PUT_SPREADSHEET_ID');
  const sheet = ss.getSheetByName('Participation') || ss.insertSheet('Participation');
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['timestamp','event','runId','team','name','clientTZ']);
  }
  sheet.appendRow([new Date(), body.event || '', body.runId || '', body.team || '', body.name || '', body.clientTZ || '' ]);
  return ContentService.createTextOutput(JSON.stringify({ok:true})).setMimeType(ContentService.MimeType.JSON);
}
```
Publish the web app and paste the deployment URL into `LOG_URL`.

## Update your repository
```bash
# From your repo root
git checkout -b feature/pwa-police-case
# Copy these files in
# (or unzip the provided archive and move contents here)

git add index.html manifest.json sw.js icons/*
git commit -m "Add PWA + 5 police-themed levels; robust modal & participation logging"
git push -u origin feature/pwa-police-case
```

## Configuration
- To **auto-resume on reload**, `ASK_ON_RELOAD` is `false`. Set `true` to always ask.
- Participation-only logging: `logEvent()` ignores non-participation events.

## Credits
Design & implementation assistance by M365 Copilot.
