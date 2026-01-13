
(async function(){
  // Load external puzzles markup to keep your original structure
  try {
    const res = await fetch('puzzles/puzzles_tabs.html');
    const html = await res.text();
    const tmp = document.createElement('div'); tmp.innerHTML = html;
    const p1 = tmp.querySelector('#p1'); const p2 = tmp.querySelector('#p2'); const p3 = tmp.querySelector('#p3');
    if (p1) document.getElementById('tab-1').appendChild(p1);
    if (p2) document.getElementById('tab-2').appendChild(p2);
    if (p3) document.getElementById('tab-3').appendChild(p3);
  } catch (e) {
    document.getElementById('tab-1').innerHTML = '<div class="puzzle-card">Unable to load tab content. Ensure puzzles/puzzles_tabs.html exists.</div>';
  }

  // Tab switching
  const tabs = Array.from(document.querySelectorAll('.tab'));
  function activate(i){
    tabs.forEach((t,idx)=>{ t.classList.toggle('active', idx===i); t.setAttribute('aria-selected', String(idx===i)); });
    ['tab-1','tab-2','tab-3'].forEach((id,idx)=>{ const el=document.getElementById(id); if (el) el.hidden = (idx!==i); });
  }
  tabs.forEach((t,idx)=> t.addEventListener('click', ()=> activate(idx)) );
  activate(0);
})();
