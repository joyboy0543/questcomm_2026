
export function interrogate(rootSel='#minigame'){
  const root=document.querySelector(rootSel); if(!root) return;
  const q={ prompt:'Where were you at 22:40?', options:[ {text:'Home',truth:false}, {text:'Warehouse',truth:true}, {text:'Cafe',truth:false} ] };
  root.innerHTML=`<h3>Interrogation</h3><p>${q.prompt}</p><div class="opts">${q.options.map((o,i)=>`<button data-i="${i}" class="btn">${o.text}</button>`).join('')}</div>`;
  root.querySelectorAll('.opts .btn').forEach(btn=>{ btn.onclick=()=>{ const ok=q.options[+btn.dataset.i].truth; btn.classList.toggle('correct', ok); alert(ok? 'Confession detected.' : 'Inconsistent statement.'); }; });
}
export function fpScan(){ const root=document.getElementById('fp-scan'); const btn=document.getElementById('scan-btn'); if(!root||!btn) return;
  btn.onclick=()=>{ root.classList.add('scanning'); setTimeout(()=>{ root.classList.remove('scanning'); const match=Math.random()>0.5; alert(match? 'Fingerprint match: 87% confidence.' : 'No match found.'); },1900); };
}
