(function(){
  function intersect(a,b,c,d){
    // segment ab with cd
    function ccw(p,q,r){return (r.y-p.y)*(q.x-p.x) > (q.y-p.y)*(r.x-p.x)}
    return (ccw(a,c,d) != ccw(b,c,d)) && (ccw(a,b,c) != ccw(a,b,d));
  }

  function genGraph(n=9){
    const nodes = Array.from({length:n}, (_,i)=>({x:Math.random(), y:Math.random()}));
    const edges=[];
    // Connect with k-nearest to make it solvable
    for(let i=0;i<n;i++){
      const dists = nodes.map((p,j)=>({j, d:(p.x-nodes[i].x)**2+(p.y-nodes[i].y)**2})).filter(o=>o.j!==i).sort((a,b)=>a.d-b.d);
      for(let k=0;k<3;k++){
        const j = dists[k].j; if(i<j) edges.push([i,j]);
      }
    }
    return {nodes, edges};
  }

  function countCrossings(nodes, edges){
    let c=0; for(let i=0;i<edges.length;i++){
      for(let j=i+1;j<edges.length;j++){
        const [a,b]=edges[i], [c1,d]=edges[j];
        if(a===c1||a===d||b===c1||b===d) continue;
        if(intersect(nodes[a], nodes[b], nodes[c1], nodes[d])) c++;
      }
    }
    return c;
  }

  window.initPlanarity = function(){
    const canvas = document.getElementById('planarity');
    const ctx = canvas.getContext('2d');
    const stats = document.getElementById('pnStats');
    const shuffleBtn = document.getElementById('pnShuffle');

    let graph = genGraph(10);
    let dragging = null;

    function toPX(p){ return {x: 20 + p.x*(canvas.width-40), y: 20 + p.y*(canvas.height-40)} }
    function toN(px){ return {x: (px.x-20)/(canvas.width-40), y: (px.y-20)/(canvas.height-40)} }

    function draw(){
      ctx.clearRect(0,0,canvas.width, canvas.height);
      // edges
      ctx.strokeStyle = '#284a63'; ctx.lineWidth=2;
      for(const [i,j] of graph.edges){
        const a = toPX(graph.nodes[i]), b = toPX(graph.nodes[j]);
        ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
      }
      // nodes
      for(let i=0;i<graph.nodes.length;i++){
        const p = toPX(graph.nodes[i]);
        ctx.beginPath(); ctx.fillStyle='#2ea8ff'; ctx.arc(p.x,p.y,10,0,Math.PI*2); ctx.fill();
        ctx.lineWidth=2; ctx.strokeStyle='#0b1218'; ctx.stroke();
      }
      const crossings = countCrossings(graph.nodes, graph.edges);
      stats.textContent = crossings===0 ? 'Network secure! No crossings.' : `Crossings: ${crossings}`;
      stats.style.color = crossings===0 ? 'var(--ok)' : '';
    }

    function pick(mx,my){
      for(let i=graph.nodes.length-1;i>=0;i--){
        const p = toPX(graph.nodes[i]);
        const dx = p.x-mx, dy=p.y-my; if(dx*dx+dy*dy < 12*12) return i;
      }
      return null;
    }

    function mouse(e){
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left; const my = e.clientY - rect.top;
      return {x:mx, y:my};
    }

    canvas.addEventListener('pointerdown', (e)=>{ dragging = pick(...Object.values(mouse(e))); if(dragging!=null) canvas.setPointerCapture(e.pointerId); });
    canvas.addEventListener('pointermove', (e)=>{
      if(dragging!=null){
        const m = mouse(e); graph.nodes[dragging] = toN(m); draw();
      }
    });
    canvas.addEventListener('pointerup', ()=> dragging=null);

    shuffleBtn.addEventListener('click', ()=>{ graph.nodes.forEach(p=>{p.x=Math.random(); p.y=Math.random()}); draw(); });

    draw();
  }
})();
