(function(){
  function load(){ fetch('puzzles/puzzles_tabs.html').then(function(r){return r.text()}).then(function(html){ var tmp=document.createElement('div'); tmp.innerHTML=html; for(var i=1;i<=6;i++){ var node=tmp.querySelector('#p'+i); var panel=document.getElementById('tab-'+i); if(node&&panel) panel.appendChild(node); } init(); }).catch(function(){ document.getElementById('tab-1').innerHTML='<div class="puzzle-card">Unable to load puzzle content.</div>'; init(); }); }
  var tabs;
  function setDisabled(idx, disabled){ tabs[idx].disabled=!!disabled; }
  function activate(i){ tabs.forEach(function(t,idx){ t.classList.toggle('active', idx===i); t.setAttribute('aria-selected', String(idx===i)); }); for (var k=1;k<=6;k++){ var el=document.getElementById('tab-'+k); el.hidden=(k-1!==i); } }
  function refreshLocks(){ var ok2=localStorage.getItem('qc_p2_ok')==='1'; var ok3=localStorage.getItem('qc_p3_ok')==='1'; var ok4=localStorage.getItem('qc_p4_ok')==='1'; var ok5=localStorage.getItem('qc_p5_ok')==='1'; var final=localStorage.getItem('qc_p6_unlocked')==='1'; setDisabled(1,false); setDisabled(2,!ok2); setDisabled(3,!(ok2&&ok3)); setDisabled(4,!(ok2&&ok3&&ok4)); setDisabled(5,!(ok2&&ok3&&ok4&&ok5)); tabs[5].disabled = !(ok2&&ok3&&ok4&&ok5) && !final; }
  function init(){ tabs=Array.from(document.querySelectorAll('.tab')); tabs.forEach(function(t,idx){ t.addEventListener('click',function(){ if(!t.disabled) activate(idx); }); }); activate(0); refreshLocks(); }
  window.QCPDUnlockNext=function(current){ var i=current-1; if(tabs[i+1]){ tabs[i+1].disabled=false; tabs[i+1].classList.add('unlocked'); setTimeout(function(){ tabs[i+1].classList.remove('unlocked'); },1200); } refreshLocks(); QC.chips(); };
  window.QCPDUnlockFinal=function(){ tabs[5].disabled=false; tabs[5].classList.add('unlocked'); setTimeout(function(){ tabs[5].classList.remove('unlocked'); },1200); localStorage.setItem('qc_p6_unlocked','1'); refreshLocks(); QC.chips(); };
  load();
})();