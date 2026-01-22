# Doorway Sequence Fix Bundle

This bundle contains the **Doorway Sequence** orchestrator, 3 mini‑games, styles, and the white door asset. Use it to fix the issue where clicking a door shows nothing (missing script includes).

## Files
- doors.css
- assets/door_white.svg
- modules/doors.js
- modules/door_minesweep4.js
- modules/door_composite.js
- modules/door_path7.js

## Steps
1) Copy these files into your repo (keeping the same paths):
```
assets/door_white.svg
modules/doors.js
modules/door_minesweep4.js
modules/door_composite.js
modules/door_path7.js
doors.css
```
2) In `game.html`, ensure these scripts are included **after** your core app scripts:
```html
<link rel="stylesheet" href="doors.css">
<script src="modules/doors.js?v=20260116"></script>
<script src="modules/door_minesweep4.js?v=20260116"></script>
<script src="modules/door_composite.js?v=20260116"></script>
<script src="modules/door_path7.js?v=20260116"></script>
```
3) Remove older door scripts if present:
```html
<!-- Remove if present -->
<!-- <script src="modules/door_minesweep.js"></script> -->
<!-- <script src="modules/door_lockpick.js"></script> -->
<!-- <script src="modules/door_snake.js"></script> -->
```
4) Hard‑refresh the page (disable cache in DevTools or add `?v=20260116` to the URL).

That’s it — clicking a door should now render the mini‑game inline. On success, the digit can be **Recorded**, and when all three are recorded the banner shows **Door Number Identified: 3 6 7**.
