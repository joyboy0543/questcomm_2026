(function(){
  const encodedWord = 'UFTU';
  const targetDecoded = 'TEST';
  let solved = false;

  function caesarDecode(s, shift){
    const A='A'.charCodeAt(0), Z='Z'.charCodeAt(0), a='a'.charCodeAt(0), z='z'.charCodeAt(0);
    return s.split('').map(ch=>{
      const c=ch.charCodeAt(0);
      if(c>=A&&c<=Z){let n=((c-A-shift)%26+26)%26;return String.fromCharCode(A+n)}
      if(c>=a&&c<=z){let n=((c-a-shift)%26+26)%26;return String.fromCharCode(a+n)}
      return ch;
    }).join('');
  }
  function buildBoard(board){
    board.innerHTML=''; const N=4; const tiles=[];
    for(let y=0;y<N;y++) for(let x=0;x<N;x++){
      const d=document.createElement('div'); d.className='jewel-tile';
      d.style.backgroundPosition=`${x*33.3333}% ${y*33.3333}%`;
      d.dataset.cx=(x*25)+'%'; d.dataset.cy=(y*25)+'%'; tiles.push(d);
    }
    const order=[...tiles].map((_,i)=>i).sort(()=>Math.random()-0.5);
    tiles.forEach((tile,i)=>{const j=order[i]; tile.style.left=(j%4)*25+'%'; tile.style.top=Math.floor(j/4)*25+'%'; board.appendChild(tile);});
  }
  function scramble(board){ if(solved) return; [...board.children].forEach(tile=>{ const j=Math.floor(Math.random()*16); tile.style.left=(j%4)*25+'%'; tile.style.top=Math.floor(j/4)*25+'%'; }); board.classList.remove('solved'); }
  function solve(board){ board.classList.add('solved'); [...board.children].forEach(tile=>{ tile.style.left=tile.dataset.cx; tile.style.top=tile.dataset.cy; }); }

  window.addEventListener('DOMContentLoaded', ()=>{
    const shift = document.getElementById('shift');
    const enc = document.getElementById('encoded');
    const dec = document.getElementById('decoded');
    const input = document.getElementById('decodedInput');
    const confirm = document.getElementById('cipherConfirm');
    const status = document.getElementById('cipherStatus');
    const board = document.getElementById('jewel-board');

    if(!board) return;
    enc.textContent=encodedWord; buildBoard(board);
    function update(){ const val=caesarDecode(encodedWord,+shift.value); dec.textContent=val; if(!solved) input.value=val; if(!solved) scramble(board); }
    shift.addEventListener('input', update); update();

    function check(){ const ok = input.value.trim().toUpperCase()===targetDecoded.toUpperCase();
      if(ok){ solved=true; solve(board); status.textContent='Correct. Evidence image restored.'; status.style.color='var(--ok)';
        const st = JSON.parse(localStorage.getItem('qcpd.case1')||'{}'); st.cipher=true; localStorage.setItem('qcpd.case1', JSON.stringify(st));
        document.querySelector('.tab[data-tab="zipgrid"]').classList.remove('disabled');
        radioHint('Cipher solved. Path Grid unlocked.');
      } else { status.textContent=''; }
    }
    confirm.addEventListener('click', check);
  });
})();
