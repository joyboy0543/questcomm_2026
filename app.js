// Greeting
(function () {
  const agent = JSON.parse(localStorage.getItem('qcpd.agent') || '{}');
  const hello = document.getElementById('hello');
  if (hello) { hello.textContent = agent.name ? `Welcome, Agent ${agent.name}.` : 'Welcome, Agent.' }
})();

// Case switching left list
(function () {
  const cases = document.querySelectorAll('.case');
  const caseMsg = document.getElementById('caseMsg');
  cases.forEach(c => c.addEventListener('click', () => {
    if (c.classList.contains('locked')) {
      const type = c.dataset.case; caseMsg.style.display = 'block'; document.getElementById('tabs').style.display = 'none';
      [...document.querySelectorAll('.section')].forEach(s => s.classList.remove('active'));
      if (type === 'solved') caseMsg.textContent = 'This case has been solved and the evidence has been moved to the evidence handling department at Post-Analysis, for access please contact the corresponding incharge or your Department Lead.';
      else if (type === 'ongoing') caseMsg.textContent = 'This is an ongoing case and a different team is assigned to it. To work on this case or access evidecnce please contact the corresponding incharge or your Department Lead.';
      else caseMsg.textContent = 'This case is locked.';
      cases.forEach(x => x.classList.remove('active')); c.classList.add('active'); return;
    }
    caseMsg.style.display = 'none'; document.getElementById('tabs').style.display = 'flex';
    document.querySelector('.section.active')?.classList.remove('active');
    document.getElementById('briefing').classList.add('active');
    cases.forEach(x => x.classList.remove('active')); c.classList.add('active');
  }));
})();

// Tabs + gating
(function () {
  const tabs = [...document.querySelectorAll('.tab')]; const sections = [...document.querySelectorAll('.section')];
  const state = JSON.parse(localStorage.getItem('qcpd.case1') || '{}');
  function setEnabled(id, en) { const t = tabs.find(x => x.dataset.tab === id); if (t) t.classList.toggle('disabled', !en); }
  function activate(id) { tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === id)); sections.forEach(s => s.classList.toggle('active', s.id === id)); }
  tabs.forEach(t => t.addEventListener('click', () => { if (!t.classList.contains('disabled')) activate(t.dataset.tab); }));

  document.getElementById('agreeBtn').addEventListener('click', () => { state.briefing = true; localStorage.setItem('qcpd.case1', JSON.stringify(state)); setEnabled('cipher', true); activate('cipher'); radioHint('Briefing completed and agreement logged. Proceeding to investigate evidence.'); });

  if (state.briefing) setEnabled('cipher', true);
  if (state.cipher) setEnabled('potion', true);
  if (state.potion) setEnabled('doors', true);
  if (state.doors) setEnabled('colorcode', true);
  if (state.colorcode) setEnabled('findings', true);

  if (state.colorcode) activate('findings');
  else if (state.doors) activate('colorcode');
  else if (state.potion) activate('doors');
  else if (state.cipher) activate('potion');
  else activate('briefing');
})();

// Radio chatter + hint
const radioHintsEl = document.getElementById('radioHints'); const radioChatterEl = document.getElementById('radioChatter');
function radioHint(msg) { if (!radioHintsEl) return; const d = document.createElement('div'); d.className = 'msg'; d.textContent = msg; radioHintsEl.prepend(d); }
(function () { const lines = ['Forensic: Any updates on the decoding the phone?. Over!', 'Patrol: Homicide crew please report on 17th street. Over!', 'Patrol 4: Running by the coffee shop. Over!', 'Patrol 12: Routine check completed on block C. Over and out!', 'Unit 7: In pursuit, requesting traffic cams. Over!', 'Dispatch: Reported break-in at Dock 3; team assigned. Over!', 'Ops: Drone sweep scheduled in sector north. Over!', 'Forensics: Lab queue clear for two samples. Over!', 'Forensic: Double homicide case has progress, Forensic lead kindly arrive at the lab. Over!']; let i = 0; setInterval(() => { const d = document.createElement('div'); d.className = 'msg'; d.textContent = new Date().toLocaleTimeString() + ' — ' + lines[i++ % lines.length]; radioChatterEl.prepend(d); }, 7000); })();
(function () { const btn = document.getElementById('hintBtn'); if (!btn) return; btn.addEventListener('click', () => { const tab = document.querySelector('.tab.active')?.dataset.tab; if (tab === 'cipher') radioHint('Lead Detective: Initial investigation led to a code ending with 3. Over!'); else if (tab === 'doors') radioHint('Lead Detective: I have uncovered that each encryption puzzle hides a digit. Solving them would give us a way forward. Over!'); else if (tab === 'potion') radioHint('Lead Detective: I recall seeing these shapes on some previous evidence. Have you checked those? There might be a hint to solve this Brew. I have a gut feeling that decoding this would give us a three digit code that we could use later. Over!'); else if (tab === 'colorcode') radioHint('Lead Detective: I realise that just finding and arranging the words is not the end of it. Over!'); else radioHint('Open a tab to see whether there has been any previous investigation. If not you are the first to have your hands-on this evidence. Over!'); }); })();

// Boot stations
window.addEventListener('DOMContentLoaded', () => {
  window.initCipherDesk?.();
  window.initDoorsHall?.(document.getElementById('doorsHost'));
});
