// modules/door_minesweep4.js
// Safe Sweep (4x4, 3 bombs) with flagging, colorful counts, and auto-reset on bomb press.
// Exposes: window.initDoorMinesweep4(host, onSolved)

(function () {
  window.initDoorMinesweep4 = function (host, onSolved) {
    const SIZE = 4, BOMBS = 3;

    const wrap = document.createElement('div');
    wrap.className = 'jlatin-wrap';
    wrap.innerHTML = `
      <h4 class="jlatin-title">Safe Sweep</h4>
      <ol class="status" style="text-align:left;max-width:520px;margin:0 auto">
        <li>Don’t tap on the cells that hide bombs.</li>
        <li>Tapping a safe cell shows how many bombs surround it.</li>
        <li>Once the field is clear, the code will be revealed.</li>
      </ol>
      <div class="msw-board"></div>
      <p class="status" id="mswStatus"></p>
      <div class="jlatin-tools">
        <button id="mswClear">Clear</button>
      </div>
    `;
    const board = wrap.querySelector('.msw-board');
    const status = wrap.querySelector('#mswStatus');
    const btnClear = wrap.querySelector('#mswClear');
    host.innerHTML = ''; host.appendChild(wrap);

    const dirs = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
    const cells = []; // {r,c,bomb,revealed,flag,count,el}
    const idx = (r, c) => r * SIZE + c;

    function neighbors(cell) {
      const out = [];
      for (const [dr, dc] of dirs) {
        const r = cell.r + dr, c = cell.c + dc;
        if (r >= 0 && r < SIZE && c >= 0 && c < SIZE) out.push(cells[idx(r, c)]);
      }
      return out;
    }

    function place() {
      board.innerHTML = '';
      cells.length = 0;

      // Random bombs
      const pool = [...Array(SIZE * SIZE).keys()];
      for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[pool[i], pool[j]] = [pool[j], pool[i]]; }
      const bombs = new Set(pool.slice(0, BOMBS));

      // Build grid
      for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
          const el = document.createElement('div');
          el.className = 'msw-cell';
          el.setAttribute('role', 'button');
          el.setAttribute('aria-label', `cell ${r + 1},${c + 1}`);
          const cell = { r, c, el, bomb: bombs.has(idx(r, c)), revealed: false, flag: false, count: 0 };
          cells.push(cell); board.appendChild(el);
        }
      }
      // Counts
      for (const cell of cells) { cell.count = neighbors(cell).filter(n => n.bomb).length; }

      // Interactions
      for (const cell of cells) {
        // Left-click/tap: reveal
        cell.el.addEventListener('click', () => { if (!cell.flag) reveal(cell); });

        // Right-click: toggle flag
        cell.el.addEventListener('contextmenu', (e) => { e.preventDefault(); toggleFlag(cell); });

        // Double-click: toggle flag
        cell.el.addEventListener('dblclick', () => { if (!cell.revealed) toggleFlag(cell); });

        // Long-press (mobile): flag
        let tId = null;
        cell.el.addEventListener('touchstart', () => { if (cell.revealed) return; tId = setTimeout(() => { toggleFlag(cell); tId = null; }, 420); }, { passive: true });
        cell.el.addEventListener('touchend', () => { if (tId) { clearTimeout(tId); } }, { passive: true });
      }

      status.textContent = '';
      renderAll();
    }

    function toggleFlag(cell) {
      if (cell.revealed) return;
      cell.flag = !cell.flag;
      cell.el.classList.toggle('flag', cell.flag);
    }

    function reveal(cell) {
      if (cell.revealed || cell.flag) return;
      cell.revealed = true;

      if (cell.bomb) {
        // 🔴 Bomb pressed: brief feedback, then auto-reset the whole board.
        cell.el.classList.add('boom');
        cell.el.style.background = '#3b0f0f';
        setTimeout(() => {
          // Clean small effects before resetting
          cell.el.classList.remove('boom');
          cell.el.style.background = '';
          place();
        }, 350);
        return;
      }

      // Flood-reveal if zero
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
      el.textContent = '';
      el.classList.add('revealed');

      if (!cell.bomb && cell.count > 0) {
        const span = document.createElement('span');
        span.textContent = cell.count;
        span.className = 'n' + cell.count;
        el.appendChild(span);
      }
    }

    function renderAll() {
      for (const cell of cells) {
        cell.el.className = 'msw-cell';
        cell.el.textContent = '';
        if (cell.flag) cell.el.classList.add('flag');
        if (cell.revealed) renderCell(cell);
      }
    }

    function checkWin() {
      const safeTotal = cells.filter(c => !c.bomb).length;
      const revealedSafe = cells.filter(c => c.revealed && !c.bomb).length;
      if (revealedSafe === safeTotal) {
        status.innerHTML = '<span><span class="hl">Three</span> bombs were diffused in front of the doorway.</span>';
        onSolved && onSolved();
      }
    }

    btnClear.addEventListener('click', place);
    place();
  };
})();