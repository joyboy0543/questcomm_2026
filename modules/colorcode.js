(function(){
  const options = [
    ['A','THE','ON','IN'],
    ['SEA','WORLD','GLOBE','EARTH'],
    ['ROAD','CHART','MAP','ATLAS']
  ];
  const target = ['THE','WORLD','MAP'];

  window.addEventListener('DOMContentLoaded', ()=>{
    const rings = document.querySelectorAll('.ring'); if(!rings.length) return;
    const status = document.getElementById('colorStatus');
    const idxs = [0,0,0]; // current index per ring

    rings.forEach((ring,i)=>{
      const val = ring.querySelector('.val');
      function show(){ val.textContent = options[i][idxs[i]]; }
      ring.querySelector('.prev').addEventListener('click', ()=>{ idxs[i] = (idxs[i]-1+options[i].length)%options[i].length; show(); check(); });
      ring.querySelector('.next').addEventListener('click', ()=>{ idxs[i] = (idxs[i]+1)%options[i].length; show(); check(); });
      show();
    });

    function check(){
      const phrase = [options[0][idxs[0]], options[1][idxs[1]], options[2][idxs[2]]];
      if(phrase.join(' ')===target.join(' ')){
        status.textContent='Correct.'; status.style.color='var(--ok)';
        const st = JSON.parse(localStorage.getItem('qcpd.case1')||'{}'); st.colorcode=true; localStorage.setItem('qcpd.case1', JSON.stringify(st));
        document.querySelector('.tab[data-tab="findings"]').classList.remove('disabled');
        radioHint('Cipher Rings solved. Findings unlocked.');
      } else {
        status.textContent='';
      }
    }
  });
})();
