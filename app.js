// Personalize greeting
(function(){
  const agent = JSON.parse(localStorage.getItem('qcpd.agent')||'{}');
  const hello = document.getElementById('hello');
  if(hello){ hello.textContent = agent.name? `Welcome, Agent ${agent.name}.` : 'Welcome, Agent.' }
})();

// Database case switching
(function(){
  const cases = document.querySelectorAll('.case');
  const caseMsg = document.getElementById('caseMsg');

  cases.forEach(c => c.addEventListener('click', () => {
    if(c.classList.contains('locked')){
      const type = c.dataset.case;
      caseMsg.style.display='block';
      document.getElementById('tabs').style.display='none';
      [...document.querySelectorAll('.section')].forEach(s=>s.classList.remove('active'));
      if(type==='solved'){
        caseMsg.textContent = 'This case has been solved and the evidence has been moved to the evidence handling department, for further access please contact the corresponding incharge person.';
      } else if(type==='ongoing'){
        caseMsg.textContent = 'This case is ongoing and a different team is working on it. To work on this case, obtain access by contacting corresponding incharge person.';
      } else {
        caseMsg.textContent = 'This case is locked.';
      }
      cases.forEach(x=>x.classList.remove('active'));
      c.classList.add('active');
      return;
    }
    // Active case
    caseMsg.style.display='none';
    document.getElementById('tabs').style.display='flex';
    document.querySelector('.section.active')?.classList.remove('active');
    document.getElementById('briefing').classList.add('active');
    cases.forEach(x=>x.classList.remove('active'));
    c.classList.add('active');
  }));
})();

// Tabs + gating state
(function(){
  const tabs = [...document.querySelectorAll('.tab')];
  const sections = [...document.querySelectorAll('.section')];
  const state = JSON.parse(localStorage.getItem('qcpd.case1')||'{}');

  function setEnabled(id, enabled){
    const t = tabs.find(x=>x.dataset.tab===id);
    if(!t) return; t.classList.toggle('disabled', !enabled);
  }
  function activate(id){
    tabs.forEach(t=>t.classList.toggle('active', t.dataset.tab===id));
    sections.forEach(s=>s.classList.toggle('active', s.id===id));
  }
  tabs.forEach(t => t.addEventListener('click', ()=>{
    if(t.classList.contains('disabled')) return; activate(t.dataset.tab);
  }));

  // Gate logic: briefing must be acknowledged
  document.getElementById('agreeBtn').addEventListener('click', ()=>{
    state.briefing=true; localStorage.setItem('qcpd.case1', JSON.stringify(state));
    setEnabled('cipher', true); activate('cipher');
    radioHint('Agreement logged. Cipher Terminal unlocked.');
  });

  // Reflect stored progress on load
  if(state.briefing) setEnabled('cipher', true);
  if(state.cipher) setEnabled('zipgrid', true);
  if(state.zipgrid) setEnabled('colorcode', true);
  if(state.colorcode) setEnabled('findings', true);

  // Auto-activate deepest reached
  if(state.colorcode) activate('findings');
  else if(state.zipgrid) activate('colorcode');
  else if(state.cipher) activate('zipgrid');
  else activate('briefing');
})();

// Radio sections
const radioHintsEl = document.getElementById('radioHints');
const radioChatterEl = document.getElementById('radioChatter');
function radioHint(msg){
  if(!radioHintsEl) return; const d=document.createElement('div'); d.className='msg'; d.textContent = msg; radioHintsEl.prepend(d);
}
(function(){
  const lines = [
    'Patrol 12: Routine check completed on block C.',
    'Unit 7: In pursuit, requesting traffic cams.',
    'Dispatch: Reported break-in at Dock 3; team assigned.',
    'Ops: Drone sweep scheduled in sector north.',
    'Forensics: Lab queue clear for two samples.'
  ];
  let i=0; setInterval(()=>{
    const d=document.createElement('div'); d.className='msg'; d.textContent=new Date().toLocaleTimeString()+ ' — '+lines[i++%lines.length]; radioChatterEl.prepend(d);
  }, 7000);
})();

// Hint button for current puzzle
(function(){
  const btn = document.getElementById('hintBtn');
  if(!btn) return;
  btn.addEventListener('click', ()=>{
    const activeTab = document.querySelector('.tab.active')?.dataset.tab;
    if(activeTab==='cipher'){
      radioHint('Hint: Adjust the shift, identify the image, and type its name.');
    } else if(activeTab==='zipgrid'){
      radioHint('Hint: Start at 1 and tap each number once. When done, note the middle column digits.');
    } else if(activeTab==='colorcode'){
      radioHint('Hint: Think in terms of geography: pick words that make a common item used to navigate.');
    } else {
      radioHint('No puzzle open. Go to a tab to request a contextual hint.');
    }
  });
})();
