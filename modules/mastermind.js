(function(){
  const SYMBOLS = ['◆','●','■','▲','★','✚'];
  const SLOTS = 4; const TRIES = 8;

  function randCode(){
    return Array.from({length:SLOTS}, ()=>Math.floor(Math.random()*SYMBOLS.length));
  }

  function score(guess, code){
    let hits=0, near=0;
    const usedC = Array(SLOTS).fill(false);
    const usedG = Array(SLOTS).fill(false);
    for(let i=0;i<SLOTS;i++) if(guess[i]===code[i]){hits++; usedC[i]=usedG[i]=true;}
    for(let i=0;i<SLOTS;i++) if(!usedG[i]){
      for(let j=0;j<SLOTS;j++) if(!usedC[j] && guess[i]===code[j]){near++; usedC[j]=true; break;}
    }
    return {hits, near};
  }

  window.initMastermind = function(){
    const root = document.getElementById('mastermind');
    const status = document.getElementById('mmStatus');

    const code = randCode();
    // console.log('Secret', code);
    let currentRow=0;

    function render(){
      root.innerHTML='';
      for(let r=0;r<TRIES;r++){
        const row = document.createElement('div'); row.className='mm-row';
        const guess = guesses[r] || Array(SLOTS).fill(null);
        const slots = [];
        for(let s=0;s<SLOTS;s++){
          const b = document.createElement('button'); b.className='mm-slot';
          b.dataset.r=r; b.dataset.s=s;
          const val = guess[s];
          b.textContent = val==null ? '?' : SYMBOLS[val];
          if(r===currentRow) b.addEventListener('click', ()=>{
            const cur = guesses[r] || Array(SLOTS).fill(null);
            cur[s] = cur[s]==null ? 0 : (cur[s]+1)%SYMBOLS.length;
            guesses[r]=cur; render();
          });
          row.appendChild(b); slots.push(b);
        }
        const fb = document.createElement('div'); fb.className='mm-feedback';
        const res = results[r];
        if(res){
          for(let i=0;i<res.hits;i++){ const p=document.createElement('span'); p.className='peg peg-hit'; fb.appendChild(p);} 
          for(let i=0;i<res.near;i++){ const p=document.createElement('span'); p.className='peg peg-near'; fb.appendChild(p);} 
        }
        row.appendChild(fb);

        const action = document.createElement('button'); action.textContent = r===currentRow? 'Check' : '—';
        if(r===currentRow){ action.addEventListener('click', ()=>{
          const g = guesses[r]; if(!g || g.some(v=>v==null)){status.textContent='Fill all slots'; return;}
          const sc = score(g, code); results[r]=sc; render();
          if(sc.hits===SLOTS){ status.textContent='Cracked!'; status.style.color='var(--ok)'; }
          else if(r===TRIES-1){ status.textContent='Out of tries. Code was '+code.map(i=>SYMBOLS[i]).join(''); status.style.color='var(--warn)'; }
          else { currentRow++; status.textContent=''; }
        }); }
        row.appendChild(action);

        root.appendChild(row);
      }
    }

    const guesses = []; const results = [];
    render();
  }
})();
