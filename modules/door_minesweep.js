(function(){
  function buildBoard(rows=5, cols=5, mines=3){
    const grid = Array.from({length:rows},()=>Array(cols).fill(0));
    let placed=0; while(placed<mines){ const r=Math.floor(Math.random()*rows), c=Math.floor(Math.random()*cols); if(grid[r][c]!==-1){ grid[r][c]=-1; placed++; for(let dr=-1;dr<=1;dr++) for(let dc=-1;dc<=1;dc++){ if(dr||dc){ const rr=r+dr, cc=c+dc; if(rr>=0&&rr<rows&&cc>=0&&cc<cols && grid[rr][cc]!==-1) grid[rr][cc]++; } } } }
    return grid;
  }

  function render(host, onSolved){
    host.innerHTML='';
    const header = document.createElement('div'); header.innerHTML = '<strong>Safe Sweep</strong> — Do not press the incorrect fields.';
    const status = document.createElement('div'); status.className='msw-status';
    const board = document.createElement('div'); board.className='msw-board'; board.style.gridTemplateColumns='repeat(5,28px)';

    host.append(header, board, status);

    let grid = buildBoard();
    let revealed=0; const total=5*5-3; let over=false;

    function cellEl(r,c){ const d=document.createElement('button'); d.className='msw-cell'; d.setAttribute('aria-label','cell'); d.addEventListener('click',()=>reveal(r,c,d)); return d; }

    function reveal(r,c,el){ if(over) return; const v=grid[r][c]; if(el.classList.contains('revealed')) return; if(v===-1){ el.classList.add('boom','revealed'); status.textContent='Boom! Try again.'; over=true; setTimeout(()=>render(host,onSolved),1200); return; }
      el.classList.add('revealed'); if(v>0) el.textContent=v; revealed++; if(revealed===total){ status.style.color='var(--ok)'; status.textContent='Mines avoided: 3'; onSolved?.(); } }

    for(let r=0;r<5;r++) for(let c=0;c<5;c++) board.appendChild(cellEl(r,c));
  }

  window.initDoorMinesweep = function(host, onSolved){ render(host, onSolved); }
})();
