var casesData = [ { id: 'sapphire', title: 'Case: The Sapphire Heist', status: 'open' } ];
function renderCases(){ var ul=document.getElementById('case-list'); ul.innerHTML=''; casesData.forEach(function(c){ var li=document.createElement('li'); li.className='case open'; var btn=document.createElement('button'); btn.textContent='Open: '+c.title; btn.addEventListener('click',function(){openCase(c)}); li.appendChild(btn); ul.appendChild(li); }); }
function openCase(c){ localStorage.setItem('qc_open_case_id',c.id); localStorage.setItem('qc_open_case_title',c.title); document.getElementById('current-case-title').textContent=c.title; }
function restoreOpenCase(){ var s=localStorage.getItem('qc_open_case_title'); if (s) document.getElementById('current-case-title').textContent=s; else { var o=casesData[0]; if (o) openCase(o); } }
var feedUl=document.getElementById('radio-feed'); var ticker=document.getElementById('radio-ticker'); var initialRadio=['Dispatch: Cipher channel opened.','HQ: Logic worksheet delivered.','Field: Network nodes are live.','Lab: Pattern device calibrated.'];
function addRadioMessage(text){ var li=document.createElement('li'); li.className='radio-msg'; var ts=new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}); li.innerHTML='<span class="radio-time">'+ts+'</span><span class="radio-text">'+text+'</span>'; feedUl.appendChild(li); }
initialRadio.forEach(addRadioMessage);
var scrollPaused=false; var SPEED=0.6; (function loop(){ if(!scrollPaused){ ticker.scrollTop+=SPEED; if (ticker.scrollTop+ticker.clientHeight>=ticker.scrollHeight) ticker.scrollTop=0; } requestAnimationFrame(loop); })();
document.getElementById('pause-scroll').addEventListener('click',function(ev){ scrollPaused=!scrollPaused; ev.target.setAttribute('aria-pressed',String(scrollPaused)); ev.target.textContent=scrollPaused?'Resume':'Pause'; });
document.getElementById('push-message').addEventListener('click',function(){ addRadioMessage('Manual: Investigator note added.'); });
var leftPanel=document.getElementById('sidebar-left'); var rightPanel=document.getElementById('sidebar-right'); var tLeft=document.getElementById('toggle-left'); var tRight=document.getElementById('toggle-right');
function togglePanel(panel,btn){ var v=panel.style.display!=='none'; panel.style.display=v?'none':'block'; btn.setAttribute('aria-expanded',String(!v)); }
if(tLeft) tLeft.addEventListener('click',function(){togglePanel(leftPanel,tLeft)}); if(tRight) tRight.addEventListener('click',function(){togglePanel(rightPanel,tRight)});
function ensureDesktop(){ var isMobile=matchMedia('(max-width: 780px)').matches; leftPanel.style.display=isMobile?'none':'block'; rightPanel.style.display=isMobile?'none':'block'; if(tLeft) tLeft.setAttribute('aria-expanded','false'); if(tRight) tRight.setAttribute('aria-expanded','false'); }
addEventListener('resize', ensureDesktop); ensureDesktop();
renderCases(); restoreOpenCase(); QC.badge('badge'); QC.chips();