(function(){
  function init(host,onSolved){
    host.innerHTML='';
    const wrap=document.createElement('div'); wrap.className='path-wrap';
    const title=document.createElement('div'); title.innerHTML='<strong>Seven Steps</strong> — Reach the exit in exactly 7 moves.';
    const gridEl=document.createElement('div'); gridEl.className='path-grid';
    const status=document.createElement('div'); status.className='path-status';
    wrap.append(title,gridEl,status); host.appendChild(wrap);

    const map=[['E','S','E','S'],['N','E','S','W'],['E','E','N','W'],['N','E','E','X']];
    let pos={r:0,c:0}; let steps=0;
    function render(){ gridEl.innerHTML=''; for(let r=0;r<4;r++) for(let c=0;c<4;c++){ const cell=document.createElement('div'); cell.className='path-cell'; if(map[r][c]==='X'){ cell.classList.add('exit'); cell.textContent='⛳'; } else { cell.textContent={N:'↑',S:'↓',E:'→',W:'←'}[map[r][c]]; } if(r===pos.r&&c===pos.c){ cell.style.outline='2px solid var(--primary)'; } gridEl.appendChild(cell);} status.textContent=`Steps: ${steps}/7`; }
    function move(){ const dir=map[pos.r][pos.c]; if(dir==='X') return; if(dir==='N') pos.r=Math.max(0,pos.r-1); else if(dir==='S') pos.r=Math.min(3,pos.r+1); else if(dir==='E') pos.c=Math.min(3,pos.c+1); else if(dir==='W') pos.c=Math.max(0,pos.c-1); steps++; render(); check(); }
    function reset(msg){ status.style.color='var(--warn)'; status.textContent=msg; setTimeout(()=>{ pos={r:0,c:0}; steps=0; status.style.color=''; render(); },800); }
    function check(){ if(steps>7){ reset('Too many moves. Resetting.'); return; } if(steps===7){ if(map[pos.r][pos.c]==='X'){ status.style.color='var(--ok)'; status.textContent='Exit reached in 7!'; onSolved?.(); } else { reset('Not on the exit at 7. Resetting.'); } } }
    gridEl.addEventListener('click', move);
    render();
  }
  window.initDoorPath7=init;
})();
