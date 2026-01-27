// Corridor Clue — three columns; choose one word from each column.
// Targets: Column 1 = MAP, Column 2 = THE, Column 3 = WORLD
// Order hint: 2 -> 3 -> 1 => "THE WORLD MAP"
(function () {
  const KEY = 'colorcode';
  const ANSWER = 'THE WORLD MAP';

  // Word banks with homonyms / grouped-but-different words in cols 1 & 3,
  // and trickier selector words in col 2 (to avoid obvious "preposition" feel).
  const BANK = {
    col1: {
      target: 'MAP',
      pool: [
        'KEY', 'SCALE', 'DIAMOND', // homonyms / map parts with other meanings
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
    out.textContent = 'Phrase accepted and the data from the phone is neutralized. Findings are now complete. Over!';
    window.QCPD?.save(KEY, ANSWER);
    window.QCPD?.unlockTab('findings', { autoSwitch: true });
    if (!silent) {
      window.QCPD?.radio('These were the words from the burglar: Some references aren’t digital, they are also found on and behind the walls. Over!');
    }
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
          // one selection per column
          [...list.querySelectorAll('.word.selected')].forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          autofill();
        });
        list.appendChild(btn);
      }

      col.appendChild(list);
      grid.appendChild(col);
    });

    function sel(colKey) {
      const el = grid.querySelector(`.column[data-col="${colKey}"] .word.selected`);
      return el ? el.textContent.trim().toUpperCase() : '';
    }

    function autofill() {
      const s1 = sel('col1'); // MAP
      const s2 = sel('col2'); // THE
      const s3 = sel('col3'); // WORLD
      if (s1 && s2 && s3) {
        // order: column 2, then 3, then 1
        const input = document.getElementById('ringsInput');
        if (input) input.value = `${s2} ${s3} ${s1}`;
      }
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    renderColumns();

    const input = document.getElementById('ringsInput');
    const btn = document.getElementById('ringsConfirm');
    const out = document.getElementById('ringsStatus');

    // Resume without replaying radio
    const saved = (window.QCPD?.load() || {})[KEY];
    const savedVal = (saved && typeof saved === 'object') ? saved.value : saved;
    if (savedVal === ANSWER) {
      if (input) input.value = ANSWER;
      solved(out, true);
    }

    btn?.addEventListener('click', () => {
      const val = (input?.value || '').trim().replace(/\s+/g, ' ').toUpperCase();
      if (val === ANSWER) {
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