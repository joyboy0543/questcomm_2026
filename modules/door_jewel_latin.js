(function(){
  const JEWELS=['R','E','S','T'];
  const ICON={R:'assets/jewel_r.svg',E:'assets/jewel_e.svg',S:'assets/jewel_s.svg',T:'assets/jewel_t.svg'};

  function init(host,onSolved){
    host.innerHTML='';
    const wrap=document.createElement('div'); wrap.className='jlatin-wrap';
    const title=document.createElement('div'); title.className='jlatin-title';
    title.innerHTML='<strong>Jewel Latin</strong> — Place one of each jewel in every row and every column.';
    const grid=document.createElement('div'); grid.className='jlatin-grid';
    const tools=document.createElement('div'); tools.className='jlatin-tools';
    const btnCheck=document.createElement('button'); btnCheck.textContent='Check';
    const btnClear=document.createElement('button'); btnClear.textContent='Clear blanks';
    const status=document.createElement('div'); status.style.minHeight='1.2rem';
    tools.append(btnCheck,btnClear);
    wrap.append(title,grid,tools,status); host.appendChild(wrap);

    // A modest set of givens to guide deduction (0 = blank)
    // Designed so solution is unique without 2x2 rule
    const G=[[0,'E',0,0],[0,0,'S',0],['S',0,0,0],[0,0,0,'E']];
    const cells=[];

    function img(sym){ const i=document.createElement('img'); i.src=ICON[sym]; i.alt=sym; return i; }
    function next(sym){ const idx=JEWELS.indexOf(sym); return JEWELS[(idx+1)%JEWELS.length]; }

    function mk(r,c){ const v=G[r][c]; const b=document.createElement('button'); b.className='jcell'; b.dataset.val=v||''; if(v){ b.classList.add('given'); b.disabled=true; b.appendChild(img(v)); } else { b.addEventListener('click',()=>{ let cur=b.dataset.val||''; if(!cur){ cur=JEWELS[0]; } else { cur=next(cur); } b.dataset.val=cur; b.innerHTML=''; b.appendChild(img(cur)); }); }
      grid.appendChild(b); cells.push({r,c,el:b}); }

    for(let r=0;r<4;r++) for(let c=0;c<4;c++) mk(r,c);

    btnClear.addEventListener('click',()=>{ cells.forEach(t=>{ if(!G[t.r][t.c]){ t.el.dataset.val=''; t.el.innerHTML=''; } }); status.textContent=''; status.style.color=''; });

    function read(){ return [0,1,2,3].map(r=>[0,1,2,3].map(c=> (cells[r*4+c].el.dataset.val||''))); }
    function allFilled(B){ return B.every(row=>row.every(v=>JEWELS.includes(v))); }
    function rowsOk(B){ return B.every(row=> new Set(row).size===4); }
    function colsOk(B){ return [0,1,2,3].every(c=> new Set([B[0][c],B[1][c],B[2][c],B[3][c]]).size===4); }

    btnCheck.addEventListener('click',()=>{ const B=read(); if(!allFilled(B)){ status.style.color='var(--warn)'; status.textContent='Place all jewels.'; return; } if(rowsOk(B)&&colsOk(B)){ status.style.color='var(--ok)'; status.textContent='Vault sorted — Digit: 6'; onSolved?.(); } else { status.style.color='var(--warn)'; status.textContent='Each row and column must contain R, E, S, T exactly once.'; } });
  }

  window.initDoorJewelLatin=init;
})();
