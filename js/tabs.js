
(function(){
  // Load puzzles markup
  fetch('puzzles/puzzles_tabs.html').then(function(r){return r.text()}).then(function(html){
    var tmp=document.createElement('div'); tmp.innerHTML=html;
    for (var i=1;i<=6;i++){ var node = tmp.querySelector('#p'+i); var panel = document.getElementById('tab-'+i); if (node && panel) panel.appendChild(node); }
    initTabs(); initLocks(); initClearanceState();
  }).catch(function(){ document.getElementById('tab-1').innerHTML='<div class="puzzle-card">Unable to load puzzle content.</div>'; });

  var tabs = Array.from(document.querySelectorAll('.tab'));
  function activate(i){ tabs.forEach(function(t,idx){ t.classList.toggle('active', idx===i); t.setAttribute('aria-selected', String(idx===i)); }); for (var k=1;k<=6;k++){ var el=document.getElementById('tab-'+k); el.hidden = (k-1!==i); } }
  function initTabs(){ tabs.forEach(function(t,idx){ t.addEventListener('click', function(){ if (!t.disabled) activate(idx); }); }); activate(0); }

  function refreshLocks(){
    var admin = localStorage.getItem('qc_admin')==='1';
    var ok2 = localStorage.getItem('qc_p2_ok')==='1'; // Cipher
    var ok3 = localStorage.getItem('qc_p3_ok')==='1'; // Logic
    var ok4 = localStorage.getItem('qc_p4_ok')==='1'; // Network
    var ok5 = localStorage.getItem('qc_p5_ok')==='1'; // Pattern
    // Tab order: 1 Briefing, 2 Clearance, 3 Cipher, 4 Logic, 5 Network, 6 Pattern
    tabs[0].disabled=false; // Briefing
    tabs[1].disabled= !(ok2 && ok3 && ok4 && ok5) && !admin; // Clearance
    tabs[2].disabled=false; // Cipher is open
    tabs[3].disabled= !ok2 && !admin; // Logic depends on Cipher
    tabs[4].disabled= !(ok2 && ok3) && !admin; // Network depends on Cipher+Logic
    tabs[5].disabled= !(ok2 && ok3 && ok4) && !admin; // Pattern last
  }
  function initLocks(){ refreshLocks(); }

  window.QCPDUnlockNext = function(current){ refreshLocks(); QC.chips(); };
  window.QCPDUnlockFinal = function(){ localStorage.setItem('qc_p6_unlocked','1'); refreshLocks(); QC.chips(); };

  function initClearanceState(){ var admin = localStorage.getItem('qc_admin')==='1'; var all = (localStorage.getItem('qc_p2_ok')==='1' && localStorage.getItem('qc_p3_ok')==='1' && localStorage.getItem('qc_p4_ok')==='1' && localStorage.getItem('qc_p5_ok')==='1') || admin; var p6Locked=document.getElementById('p6locked'); var p6Open=document.getElementById('p6open'); if(p6Locked && p6Open){ if(all){ p6Locked.style.display='none'; p6Open.classList.remove('hidden'); localStorage.setItem('qc_p6_unlocked','1'); } }
  }
})();
