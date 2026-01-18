(function(){
  window.addEventListener('DOMContentLoaded', ()=>{
    const btn = document.getElementById('colorCheck');
    const status = document.getElementById('colorStatus');

    btn.addEventListener('click', ()=>{
      const v0 = document.querySelector('input[name="c0"]:checked')?.value || '';
      const v1 = document.querySelector('input[name="c1"]:checked')?.value || '';
      const v2 = document.querySelector('input[name="c2"]:checked')?.value || '';
      const phrase = [v0,v1,v2].join(' ').trim();
      if(phrase.toUpperCase()==='THE WORLD MAP'){
        status.textContent='Correct.'; status.style.color='var(--ok)';
        const st = JSON.parse(localStorage.getItem('qcpd.case1')||'{}'); st.colorcode=true; localStorage.setItem('qcpd.case1', JSON.stringify(st));
        document.querySelector('.tab[data-tab="findings"]').classList.remove('disabled');
        radioHint('Atlas Cards solved. Findings unlocked.');
      } else {
        status.textContent='Not quite. Pick the words to form a common navigation item.'; status.style.color='var(--warn)';
      }
    });
  });
})();
