(function(){
  function init(host,onSolved){
    host.innerHTML='';
    const wrap=document.createElement('div'); wrap.className='latin-wrap';
    const title=document.createElement('div'); title.innerHTML='<strong>Latin Lock</strong> — Complete the 4×4 grid so each row/column has 1–4 once.';
    const grid=document.createElement('div'); grid.className='latin-grid';
    const status=document.createElement('div'); status.style.minHeight='1.2rem';

    const givens=[[0,2,0,0],[0,0,3,0],[3,0,0,0],[0,0,0,2]]; // 0 = blank
    const cells=[];

    function mk(r,c){ const v=givens[r][c]; const b=document.createElement('button'); b.className='latin-cell';
      if(v){ b.textContent=String(v); b.classList.add('given'); b.disabled=true; b.dataset.val=String(v); }
      else { b.dataset.val='0'; b.textContent=''; b.addEventListener('click',()=>{ let n=Number(b.dataset.val||'0'); n=(n%4)+1; b.dataset.val=String(n); b.textContent=String(n); }); }
      grid.appendChild(b); cells.push({r,c,el:b}); }
    for(let r=0;r<4;r++) for(let c=0;c<4;c++) mk(r,c);

    const tools=document.createElement('div'); tools.style.display='flex'; tools.style.gap='8px';
    const btnCheck=document.createElement('button'); btnCheck.textContent='Check';
    const btnClear=document.createElement('button'); btnClear.textContent='Clear blanks';
    tools.append(btnCheck,btnClear);

    wrap.append(title,grid,tools,status); host.appendChild(wrap);

    btnClear.addEventListener('click',()=>{ cells.forEach(t=>{ if(!givens[t.r][t.c]){ t.el.dataset.val='0'; t.el.textContent=''; } }); status.textContent=''; status.style.color=''; });

    function readBoard(){ return [0,1,2,3].map(r=>[0,1,2,3].map(c=> Number(cells[r*4+c].el.dataset.val||'0'))); }

    btnCheck.addEventListener('click',()=>{
      const B=readBoard();
      // must be 1..4 everywhere
      if(B.some(row=>row.some(v=>v<1||v>4))){ status.style.color='var(--warn)'; status.textContent='Fill all cells with 1–4.'; return; }
      const okRows=B.every(row=> new Set(row).size===4);
      const okCols=[0,1,2,3].every(c=> new Set([B[0][c],B[1][c],B[2][c],B[3][c]]).size===4);
      if(okRows && okCols){ status.style.color='var(--ok)'; status.textContent='Latin square complete — Digit: 6'; onSolved?.(); }
      else { status.style.color='var(--warn)'; status.textContent='Rows/columns must contain 1–4 exactly once.'; }
    });
  }
  window.initDoorLatinLock=init;
})();
