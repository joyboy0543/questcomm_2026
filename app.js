// Greeting
(function(){
  const agent = JSON.parse(localStorage.getItem('qcpd.agent')||'{}');
  const hello = document.getElementById('hello');
  if(hello){ hello.textContent = agent.name? `Welcome, Agent ${agent.name}.` : 'Welcome, Agent.' }
})();

// Case switching left list
(function(){
  const cases = document.querySelectorAll('.case');
  const caseMsg = document.getElementById('caseMsg');
  cases.forEach(c => c.addEventListener('click', () => {
    if(c.classList.contains('locked')){
      const type = c.dataset.case; caseMsg.style.display='block'; document.getElementById('tabs').style.display='none';
      [...document.querySelectorAll('.section')].forEach(s=>s.classList.remove('active'));
      if(type==='solved') caseMsg.textContent='This case has been solved and the evidence has been moved to the evidence handling department, for further access please contact the corresponding incharge person.';
      else if(type==='ongoing') caseMsg.textContent='This case is ongoing and a different team is working on it. To work on this case, obtain access by contacting corresponding incharge person.';
      else caseMsg.textContent='This case is locked.';
      cases.forEach(x=>x.classList.remove('active')); c.classList.add('active'); return;
    }
    caseMsg.style.display='none'; document.getElementById('tabs').style.display='flex';
    document.querySelector('.section.active')?.classList.remove('active');
    document.getElementById('briefing').classList.add('active');
    cases.forEach(x=>x.classList.remove('active')); c.classList.add('active');
  }));
})();

// Tabs + gating
(function(){
  const tabs=[...document.querySelectorAll('.tab')]; const sections=[...document.querySelectorAll('.section')];
  const state=JSON.parse(localStorage.getItem('qcpd.case1')||'{}');
  function setEnabled(id,en){ const t=tabs.find(x=>x.dataset.tab===id); if(t) t.classList.toggle('disabled',!en); }
  function activate(id){ tabs.forEach(t=>t.classList.toggle('active', t.dataset.tab===id)); sections.forEach(s=>s.classList.toggle('active', s.id===id)); }
  tabs.forEach(t=>t.addEventListener('click',()=>{ if(!t.classList.contains('disabled')) activate(t.dataset.tab); }));

  document.getElementById('agreeBtn').addEventListener('click', ()=>{ state.briefing=true; localStorage.setItem('qcpd.case1', JSON.stringify(state)); setEnabled('cipher', true); activate('cipher'); radioHint('Agreement logged. Cipher Terminal unlocked.'); });

  if(state.briefing) setEnabled('cipher', true);
  if(state.cipher) setEnabled('doors', true);
  if(state.doors) setEnabled('colorcode', true);
  if(state.colorcode) setEnabled('findings', true);

  if(state.colorcode) activate('findings');
  else if(state.doors) activate('colorcode');
  else if(state.cipher) activate('doors');
  else activate('briefing');
})();

// Radio chatter + hint
const radioHintsEl=document.getElementById('radioHints'); const radioChatterEl=document.getElementById('radioChatter');
function radioHint(msg){ if(!radioHintsEl) return; const d=document.createElement('div'); d.className='msg'; d.textContent=msg; radioHintsEl.prepend(d); }
(function(){ const lines=['Patrol 12: Routine check completed on block C.','Unit 7: In pursuit, requesting traffic cams.','Dispatch: Reported break-in at Dock 3; team assigned.','Ops: Drone sweep scheduled in sector north.','Forensics: Lab queue clear for two samples.']; let i=0; setInterval(()=>{ const d=document.createElement('div'); d.className='msg'; d.textContent=new Date().toLocaleTimeString()+' — '+lines[i++%lines.length]; radioChatterEl.prepend(d); }, 7000); })();
(function(){ const btn=document.getElementById('hintBtn'); if(!btn) return; btn.addEventListener('click',()=>{ const tab=document.querySelector('.tab.active')?.dataset.tab; if(tab==='cipher') radioHint('Hint: Adjust the shift, identify the image, and type its name.'); else if(tab==='doors') radioHint('Hint: Each door hides a digit. Complete the mini‑games and enter the digits.'); else if(tab==='colorcode') radioHint('Hint: Rotate the rings to form a familiar navigation phrase.'); else radioHint('Open a station to get a contextual hint.'); }); })();

// Boot stations
window.addEventListener('DOMContentLoaded', ()=>{
  window.initCipherDesk?.();
  window.initDoorsHall?.(document.getElementById('doorsHost'));
});
