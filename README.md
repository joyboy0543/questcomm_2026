# Sapphire Heist — Linear Flow (Update)

This update implements your requested changes:

- **Landing** (Google **Form** → Sheet; no Apps Script)
- **Lindholmen River View Photo** uses the **Cipher Code** image and keeps the **same answer** (configure `RIVER_ANSWER`)
- **Minesweeper** (replaces Safe Sweep)
- **Queens Protocol** (from Doorway sequence)
- **Quick Pairs** (as the third game)
- **Findings**
- Removed Radio / Case panels

## 1) Wire the Landing form to your Google Sheet (via Google Form)
1. Create a Google **Form** with 3 fields: Name, Codename, Department
2. Link it to a Google **Sheet** (default)
3. Get your form's **action URL** (ends with `/formResponse`) and the 3 **entry IDs** (e.g., `entry.123456789`)
4. Open **index.html** and replace:
   - `GOOGLE_FORM_ACTION`
   - `entry.NAME_ENTRY_ID`
   - `entry.CODENAME_ENTRY_ID`
   - `entry.DEPT_ENTRY_ID`

> The form posts into a hidden iframe so the page doesn't navigate. After the iframe loads, the River section unlocks.

## 2) Lindholmen River View — using the Cipher photo
- Put your Cipher photo file at: **`assets/cipher_photo.jpg`**
- In **index.html**, set the constant `RIVER_ANSWER` to the **same answer** as in your previous version. It is matched case‑insensitively.

```js
const RIVER_ANSWER = 'REPLACE_WITH_PREVIOUS_ANSWER';
```

## 3) Minesweeper (Doorway)
- 6×6 grid with 6 mines
- **Flag mode** toggle and right‑click flagging
- Win condition: all safe cells revealed → unlocks Queens Protocol

## 4) Queens Protocol (Doorway)
- 5×5 board
- Place exactly **5 queens** so none attack each other (rows, columns, diagonals)
- Any valid non‑attacking layout completes → unlocks Quick Pairs

## 5) Quick Pairs (simple)
- 3 pairs to match → unlocks Findings

## 6) Findings
- Shows Name, Codename, Department, and completion ticks
- **Restart** keeps registration and resets progression

## 7) Assets
- Add your **Cipher photo** at `assets/cipher_photo.jpg`

## 8) Deployment
- Replace your repo's `index.html` with this one (or test in a branch/folder)
- Add the `assets/` folder to the repo and place the photo
- Commit & push

---
Questions or want me to wire the exact previous answer and embed the real photo for you? Share the image (or path) and the answer word, and I’ll ship a PR-ready build.
