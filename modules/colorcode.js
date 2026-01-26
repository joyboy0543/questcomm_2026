// Final puzzle (Corridor Clue) — three columns. Pick one word from each column.
// Targets: Col2='THE', Col3='WORLD', Col1='MAP'; Order: 2 -> 3 -> 1 → "THE WORLD MAP".
(function () {
  const KEY = 'colorcode';
  const ANSWER = 'THE WORLD MAP';

  // Word banks (we'll shuffle and pick 5 including the target)
  const BANK = {
    col1: { target: 'MAP', pool: ['PLAN', 'CHART', 'GUIDE', 'SKETCH', 'KEY', 'MAP', 'ATLAS'] },
    col2: { target: 'THE', pool: ['A', 'AN', 'THE', 'THIS', 'THAT', 'YOUR'] },
    col3: { target: 'WORLD', pool: ['WORLD', 'EARTH', 'GLOBE', 'PLANET', 'SPHERE', 'REALM'] }
  };

  // Utility: shuffle array in-place
  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }

  function solved(out, silent = false) {
    out.textContent = 'Phrase accepted. Findings are now complete.';
    window.QCPD?.save(KEY, ANSWER);
    window.QCPD?.unlockTab('findings', { autoSwitch: true });

    if (!silent) {
      window.QCPD?.radio('Ops note: Some references aren’t digital. Check the corridor — something important is mounted on the wall.');
    }
  }

  function renderColumns() {
    const grid = document.getElementById('corridorGrid');
    if (!grid) return;

    grid.innerHTML = '';

    // Build three columns
    const cols = [
      { id: 'c1', label: 'Column 1', key: 'col1' },
      { id: 'c2', label: 'Column 2', key: 'col2' },
      { id: 'c3', label: 'Column 3', key: 'col3' }
    ];

    cols.forEach(({ id, label, key }) => {
      const col = document.createElement('div');
      col.className = 'column';
      col.setAttribute('data-col', key);

      const header = document.createElement('div');
      header.className = 'col-title';
      header.textContent = label;
      col.appendChild(header);

      const list = document.createElement('div');
      list.className = 'word-list';

      // Create a shuffled list of 5 words that includes the target
      const bank = [...BANK[key].pool];
      if (!bank.includes(BANK[key].target)) bank.push(BANK[key].target);
      shuffle(bank);
      const five = [];
      const target = BANK[key].target;
      // Ensure target is included; pick 5 unique
      for (const w of bank) { if (!five.includes(w)) { five.push(w); if (five.length === 5) break; } }
      if (!five.includes(target)) { five[0] = target; shuffle(five); }

      for (const w of five) {
        const btn = document.createElement('button');
        btn.className = 'word';
        btn.textContent = w;
        btn.setAttribute('type', 'button');
        btn.addEventListener('click', () => {
          // Only one selection per column
          [...list.querySelectorAll('.word.selected')].forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          autofill();
        });
        list.appendChild(btn);
      }

      col.appendChild(list);
      grid.appendChild(col);
    });

    function getSelection(colKey) {
      const col = grid.querySelector(`.column[data-col="${colKey}"] .word.selected`);
      return col ? col.textContent.trim().toUpperCase() : '';
    }

    function autofill() {
      const s1 = getSelection('col1'); // MAP
      const s2 = getSelection('col2'); // THE
      const s3 = getSelection('col3'); // WORLD
      if (s1 && s2 && s3) {
        // order: col2, col3, col1
        const val = `${s2} ${s3} ${s1}`;
        const input = document.getElementById('ringsInput');
        if (input) input.value = val;
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
        out.textContent = 'Not quite. Choose one word in each column and follow the order hint.';
        // subtle feedback on the input
        input?.classList.remove('input-ok', 'input-bad', 'shake');
        input?.classList.add('input-bad', 'shake');
        setTimeout(() => input?.classList.remove('shake'), 250);
      }
    });
  });
})();