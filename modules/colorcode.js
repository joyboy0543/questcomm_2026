// Corridor Clue — three columns; choose one word from each column.
// Targets: Column 1 = MAP, Column 2 = THE, Column 3 = WORLD
// Order hint: 2 -> 3 -> 1 => "THE WORLD MAP"
(function () {
  const KEY = 'colorcode';
  const ANSWER_CANON = 'THEWORLDMAP'; // canonical (no spaces, upper) for strict order check
  const ANSWER_WITH_SPACES = 'THE WORLD MAP';

  const BANK = {
    col1: {
      target: 'MAP',
      pool: [
        'KEY', 'SCALE', 'DIAMOND',
        'JEWEL', 'NOTE', 'PLAN', 'DRAW', 'DESK', 'ROAD', 'MAP'
      ]
    },
    col2: {
      target: 'THE',
      pool: [
        'I', 'EACH', 'YOU', 'NEITHER', 'GOLD', 'THIS', 'THAT', 'WE', 'THE'
      ]
    },
    col3: {
      target: 'WORLD',
      pool: [
        'SILVER', 'GLOBE', 'SPHERE', 'REALM', 'TREE', 'TERRAIN', 'WORLD'
      ]
    }
  };

  // Shuffle helper
  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }

  function solved(out, silent = false) {
    // keep your original success line as-is
    out.textContent = '✅ Phrase accepted and the data from the phone is neutralized. Findings are now complete and compiled. For an overview of all decoded information, let’s take a look in the findings section. Over!';
    // persist + unlock (no auto-switch)
    window.QCPD?.save(KEY, ANSWER_WITH_SPACES);

    const usedQcpd = !!(window.QCPD?.unlockTab?.('findings', { autoSwitch: false }));
    if (!usedQcpd) {
      try {
        const tabsRow = document.getElementById('tabs');
        if (tabsRow) {
          const nextBtn = tabsRow.querySelector('button.tab[data-tab="findings"]');
          if (nextBtn) {
            nextBtn.classList.remove('disabled');
            nextBtn.removeAttribute('disabled');
            nextBtn.setAttribute('aria-disabled', 'false');
          }
        }
      } catch { }
    }

    if (!silent) {
      window.QCPD?.radio('These were the words from the burglar: Some references aren’t digital, they are also found on and behind the walls. Over!');
    }

    try { window.dispatchEvent(new CustomEvent('qcpd:tabUnlocked', { detail: { from: 'colorcode', to: 'findings' } })); } catch { }
  }

  function renderColumns() {
    const grid = document.getElementById('corridorGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const cols = [
      { label: 'Column 1', key: 'col1' }, // MAP
      { label: 'Column 2', key: 'col2' }, // THE
      { label: 'Column 3', key: 'col3' }  // WORLD
    ];

    cols.forEach(({ label, key }) => {
      const col = document.createElement('div');
      col.className = 'column';
      col.setAttribute('data-col', key);

      const header = document.createElement('div');
      header.className = 'col-title';
      header.textContent = label;
      col.appendChild(header);

      const list = document.createElement('div');
      list.className = 'word-list';

      // Build 5 unique words including the target; then shuffle
      const pool = Array.from(new Set(BANK[key].pool));
      if (!pool.includes(BANK[key].target)) pool.push(BANK[key].target);
      shuffle(pool);
      const five = [];
      for (const w of pool) { five.push(w); if (five.length === 5) break; }
      if (!five.includes(BANK[key].target)) { five[0] = BANK[key].target; }
      shuffle(five);

      for (const w of five) {
        const btn = document.createElement('button');
        btn.className = 'word';
        btn.type = 'button';
        btn.textContent = w.toUpperCase();
        btn.addEventListener('click', () => {
          // One selection per column; purely visual now (no auto-fill)
          [...list.querySelectorAll('.word.selected')].forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
        });
        list.appendChild(btn);
      }

      col.appendChild(list);
      grid.appendChild(col);
    });
  }

  // Normalize user input:
  // - uppercase
  // - collapse internal whitespace to single space
  // - also compute a "compact" version with all non-letters removed to compare to THEWORLDMAP
  function normalizeForCheck(str) {
    const raw = (str || '').trim();
    const upper = raw.toUpperCase();
    const withSingleSpaces = upper.replace(/\s+/g, ' ').trim();
    const lettersOnly = upper.replace(/[^A-Z]/g, '');
    return { withSingleSpaces, lettersOnly };
  }

  window.addEventListener('DOMContentLoaded', () => {
    renderColumns();

    const input = document.getElementById('ringsInput');
    const btn = document.getElementById('ringsConfirm');
    const out = document.getElementById('ringsStatus');

    // Resume without replaying radio
    const saved = (window.QCPD?.load() || {})[KEY];
    const savedVal = (saved && typeof saved === 'object') ? saved.value : saved;
    if (savedVal === ANSWER_WITH_SPACES) {
      if (input) input.value = ANSWER_WITH_SPACES;
      solved(out, true);
    }

    btn?.addEventListener('click', () => {
      const val = input?.value || '';
      const { withSingleSpaces, lettersOnly } = normalizeForCheck(val);

      // Accept "THE WORLD MAP" (any casing / extra spaces) OR "THEWORLDMAP" (no spaces, any case)
      const ok =
        (withSingleSpaces === 'THE WORLD MAP') ||
        (lettersOnly === ANSWER_CANON);

      if (ok) {
        solved(out);
      } else {
        out.textContent = 'Not quite. Let us try picking a different word from each column.';
        input?.classList.remove('input-ok', 'input-bad', 'shake');
        input?.classList.add('input-bad', 'shake');
        setTimeout(() => input?.classList.remove('shake'), 250);
      }
    });
  });
})();