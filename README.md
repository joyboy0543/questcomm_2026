
# QuestComm 2026 (GitHub Pages)

A single-page, **media-free** step-by-step puzzle site.

## Features
- Landing form (name/team) → start game
- 3 puzzles shown **one at a time**; **Next** button unlocks on correct
- Progress saved in `localStorage`
- QR prefill via `?name=...&team=...`
- **Version gate** (`GAME_VERSION`) auto-clears old progress when you publish updates

## How to Deploy (GitHub Pages)
1. Repo → **Settings → Pages**
2. **Source**: `Deploy from a branch`
3. **Branch**: `main`, **Folder**: `/ (root)`
4. Wait ~1–10 minutes for global propagation.

## How to Force Fresh Loads
- Bump the constant `GAME_VERSION` in `index.html` (e.g., `2026-01-12-stepper-v4`).
- Optional: visit with a querystring:  
  `https://<user>.github.io/questcomm_2026/?v=2026-01-12-4`
- Verify via DevTools → **Network** → **Disable cache** → Reload.

## Editing Puzzles
Open `index.html` and edit the `PUZZLES` array. Each puzzle:

```js
{
  title: "Puzzle X",
  type: "mcq" | "text",
  prompt: "Question text",
  options: ["A","B","C","D"], // for mcq only
  answer: "B",
  accept: ["b","beta"], // optional, for text type
  explain: "Short rationale"
}
```

After changes, **bump `GAME_VERSION`** and commit.

## License
MIT (or your preferred)
