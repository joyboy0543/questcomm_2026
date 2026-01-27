{/* <script> */ }
// Shared helpers: radio, persistence, ribbon, tabs. Shows ribbon only when all steps cleared.
// Marks steps as 'puzzle' (green) or 'skip' (red).
(function () {
    const KEY = 'qcpd.progress';
    const ORDER = ['cipher', 'riddle1', 'potion', 'doors', 'colorcode'];

    const QCPD = {
        load() { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; } },
        save(part, value, method = 'puzzle') {
            const p = QCPD.load(); p[part] = { value, method, ts: Date.now() };
            localStorage.setItem(KEY, JSON.stringify(p));
            QCPD.updateRibbon();
        },
        radio(msg) {
            const box = document.getElementById('radioChatter');
            if (box) { const div = document.createElement('div'); div.className = 'msg'; div.textContent = msg; box.prepend(div); }
            if (typeof window.radioHint === 'function') { window.radioHint(msg); }
        },
        unlockTab(tabId, { autoSwitch = false, message } = {}) {
            const btn = document.querySelector(`.tab[data-tab="${tabId}"]`);
            if (!btn) return;
            btn.classList.remove('disabled');
            if (message) QCPD.radio(message);
            if (autoSwitch) { btn.click?.(); QCPD.switchTo(tabId); }
            QCPD.updateRibbon();
        },
        switchTo(tabId) {
            const btns = [...document.querySelectorAll('.tab')];
            const secs = [...document.querySelectorAll('.section')];
            btns.forEach(b => b.classList.toggle('active', b.dataset.tab === tabId));
            secs.forEach(s => s.classList.toggle('active', s.id === tabId));
        },
        updateRibbon() {
            return;
            // const p = QCPD.load();
            // const ribbon = document.getElementById('progressRibbon');
            // if (!ribbon) return;
            // const allDone = ORDER.every(id => p[id]);
            // ribbon.classList.toggle('ribbon-hidden', !allDone);
            // [...ribbon.querySelectorAll('.step')].forEach(step => {
            //     const id = step.dataset.step; const data = p[id];
            //     const done = Boolean(data); step.classList.toggle('done', done);
            //     step.classList.toggle('skip', done && data.method === 'skip');
            // });
        },
        resume() {
            const p = QCPD.load();
            if (p.cipher) QCPD.unlockTab('riddle1');
            if (p.riddle1) QCPD.unlockTab('potion');
            if (p.potion) QCPD.unlockTab('doors');
            if (p.doors) QCPD.unlockTab('colorcode');
            if (p.colorcode) QCPD.unlockTab('findings');
            QCPD.updateRibbon();
        },
        markDoorsComplete(method = 'puzzle') {
            QCPD.save('doors', '367', method);
            QCPD.unlockTab('colorcode', { message: 'Doorway sequence complete.' });
            QCPD.radio('Threats neutralized, Digits noted! Over!.');
        }
    };

    window.QCPD = QCPD;

    window.addEventListener('DOMContentLoaded', () => {
        document.getElementById('agreeBtn')?.addEventListener('click', () => {
            const cipherTab = document.querySelector('.tab[data-tab="cipher"]');
            cipherTab?.classList.remove('disabled');
            QCPD.switchTo('cipher');
            QCPD.radio('Investigating Photo from Forensic Department. Over!');
        });

        document.getElementById('tabs')?.addEventListener('click', (e) => {
            const b = e.target.closest('.tab'); if (!b || b.classList.contains('disabled')) return;
            QCPD.switchTo(b.dataset.tab);
        });

        QCPD.resume();
    });
})();
// </script >