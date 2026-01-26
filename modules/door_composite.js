// modules/door_composite.js
// Jewel Latin 6x6 (uses assets/jewels/*.svg), with a few givens and an iconic look.
// Exposes window.initDoorJewelLatin(host, onSolved) for the Doors loader.

(function () {
  function mountComposite(host, onSolved) {
    const JEWELS = ["emerald", "hex", "ruby", "amethyst", "star", "diamond"]; // 6 types
    const SIZE = 6;

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

    // --- Build a simple Latin base solution (shifted rows) ---
    // solution[r][c] = JEWELS[(r + c) % 6]
    const solution = Array.from({ length: SIZE }, (_, r) =>
      Array.from({ length: SIZE }, (_, c) => JEWELS[(r + c) % SIZE])
    );

    // Choose some givens (coordinates) — tweak if you want more/less
    // Format: [r,c]
    // const GIVENS = new Set(
    //   ["0,0", "0,3", "1,1", "1,4", "2,2", "2,5", "3,0", "3,3", "4,2", "5,4", "4,5"]
    // );
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

        // Iconic look: we'll wrap <img> into a small "chip" to make it pop
        el.onclick = () => {
          if (el.dataset.given === "1") return;
          cycle(el);
        };
        gridEl.appendChild(el);
        cells[r][c] = el;
      }
    }

    // Apply grid columns for 6x6
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
      // Given cells get a subtle locked background
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
        ok &= uniq(cells[i]);
        ok &= uniq(cells.map((r) => r[i]));
      }

      if (ok && cells.flat().every((c) => c.dataset.value)) {
        status.innerHTML =
          'The encryption on the door has <strong class="hl">revealed</strong> that there are <strong class="hl">Six</strong> types of jewels.';
        onSolved && onSolved();
      } else {
        status.textContent = "";
      }
    }

    function uniq(list) {
      const seen = {};
      let valid = true;
      for (const el of list) {
        const v = el.dataset.value;
        if (!v) continue;
        if (seen[v]) {
          el.style.boxShadow = "0 0 0 2px rgba(255,92,92,.45)";
          seen[v].style.boxShadow = "0 0 0 2px rgba(255,92,92,.45)";
          valid = false;
        } else {
          seen[v] = el;
        }
      }
      return valid;
    }

    btnClear.onclick = () => {
      cells.flat().forEach((c, i) => {
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