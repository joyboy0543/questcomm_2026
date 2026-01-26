// modules/door_path7.js
// Queens Protocol 7x7 with 7 clearly-different colored regions + Check/Clear.
// Rules: (1) no shared row/column, (2) no touching (incl. diagonals), (3) exactly one queen per region.
// Exposes: window.initDoorQueens5(host, onSolved)

(function () {
  window.initDoorQueens5 = function (host, onSolved) {
    const SIZE = 7; // <-- 7x7, require exactly 7 queens

    // 7 distinct regions (0..6). Shapes deliberately varied; each region must contain exactly one queen.
    const REGIONS = [
      [0, 0, 0, 1, 1, 1, 2],
      [0, 3, 3, 1, 4, 1, 2],
      [0, 3, 4, 4, 4, 1, 2],
      [5, 3, 4, 6, 4, 1, 2],
      [5, 3, 6, 6, 4, 2, 2],
      [5, 5, 6, 6, 6, 2, 2],
      [5, 5, 5, 6, 6, 6, 2]
    ];

    // 7 fully different colors (not shades of one color)
    const COLORS = {
      0: "#ef6b6b", // red
      1: "#4cc9f0", // cyan
      2: "#43aa8b", // teal/green
      3: "#f8961e", // orange
      4: "#9b5de5", // purple
      5: "#ffd166", // yellow
      6: "#2dd4bf"  // aqua
    };

    const wrap = document.createElement("div");
    wrap.className = "q-wrap";
    wrap.innerHTML = `
      <h4 class="jlatin-title">Queens Protocol</h4>
      <ol class="status" style="text-align:left;max-width:520px;margin:0 auto">
        <li>Place queens so no two share a row or a column.</li>
        <li>Queens cannot touch — not even diagonally.</li>
        <li>Each colored section must contain exactly one queen.</li>
      </ol>
      <div class="q-grid small"></div>
      <div class="q-tools" style="display:flex;gap:8px;justify-content:center">
        <button id="qCheck">Check</button>
        <button id="qClear">Clear</button>
      </div>
      <p id="qStatus" class="q-status" style="min-height:1.2rem"></p>
    `;
    const grid = wrap.querySelector(".q-grid");
    const status = wrap.querySelector("#qStatus");
    const btnCheck = wrap.querySelector("#qCheck");
    const btnClear = wrap.querySelector("#qClear");
    host.innerHTML = "";
    host.appendChild(wrap);

    // Compact board for phones (without changing global CSS)
    grid.style.gridTemplateColumns = `repeat(${SIZE}, 52px)`;

    const cells = [];
    for (let r = 0; r < SIZE; r++) {
      cells[r] = [];
      for (let c = 0; c < SIZE; c++) {
        const el = document.createElement("div");
        el.className = "q-cell";
        el.dataset.q = "0";
        el.style.width = "52px";
        el.style.height = "52px";
        el.style.background = COLORS[REGIONS[r][c]];
        el.style.filter = "saturate(1) brightness(0.9)";
        el.addEventListener("click", () => toggleQ(el));
        grid.appendChild(el);
        cells[r][c] = el;
      }
    }

    function toggleQ(el) {
      el.dataset.q = (el.dataset.q === "1") ? "0" : "1";
      render(el);
    }
    function render(el) {
      el.innerHTML = "";
      if (el.dataset.q === "1") {
        const img = document.createElement("img");
        img.src = "assets/queen.svg";
        img.alt = "Q";
        img.style.width = "60%";
        img.style.height = "60%";
        el.appendChild(img);
      }
    }

    function validateAndMark() {
      // clear marks
      cells.flat().forEach(e => e.classList.remove("attacked"));

      const queens = [];
      for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
          if (cells[r][c].dataset.q === "1") queens.push([r, c]);
        }
      }

      let ok = true;

      // row/col uniqueness
      for (let r = 0; r < SIZE; r++) if (queens.filter(q => q[0] === r).length > 1) ok = false;
      for (let c = 0; c < SIZE; c++) if (queens.filter(q => q[1] === c).length > 1) ok = false;

      // one per region
      const seen = new Set();
      for (const [r, c] of queens) {
        const key = "R" + REGIONS[r][c];
        if (seen.has(key)) ok = false; else seen.add(key);
      }

      // cannot touch (8-neighborhood)
      const dirs = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
      for (const [r, c] of queens) {
        for (const [dr, dc] of dirs) {
          const rr = r + dr, cc = c + dc;
          if (rr >= 0 && rr < SIZE && cc >= 0 && cc < SIZE && cells[rr][cc].dataset.q === "1") {
            cells[r][c].classList.add("attacked");
            cells[rr][cc].classList.add("attacked");
            ok = false;
          }
        }
      }

      // ✅ exactly 7 queens required
      if (queens.length !== 7) ok = false;

      return ok;
    }

    btnCheck.addEventListener("click", () => {
      const solved = validateAndMark();
      if (solved) {
        status.innerHTML = 'The <span class="hl">Seven</span> Queens have been located. Threats neutralized.';
        onSolved && onSolved();
      } else {
        status.textContent = "Conflicts detected — adjust the placements.";
        btnCheck.classList.remove("shake");
        btnCheck.classList.add("shake");
        setTimeout(() => btnCheck.classList.remove("shake"), 300);
      }
    });

    btnClear.addEventListener("click", () => {
      cells.flat().forEach(el => { el.dataset.q = "0"; el.innerHTML = ""; el.classList.remove("attacked"); });
      status.textContent = "";
    });
  };
})();