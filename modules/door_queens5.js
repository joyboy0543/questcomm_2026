(function(){
  function init(host,onSolved){
    host.innerHTML='';
    const wrap=document.createElement('div'); wrap.className='q-wrap';
    const title=document.createElement('div'); title.innerHTML='<strong>Queens Protocol</strong> — Place one queen per row. Queens must not attack each other (no shared columns or diagonals).';
    const grid=document.createElement('div'); grid.className='q-grid';
    const tools=document.createElement('div'); tools.className='q-tools';
    const btnReset=document.createElement('button'); btnReset.textContent='Reset';
    const btnCheck=document.createElement('button'); btnCheck.textContent='Check';
    const status=document.createElement('div'); status.className='q-status';
    tools.append(btnReset,btnCheck);
    wrap.append(title,grid,tools,status); host.appendChild(wrap);

    const N=5; const ICON='assets/queen.svg';
    const blocked=[[0,1],[2,3]]; // gentle constraints to force uniqueness
    let queens=Array(N).fill(-1); // queens[r]=c or -1

    function isBlocked(r,c){ return blocked.some(([rr,cc])=> rr===r && cc===c); }

    function cell(r,c){ const d=document.createElement('button'); d.className='q-cell'+(isBlocked(r,c)?' blocked':''); d.setAttribute('aria-label','board cell'); d.addEventListener('click',()=>place(r,c,d)); return d; }

    function place(r,c,el){ if(isBlocked(r,c)) return; if(queens[r]===c){ queens[r]=-1; render(); return; } queens[r]=c; render(); autoStatus(); }

    function attacked(r,c){ for(let rr=0; rr<N; rr++){ const cc=queens[rr]; if(cc===-1) continue; if(rr===r && cc===c) continue; if(cc===c) return true; if(Math.abs(rr-r)===Math.abs(cc-c)) return true; } return false; }

    function render(){ grid.innerHTML=''; for(let r=0;r<N;r++){ for(let c=0;c<N;c++){ const d=cell(r,c); if(queens[r]===c){ const img=document.createElement('img'); img.src=ICON; img.alt='Q'; d.appendChild(img); } if(attacked(r,c) && queens[r]===c){ d.classList.add('attacked'); } grid.appendChild(d); } } }

    function solved(){ // one queen per row, all placed, no column/diag conflicts
      for(let r=0;r<N;r++) if(queens[r]===-1) return false;
      // columns unique
      const cols=new Set(queens); if(cols.size!==N) return false;
      // diagonals
      for(let r1=0;r1<N;r1++) for(let r2=r1+1;r2<N;r2++){ if(Math.abs(queens[r1]-queens[r2])===Math.abs(r1-r2)) return false; }
      return true;
    }

    function autoStatus(){ if(solved()){ status.style.color='var(--ok)'; status.textContent='Threats neutralized — Digit: 7'; onSolved?.(); } else { status.style.color=''; status.textContent=''; } }

    btnReset.addEventListener('click',()=>{ queens=Array(N).fill(-1); render(); status.textContent=''; });
    btnCheck.addEventListener('click',autoStatus);

    render();
  }
  window.initDoorQueens5=init;
})();
