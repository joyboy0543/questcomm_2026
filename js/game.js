
// Cases
const casesData = [
  { id: 'orion',  title: 'Case: Operation Orion',    status: 'locked' },
  { id: 'harbor', title: 'Case: Harbor Ghost',       status: 'locked' },
  { id: 'sapphire', title: 'Case: The Sapphire Heist', status: 'open' },
  { id: 'museum', title: 'Case: Museum Mirage',      status: 'locked' },
  { id: 'night',  title: 'Case: Night Parade',       status: 'locked' }
];
function renderCases(){
  const ul=document.getElementById('case-list'); ul.innerHTML='';
  casesData.forEach(c=>{
    const li=document.createElement('li'); li.className=`case ${c.status}`;
    if (c.status==='locked') {
      li.innerHTML=`<span>${c.title}</span><span class="lock" aria-label="Locked" title="Locked">🔒</span>`;
    } else {
      const btn=document.createElement('button'); btn.textContent=`Open: ${c.title}`; btn.addEventListener('click',()=>openCase(c));
      li.appendChild(btn);
    }
    ul.appendChild(li);
  });
}
function openCase(c){ localStorage.setItem('qc_open_case_id',c.id); localStorage.setItem('qc_open_case_title',c.title); document.getElementById('current-case-title').textContent=c.title; }
function restoreOpenCase(){ const s=localStorage.getItem('qc_open_case_title'); if (s) document.getElementById('current-case-title').textContent=s; else { const o=casesData.find(x=>x.status==='open'); if (o) openCase(o); } }

// Radio
const feedUl=document.getElementById('radio-feed');
const ticker=document.getElementById('radio-ticker');
const initialRadio=[
  'Dispatch: Unit Bravo, maintain perimeter at Dock 12.',
  'Analyst: Cipher fragment recovered—pattern suggests Vigenère.',
  'HQ: Witness reports a black duffel near crane B7.',
  'Forensics: Partial fingerprint lifted from locker 31.',
  'Patrol: CCTV shows movement at 22:15 near Shipyard Gate.'
];
function addRadioMessage(text){ const li=document.createElement('li'); li.className='radio-msg'; const ts=new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}); li.innerHTML=`<span class="radio-time">${ts}</span><span class="radio-text">${text}</span>`; feedUl.appendChild(li); }
initialRadio.forEach(addRadioMessage);
const PUBLISH_MS=5000; let msgId=1; setInterval(()=> addRadioMessage(`Auto: Status update #${msgId++} — monitoring continues.`), PUBLISH_MS);
let scrollPaused=false; const SPEED=0.6; (function loop(){ if(!scrollPaused){ ticker.scrollTop+=SPEED; if (ticker.scrollTop+ticker.clientHeight>=ticker.scrollHeight) ticker.scrollTop=0; } requestAnimationFrame(loop); })();
document.getElementById('pause-scroll').addEventListener('click',(ev)=>{ scrollPaused=!scrollPaused; ev.target.setAttribute('aria-pressed',String(scrollPaused)); ev.target.textContent=scrollPaused?'Resume':'Pause'; });
document.getElementById('push-message').addEventListener('click',()=> addRadioMessage('Manual: Investigator note added to the feed.'));
ticker.addEventListener('mouseenter',()=>scrollPaused=true); ticker.addEventListener('mouseleave',()=>scrollPaused=false);

// Mobile toggles
const leftPanel=document.getElementById('sidebar-left'); const rightPanel=document.getElementById('sidebar-right'); const tLeft=document.getElementById('toggle-left'); const tRight=document.getElementById('toggle-right');
function togglePanel(panel,btn){ const v=panel.style.display!=='none'; panel.style.display=v?'none':'block'; btn.setAttribute('aria-expanded',String(!v)); }
tLeft.addEventListener('click',()=>togglePanel(leftPanel,tLeft)); tRight.addEventListener('click',()=>togglePanel(rightPanel,tRight));
function ensureDesktop(){ const isMobile=matchMedia('(max-width: 780px)').matches; leftPanel.style.display=isMobile?'none':'block'; rightPanel.style.display=isMobile?'none':'block'; tLeft.setAttribute('aria-expanded','false'); tRight.setAttribute('aria-expanded','false'); }
addEventListener('resize', ensureDesktop); ensureDesktop();

// Init
renderCases(); restoreOpenCase(); QC.badge('badge');
