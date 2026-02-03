// Potion — expects "928"
(function () {
    const KEY = 'potion', ANSWER = '928';

    function solved(out) {
        out.textContent = '✅ That\'s right Detective!. Let\'s go ahead to the next section.';
        window.QCPD?.save(KEY, ANSWER);
        window.QCPD?.radio('Potion decoded: Code recorded. Over!');

        // Unlock next without auto-switch; DOM fallback
        const usedQcpd = !!(window.QCPD?.unlockTab?.('doors', { autoSwitch: false }));
        if (!usedQcpd) {
            try {
                const tabsRow = document.getElementById('tabs');
                if (tabsRow) {
                    const nextBtn = tabsRow.querySelector('button.tab[data-tab="doors"]');
                    if (nextBtn) {
                        nextBtn.classList.remove('disabled');
                        nextBtn.removeAttribute('disabled');
                        nextBtn.setAttribute('aria-disabled', 'false');
                    }
                }
            } catch { }
        }

        try { window.dispatchEvent(new CustomEvent('qcpd:tabUnlocked', { detail: { from: 'potion', to: 'doors' } })); } catch { }
    }

    window.addEventListener('DOMContentLoaded', () => {
        const input = document.getElementById('potionInput');
        const btn = document.getElementById('potionConfirm');
        const out = document.getElementById('potionStatus');

        const saved = (window.QCPD?.load() || {})[KEY];
        if (saved === ANSWER) { input.value = ANSWER; solved(out); }

        btn?.addEventListener('click', () => {
            const val = (input.value || '').trim();
            if (val === ANSWER) solved(out);
            else out.textContent = 'That incantation number didn’t bind. Let\'s recheck the steps and count again.';
        });
    });
})();