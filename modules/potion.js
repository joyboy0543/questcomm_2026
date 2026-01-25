// Potion — expects "928"
(function () {
    function unlockNext(nextId, msgEl, message) {
        msgEl.textContent = message;
        const btn = document.querySelector(`.tab[data-tab="${nextId}"]`);
        if (btn) { btn.classList.remove('disabled'); btn.click?.(); }
    }

    window.addEventListener('DOMContentLoaded', () => {
        const input = document.getElementById('potionInput');
        const btn = document.getElementById('potionConfirm');
        const out = document.getElementById('potionStatus');

        btn?.addEventListener('click', () => {
            const val = (input.value || '').trim();
            if (val === '928') {
                unlockNext('doors', out, 'Brew logged. Proceed to the Doorway Sequence.');
            } else {
                out.textContent = 'That incantation number doesn’t bind. Re-check the steps and counts.';
            }
        });
    });
})();