// Final riddle — expects "THE WORLD MAP" (case-insensitive)
(function () {
  const KEY = 'colorcode', ANSWER = 'THE WORLD MAP';

  function solved(out) {
    out.textContent = 'Phrase accepted. Findings are now complete.';
    window.QCPD?.save(KEY, ANSWER);
    window.QCPD?.radio('Final phrase confirmed: THE WORLD MAP');
    window.QCPD?.unlockTab('findings', { autoSwitch: true });
  }

  window.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('ringsInput');
    const btn = document.getElementById('ringsConfirm');
    const out = document.getElementById('ringsStatus');

    const saved = (window.QCPD?.load() || {})[KEY];
    if (saved === ANSWER) { input.value = ANSWER; solved(out); }

    btn?.addEventListener('click', () => {
      const val = (input.value || '').trim().toUpperCase();
      if (val === ANSWER) solved(out);
      else out.textContent = 'That phrase doesn’t align. Consider a global perspective.';
    });
  });
})();