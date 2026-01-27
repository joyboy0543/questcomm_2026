// Potion — expects "928"
(function () {
    const KEY = 'potion', ANSWER = '928';

    function solved(out) {
        out.textContent = 'Brew logged. Let\'s proceed to the Doorway Sequence.';
        window.QCPD?.save(KEY, ANSWER);
        window.QCPD?.radio('Potion decoded: Code recorded. Over!');
        window.QCPD?.unlockTab('doors', { autoSwitch: true });
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
            else out.textContent = 'That incantation number doesn’t bind. Re-check the steps and counts.';
        });
    });
})();