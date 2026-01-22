# QuestComm 2026 — Doorway Sequence (Complete Bundle v4)

This bundle contains everything needed to render the door puzzles when a door is clicked.

## Files included
- `game.html` (with correct <script> includes + Record wording)
- `doors.css`
- `assets/door_white.svg`
- `modules/doors.js`
- `modules/door_minesweep4.js`
- `modules/door_composite.js`
- `modules/door_path7.js`

## How to apply
1) Copy all files to your repo, keeping the folder structure (assets/, modules/).
2) Ensure `game.html` overwrites your current one, or manually add the 3 mini-game scripts after `modules/doors.js`:
   ```html
   <script src="modules/door_minesweep4.js?v=20260116"></script>
   <script src="modules/door_composite.js?v=20260116"></script>
   <script src="modules/door_path7.js?v=20260116"></script>
   ```
3) Hard-refresh the page or open with a cache-busting query (e.g., `game.html?refresh=20260116`).

## Expected
Clicking a door renders its puzzle inline. On success, you can Record the digit. After recording all three, a banner shows `Door Number Identified: 3 6 7`.
