(function(){
  function init(host,onSolved){
    host.innerHTML='';
    const wrap=document.createElement('div'); wrap.className='lights-wrap';
    const title=document.createElement('div'); title.innerHTML='<strong>Lights Out</strong> — Turn all lights off in <em>exactly</em> 7 toggles.';
    const grid=document.createElement('div'); grid.className='lights-grid';
    const tools=document.createElement('div'); tools.className='lights-tools';
    const btnReset=document.createElement('button'); btnReset.textContent='Reset';
    const status=document.createElement('div'); status.style.minHeight='1.2rem';
    tools.append(btnReset);
    wrap.append(title,grid,tools,status); host.appendChild(wrap);

    const N=4; let moves=0; let board=[];

    function flip(r,c){ if(r>=0&&r<N&&c>=0&&c<N) board[r][c]=!board[r][c]; }
    function kernelToggle(r,c){ flip(r,c); flip(r-1,c); flip(r+1,c); flip(r,c-1); flip(r,c+1); }

    function makeStart(){
      board=Array.from({length:N},()=>Array(N).fill(false));
      moves=0;
      const seq=[[0,0],[0,2],[1,1],[1,3],[2,0],[2,2],[3,1]]; // solution clicks
      seq.forEach(([r,c])=> kernelToggle(r,c));
    }

    function render(){ grid.innerHTML=''; for(let r=0;r<N;r++) for(let c=0;c<N;c++){ const d=document.createElement('div'); d.className='light '+(board[r][c]?'on':'off'); d.addEventListener('click',()=>userToggle(r,c)); grid.appendChild(d);} status.textContent=`Moves: ${moves}/7`; status.style.color=''; }

    function userToggle(r,c){ kernelToggle(r,c); moves++; render(); check(); }

    function allOff(){ for(let r=0;r<N;r++) for(let c=0;c<N;c++) if(board[r][c]) return false; return true; }
    function check(){ if(allOff()){ if(moves===7){ status.style.color='var(--ok)'; status.textContent='All lights out in exactly 7. Digit: 7'; onSolved?.(); } else { status.style.color='var(--warn)'; status.textContent='Solved, but not in exactly 7. Press Reset and try again.'; } } }

    btnReset.addEventListener('click',()=>{ makeStart(); render(); });

    makeStart(); render();
    window.__lights7_solution = [[0,0],[0,2],[1,1],[1,3],[2,0],[2,2],[3,1]];
  }
  window.initDoorLights7=init;
})();
