{/* <script> */ }
// Final riddle — expects "THE WORLD MAP" (case-insensitive) with one-time location radio.
(function () {
  const KEY = 'colorcode', ANSWER = 'THE WORLD MAP';

  function solved(out, silent = false) {
    out.textContent = 'Phrase accepted. Findings are now complete.';
    window.QCPD?.save(KEY, ANSWER);
    window.QCPD?.unlockTab('findings', { autoSwitch: true });

    if (!silent) {
      window.QCPD?.radio('Ops note: Some references aren’t digital. Check the corridor — something important is mounted on the wall.');
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('ringsInput');
    const btn = document.getElementById('ringsConfirm');
    const out = document.getElementById('ringsStatus');

    const saved = (window.QCPD?.load() || {})[KEY];
    const savedVal = (saved && typeof saved === 'object') ? saved.value : saved;
    if (savedVal === ANSWER) { input.value = ANSWER; solved(out, true); }

    btn?.addEventListener('click', () => {
      const val = (input.value || '').trim().toUpperCase();
      if (val === ANSWER) solved(out);
      else out.textContent = 'That phrase doesn’t align. Consider a global perspective.';
    });
  });
})();
{/* </script> */ }