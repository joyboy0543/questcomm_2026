// modules/door_composite.js
// Jewel Latin 4x4 (uses assets/jewels/*.svg)

export function mountComposite(host, onSolved) {
  const JEWELS = ["emerald", "hex", "ruby", "amethyst", "star", "diamond"]; // 6 types
  const SIZE = 4;

  const wrap = document.createElement("div");
  wrap.className = "jlatin-wrap";
  wrap.innerHTML = `
    <h4 class="jlatin-title">Jewel Latin</h4>
    <p class="status">Each row and column must contain every jewel exactly once.</p>
    <div class="jlatin-grid"></div>
    <p id="jlStatus" class="status"></p>
    <div class="jlatin-tools">
      <button id="jlClear">Clear</button>
    </div>
  `;

  const gridEl = wrap.querySelector(".jlatin-grid");
  const status = wrap.querySelector("#jlStatus");
  const btnClear = wrap.querySelector("#jlClear");
  host.appendChild(wrap);

  const cells = [];
  for (let r = 0; r < SIZE; r++) {
    cells[r] = [];
    for (let c = 0; c < SIZE; c++) {
      const el = document.createElement("div");
      el.className = "jcell";
      el.dataset.value = "";
      el.onclick = () => cycle(el);
      gridEl.appendChild(el);
      cells[r][c] = el;
    }
  }

  function cycle(cell) {
    const idx = JEWELS.indexOf(cell.dataset.value);
    cell.dataset.value = JEWELS[(idx + 1) % JEWELS.length];
    render(cell);
    validate();
  }

  function render(cell) {
    cell.innerHTML = "";
    if (!cell.dataset.value) return;
    const img = document.createElement("img");
    img.src = `assets/jewels/${cell.dataset.value}.svg`;
    img.alt = cell.dataset.value;
    cell.appendChild(img);
  }

  function validate() {
    let ok = true;

    // clear any error styles
    cells.flat().forEach(c => c.style.boxShadow = "");

    // rows + cols unique
    for (let i = 0; i < SIZE; i++) {
      ok &= uniq(cells[i]);
      ok &= uniq(cells.map(r => r[i]));
    }

    if (ok && cells.flat().every(c => c.dataset.value)) {
      status.innerHTML = 'The encryption on the door has <strong class="hl">revealed</strong> that there are <strong class="hl">Six</strong> types of jewels.';
      onSolved && onSolved();
    } else {
      status.textContent = "";
    }
  }

  function uniq(list) {
    const seen = {}; let valid = true;
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
    cells.flat().forEach(c => { c.dataset.value = ""; c.innerHTML = ""; c.style.boxShadow = ""; });
    status.textContent = "";
  };
}