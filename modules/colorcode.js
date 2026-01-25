// Final riddle — expects "THE WORLD MAP" (case-insensitive, trim)
(function () {
  function unlockNext(nextId, msgEl, message) {
    msgEl.textContent = message;
    const btn = document.querySelector(`.tab[data-tab="${nextId}"]`);
    if (btn) { btn.classList.remove('disabled'); btn.click?.(); }
  }

  window.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('ringsInput');
    const btn = document.getElementById('ringsConfirm');
    const out = document.getElementById('ringsStatus');

    btn?.addEventListener('click', () => {
      const val = (input.value || '').trim().toUpperCase();
      if (val === 'THE WORLD MAP') {
        unlockNext('findings', out, 'Phrase accepted. Findings are now complete.');
      } else {
        out.textContent = 'That phrase doesn’t align. Consider a global perspective.';
      }
    });
  });
})();