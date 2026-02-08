# QuestComm 2026 — **Sapphire Heist** (Simplified Flow)

This package replaces the old multi‑panel UI (radio/case panes) with a **simple, section‑by‑section flow**:

1. **Landing** — Name, Codename, Department (posts to Google **Form** → Google Sheet; no Apps Script required)
2. **Lindholmen River View** — keep your existing riddle/photo puzzle; when solved, call `completeRiver()`
3. **Safe Sweep** — 3×3 pattern keypad mini‑game
4. **Diffuser** — Simple “Simon” memory (pattern seeded by the Name)
5. **Quick Pairs** — 3 pairs matching game
6. **Findings** — Summary screen

All progress is stored in `localStorage` (on the current browser/device).

---

## 1) Hook the Landing page to a Google Sheet **without Apps Script**
Use a **Google Form** that writes into a linked Sheet.

### Steps
1. Create a new **Google Form** with 3 fields: **Name**, **Codename**, **Department**.
2. In the Form settings, ensure it **collects responses** to a Sheet (default behavior).
3. Open the live form, right‑click → **View page source** (or Inspect → Network while submitting once).
4. Find the **form action** URL ending with `/formResponse` and the field names like `entry.1234567890`.
5. Edit **`index.html`**:
   - Replace `GOOGLE_FORM_ACTION` with that URL.
   - Replace `entry.NAME_ENTRY_ID`, `entry.CODENAME_ENTRY_ID`, `entry.DEPT_ENTRY_ID` with your real entry IDs.
6. That’s it. Submitting the landing form appends a new row to the linked Google Sheet **every time**.

> The page submits the form into a **hidden iframe** so users stay on your page. The UI proceeds immediately after the iframe load event.

---

## 2) Keep your **Lindholmen River View** section as‑is
- In `index.html`, locate the **River View** section and replace the placeholder with your current puzzle markup and script.
- When your puzzle detects success, call:

```js
completeRiver(); // This opens the Safe Sweep gate
```

If your River View is a separate page (e.g., `photo.html`), you can embed it in an iframe and, on success, run:

```js
localStorage.setItem('qc26.gates', JSON.stringify({ ...(JSON.parse(localStorage.getItem('qc26.gates')||'{}')), river:true }));
window.parent && window.parent.completeRiver && window.parent.completeRiver();
```

---

## 3) Gates / Progression
- Registration → opens **River View**
- River solved → opens **Safe Sweep**
- Safe Sweep solved → opens **Diffuser**
- Diffuser solved → opens **Quick Pairs**
- Quick Pairs solved → opens **Findings**

Gates are kept in `localStorage.qc26.gates`.

---

## 4) Remove legacy panels
This build **omits** the Radio panel and Case panel. The UI is a linear HMI with clear buttons.

---

## 5) Development notes
- All CSS and JS are inline in `index.html` for easy drop‑in.
- Colors and feel match your previous palette.
- You can still pass QR params like `?name=&codename=&department=` to prefill the landing form.

---

## 6) Deploy
- Replace the old `index.html` in your repo root with this version (or test in a `v2/` folder).
- Commit and push.
- Host with GitHub Pages (if you were already doing that) or your existing hosting.

---

## 7) Optional enhancements
- Add audit logging 
- Persist timestamps of completions
- Replace the placeholder pattern/order with a daily seed or per‑team logic

If you share your current `photo.html` and any assets, I can wire them directly into Section B and ship another ZIP.
