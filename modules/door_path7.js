// modules/door_path7.js
// Queens Protocol 5x5 with colored regions (sections)

export function mountPath7(host, onSolved) {
  const SIZE = 5;

  // Region map (0..4) -> colored sections
  const REGIONS = [
    [0, 0, 1, 1, 1],
    [0, 2, 2, 3, 1],
    [0, 2, 4, 3, 3],
    [4, 2, 4, 4, 3],
    [4, 4, 4, 3, 3]
  ];
  const COLORS = {
    0: "#09c9e2",
    1: "#5c0404",
    2: "#0ed159",
    3: "#8153ec",
    4: "#eccc11",
  };

  const wrap = document.createElement("div");
  wrap.className = "q-wrap";
  wrap.innerHTML = `
    <h4 class="jlatin-title">Queens Protocol</h4>
    <p class="status">Place queens so that: (1) no two share a row or column, (2) no two touch—even diagonally, and (3) each colored section contains exactly <strong>one</strong> queen.</p>
    <div class="q-grid"></div>
    <div class="q-tools">
      <button id="qClear">Clear</button>
    </div>
    <p id="qStatus" class="q-status"></p>
  `;
  const grid = wrap.querySelector(".q-grid");
  const btnClear = wrap.querySelector("#qClear");
  const status = wrap.querySelector("#qStatus");
  host.appendChild(wrap);

  const cells = [];
  for (let r = 0; r < SIZE; r++) {
    cells[r] = [];
    for (let c = 0; c < SIZE; c++) {
      const el = document.createElement("div");
      el.className = "q-cell";
      el.dataset.q = "0";
      el.style.background = COLORS[REGIONS[r][c]];
      el.onclick = () => toggleQueen(el);
      grid.appendChild(el);
      cells[r][c] = el;
    }
  }

  function toggleQueen(el) {
    el.dataset.q = (el.dataset.q === "1") ? "0" : "1";
    render(el);
    validate();
  }

  function render(el) {
    el.innerHTML = "";
    if (el.dataset.q === "1") {
      // reuse jewel as a queen: star (distinct) — optional
      const img = document.createElement("img");
      img.src = "assets/jewels/star.svg";
      img.alt = "Q";
      el.appendChild(img);
    }
  }

  function validate() {
    // clear attack/marks
    cells.flat().forEach(e => e.classList.remove("attacked"));

    const queens = [];
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (cells[r][c].dataset.q === "1") queens.push([r, c]);
      }
    }

    let ok = true;

    // rows & cols uniqueness
    for (let r = 0; r < SIZE; r++) {
      if (queens.filter(q => q[0] === r).length > 1) ok = false;
    }
    for (let c = 0; c < SIZE; c++) {
      if (queens.filter(q => q[1] === c).length > 1) ok = false;
    }

    // regions uniqueness
    const seenRegion = new Set();
    for (const [r, c] of queens) {
      const reg = REGIONS[r][c];
      const key = "R" + reg;
      if (seenRegion.has(key)) ok = false;
      seenRegion.add(key);
    }

    // adjacency (no touch diagonally or orthogonally)
    const dirs = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1], [0, 1],
      [1, -1], [1, 0], [1, 1]
    ];
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

    if (ok && queens.length === SIZE) { // one per region → 5 queens
      status.textContent = "The queens’ jewels have been secured and isolated inside our secure box and the final digit is revealed. The encoded digit is 7.";
      onSolved?.("Queens Protocol", 7);
    } else {
      status.textContent = "";
    }
  }

  btnClear.onclick = () => {
    cells.flat().forEach(el => { el.dataset.q = "0"; el.innerHTML = ""; el.classList.remove("attacked"); });
    status.textContent = "";
  };
}