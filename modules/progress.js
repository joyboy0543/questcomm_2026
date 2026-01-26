// Shared helpers for QCPD: radio, persistence, ribbon, and basic tab switching.
(function () {
    const KEY = 'qcpd.progress';
    const ORDER = ['cipher', 'riddle1', 'potion', 'doors', 'colorcode'];

    const QCPD = {
        load() {
            try { return JSON.parse(localStorage.getItem(KEY) || '{}'); }
            catch { return {}; }
        },
        save(part, value) {
            const p = QCPD.load();
            p[part] = value;
            localStorage.setItem(KEY, JSON.stringify(p));
            QCPD.updateRibbon();
        },
        radio(msg) {
            // Push to chatter panel
            const box = document.getElementById('radioChatter');
            if (box) {
                const div = document.createElement('div');
                div.className = 'msg';
                div.textContent = msg;
                box.prepend(div);
            }
            // Also push to hint stream if provided by your code
            if (typeof window.radioHint === 'function') { window.radioHint(msg); }
        },
        unlockTab(tabId, { autoSwitch = false, message } = {}) {
            const btn = document.querySelector(`.tab[data-tab="${tabId}"]`);
            if (!btn) return;
            btn.classList.remove('disabled');
            if (message) QCPD.radio(message);
            if (autoSwitch) {
                btn.click?.();
                // manual fallback switch if app.js isn't handling tabs:
                QCPD.switchTo(tabId);
            }
            QCPD.updateRibbon();
        },
        switchTo(tabId) {
            const btns = [...document.querySelectorAll('.tab')];
            const secs = [...document.querySelectorAll('.section')];
            btns.forEach(b => b.classList.toggle('active', b.dataset.tab === tabId));
            secs.forEach(s => s.classList.toggle('active', s.id === tabId));
        },
        updateRibbon() {
            const p = QCPD.load();
            [...document.querySelectorAll('#progressRibbon .step')].forEach(step => {
                const id = step.dataset.step;
                const done = Boolean(p[id]);
                step.classList.toggle('done', done);
            });
        },
        resume() {
            const p = QCPD.load();

            // Unlock tabs in flow based on progress
            function unlocked(id) { return Boolean(p[id]); }
            if (unlocked('cipher')) QCPD.unlockTab('riddle1');
            if (unlocked('riddle1')) QCPD.unlockTab('potion');
            if (unlocked('potion')) QCPD.unlockTab('doors');
            if (unlocked('doors')) QCPD.unlockTab('colorcode');
            if (unlocked('colorcode')) QCPD.unlockTab('findings');

            // Prefill statuses if modules added messages themselves (they do).
            QCPD.updateRibbon();

            // Optional: jump to first incomplete step
            const firstIncomplete = ORDER.find(id => !p[id]);
            if (firstIncomplete) {
                // keep user on briefing until they press Agree; after that, modules move flow.
            } else {
                // All done → show Findings
                QCPD.unlockTab('findings', { autoSwitch: false });
            }
        },
        // For external modules (Doors) to mark completion:
        markDoorsComplete() {
            QCPD.save('doors', '367');
            QCPD.unlockTab('colorcode', { message: 'Doorway sequence complete. Door number 367 noted.' });
            QCPD.radio('Sequence complete. Door number 367 noted.');
        }
    };

    window.QCPD = QCPD;

    // Lightweight tabs in case app.js doesn’t control them
    window.addEventListener('DOMContentLoaded', () => {
        document.getElementById('agreeBtn')?.addEventListener('click', () => {
            const cipherTab = document.querySelector('.tab[data-tab="cipher"]');
            cipherTab?.classList.remove('disabled');
            QCPD.switchTo('cipher');
            QCPD.radio('Briefing acknowledged. Proceeding to Cipher Terminal.');
        });

        document.getElementById('tabs')?.addEventListener('click', (e) => {
            const b = e.target.closest('.tab');
            if (!b || b.classList.contains('disabled')) return;
            QCPD.switchTo(b.dataset.tab);
        });

        QCPD.resume();
    });
})();