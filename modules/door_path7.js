{/* <script> */ }
// Queens Protocol 7x7 with 7 colored sections; exposes window.initDoorQueens5 for Doors loader.
(function () {
  window.initDoorQueens5 = function (host, onSolved) {
    const SIZE = 7;

    const REGIONS = [
      [0, 0, 1, 1, 1, 2, 2],
      [0, 3, 3, 1, 4, 2, 2],
      [0, 3, 4, 4, 4, 2, 5],
      [6, 3, 3, 4, 5, 5, 5],
      [6, 6, 3, 5, 5, 5, 5],
      [6, 6, 6, 6, 5, 5, 5],
      [6, 6, 6, 6, 6, 5, 5]
    ];
    const COLORS = { 0: "#0f2230", 1: "#153547", 2: "#1e4b60", 3: "#244e6b", 4: "#2b5a79", 5: "#316586", 6: "#3a7193" };

    const wrap = document.createElement('div');
    wrap.className = 'q-wrap';
    wrap.innerHTML = `
      <h4 class="jlatin-title">Queens Protocol</h4>
      <p class="status">Place queens so that: (1) no two share a row or column, (2) no two touch—even diagonally, and (3) each colored section contains exactly <strong>one</strong> queen.</p>
      <div class="q-grid"></div>
      <div class="q-tools"><button id="qClear">Clear</button></div>
      <p id="qStatus" class="q-status"></p>
    `;
    const grid = wrap.querySelector('.q-grid');
    const status = wrap.querySelector('#qStatus');
    const btnClear = wrap.querySelector('#qClear');
    host.innerHTML = ''; host.appendChild(wrap);

    const cells = [];
    for (let r = 0; r < SIZE; r++) {
      cells[r] = [];
      for (let c = 0; c < SIZE; c++) {
        const el = document.createElement('div');
        el.className = 'q-cell'; el.dataset.q = '0';
        el.style.background = COLORS[REGIONS[r][c]];
        el.onclick = () => toggleQ(el);
        grid.appendChild(el);
        cells[r][c] = el;
      }
    }

    function toggleQ(el) { el.dataset.q = (el.dataset.q === '1') ? '0' : '1'; render(el); validate(); }
    function render(el) {
      el.innerHTML = '';
      if (el.dataset.q === '1') { const img = document.createElement('img'); img.src = 'assets/queen.svg'; img.alt = 'Q'; el.appendChild(img); }
    }

    function validate() {
      cells.flat().forEach(e => e.classList.remove('attacked'));
      const queens = []; for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) if (cells[r][c].dataset.q === '1') queens.push([r, c]);

      let ok = true;
      for (let r = 0; r < SIZE; r++) { if (queens.filter(q => q[0] === r).length > 1) ok = false; }
      for (let c = 0; c < SIZE; c++) { if (queens.filter(q => q[1] === c).length > 1) ok = false; }

      const seen = new Set();
      for (const [r, c] of queens) { const key = 'R' + REGIONS[r][c]; if (seen.has(key)) ok = false; else seen.add(key); }

      const dirs = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
      for (const [r, c] of queens) {
        for (const [dr, dc] of dirs) {
          const rr = r + dr, cc = c + dc;
          if (rr >= 0 && rr < SIZE && cc >= 0 && cc < SIZE && cells[rr][cc].dataset.q === '1') {
            cells[r][c].classList.add('attacked'); cells[rr][cc].classList.add('attacked'); ok = false;
          }
        }
      }

      if (ok && queens.length === 7) {
        status.innerHTML = 'The <span class="hl">Seven</span> Queens have been located. Threats neutralized.';
        onSolved && onSolved();
      } else status.textContent = "";
    }

    btnClear.onclick = () => { cells.flat().forEach(el => { el.dataset.q = '0'; el.innerHTML = ''; el.classList.remove('attacked'); }); status.textContent = ''; };
  };
})();
{/* </script> */ }