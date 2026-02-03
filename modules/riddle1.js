// Riddle #1 — expects "1"
(function () {
    const KEY = 'riddle1', ANSWER = '1';

    function solved(out) {
        out.textContent = 'Good job!. The first step is secured, let\'s carefully move to the next part.';
        window.QCPD?.save(KEY, ANSWER);
        window.QCPD?.radio('Lock screen Unlocked: Digit recorded. Over!');

        // Unlock next without auto-switch; DOM fallback
        const usedQcpd = !!(window.QCPD?.unlockTab?.('potion', { autoSwitch: false }));
        if (!usedQcpd) {
            try {
                const tabsRow = document.getElementById('tabs');
                if (tabsRow) {
                    const nextBtn = tabsRow.querySelector('button.tab[data-tab="potion"]');
                    if (nextBtn) {
                        nextBtn.classList.remove('disabled');
                        nextBtn.removeAttribute('disabled');
                        nextBtn.setAttribute('aria-disabled', 'false');
                    }
                }
            } catch { }
        }

        try { window.dispatchEvent(new CustomEvent('qcpd:tabUnlocked', { detail: { from: 'riddle1', to: 'potion' } })); } catch { }
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
            else out.textContent = 'Try again. It looks like the answer is simple.';
        });
    });
})();