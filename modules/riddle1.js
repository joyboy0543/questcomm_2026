// Riddle #1 — expects "1"
(function () {
    const KEY = 'riddle1', ANSWER = '1';

    function solved(out) {
        out.textContent = 'Correct. The first step is secured — move to the potion.';
        window.QCPD?.save(KEY, ANSWER);
        window.QCPD?.radio('Riddle solved: 1');
        window.QCPD?.unlockTab('potion', { autoSwitch: true });
    }

    window.addEventListener('DOMContentLoaded', () => {
        const input = document.getElementById('riddle1Input');
        const btn = document.getElementById('riddle1Confirm');
        const out = document.getElementById('riddle1Status');

        const saved = (window.QCPD?.load() || {})[KEY];
        if (saved === ANSWER) { input.value = ANSWER; solved(out); }

        btn?.addEventListener('click', () => {
            const val = (input.value || '').trim();
            if (val === ANSWER) solved(out);
            else out.textContent = 'Try again. The answer is a single digit.';
        });
    });
})();