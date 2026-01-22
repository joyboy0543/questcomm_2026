(function(){
  function init(host,onSolved){
    host.innerHTML='';
    const wrap=document.createElement('div'); wrap.className='latin-wrap';
    const title=document.createElement('div'); title.innerHTML='<strong>Latin Lock</strong> — Complete the 4×4 grid so each row/column has 1–4 once.';
    const grid=document.createElement('div'); grid.className='latin-grid';
    const status=document.createElement('div'); status.style.minHeight='1.2rem';

    // 0 means empty, others are givens (locked)
    // This puzzle is uniquely solvable and modest in difficulty
    const givens=[
      [0,2,0,0],
      [0,0,3,0],
      [3,0,0,0],
      [0,0,0,2]
    ];
    const cells=[];

    function mk(r,c){ const v=givens[r][c]; const b=document.createElement('button'); b.className='latin-cell';
      if(v){ b.textContent=v; b.classList.add('given'); b.disabled=true; b.dataset.val=v; }
      else { b.textContent=''; b.dataset.val='0'; b.addEventListener('click',()=>{ let n=parseInt(b.dataset.val||'0',10); n=(n%4)+1; b.dataset.val=String(n); b.textContent=n===0?'':String(n); }); }
      grid.appendChild(b); cells.push({r,c,el:b}); }

    for(let r=0;r<4;r++) for(let c=0;c<4;c++) mk(r,c);

    const tools=document.createElement('div'); tools.style.display='flex'; tools.style.gap='8px';
    const btnCheck=document.createElement('button'); btnCheck.textContent='Check';
    const btnClear=document.createElement('button'); btnClear.textContent='Clear blanks';
    tools.append(btnCheck,btnClear);

    wrap.append(title,grid,tools,status); host.appendChild(wrap);

    btnClear.addEventListener('click',()=>{ cells.forEach(t=>{ if(!givens[t.r][t.c]){ t.el.dataset.val='0'; t.el.textContent=''; } }); status.textContent=''; status.style.color=''; });

    btnCheck.addEventListener('click',()=>{
      const board=[0,1,2,3].map(r=>[0,1,2,3].map(c=>parseInt(cells[r*4+c].el.dataset.val||'0',10)));
      // quick checks
      if(board.some(row=>row.some(v=>v<1||v>4))){ status.style.color='var(--warn)'; status.textContent='Fill all cells with 1–4.'; return; }
      const okRow=board.every(row=> new Set(row).size===4);
      const okCol=[0,1,2,3].every(c=> new Set(board.map(r=>board[r][c])).size===4);
      if(okRow && okCol){ status.style.color='var(--ok)'; status.textContent='Latin square complete — Digit: 6'; onSolved?.(); }
      else { status.style.color='var(--warn)'; status.textContent='Rows/columns must contain 1–4 exactly once.'; }
    });
  }
  window.initDoorLatinLock=init;
})();
