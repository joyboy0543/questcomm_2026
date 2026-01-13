
(async function(){
  // Load external puzzles markup
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

  // Tab behavior
  const tabs = Array.from(document.querySelectorAll('.tab'));
  function activate(i){
    tabs.forEach((t,idx)=>{ t.classList.toggle('active', idx===i); t.setAttribute('aria-selected', String(idx===i)); });
    for (let k=1;k<=6;k++){ const el = document.getElementById('tab-'+k); el.hidden = (k-1!==i); }
  }
  tabs.forEach((t,idx)=> t.addEventListener('click',()=>{ if (!t.disabled) activate(idx); }) );
  activate(0);
})();
