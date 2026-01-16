(function(){
  window.initSimon = function(){
    const pads = [...document.querySelectorAll('#simon .pad')];
    const start = document.getElementById('smStart');
    const status = document.getElementById('smStatus');
    const goal = 8;

    let seq = [];
    let step = 0;
    let locked = false;

    function flash(i, t=350){
      return new Promise(res=>{
        pads[i].classList.add('active');
        setTimeout(()=>{ pads[i].classList.remove('active'); setTimeout(res, 100); }, t);
      });
    }

    async function play(){
      locked=true;
      for(const i of seq){ await flash(i); }
      locked=false; step=0; status.textContent = `Level ${seq.length}`;
    }

    function next(){
      seq.push(Math.floor(Math.random()*4));
      play();
    }

    pads.forEach((p,i)=> p.addEventListener('click', ()=>{
      if(locked) return; flash(i,150);
      if(i===seq[step]){ step++; if(step===seq.length){ if(seq.length>=goal){ status.textContent='Cleared!'; status.style.color='var(--ok)'; locked=true; } else { next(); } } }
      else { status.textContent='Wrong. Try again'; status.style.color='var(--warn)'; seq=[]; }
    }));

    start.addEventListener('click', ()=>{ seq=[]; status.style.color=''; next(); });
  }
})();
