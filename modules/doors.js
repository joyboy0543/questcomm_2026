{/* <script> */ }
// Doorway hall: adds per-door skip inputs with green/red feedback; integrates with QCPD ribbon/persist.
(function () {
  const state = JSON.parse(localStorage.getItem('qcpd.doors') || '{}');
  function save() { localStorage.setItem('qcpd.doors', JSON.stringify(state)); }
  function radio(msg) { if (typeof window.radioHint === 'function') radioHint(msg); window.QCPD?.radio(msg); }

  const v = '20260123-6'; const pending = {};
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
    // Force-load Safe Sweep module to avoid race
    if (keys.includes('one')) t.push(loadScript('modules/door_minesweep4.js'));
    // These are already included via script tags, and we export globals below.
    if (keys.includes('two') && need('initDoorJewelLatin')) t.push(loadScript('modules/door_jewel_latin.js')); // will be a no-op if our global exists
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

              <div class="digit-row skip-row" style="display:flex;gap:8px;align-items:center;margin-top:10px">
                <input aria-label="Enter digit" maxlength="1" inputmode="numeric" pattern="[0-9]" placeholder="Enter digit" />
                <button class="skip-confirm">Confirm</button>
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
      const info = card.querySelector('.door-status');
      const digit = correctDigit[key];

      function markSolved(method) {  // 'puzzle' | 'skip'
        state[key] = { ...(state[key] || {}), open: true, recorded: true, digit, method };
        save();

        const all = ['one', 'two', 'three'].every(k => state[k]?.recorded);
        if (all) {
          const anySkip = ['one', 'two', 'three'].some(k => state[k]?.method === 'skip');
          window.QCPD?.save('doors', '367', anySkip ? 'skip' : 'puzzle');
          window.QCPD?.unlockTab('colorcode', { message: 'Doorway sequence complete. Digits noted. Over!' });
          radio('Wait! There seems to be one more piece of evidence that has uncovered from the data extraction of the phone. Over!');
        }
      }

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

        // restore visual state
        if (state[key]?.recorded) {
          input.value = state[key].digit || digit;
          input.readOnly = true;
          input.classList.add('input-ok');
        }
      }

      face.addEventListener('click', () => mount());
      if (state[key]?.open) mount();

      // Skip-confirm behavior
      btn.addEventListener('click', () => {
        input.classList.remove('input-ok', 'input-bad', 'shake');
        const ok = input.value.trim() === digit;
        if (ok) {
          input.classList.add('input-ok');
          input.readOnly = true;
          info.textContent = '';      // no "Recorded" text
          markSolved('skip');
        } else {
          input.classList.add('input-bad', 'shake');
          setTimeout(() => input.classList.remove('shake'), 250);
          info.textContent = '';      // keep clean per spec
        }
      });
    });
  }

  window.initDoorsHall = function (container) { build(container); };
})();
{/* </script> */ }