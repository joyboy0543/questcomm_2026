(function () {
  const state = JSON.parse(localStorage.getItem('qcpd.doors') || '{}');
  function save() { localStorage.setItem('qcpd.doors', JSON.stringify(state)); }
  function radio(msg) { if (typeof window.radioHint === 'function') radioHint(msg); window.QCPD?.radio(msg); }

  const v = '20260123-5'; const pending = {};
  function need(fn) { return typeof window[fn] !== 'function'; }
  function loadScript(src) {
    if (pending[src]) return pending[src];
    return pending[src] = new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = src + (src.includes('?') ? '' : '?v=' + v);
      s.onload = res; s.onerror = () => rej(new Error('Failed to load ' + src));
      document.head.appendChild(s);
    });
  }
  async function ensure(keys) {
    const t = [];
    if (keys.includes('one')) t.push(loadScript('modules/door_minesweep4.js')); // force-load
    if (keys.includes('two') && need('initDoorJewelLatin')) t.push(loadScript('modules/door_jewel_latin.js'));
    if (keys.includes('three') && need('initDoorQueens5')) t.push(loadScript('modules/door_queens5.js'));
    if (t.length) await Promise.all(t);
  }

  const correctDigit = { one: '3', two: '6', three: '7' };

  function build(container) {
    container.innerHTML =
      `<div class="doors-hall">${['one', 'two', 'three'].map(k => `
          <div class="door-card ${state[k]?.open ? 'open' : ''}" data-door="${k}">
            <div class="door-top">
              <div class="door-face" role="button" aria-label="Open puzzle">
                <img src="assets/door_white.svg" alt="door"/>
              </div>
            </div>
            <div class="door-game">
              <div class="game-host" id="host-${k}"></div>

              <!-- Skip Row: allow entering the digit directly -->
              <div class="digit-row skip-row" style="display:flex;gap:8px;align-items:center;margin-top:10px">
                <input aria-label="Enter digit" maxlength="1" inputmode="numeric" pattern="[0-9]" placeholder="Digit" />
                <button class="skip-confirm">Confirm</button>
                <span class="pill" style="display:none"><span class="record-pill">✔ Recorded</span></span>
              </div>
              <p class="status door-status" style="min-height:1.2rem"></p>
            </div>
          </div>
        `).join('')
      }</div>`;

    [...container.querySelectorAll('.door-card')].forEach(card => {
      const key = card.dataset.door;
      const host = card.querySelector('.game-host');
      const face = card.querySelector('.door-face');
      const row = card.querySelector('.skip-row');
      const input = row.querySelector('input');
      const btn = row.querySelector('.skip-confirm');
      const pill = row.querySelector('.pill');
      const info = card.querySelector('.door-status');
      const digit = correctDigit[key];

      function markSolved(method) {  // method: 'puzzle' | 'skip'
        state[key] = { ...(state[key] || {}), open: true, recorded: true, digit, method };
        pill.style.display = 'inline-block';
        input.value = digit; input.readOnly = true;
        save();

        if (method === 'puzzle') {
          if (key === 'one') radio('Safe Sweep cleared. Three hazards neutralized.');
          if (key === 'two') radio('Jewel Latin solved. Second digit verified.');
          if (key === 'three') radio('Queens Protocol complete. Final digit verified.');
        } else {
          radio(`Digit ${digit} recorded for Door ${key === 'one' ? 1 : key === 'two' ? 2 : 3} (manual entry).`);
        }

        // If all three recorded, mark Doors step in global progress.
        const all = ['one', 'two', 'three'].every(k => state[k]?.recorded);
        if (all) {
          // mark Doors step with method 'puzzle' only if none were skipped
          const anySkip = ['one', 'two', 'three'].some(k => state[k]?.method === 'skip');
          window.QCPD?.save('doors', '367', anySkip ? 'skip' : 'puzzle');
          window.QCPD?.unlockTab('colorcode', { message: 'Doorway sequence complete. Door number 367 noted.' });
          radio('Sequence complete. Door number 367 noted.');
        }
      }

      // OPEN/MOUNT
      async function mount() {
        card.classList.add('open');
        state[key] = state[key] || { open: true }; save();

        try {
          await ensure([key]);
          if (key === 'one') {
            if (typeof window.initDoorMinesweep4 === 'function') {
              window.initDoorMinesweep4(host, () => markSolved('puzzle'));
            } else {
              host.innerHTML = '<div style="color:var(--warn)">Minesweeper module did not initialize.</div>';
            }
          }
          if (key === 'two') window.initDoorJewelLatin?.(host, () => markSolved('puzzle'));
          if (key === 'three') window.initDoorQueens5?.(host, () => markSolved('puzzle'));
        } catch (e) {
          host.innerHTML = `<div style="color:var(--warn)">${e.message}</div>`;
        }

        // Restore skip row if already recorded
        if (state[key]?.recorded) {
          pill.style.display = 'inline-block';
          input.value = state[key].digit || digit;
          input.readOnly = true;
        }
      }

      face.addEventListener('click', () => mount());
      if (state[key]?.open) mount();

      // Skip confirm
      btn.addEventListener('click', () => {
        if (input.value.trim() === digit) {
          info.textContent = 'Digit recorded.';
          markSolved('skip');
        } else {
          info.textContent = 'Incorrect digit.';
          input.classList.add('shake');
          setTimeout(() => input.classList.remove('shake'), 200);
        }
      });
    });
  }

  window.initDoorsHall = function (container) {
    build(container);
  };
})();