(function(){
  function dist2(a,b){const dx=a.x-b.x, dy=a.y-b.y; return dx*dx+dy*dy;}
  function draw(ctx, nodes, path){
    ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
    // lines
    ctx.strokeStyle='#2ea8ff'; ctx.lineWidth=3; ctx.lineCap='round';
    ctx.beginPath();
    for(let i=1;i<path.length;i++){ const a=nodes[path[i-1]-1], b=nodes[path[i]-1]; ctx.moveTo(a.px,a.py); ctx.lineTo(b.px,b.py);} ctx.stroke();
    // nodes
    nodes.forEach(n=>{
      ctx.beginPath(); ctx.fillStyle='#0b1218'; ctx.arc(n.px,n.py,18,0,Math.PI*2); ctx.fill();
      ctx.lineWidth=2; ctx.strokeStyle='#284a63'; ctx.stroke();
      ctx.fillStyle='#cfe6f7'; ctx.font='bold 16px system-ui'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(n.id,n.px,n.py);
    });
  }

  window.addEventListener('DOMContentLoaded', ()=>{
    const cv = document.getElementById('zipCanvas'); if(!cv) return; const ctx=cv.getContext('2d');
    const statusEl = document.getElementById('zipStatus');
    const answer = document.getElementById('zipAnswer');
    const confirm = document.getElementById('zipConfirm');

    // Build 3x3 nodes 1..9
    const nodes=[]; const W=cv.width, H=cv.height; const offx=120, offy=60, step=200;
    for(let y=0;y<3;y++) for(let x=0;x<3;x++){ const id = y*3+x+1; nodes.push({id, px: offx+x*step, py: offy+y*step}); }

    let path=[]; let next=1; draw(ctx,nodes,path);

    function pick(mx,my){ for(const n of nodes){ if(dist2({x:mx,y:my},{x:n.px,y:n.py})<22*22) return n; } return null; }

    cv.addEventListener('pointerdown', (e)=>{
      const r=cv.getBoundingClientRect(); const n=pick(e.clientX-r.left, e.clientY-r.top); if(!n) return;
      if(n.id!==next){ statusEl.textContent = `Touch ${next} next`; statusEl.style.color='var(--warn)'; return; }
      path.push(n.id); next++; draw(ctx,nodes,path);
      if(path.length===9){ statusEl.textContent='Path complete. Highlight: 2 6 7'; statusEl.style.color='var(--ok)';
        // Show note for 627
        answer.style.display='inline-block'; confirm.style.display='inline-block'; answer.placeholder='Reorder the digits to open the vault'; answer.focus();
      }
    });

    confirm.addEventListener('click', ()=>{
      if(answer.value.trim()==='627'){
        statusEl.textContent='Correct: 627'; statusEl.style.color='var(--ok)';
        const st = JSON.parse(localStorage.getItem('qcpd.case1')||'{}'); st.zipgrid=true; localStorage.setItem('qcpd.case1', JSON.stringify(st));
        document.querySelector('.tab[data-tab="colorcode"]').classList.remove('disabled');
        radioHint('Zip Grid cleared. Color Code unlocked.');
      } else { statusEl.textContent='Not yet. Hint: first and last swap.'; statusEl.style.color='var(--warn)'; }
    });
  });
})();
