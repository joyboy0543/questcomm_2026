
(async function(){
  // Load puzzles markup
  try {
    const res = await fetch('puzzles/puzzles_tabs.html');
    const html = await res.text();
    const tmp = document.createElement('div'); tmp.innerHTML = html;
    for (let i=1;i<=6;i++){
      const node = tmp.querySelector('#p'+i);
      const panel = document.getElementById('tab-'+i);
      if (node && panel) panel.appendChild(node);
    }
  } catch(e){
    document.getElementById('tab-1').innerHTML = '<div class="puzzle-card">Unable to load puzzle content.</div>';
  }

  const tabs = Array.from(document.querySelectorAll('.tab'));
  function setDisabled(idx, disabled){ tabs[idx].disabled = !!disabled; }
  function activate(i){
    tabs.forEach((t,idx)=>{ t.classList.toggle('active', idx===i); t.setAttribute('aria-selected', String(idx===i)); });
    for (let k=1;k<=6;k++){ const el = document.getElementById('tab-'+k); el.hidden = (k-1!==i); }
  }
  tabs.forEach((t,idx)=> t.addEventListener('click',()=>{ if (!t.disabled) activate(idx); }) );
  activate(0);

  // Restore gating from localStorage
  const ok1 = localStorage.getItem('qc_p1_ok')==='1';
  const ok2 = localStorage.getItem('qc_p2_ok')==='1';
  const ok3 = localStorage.getItem('qc_p3_ok')==='1';
  const ok4 = localStorage.getItem('qc_p4_ok')==='1';
  const ok5 = localStorage.getItem('qc_p5_ok')==='1';
  const ge2 = localStorage.getItem('qc_snake_ge2')==='1';
  setDisabled(1, !ok1);
  setDisabled(2, !(ok1 && ok2));
  setDisabled(3, !(ok1 && ok2 && ok3));
  setDisabled(4, !(ok1 && ok2 && ok3 && ok4));
  setDisabled(5, !(ok1 && ok2 && ok3 && ok4 && ok5));
  setDisabled(5, !(ok1 && ok2 && ok3 && ok4 && ok5));
  setDisabled(5, !(ok1 && ok2 && ok3 && ok4 && ok5));
  setDisabled(5, !(ok1 && ok2 && ok3 && ok4 && ok5)); // ensure
  setDisabled(5, !(ok1 && ok2 && ok3 && ok4 && ok5));
  setDisabled(5, !(ok1 && ok2 && ok3 && ok4 && ok5));
  setDisabled(5, !(ok1 && ok2 && ok3 && ok4 && ok5));
  setDisabled(5, !(ok1 && ok2 && ok3 && ok4 && ok5));
  // Page 6 unlock
  setDisabled(5, !(ok1 && ok2 && ok3 && ok4 && ok5));
  tabs[5].disabled = notUnlocked();
  function notUnlocked(){
    const all = ok1 && ok2 && ok3 && ok4 && ok5;
    return !(all || ge2 || localStorage.getItem('qc_p6_unlocked')==='1');
  }

  // Expose unlock helper for puzzles_logic
  window.QCPDUnlockNext = function(current){
    const i = current - 1; // tab index
    if (tabs[i+1]) { tabs[i+1].disabled = false; }
  };
  window.QCPDUnlockFinal = function(){ tabs[5].disabled = false; };
})();
