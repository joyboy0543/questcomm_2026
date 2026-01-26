{/* <script> */ }
// Cipher Terminal — Photo Forensics (buildings.jpg -> 243). Injects preview image; opens zoomable modal.
// Persists progress; pushes radio on success.
(function () {
  const KEY = 'cipher';
  const ANSWER = '243';
  const IMG_SRC = 'assets/buildings.jpg';

  function unlockNext() {
    const out = document.getElementById('cipherStatus');
    if (out) out.textContent = 'Verified. Proceed to the next riddle.';
    window.QCPD?.save(KEY, ANSWER);
    window.QCPD?.radio('Cipher verified: 243');
    window.QCPD?.unlockTab('riddle1', { autoSwitch: true });
  }

  function create(el, attrs = {}, children = []) {
    const n = document.createElement(el);
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === 'class') n.className = v; else if (k === 'text') n.textContent = v; else n.setAttribute(k, v);
    });
    (Array.isArray(children) ? children : [children]).filter(Boolean).forEach(c => n.appendChild(c));
    return n;
  }

  function openLightbox() {
    const backdrop = create('div', { class: 'lb-backdrop' });
    const panel = create('div', { class: 'lb-panel' });
    backdrop.appendChild(panel);

    const header = create('div', { class: 'lb-header' });
    const title = create('div', { class: 'lb-title', text: 'Photo Forensics — buildings.jpg' });
    const close = create('button', { class: 'lb-close', text: 'Close' });
    header.append(title, close);

    const view = create('div', { class: 'lb-view' });
    const img = create('img', { class: 'zoom-img', src: IMG_SRC, alt: 'Buildings panorama' });
    view.appendChild(img);

    const tools = create('div', { class: 'lb-tools' });
    const zOut = create('button', { text: '−' });
    const zReset = create('button', { text: 'Reset' });
    const zIn = create('button', { text: '+' });
    tools.append(zOut, zReset, zIn);

    panel.append(header, view, tools);
    document.body.appendChild(backdrop);

    const Z_MIN = 0.5, Z_MAX = 4, STEP = 0.25;
    let scale = 1, pos = { x: 0, y: 0 }, drag = null, startDist = 0, startScale = 1;

    function apply() { img.style.transform = `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px)) scale(${scale})`; }
    function fitToView() {
      const vw = view.clientWidth, vh = view.clientHeight;
      const iw = img.naturalWidth || vw, ih = img.naturalHeight || vh;
      const fit = Math.min(vw / iw, vh / ih);
      scale = Math.max(Z_MIN, Math.min(1, fit)); pos = { x: 0, y: 0 }; apply();
    }
    function setScale(next, cx, cy) {
      const old = scale; scale = Math.min(Z_MAX, Math.max(Z_MIN, next));
      const rect = view.getBoundingClientRect();
      const dx = (cx - rect.left) - rect.width / 2, dy = (cy - rect.top) - rect.height / 2;
      pos.x = pos.x + dx * (1 / old - 1 / scale); pos.y = pos.y + dy * (1 / old - 1 / scale); apply();
    }
    if (img.complete) fitToView(); else img.onload = fitToView;

    view.addEventListener('wheel', (e) => { e.preventDefault(); setScale(scale + (e.deltaY < 0 ? STEP : -STEP), e.clientX, e.clientY); }, { passive: false });
    view.addEventListener('dblclick', (e) => { e.preventDefault(); const t = scale < 2 ? Math.min(Z_MAX, scale + 1) : 1; setScale(t, e.clientX, e.clientY); if (t === 1) { pos = { x: 0, y: 0 }; apply(); } });
    view.addEventListener('pointerdown', (e) => { view.setPointerCapture(e.pointerId); drag = { x: e.clientX - pos.x, y: e.clientY - pos.y }; });
    view.addEventListener('pointermove', (e) => { if (!drag) return; pos.x = e.clientX - drag.x; pos.y = e.clientY - drag.y; apply(); });
    view.addEventListener('pointerup', () => { drag = null; });

    const pts = new Map();
    view.addEventListener('pointerdown', e => pts.set(e.pointerId, e));
    view.addEventListener('pointermove', e => {
      if (pts.has(e.pointerId)) pts.set(e.pointerId, e);
      if (pts.size === 2) {
        const [a, b] = [...pts.values()]; const dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
        if (!startDist) { startDist = dist; startScale = scale; }
        const cx = (a.clientX + b.clientX) / 2, cy = (a.clientY + b.clientY) / 2; setScale(startScale * (dist / startDist), cx, cy);
      }
    }, { passive: false });
    view.addEventListener('pointerup', e => { pts.delete(e.pointerId); if (pts.size < 2) startDist = 0; });

    zIn.addEventListener('click', () => { const r = view.getBoundingClientRect(); setScale(scale + STEP, r.left + r.width / 2, r.top + r.height / 2); });
    zOut.addEventListener('click', () => { const r = view.getBoundingClientRect(); setScale(scale - STEP, r.left + r.width / 2, r.top + r.height / 2); });
    zReset.addEventListener('click', () => { fitToView(); });

    function closeModal() { backdrop.remove(); }
    close.addEventListener('click', closeModal);
    backdrop.addEventListener('click', (e) => { if (e.target === backdrop) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); }, { once: true });
  }

  window.addEventListener('DOMContentLoaded', () => {
    const figure = document.querySelector('.photo-thumb');
    if (figure) {
      figure.innerHTML = '';                         // ensure NO literal text is visible
      if (!figure.querySelector('img')) {
        const img = document.createElement('img'); img.src = IMG_SRC; img.alt = 'Buildings panorama preview';
        figure.appendChild(img);
        const fc = document.createElement('figcaption'); fc.textContent = 'Tap/click to open';
        figure.appendChild(fc);
      }
      figure.addEventListener('click', openLightbox);
    }

    const input = document.getElementById('cipherInput');
    const btn = document.getElementById('cipherConfirm');

    const saved = (window.QCPD?.load() || {})[KEY];
    const savedVal = (saved && typeof saved === 'object') ? saved.value : saved;
    if (savedVal === ANSWER) {
      input.value = ANSWER;
      const out = document.getElementById('cipherStatus');
      if (out) out.textContent = 'Verified earlier. You can proceed to the next riddle.';
      window.QCPD?.updateRibbon?.();
    }

    btn?.addEventListener('click', () => {
      const val = (input.value || '').trim();
      if (val === ANSWER) unlockNext(); else {
        const out = document.getElementById('cipherStatus');
        if (out) out.textContent = 'Not quite. Open the photo and review again.';
      }
    });
  });
})();
{/* </script> */ }