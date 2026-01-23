(function(){
  function init(host,onSolved){
    host.innerHTML='';
    const wrap=document.createElement('div'); wrap.className='lights-wrap';
    const title=document.createElement('div');
    title.innerHTML=`<strong>Lights Out</strong> — Turn all lights off in <em>exactly</em> 5 toggles.<br><small>Clicking a cell toggles that cell and its up/down/left/right neighbors.</small>`;
    const how=document.createElement('details'); how.style.marginTop='6px';
    const sum=document.createElement('summary'); sum.textContent='How it works';
    const expl=document.createElement('div'); expl.style.color='#9fb1c1'; expl.style.marginTop='6px';
    expl.innerHTML=`This instance is constructed by applying the same toggle pattern to five specific cells on an all-off board, so there’s a guaranteed 5-click solution. If you finish in a different number of moves, press Reset and try again.`;
    how.append(sum, expl);

    const grid=document.createElement('div'); grid.className='lights-grid';
    const tools=document.createElement('div'); tools.className='lights-tools';
    const btnReset=document.createElement('button'); btnReset.textContent='Reset';
    const btnHint=document.createElement('button'); btnHint.textContent='Show a hint';
    const status=document.createElement('div'); status.style.minHeight='1.2rem';

    tools.append(btnReset, btnHint); wrap.append(title, how, grid, tools, status); host.appendChild(wrap);

    const N=3; let moves=0; let board=[];
    const SOL=[[0,0],[0,2],[1,1],[2,0],[2,2]]; // 5-cell exact solution

    function flip(r,c){ if(r>=0&&r<N&&c>=0&&c<N) board[r][c]=!board[r][c]; }
    function kernelToggle(r,c){ flip(r,c); flip(r-1,c); flip(r+1,c); flip(r,c-1); flip(r,c+1); }

    function makeStart(){ board=Array.from({length:N},()=>Array(N).fill(false)); moves=0; SOL.forEach(([r,c])=>kernelToggle(r,c)); }

    function render(){ grid.innerHTML=''; for(let r=0;r<N;r++){ for(let c=0;c<N;c++){ const d=document.createElement('div'); d.className='light '+(board[r][c]?'on':'off'); d.title='Toggle'; d.addEventListener('click',()=>userToggle(r,c)); grid.appendChild(d);} } status.textContent=`Moves: ${moves}/5`; status.style.color=''; }

    function userToggle(r,c){ kernelToggle(r,c); moves++; render(); check(); }
    function allOff(){ for(let r=0;r<N;r++) for(let c=0;c<N;c++) if(board[r][c]) return false; return true; }
    function check(){ if(allOff()){ if(moves===5){ status.style.color='var(--ok)'; status.textContent='All lights out in exactly 5. Digit: 7'; onSolved?.(); } else { status.style.color='var(--warn)'; status.textContent='Solved, but not in exactly 5. Press Reset and try again.'; } } }

    btnReset.addEventListener('click',()=>{ makeStart(); render(); });
    btnHint.addEventListener('click',()=>{ status.style.color=''; status.textContent='Hint (row,col 0-indexed): '+ SOL.map(p=>`(${p[0]},${p[1]})`).join(', '); });

    window.__lights5_solution = SOL.slice();
    makeStart(); render();
  }
  window.initDoorLights3x3=init;
})();
