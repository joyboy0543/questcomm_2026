// modules/door_composite.js
// Jewel Latin 6x6 (uses assets/jewels/*.svg), with a few givens and an iconic look.
// Exposes window.initDoorJewelLatin(host, onSolved) for the Doors loader.

(function () {
  function mountComposite(host, onSolved) {
    const JEWELS = ["emerald", "hex", "ruby", "amethyst", "star", "diamond"]; // 6 types
    const SIZE = 6;

    // 🔧 Limit conflict marking to selected axes (exactly 3 rows OR 3 columns recommended)
    // Default below: show red conflicts only on rows 0,2,4 (1st, 3rd, 5th). Change as desired.
    const JL_HINTS = {
      rows: [0, 2, 4],   // e.g., [0,2,4] three rows to show red; set to null to disable row hints
      cols: null         // or set to three column indices like [1,3,5]; keep the other null
    };
    function canPaint(axis, idx) {
      if (axis === 'row') return Array.isArray(JL_HINTS.rows) && JL_HINTS.rows.includes(idx);
      if (axis === 'col') return Array.isArray(JL_HINTS.cols) && JL_HINTS.cols.includes(idx);
      return false;
    }

    const wrap = document.createElement("div");
    wrap.className = "jlatin-wrap";
    wrap.innerHTML = `
      <h4 class="jlatin-title">Jewel Latin</h4>
      <ol class="status" style="text-align:left;max-width:520px;margin:0 auto">
        <li>Each row and each column must contain every jewel exactly once.</li>
        <li>Tap a cell to cycle through the jewels.</li>
        <li>Cells marked in grey are given and cannot be changed.</li>
      </ol>
      <div class="jlatin-grid"></div>
      <p id="jlStatus" class="status"></p>
      <div class="jlatin-tools">
        <button id="jlClear">Clear</button>
      </div>
    `;

    const gridEl = wrap.querySelector(".jlatin-grid");
    const status = wrap.querySelector("#jlStatus");
    const btnClear = wrap.querySelector("#jlClear");
    host.innerHTML = "";
    host.appendChild(wrap);

    // --- Latin base solution (cyclic shifts) ---
    const solution = Array.from({ length: SIZE }, (_, r) =>
      Array.from({ length: SIZE }, (_, c) => JEWELS[(r + c) % SIZE])
    );

    // GIVENS (coords as "r,c")
    const GIVENS = new Set([
      // Row 0
      "0,0", "0,2", "0,4",
      // Row 1
      "1,1", "1,3", "1,5",
      // Row 2
      "2,0", "2,2", "2,4",
      // Row 3
      "3,1", "3,3", "3,5",
      // Row 4
      "4,0", "4,4",
      // Row 5
      "5,2"
    ]);

    // --- Create cells ---
    const cells = [];
    for (let r = 0; r < SIZE; r++) {
      cells[r] = [];
      for (let c = 0; c < SIZE; c++) {
        const el = document.createElement("div");
        el.className = "jcell";
        const key = `${r},${c}`;
        const isGiven = GIVENS.has(key);
        el.dataset.given = isGiven ? "1" : "0";
        el.dataset.value = isGiven ? solution[r][c] : "";

        el.onclick = () => { if (el.dataset.given === "1") return; cycle(el); };
        gridEl.appendChild(el);
        cells[r][c] = el;
      }
    }

    // Grid columns for 6x6
    gridEl.style.gridTemplateColumns = "repeat(6, var(--gem))";

    // Initial render
    cells.flat().forEach(render);
    validate();

    function cycle(cell) {
      const idx = JEWELS.indexOf(cell.dataset.value);
      const next = JEWELS[(idx + 1 + JEWELS.length) % JEWELS.length];
      cell.dataset.value = next;
      render(cell);
      validate();
    }

    function render(cell) {
      cell.innerHTML = "";
      cell.classList.toggle("given", cell.dataset.given === "1");

      const v = cell.dataset.value;
      if (!v) return;

      const chip = document.createElement("span");
      chip.className = "jewel-chip";
      const img = document.createElement("img");
      img.src = `assets/jewels/${v}.svg`;
      img.alt = v;
      chip.appendChild(img);
      cell.appendChild(chip);
    }

    function validate() {
      let ok = true;

      // clear any error styles
      cells.flat().forEach((c) => (c.style.boxShadow = ""));

      // rows + cols unique (ignore blanks)
      for (let i = 0; i < SIZE; i++) {
        ok &= uniq(cells[i], 'row', i);
        ok &= uniq(cells.map((r) => r[i]), 'col', i);
      }

      if (ok && cells.flat().every((c) => c.dataset.value)) {
        status.innerHTML =
          'The encryption on the door has revealed that there were <strong class="hl">six</strong> types of jewels.';
        onSolved && onSolved();
      } else {
        status.textContent = "";
      }
    }

    function uniq(list, axis, index) {
      const seen = {};
      let valid = true;
      const paint = canPaint(axis, index);

      for (const el of list) {
        const v = el.dataset.value;
        if (!v) continue;
        if (seen[v]) {
          // Only paint conflict when allowed; still mark invalid either way
          if (paint) {
            el.style.boxShadow = "0 0 0 2px rgba(255,92,92,.45)";
            seen[v].style.boxShadow = "0 0 0 2px rgba(255,92,92,.45)";
          }
          valid = false;
        } else {
          seen[v] = el;
        }
      }
      return valid;
    }

    btnClear.onclick = () => {
      cells.flat().forEach((c) => {
        if (c.dataset.given === "0") {
          c.dataset.value = "";
          c.innerHTML = "";
          c.style.boxShadow = "";
        }
      });
      status.textContent = "";
    };
  }

  // Expose global initializer for Doors
  window.initDoorJewelLatin = (host, cb) => mountComposite(host, cb);
})();