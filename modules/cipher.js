
// Cipher Terminal — Photo Forensics (buildings.jpg -> answer 243)
(function () {
  const Z_MIN = 1, Z_MAX = 4, STEP = 0.25;

  function setupZoom() {
    const wrap = document.getElementById('zoomWrap');
    const img = document.getElementById('zoomImg');
    if (!wrap || !img) return;

    let scale = 1, startDist = 0, startScale = 1;
    let origin = { x: 0, y: 0 };
    let pos = { x: 0, y: 0 };
    let start = null; // for drag

    function apply() {
      img.style.transform = `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px)) scale(${scale})`;
    }

    function setScale(next, cx, cy) {
      const old = scale;
      scale = Math.min(Z_MAX, Math.max(Z_MIN, next));
      // zoom towards pointer: adjust pos so the point under cursor stays under it
      const rect = wrap.getBoundingClientRect();
      const dx = (cx - rect.left) - rect.width / 2;
      const dy = (cy - rect.top) - rect.height / 2;
      pos.x = pos.x + dx * (1 / old - 1 / scale);
      pos.y = pos.y + dy * (1 / old - 1 / scale);
      apply();
    }

    // wheel zoom
    wrap.addEventListener('wheel', (e) => {
      e.preventDefault();
      const dir = e.deltaY < 0 ? 1 : -1;
      setScale(scale + dir * STEP, e.clientX, e.clientY);
    }, { passive: false });

    // double click zoom
    wrap.addEventListener('dblclick', (e) => {
      e.preventDefault();
      setScale(scale < 2 ? Math.min(Z_MAX, scale + 1) : 1, e.clientX, e.clientY);
      if (scale === 1) { pos = { x: 0, y: 0 }; apply(); }
    });

    // drag / pan
    wrap.addEventListener('pointerdown', (e) => {
      wrap.setPointerCapture(e.pointerId);
      start = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    });
    wrap.addEventListener('pointermove', (e) => {
      if (!start) return;
      pos.x = e.clientX - start.x;
      pos.y = e.clientY - start.y;
      apply();
    });
    wrap.addEventListener('pointerup', () => { start = null; });

    // pinch zoom (two pointers)
    const pts = new Map();
    wrap.addEventListener('pointerdown', e => pts.set(e.pointerId, e));
    wrap.addEventListener('pointermove', e => {
      if (pts.has(e.pointerId)) pts.set(e.pointerId, e);
      if (pts.size === 2) {
        const arr = [...pts.values()];
        const dist = Math.hypot(arr[0].clientX - arr[1].clientX, arr[0].clientY - arr[1].clientY);
        if (!startDist) { startDist = dist; startScale = scale; }
        const centerX = (arr[0].clientX + arr[1].clientX) / 2;
        const centerY = (arr[0].clientY + arr[1].clientY) / 2;
        setScale(startScale * (dist / startDist), centerX, centerY);
      }
    }, { passive: false });
    wrap.addEventListener('pointerup', e => {
      pts.delete(e.pointerId);
      if (pts.size < 2) { startDist = 0; }
    });

    // tool buttons
    document.getElementById('zIn')?.addEventListener('click', () => setScale(scale + STEP, wrap.getBoundingClientRect().left + wrap.clientWidth / 2, wrap.getBoundingClientRect().top + wrap.clientHeight / 2));
    document.getElementById('zOut')?.addEventListener('click', () => setScale(scale - STEP, wrap.getBoundingClientRect().left + wrap.clientWidth / 2, wrap.getBoundingClientRect().top + wrap.clientHeight / 2));
    document.getElementById('zReset')?.addEventListener('click', () => { scale = 1; pos = { x: 0, y: 0 }; apply(); });

    apply();
  }

  function unlockNext(nextId, msgEl, message) {
    msgEl.textContent = message;
    const btn = document.querySelector(`.tab[data-tab="${nextId}"]`);
    if (btn) { btn.classList.remove('disabled'); btn.click?.(); }
  }

  window.addEventListener('DOMContentLoaded', () => {
    setupZoom();

    const input = document.getElementById('cipherInput');
    const btn = document.getElementById('cipherConfirm');
    const out = document.getElementById('cipherStatus');

    btn?.addEventListener('click', () => {
      const val = (input.value || '').trim();
      if (val === '243') {
        unlockNext('riddle1', out, 'Verified. Proceed to the next riddle.');
      } else {
        out.textContent = 'Not quite. Review the photo again.';
      }
    });
  });
})();