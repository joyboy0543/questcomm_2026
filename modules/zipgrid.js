(function(){
  function setupCanvas(canvas){
    const dpr = Math.max(1, window.devicePixelRatio||1);
    const width = Math.min(canvas.parentElement.clientWidth, 720);
    const height = Math.round(width * 2/3); // 3:2 ratio
    canvas.style.width = width+'px'; canvas.style.height = height+'px';
    canvas.width = Math.floor(width*dpr); canvas.height = Math.floor(height*dpr);
    return {dpr, width:canvas.width, height:canvas.height};
  }

  function draw(ctx, nodes, path){
    const {canvas} = ctx;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    // glow background grid
    ctx.save();
    ctx.strokeStyle = '#183247'; ctx.lineWidth=1;
    for(let i=0;i<3;i++){
      const x = nodes[i].px; const y = nodes[i*3].py;
      ctx.beginPath(); ctx.moveTo(x, nodes[0].py-40); ctx.lineTo(x, nodes[8].py+40); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(nodes[0].px-40, y); ctx.lineTo(nodes[8].px+40, y); ctx.stroke();
    }
    ctx.restore();

    // path
    if(path.length>1){
      const grad = ctx.createLinearGradient(nodes[path[0]-1].px, nodes[path[0]-1].py, nodes[path[path.length-1]-1].px, nodes[path[path.length-1]-1].py);
      grad.addColorStop(0,'#2ea8ff'); grad.addColorStop(1,'#29d49a');
      ctx.strokeStyle = grad; ctx.lineWidth = 6; ctx.lineCap='round';
      ctx.beginPath();
      for(let i=1;i<path.length;i++){
        const a=nodes[path[i-1]-1], b=nodes[path[i]-1]; ctx.moveTo(a.px,a.py); ctx.lineTo(b.px,b.py);
      }
      ctx.stroke();
    }

    // nodes
    nodes.forEach(n=>{
      ctx.beginPath(); ctx.fillStyle='#0b1218'; ctx.arc(n.px,n.py,22,0,Math.PI*2); ctx.fill();
      ctx.lineWidth=3; ctx.strokeStyle = '#284a63'; ctx.stroke();
      ctx.beginPath(); ctx.arc(n.px,n.py,28,0,Math.PI*2); ctx.strokeStyle='rgba(46,168,255,.15)'; ctx.lineWidth=2; ctx.stroke();
      ctx.fillStyle='#cfe6f7'; ctx.font='bold 20px system-ui'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(n.id,n.px,n.py);
    });
  }

  function buildNodes(canvas){
    const W=canvas.width, H=canvas.height; const margin=80;
    const xs=[margin, W/2, W-margin]; const ys=[margin, H/2, H-margin];
    const nodes=[]; for(let y=0;y<3;y++) for(let x=0;x<3;x++){ const id=y*3+x+1; nodes.push({id, px: xs[x], py: ys[y]}); }
    return nodes;
  }

  window.addEventListener('DOMContentLoaded', ()=>{
    const cv = document.getElementById('zipCanvas'); if(!cv) return; const ctx=cv.getContext('2d');
    function resize(){ setupCanvas(cv); nodes = buildNodes(cv); draw(ctx,nodes,path); }

    let nodes = []; let path=[]; let next=1; resize();
    window.addEventListener('resize', ()=>{ resize(); });

    function pick(mx,my){
      const rect=cv.getBoundingClientRect(); const dpr = cv.width/rect.width; mx*=dpr; my*=dpr;
      for(const n of nodes){ const dx=n.px-mx, dy=n.py-my; if(dx*dx+dy*dy < 26*26) return n; } return null;
    }

    cv.addEventListener('pointerdown', (e)=>{
      const r=cv.getBoundingClientRect(); const n=pick(e.clientX-r.left, e.clientY-r.top); if(!n) return;
      if(n.id!==next){ status('Touch '+next+' next','warn'); return; }
      path.push(n.id); next++; draw(ctx,nodes,path);
      if(path.length===9){ status('Path complete. Highlight: 2 6 7','ok');
        revealNote();
      }
    });

    function status(t, type){ const el=document.getElementById('zipStatus'); el.textContent=t; el.style.color = (type==='ok')? 'var(--ok)' : (type==='warn')? 'var(--warn)' : '' }
    function revealNote(){ const a=document.getElementById('zipAnswer'); const b=document.getElementById('zipConfirm'); a.style.display=b.style.display='inline-block'; a.placeholder='Reorder the digits to open the vault'; a.focus(); }

    document.getElementById('zipConfirm').addEventListener('click', ()=>{
      const val = document.getElementById('zipAnswer').value.trim();
      if(val==='627'){
        status('Correct: 627','ok');
        const st = JSON.parse(localStorage.getItem('qcpd.case1')||'{}'); st.zipgrid=true; localStorage.setItem('qcpd.case1', JSON.stringify(st));
        document.querySelector('.tab[data-tab="colorcode"]').classList.remove('disabled');
        radioHint('Zip Grid cleared. Atlas Cards unlocked.');
      } else status('Not yet. Hint: first and last swap.','warn');
    });

    document.getElementById('zipReset').addEventListener('click', ()=>{ path=[]; next=1; draw(ctx,nodes,path); status('',''); });
  });
})();
