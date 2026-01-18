(function(){
  window.addEventListener('DOMContentLoaded', ()=>{
    const row = document.getElementById('colorRow'); if(!row) return;
    const input = document.getElementById('colorInput');
    const confirm = document.getElementById('colorConfirm');
    const status = document.getElementById('colorStatus');

    // Encode the phrase THE WORLD MAP using colors: gray, blue, green
    const legend = { '#7b8794':'THE', '#2ea8ff':'WORLD', '#06D6A0':'MAP' };
    const seq = ['#7b8794','#2ea8ff','#06D6A0'];
    seq.forEach(c=>{ const b=document.createElement('div'); b.style.width='48px'; b.style.height='48px'; b.style.borderRadius='8px'; b.style.border='1px solid #1c2d3a'; b.style.background=c; row.appendChild(b); });

    confirm.addEventListener('click', ()=>{
      const ans = input.value.trim().toLowerCase();
      if(ans==='the world map' || ans==='world map' || ans==='the map of the world'){
        status.textContent='Decoded.'; status.style.color='var(--ok)';
        const st = JSON.parse(localStorage.getItem('qcpd.case1')||'{}'); st.colorcode=true; localStorage.setItem('qcpd.case1', JSON.stringify(st));
        document.querySelector('.tab[data-tab="findings"]').classList.remove('disabled');
        radioHint('Color Code solved. Findings unlocked.');
      } else { status.textContent='Try again. Hint: each color is a word.'; status.style.color='var(--warn)'; }
    });
  });
})();
