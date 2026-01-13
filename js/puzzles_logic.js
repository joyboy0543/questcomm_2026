
// Helpers
function setLS(k,v){ try{ localStorage.setItem(k, v); }catch(e){} }
function getLS(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
function okStatus(el,msg){ el.textContent = msg; el.style.color = '#51d98e'; }
function badStatus(el,msg){ el.textContent = msg; el.style.color = '#ff6b6b'; }

// Page 1: Photo + Note
(function(){
  const file = document.getElementById('p1file');
  const preview = document.getElementById('p1preview');
  const note = document.getElementById('p1note');
  const status = document.getElementById('p1status');
  const save = document.getElementById('p1save');
  if (!file) return;
  // restore
  const imgData = getLS('qc_p1_img'); if (imgData) preview.src = imgData;
  const noteData = getLS('qc_p1_note'); if (noteData) note.value = noteData;
  file.addEventListener('change', (ev)=>{
    const f = ev.target.files && ev.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = ()=>{ preview.src = r.result; setLS('qc_p1_img', r.result); okStatus(status, 'Photo saved.'); };
    r.readAsDataURL(f);
  });
  save.addEventListener('click', ()=>{ setLS('qc_p1_note', note.value.trim()); okStatus(status, 'Note saved.'); });
})();

// Page 2: Puzzle 1 — Right Building
(function(){
  const input = document.getElementById('p2answer');
  const submit = document.getElementById('p2submit');
  const status = document.getElementById('p2status');
  if (!submit) return;
  submit.addEventListener('click', ()=>{
    const v = (input.value||'').trim().toLowerCase();
    if (v === 'rb' || v === 'right building' || v === 'right'){
      okStatus(status, 'Correct.'); setLS('qc_p2_ok','1');
      if (typeof addRadioMessage === 'function') addRadioMessage('Puzzle 1 solved: Right building identified.');
      checkUnlock();
    } else badStatus(status,'Try again.');
  });
})();

// Page 3: Puzzle 2 — Jigsaw from side box to 3x3 grid
(function(){
  const side = document.getElementById('p3side');
  const grid = document.getElementById('p3grid');
  const status = document.getElementById('p3status');
  const clues = document.getElementById('p3clues');
  if (!side) return;
  const size = 3; const tileSize = 100; const bg = 'assets/jigsaw.png';
  const tiles = [];
  for (let r=0;r<size;r++){
    for (let c=0;c<size;c++){
      const idx = r*size + c; tiles.push(idx);
    }
  }
  // create side tiles shuffled
  tiles.sort(()=>Math.random()-0.5);
  tiles.forEach(idx=>{
    const t = document.createElement('div'); t.className='tile'; t.draggable=true; t.dataset.idx = String(idx);
    t.style.backgroundImage = `url(${bg})`;
    t.style.backgroundSize = `${size*tileSize}px ${size*tileSize}px`;
    const x = (idx%size)*tileSize, y = Math.floor(idx/size)*tileSize;
    t.style.backgroundPosition = `-${x}px -${y}px`;
    side.appendChild(t);
  });
  // create grid cells
  for (let i=0;i<size*size;i++){
    const cell = document.createElement('div'); cell.className='cell'; cell.dataset.target = String(i);
    grid.appendChild(cell);
  }
  // DnD
  let drag;
  side.addEventListener('dragstart', (e)=>{ drag = e.target; });
  grid.addEventListener('dragover', (e)=> e.preventDefault());
  grid.addEventListener('drop', (e)=>{
    e.preventDefault(); const cell = e.target.closest('.cell'); if (!cell || !drag) return;
    // if cell already has a tile, return
    if (cell.firstChild) return;
    cell.appendChild(drag);
    drag = null;
    checkSolved();
  });
  function checkSolved(){
    const cells = Array.from(grid.children);
    const correct = cells.every(cell => {
      const child = cell.firstChild; if (!child) return false; return child.dataset.idx === cell.dataset.target;
    });
    if (correct){ okStatus(status,'Jigsaw solved.'); clues.classList.remove('hidden'); setLS('qc_p3_ok','1'); if (typeof addRadioMessage==='function') addRadioMessage('Puzzle 2 solved: Tourist location assembled.'); checkUnlock(); }
  }
})();

// Page 4: Puzzle 3 — Block arranging then riddle answer world map
(function(){
  const box = document.getElementById('p4box');
  const grid = document.getElementById('p4grid');
  const riddle = document.getElementById('p4riddle');
  const status = document.getElementById('p4status');
  const input = document.getElementById('p4answer');
  const submit = document.getElementById('p4submit');
  const reveal = document.getElementById('p4reveal');
  if (!box) return;
  const size=3; const nums=[1,2,3,4,5,6,7,8,9].sort(()=>Math.random()-0.5);
  nums.forEach(n=>{ const t=document.createElement('div'); t.className='tile'; t.draggable=true; t.textContent=String(n); t.dataset.idx=String(n); box.appendChild(t); });
  for(let i=1;i<=9;i++){ const cell=document.createElement('div'); cell.className='cell'; cell.dataset.target=String(i); grid.appendChild(cell); }
  let drag;
  box.addEventListener('dragstart',(e)=>{ drag=e.target; });
  grid.addEventListener('dragover',(e)=> e.preventDefault());
  grid.addEventListener('drop',(e)=>{ e.preventDefault(); const cell=e.target.closest('.cell'); if(!cell||!drag) return; if(cell.firstChild) return; cell.appendChild(drag); drag=null; checkOrder(); });
  function checkOrder(){
    const cells=Array.from(grid.children);
    const ok=cells.every((cell,i)=>{ const child=cell.firstChild; if(!child) return false; return child.dataset.idx===String(i+1); });
    if(ok){ riddle.classList.remove('hidden'); okStatus(status,'Blocks arranged. Solve the riddle.'); }
  }
  if (submit) submit.addEventListener('click',()=>{
    const v=(input.value||'').trim().toLowerCase();
    if (v==='world map' || v==='map' || v==='world'){ okStatus(status,'Correct.'); reveal.classList.remove('hidden'); setLS('qc_p4_ok','1'); if (typeof addRadioMessage==='function') addRadioMessage('Puzzle 3 solved: World map confirmed.'); checkUnlock(); }
    else badStatus(status,'Try again.');
  });
})();

// Page 5: Puzzle 4 — Riddle -> Snake game; message every 2 points
(function(){
  const input = document.getElementById('p5answer');
  const submit = document.getElementById('p5submit');
  const status = document.getElementById('p5status');
  const wrap = document.getElementById('snakeWrap');
  const canvas = document.getElementById('snake');
  const msg = document.getElementById('snakeMsg');
  const scoreEl = document.getElementById('snakeScore');
  if (!submit) return;
  submit.addEventListener('click',()=>{
    const v=(input.value||'').trim().toLowerCase();
    if (v==='nothing'){
      okStatus(status,'Correct. Snake game unlocked.'); wrap.classList.remove('hidden'); setLS('qc_p5_ok','1'); if (typeof addRadioMessage==='function') addRadioMessage('Puzzle 4 solved: Nothing leads to snake.'); startSnake(); }
    else badStatus(status,'Try again.');
  });
  function startSnake(){
    const ctx = canvas.getContext('2d');
    const grid = 15; let count=0; let score=0; let snake={ x:150, y:150, cells:[], maxCells:4, dx:grid, dy:0 };
    let apple={ x: grid*Math.floor(Math.random()*20), y: grid*Math.floor(Math.random()*20)};
    document.addEventListener('keydown',(e)=>{
      switch(e.key){ case 'ArrowLeft': if (snake.dx===0) { snake.dx=-grid; snake.dy=0; } break; case 'ArrowUp': if (snake.dy===0){ snake.dx=0; snake.dy=-grid; } break; case 'ArrowRight': if (snake.dx===0){ snake.dx=grid; snake.dy=0; } break; case 'ArrowDown': if (snake.dy===0){ snake.dx=0; snake.dy=grid; } break; }
    });
    function loop(){
      requestAnimationFrame(loop);
      if (++count < 4) return; count=0; ctx.clearRect(0,0,canvas.width,canvas.height);
      snake.x += snake.dx; snake.y += snake.dy;
      if (snake.x < 0) snake.x = canvas.width - grid;
      else if (snake.x >= canvas.width) snake.x = 0;
      if (snake.y < 0) snake.y = canvas.height - grid;
      else if (snake.y >= canvas.height) snake.y = 0;
      snake.cells.unshift({x: snake.x, y: snake.y});
      if (snake.cells.length > snake.maxCells) snake.cells.pop();
      ctx.fillStyle = '#51d98e'; ctx.fillRect(apple.x, apple.y, grid-1, grid-1);
      ctx.fillStyle = '#2db2ff';
      snake.cells.forEach((cell, index)=>{
        ctx.fillRect(cell.x, cell.y, grid-1, grid-1);
        for (let i=index+1; i<snake.cells.length; i++){
          if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y){ snake.x=150; snake.y=150; snake.cells=[]; snake.maxCells=4; snake.dx=grid; snake.dy=0; score=0; scoreEl.textContent=score; }
        }
      });
      if (snake.x === apple.x && snake.y === apple.y){ score++; scoreEl.textContent = score; snake.maxCells++; apple.x = grid*Math.floor(Math.random()*20); apple.y = grid*Math.floor(Math.random()*20);
        if (score % 2 === 0){ msg.classList.remove('hidden'); setTimeout(()=> msg.classList.add('hidden'), 1500); if (score >= 2){ setLS('qc_snake_ge2','1'); checkUnlock(); if (typeof addRadioMessage==='function') addRadioMessage('Snake score ≥2: misleading clue noted.'); } }
      }
    }
    requestAnimationFrame(loop);
  }
})();

// Page 6: Unlock logic
function checkUnlock(){
  const ok2 = getLS('qc_p2_ok')==='1';
  const ok3 = getLS('qc_p3_ok')==='1';
  const ok4 = getLS('qc_p4_ok')==='1';
  const ok5 = getLS('qc_p5_ok')==='1';
  const ge2 = getLS('qc_snake_ge2')==='1';
  const all = ok2 && ok3 && ok4 && ok5;
  const unlocked = all || ge2;
  const btn6 = document.getElementById('btn-tab-6');
  const p6Locked = document.getElementById('p6locked');
  const p6Open = document.getElementById('p6open');
  if (!btn6) return;
  if (unlocked){ btn6.disabled = false; p6Locked.style.display='none'; p6Open.classList.remove('hidden'); setLS('qc_p6_unlocked','1'); }
}
// on load
(function(){ checkUnlock(); })();
