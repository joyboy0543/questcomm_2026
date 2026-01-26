// modules/door_path7.js
// Queens Protocol 6x6 with clearly-different colored sections, smaller cells, and a Check button.
// Exposes window.initDoorQueens5(host, onSolved) for the Doors loader.

(function () {
  window.initDoorQueens5 = function (host, onSolved) {
    const SIZE = 6; // change to 5 if you want 5x5 later

    // 6 distinct regions (0..5) — clearly different colors (not just shades)
    // You can tweak shapes anytime; keep exactly one queen per region as a rule.
    const REGIONS = [
      [0, 0, 0, 1, 1, 1],
      [0, 2, 2, 1, 3, 1],
      [0, 2, 4, 4, 3, 3],
      [5, 2, 4, 4, 3, 3],
      [5, 2, 2, 4, 4, 3],
      [5, 5, 2, 4, 4, 3]
    ];
    const COLORS = {
      0: "#ef6b6b", // red
      1: "#4cc9f0", // cyan
      2: "#43aa8b", // teal/green
      3: "#f8961e", // orange
      4: "#9b5de5", // purple
      5: "#ffd166"  // yellow
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

    // Make the board smaller visually (without editing doors.css)
    // We force a fixed size for this mini-board.
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
        el.style.filter = "saturate(1) brightness(0.9)"; // punchier blocks
        el.onclick = () => toggleQ(el);
        grid.appendChild(el);
        cells[r][c] = el;
      }
    }

    function toggleQ(el) {
      el.dataset.q = el.dataset.q === "1" ? "0" : "1";
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

    function validate() {
      // Return true if solved; mark any conflicts for UX
      cells.flat().forEach((e) => e.classList.remove("attacked"));

      const queens = [];
      for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
          if (cells[r][c].dataset.q === "1") queens.push([r, c]);
        }
      }

      let ok = true;

      // row/col uniqueness
      for (let r = 0; r < SIZE; r++) {
        if (queens.filter((q) => q[0] === r).length > 1) ok = false;
      }
      for (let c = 0; c < SIZE; c++) {
        if (queens.filter((q) => q[1] === c).length > 1) ok = false;
      }

      // region uniqueness
      const seen = new Set();
      for (const [r, c] of queens) {
        const key = "R" + REGIONS[r][c];
        if (seen.has(key)) ok = false;
        else seen.add(key);
      }

      // adjacency (no touch)
      const dirs = [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1],
      ];
      for (const [r, c] of queens) {
        for (const [dr, dc] of dirs) {
          const rr = r + dr,
            cc = c + dc;
          if (
            rr >= 0 &&
            rr < SIZE &&
            cc >= 0 &&
            cc < SIZE &&
            cells[rr][cc].dataset.q === "1"
          ) {
            cells[r][c].classList.add("attacked");
            cells[rr][cc].classList.add("attacked");
            ok = false;
          }
        }
      }

      // exactly one per region means: number of queens == number of regions (6 here)
      if (ok && queens.length === 6) return true;
      return false;
    }

    btnCheck.onclick = () => {
      const solved = validate();
      status.textContent = solved
        ? "Queens secured. Threats neutralized."
        : "Conflicts detected — adjust the placements.";
      // Shake the Check button if incorrect
      btnCheck.classList.remove("shake");
      if (!solved) {
        btnCheck.classList.add("shake");
        setTimeout(() => btnCheck.classList.remove("shake"), 300);
      } else {
        // call Doors to record as solved
        onSolved && onSolved();
      }
    };

    btnClear.onclick = () => {
      cells.flat().forEach((el) => {
        el.dataset.q = "0";
        el.innerHTML = "";
        el.classList.remove("attacked");
      });
      status.textContent = "";
    };
  };
})();