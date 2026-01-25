// Riddle #1 — expects "1"
(function () {
    function unlockNext(nextId, msgEl, message) {
        msgEl.textContent = message;
        const btn = document.querySelector(`.tab[data-tab="${nextId}"]`);
        if (btn) { btn.classList.remove('disabled'); btn.click?.(); }
    }

    window.addEventListener('DOMContentLoaded', () => {
        const input = document.getElementById('riddle1Input');
        const btn = document.getElementById('riddle1Confirm');
        const out = document.getElementById('riddle1Status');

        btn?.addEventListener('click', () => {
            const val = (input.value || '').trim();
            if (val === '1') {
                unlockNext('potion', out, 'Correct. The first step is secured — move to the potion.');
            } else {
                out.textContent = 'Try again. The answer is a single digit.';
            }
        });
    });
})();