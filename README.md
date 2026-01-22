# QCPD Doors Mini-Game (367)

This drop-in station adds a **hallway of 3 doors** with inline mini-games that reveal the access code **367**.

- Door α — **Safe Sweep** (Minesweeper-lite). Win → enter **3** to lock.
- Door β — **Six at Shear** (Lockpick pins). Win → enter **6** to lock.
- Door γ — **Sevens Only** (Snake variant). After 3 decoys **b** pass uneaten → enter **7** to lock.

When all three digits are locked, a banner shows **Access Code: 3 6 7** and you can unlock the next tab.

## Files
- `doors.css` — additive styles (merge into your main stylesheet or link separately)
- `modules/doors.js` — orchestrator & persistence
- `modules/door_minesweep.js` — Door α
- `modules/door_lockpick.js` — Door β
- `modules/door_snake.js` — Door γ
- `assets/door.svg` — door icon

## How to integrate
1. **Copy files** into your repo:
   ```
   /assets/door.svg
   /modules/doors.js
   /modules/door_minesweep.js
   /modules/door_lockpick.js
   /modules/door_snake.js
   /doors.css (optional; or paste into your existing style.css)
   ```
2. **Include scripts** near the bottom of your `game.html` (after the core app scripts):
   ```html
   <script src="modules/doors.js"></script>
   <script src="modules/door_minesweep.js"></script>
   <script src="modules/door_lockpick.js"></script>
   <script src="modules/door_snake.js"></script>
   ```
3. **Add the Doors section** to your Evidence panel where you want the games:
   ```html
   <section id="doors" class="section">
     <h3>Doorway Sequence</h3>
     <div id="doorsHost"></div>
   </section>
   ```
4. **Boot the Doors hall** after DOM ready (e.g., inside your `app.js` DOMContentLoaded):
   ```js
   window.initDoorsHall?.(document.getElementById('doorsHost'));
   ```
5. **(Optional) Styles**: either link `doors.css` or copy its content into your stylesheet.
   ```html
   <link rel="stylesheet" href="doors.css"/>
   ```

## Notes
- Progress persists in `localStorage.qcpd.doors`.
- If you have a Radio feed helper `radioHint(msg)`, the station will post progress messages.
- The section uses **inline expansion** under each door (no modal windows).
- Keyboard support for Snake: arrow keys / WASD.

## License
MIT for code; SVG icon included.
