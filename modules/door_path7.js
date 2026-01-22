(function(){
  function init(host,onSolved){
    host.innerHTML='';
    const wrap=document.createElement('div'); wrap.className='path-wrap';
    const title=document.createElement('div'); title.innerHTML='<strong>Seven Steps</strong> — Follow arrows; land on the flag in exactly 7 moves.';
    const gridEl=document.createElement('div'); gridEl.className='path-grid';
    const status=document.createElement('div'); status.className='path-status';
    const tools=document.createElement('div'); tools.className='toolrow';
    const btnStep=document.createElement('button'); btnStep.textContent='Step';
    const btnReset=document.createElement('button'); btnReset.textContent='Reset';
    tools.append(btnStep,btnReset);
    wrap.append(title,gridEl,tools,status); host.appendChild(wrap);

    // 4x4 arrow map; Start at (0,0); Exit at (3,3)
    const map=[
      ['E','S','E','S'],
      ['N','E','S','W'],
      ['E','E','N','W'],
      ['N','E','E','X']
    ];
    let pos={r:0,c:0}; let steps=0;

    function render(){ gridEl.innerHTML=''; for(let r=0;r<4;r++) for(let c=0;c<4;c++){ const cell=document.createElement('div'); cell.className='path-cell';
        const ch=map[r][c];
        cell.textContent= ch==='X' ? '⛳' : ({N:'↑',S:'↓',E:'→',W:'←'}[ch]);
        if(r===0&&c===0) cell.classList.add('start');
        if(ch==='X') cell.classList.add('exit');
        if(r===pos.r&&c===pos.c) cell.style.outline='2px solid var(--primary)';
        gridEl.appendChild(cell); }
      status.textContent=`Steps: ${steps}/7`;
    }

    function doStep(){ const dir=map[pos.r][pos.c]; if(dir==='X') return; if(dir==='N') pos.r=Math.max(0,pos.r-1); else if(dir==='S') pos.r=Math.min(3,pos.r+1); else if(dir==='E') pos.c=Math.min(3,pos.c+1); else if(dir==='W') pos.c=Math.max(0,pos.c-1); steps++; render(); check(); }
    function reset(){ pos={r:0,c:0}; steps=0; status.style.color=''; render(); }
    function check(){ if(steps>7){ status.style.color='var(--warn)'; status.textContent='Too many moves. Resetting.'; setTimeout(reset,900); return; }
      if(steps===7){ if(map[pos.r][pos.c]==='X'){ status.style.color='var(--ok)'; status.textContent='Exit reached in 7!'; onSolved?.(); } else { status.style.color='var(--warn)'; status.textContent='Not on the exit at 7. Resetting.'; setTimeout(reset,900); } } }

    btnStep.addEventListener('click', doStep);
    btnReset.addEventListener('click', reset);
    // also allow clicking grid to step for convenience
    gridEl.addEventListener('click', doStep);

    render();
  }
  window.initDoorPath7=init;
})();
