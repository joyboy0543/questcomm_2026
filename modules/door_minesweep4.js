// modules/door_minesweep4.js
// Safe Sweep (4x4, 3 bombs)

export function mountMineSweep(host, onSolved) {
  const SIZE = 4;
  const BOMBS = 3;

  const wrap = document.createElement("div");
  wrap.className = "jlatin-wrap"; // reuse vertical layout
  wrap.innerHTML = `
    <h4 class="jlatin-title">Safe Sweep</h4>
    <ol class="status" style="text-align:left;max-width:520px;margin:0 auto">
      <li>Don’t tap on cells that hide bombs.</li>
      <li>Tapping a safe cell reveals a number showing how many bombs surround it.</li>
      <li>Once the field is clear, the code will be revealed.</li>
    </ol>
    <div class="msw-board"></div>
    <div class="digit-row" style="display:none"></div>
    <p class="status" id="mswStatus"></p>
    <div class="jlatin-tools">
      <button id="mswClear">Clear</button>
    </div>
  `;
  const board = wrap.querySelector(".msw-board");
  const status = wrap.querySelector("#mswStatus");
  const btnClear = wrap.querySelector("#mswClear");
  host.appendChild(wrap);

  // --- Model ---
  const cells = []; // [{bomb,revealed,flag,count,el}]
  const dirs = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1]
  ];

  function idx(r, c) { return r * SIZE + c; }

  function reset() {
    board.innerHTML = "";
    cells.length = 0;

    // place bombs
    const spots = Array.from({ length: SIZE * SIZE }, (_, i) => i);
    for (let i = spots.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [spots[i], spots[j]] = [spots[j], spots[i]];
    }
    const bombsAt = new Set(spots.slice(0, BOMBS));

    // build grid
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        const el = document.createElement("div");
        el.className = "msw-cell";
        el.setAttribute("role", "button");
        el.setAttribute("aria-label", `cell ${r + 1},${c + 1}`);
        el.tabIndex = 0;

        const cell = { r, c, el, bomb: bombsAt.has(idx(r, c)), revealed: false, flag: false, count: 0 };
        cells.push(cell);
        board.appendChild(el);
      }
    }

    // counts
    for (const cell of cells) {
      cell.count = neighbors(cell).filter(n => n.bomb).length;
    }

    // interactions
    for (const cell of cells) {
      // Left click / tap: reveal
      cell.el.addEventListener("click", (e) => {
        if (cell.flag || cell.revealed) return;
        reveal(cell);
      });

      // Right-click: toggle flag
      cell.el.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        toggleFlag(cell);
      });

      // Double-click: toggle flag
      cell.el.addEventListener("dblclick", () => {
        if (cell.revealed) return;
        toggleFlag(cell);
      });

      // Long-press (mobile) to flag
      let tId = null;
      cell.el.addEventListener("touchstart", () => {
        if (cell.revealed) return;
        tId = setTimeout(() => { toggleFlag(cell); tId = null; }, 420);
      }, { passive: true });
      cell.el.addEventListener("touchend", () => { if (tId) { clearTimeout(tId); /* short tap -> handled by click */ } });
    }

    status.textContent = "";
    renderAll();
  }

  function neighbors(cell) {
    const list = [];
    for (const [dr, dc] of dirs) {
      const r = cell.r + dr, c = cell.c + dc;
      if (r >= 0 && r < SIZE && c >= 0 && c < SIZE) list.push(cells[idx(r, c)]);
    }
    return list;
  }

  function toggleFlag(cell) {
    if (cell.revealed) return;
    cell.flag = !cell.flag;
    cell.el.classList.toggle("flag", cell.flag);
  }

  function reveal(cell) {
    if (cell.revealed || cell.flag) return;
    cell.revealed = true;

    if (cell.bomb) {
      // Gentle “don’t do that” feedback; keep game alive.
      cell.el.classList.add("boom");
      cell.el.style.background = "#3b0f0f";
      setTimeout(() => {
        cell.el.classList.remove("boom");
        cell.el.style.background = "";
      }, 600);
      return;
    }

    // flood reveal
    if (cell.count === 0) {
      for (const n of neighbors(cell)) {
        if (!n.revealed && !n.flag && !n.bomb) reveal(n);
      }
    }
    renderCell(cell);
    checkWin();
  }

  function renderCell(cell) {
    const el = cell.el;
    el.textContent = "";
    el.classList.add("revealed");

    if (!cell.bomb && cell.count > 0) {
      const span = document.createElement("span");
      span.textContent = cell.count;
      span.className = "n" + cell.count;
      el.appendChild(span);
    }
  }

  function renderAll() {
    for (const cell of cells) {
      cell.el.className = "msw-cell";
      cell.el.textContent = "";
      if (cell.flag) cell.el.classList.add("flag");
      if (cell.revealed) renderCell(cell);
    }
  }

  function checkWin() {
    const safe = cells.filter(c => !c.bomb).length;
    const revealed = cells.filter(c => c.revealed && !c.bomb).length;
    if (revealed === safe) {
      status.textContent = "Three bombs were diffused in front of the doorway.";
      onSolved?.("Safe Sweep");
    }
  }

  btnClear.addEventListener("click", reset);
  reset();
}