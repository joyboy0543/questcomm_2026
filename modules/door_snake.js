(function(){
  function init(host, onSolved){
    host.innerHTML = '<strong>Sevens Only</strong> — Eat 7s. Avoid b. Wait out three b decoys.';
    const wrap=document.createElement('div'); wrap.className='snake-wrap';
    const cv=document.createElement('canvas'); cv.className='snake-cv'; cv.width=360; cv.height=240; const s=document.createElement('div'); s.className='s-status';
    wrap.append(cv,s); host.appendChild(wrap);

    const ctx=cv.getContext('2d');
    const grid=12; const cols=cv.width/grid, rows=cv.height/grid;
    let snake=[{x:5,y:5}]; let dir={x:1,y:0}; let food={x:10,y:8, t:'7'}; let tick=0; let speed=8; let bCount=0; let bTimer=0;

    function spawnFood(type){ let p; do{ p={x:Math.floor(Math.random()*cols), y:Math.floor(Math.random()*rows)} }while(snake.some(q=>q.x===p.x&&q.y===p.y)); p.t=type; return p; }

    function drawCell(x,y,txt,col){ ctx.fillStyle=col; ctx.fillRect(x*grid,y*grid,grid-1,grid-1); ctx.fillStyle='#cfe6f7'; ctx.font='bold 12px system-ui'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(txt, x*grid+grid/2, y*grid+grid/2); }

    function step(){ tick++; if(tick%(Math.max(2,12-speed))===0){
        const head={x:(snake[0].x+dir.x+cols)%cols, y:(snake[0].y+dir.y+rows)%rows};
        if(snake.some((p,i)=>i&&p.x===head.x&&p.y===head.y)){ reset(); return; }
        snake.unshift(head);
        if(head.x===food.x && head.y===food.y){ if(food.t==='7'){ /* grow */ } else { /* ate b -> reset */ reset(); return; } }
        else snake.pop();
      }
      // spawn/rotate b decoys occasionally
      if(tick%180===0 && bCount<3 && food.t==='7'){ food=spawnFood('b'); bTimer=120; }
      if(food.t==='b'){ bTimer--; if(bTimer<=0){ bCount++; food=spawnFood('7'); if(bCount>=3){ done(); return; } }
      }
      render(); requestAnimationFrame(step);
    }

    function render(){ ctx.clearRect(0,0,cv.width,cv.height);
      // snake
      ctx.fillStyle='#29d49a'; snake.forEach(p=>ctx.fillRect(p.x*grid,p.y*grid,grid-1,grid-1));
      // food
      if(food.t==='7') drawCell(food.x,food.y,'7','#143147'); else drawCell(food.x,food.y,'b','#3b1f2b');
    }

    function reset(){ snake=[{x:5,y:5}]; dir={x:1,y:0}; bCount=0; bTimer=0; food=spawnFood('7'); s.textContent='Reset'; }
    function done(){ s.style.color='var(--ok)'; s.textContent="The only safe target was '7'."; onSolved?.(); }

    window.addEventListener('keydown', (e)=>{ const k=e.key.toLowerCase(); if(k==='arrowup'||k==='w') dir={x:0,y:-1}; else if(k==='arrowdown'||k==='s') dir={x:0,y:1}; else if(k==='arrowleft'||k==='a') dir={x:-1,y:0}; else if(k==='arrowright'||k==='d') dir={x:1,y:0}; });
    step();
  }
  window.initDoorSnake = init;
})();
