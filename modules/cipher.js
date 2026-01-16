(function(){
  const encodedWord = 'UFTU'; // Change in case config as needed
  const targetDecoded = 'TEST'; // Correct plaintext

  function caesarDecode(s, shift){
    const A = 'A'.charCodeAt(0), Z='Z'.charCodeAt(0);
    const a = 'a'.charCodeAt(0), z='z'.charCodeAt(0);
    return s.split('').map(ch => {
      const c = ch.charCodeAt(0);
      if (c>=A && c<=Z){
        let n = ((c - A - shift) % 26 + 26) % 26; return String.fromCharCode(A+n);
      } else if (c>=a && c<=z){
        let n = ((c - a - shift) % 26 + 26) % 26; return String.fromCharCode(a+n);
      } else return ch;
    }).join('');
  }

  function buildJewel(board){
    board.innerHTML = '';
    const N=4; // 4x4
    const tiles=[];
    for(let y=0;y<N;y++){
      for(let x=0;x<N;x++){
        const i=y*N+x;
        const d=document.createElement('div');
        d.className='jewel-tile';
        d.style.backgroundPosition=`${x*33.3333}% ${y*33.3333}%`;
        // Correct position in percentages
        d.dataset.cx = (x*25)+'%';
        d.dataset.cy = (y*25)+'%';
        tiles.push(d);
      }
    }
    // scramble positions
    const order=[...tiles].map((_,i)=>i).sort(()=>Math.random()-0.5);
    tiles.forEach((tile, i)=>{
      const j = order[i];
      const sx = (j%4)*25; const sy = Math.floor(j/4)*25;
      tile.style.left = sx+'%';
      tile.style.top  = sy+'%';
      board.appendChild(tile);
    });
  }

  function solveJewel(board){
    board.classList.add('solved');
    [...board.children].forEach(tile=>{
      tile.style.left = tile.dataset.cx;
      tile.style.top  = tile.dataset.cy;
    });
  }

  window.initCipherDesk = function(){
    const shift = document.getElementById('shift');
    const enc = document.getElementById('encoded');
    const dec = document.getElementById('decoded');
    const input = document.getElementById('decodedInput');
    const confirm = document.getElementById('confirmBtn');
    const status = document.getElementById('cipherStatus');
    const board = document.getElementById('jewel-board');

    enc.textContent = encodedWord;
    dec.textContent = caesarDecode(encodedWord, +shift.value);
    buildJewel(board);

    function checkSolved(text){
      if (text.trim().toUpperCase() === targetDecoded.toUpperCase()){
        status.textContent = 'Correct! Jewel image sorted.';
        status.style.color = 'var(--ok)';
        solveJewel(board);
        return true;
      } else {
        status.textContent = '';
        status.style.color = '';
        return false;
      }
    }

    shift.addEventListener('input', () => {
      const cur = caesarDecode(encodedWord, +shift.value);
      dec.textContent = cur;
      input.value = cur;
      checkSolved(cur);
    });

    confirm.addEventListener('click', () => {
      checkSolved(input.value);
    });

    // Pre-fill input with current decode
    input.value = dec.textContent;
  }
})();
