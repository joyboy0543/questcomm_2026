(function(){
  const size=3; // 3x3 Hidato
  // Predefined solution (spiral): positions of 1..9 (row-major indices)
  const sol = [
    [0,0], //1
    [0,1], //2
    [0,2], //3
    [1,2], //4
    [2,2], //5
    [2,1], //6
    [2,0], //7
    [1,0], //8
    [1,1]  //9
  ];
  function key(r,c){return r+','+c}

  window.addEventListener('DOMContentLoaded', ()=>{
    const root = document.getElementById('hidato'); if(!root) return;
    const status = document.getElementById('hidStatus');
    const answer = document.getElementById('zipAnswer');
    const confirm = document.getElementById('zipConfirm');
    const resetBtn = document.getElementById('hidReset');

    let grid = Array.from({length:size},()=>Array(size).fill(null));
    // Place fixed 1 and 9
    grid[sol[0][0]][sol[0][1]] = 1;
    grid[sol[8][0]][sol[8][1]] = 9; // 9 fixed

    let next = 2;

    function render(){
      root.innerHTML='';
      for(let r=0;r<size;r++){
        for(let c=0;c<size;c++){
          const v = grid[r][c];
          const cell = document.createElement('button');
          cell.className='hcell';
          if(v!==null) cell.textContent=v;
          cell.dataset.r=r; cell.dataset.c=c;
          if(v===1 || v===9){ cell.classList.add('fixed'); }
          if(v===next-1) cell.classList.add('next');
          cell.addEventListener('click', ()=>place(r,c));
          root.appendChild(cell);
        }
      }
    }

    function adj(a,b){ return Math.max(Math.abs(a[0]-b[0]), Math.abs(a[1]-b[1]))===1 }

    function locate(val){ for(let r=0;r<size;r++) for(let c=0;c<size;c++) if(grid[r][c]===val) return [r,c]; return null; }

    function place(r,c){
      if(grid[r][c]!==null) return; // occupied
      const prev = locate(next-1);
      if(!prev || !adj(prev,[r,c])){ status.textContent='Each number must touch the previous (diagonals allowed).'; status.style.color='var(--warn)'; return; }
      grid[r][c] = next; next++; status.textContent=''; status.style.color='';
      render();
      if(next===10){ // solved
        // highlight 2,6,7
        highlight([2,6,7]);
        status.textContent='Sequence complete. Highlight: 2 6 7'; status.style.color='var(--ok)';
        answer.style.display='inline-block'; confirm.style.display='inline-block'; answer.placeholder='Reorder the digits to open the vault'; answer.focus();
      }
    }

    function highlight(list){
      const nodes = {}; sol.forEach((p,i)=>{ nodes[i+1]=p; });
      const elems = root.querySelectorAll('.hcell');
      list.forEach(v=>{ const [rr,cc]=nodes[v]; const idx=rr*size+cc; elems[idx].classList.add('hl'); });
    }

    resetBtn.addEventListener('click', ()=>{ grid = Array.from({length:size},()=>Array(size).fill(null)); grid[sol[0][0]][sol[0][1]]=1; grid[sol[8][0]][sol[8][1]]=9; next=2; status.textContent=''; status.style.color=''; answer.style.display=confirm.style.display='none'; render(); });

    confirm.addEventListener('click', ()=>{
      if(answer.value.trim()==='627'){
        status.textContent='Correct: 627'; status.style.color='var(--ok)';
        const st = JSON.parse(localStorage.getItem('qcpd.case1')||'{}'); st.zipgrid=true; localStorage.setItem('qcpd.case1', JSON.stringify(st));
        document.querySelector('.tab[data-tab="colorcode"]').classList.remove('disabled');
        radioHint('Path Grid cleared. Cipher Rings unlocked.');
      } else { status.textContent='Not yet. Hint: first and last swap.'; status.style.color='var(--warn)'; }
    });

    render();
  });
})();
