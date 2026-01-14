
(async function(){
  try { const res = await fetch('puzzles/puzzles_tabs.html'); const html = await res.text(); const tmp = document.createElement('div'); tmp.innerHTML = html; for (let i=1;i<=6;i++){ const node = tmp.querySelector('#p'+i); const panel = document.getElementById('tab-'+i); if (node && panel) panel.appendChild(node); } } catch(e){ document.getElementById('tab-1').innerHTML = '<div class="puzzle-card">Unable to load puzzle content.</div>'; }

  const tabs = Array.from(document.querySelectorAll('.tab'));
  function setDisabled(idx, disabled){ tabs[idx].disabled = !!disabled; }
  function activate(i){ tabs.forEach((t,idx)=>{ t.classList.toggle('active', idx===i); t.setAttribute('aria-selected', String(idx===i)); }); for (let k=1;k<=6;k++){ const el = document.getElementById('tab-'+k); el.hidden = (k-1!==i); } }
  tabs.forEach((t,idx)=> t.addEventListener('click',()=>{ if (!t.disabled) activate(idx); }) ); activate(0);

  const ok2 = localStorage.getItem('qc_p2_ok')==='1';
  const ok3 = localStorage.getItem('qc_p3_ok')==='1';
  const ok4 = localStorage.getItem('qc_p4_ok')==='1';
  const ok5 = localStorage.getItem('qc_p5_ok')==='1';
  const ge2 = localStorage.getItem('qc_snake_ge2')==='1';

  setDisabled(1, false); setDisabled(2, !ok2); setDisabled(3, !(ok2 && ok3)); setDisabled(4, !(ok2 && ok3 && ok4)); setDisabled(5, !(ok2 && ok3 && ok4 && ok5));
  function finalLocked(){ const all = ok2 && ok3 && ok4 && ok5; return !(all || ge2 || localStorage.getItem('qc_p6_unlocked')==='1'); }
  tabs[5].disabled = finalLocked();

  window.QCPDUnlockNext = function(current){ const i = current-1; if (tabs[i+1]) { tabs[i+1].disabled=false; tabs[i+1].classList.add('unlocked'); setTimeout(()=> tabs[i+1].classList.remove('unlocked'), 1200); } QC.chips(); };
  window.QCPDUnlockFinal = function(){ tabs[5].disabled=false; tabs[5].classList.add('unlocked'); setTimeout(()=> tabs[5].classList.remove('unlocked'), 1200); QC.chips(); };
})();
