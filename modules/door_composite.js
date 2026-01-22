(function(){
  function init(host,onSolved){
    host.innerHTML='';
    const wrap=document.createElement('div'); wrap.className='comp-wrap';
    const title=document.createElement('div'); title.innerHTML='<strong>Composite Sweep</strong> — Select all composite numbers.';
    const grid=document.createElement('div'); grid.className='comp-grid';
    const status=document.createElement('div'); status.style.minHeight='1.2rem';
    wrap.append(title,grid,status); host.appendChild(wrap);

    // Fixed 3x3 set with exactly 6 composites
    const nums=[1,2,3,4,6,9,10,12,15];
    const tiles=[]; const isComposite=n=> n>3? (n%2===0 || n%3===0 || (function(){for(let i=5;i*i<=n;i+=6){ if(n%i===0||n%(i+2)===0) return true;}return false;})()): (n===4);

    nums.forEach(n=>{ const b=document.createElement('button'); b.className='comp-tile'; b.textContent=n; b.addEventListener('click',()=>{ b.classList.toggle('on'); }); grid.appendChild(b); tiles.push({el:b,n}); });

    const checkBtn=document.createElement('button'); checkBtn.textContent='Check'; checkBtn.style.marginTop='4px'; wrap.appendChild(checkBtn);

    checkBtn.addEventListener('click',()=>{
      const selected=tiles.filter(t=>t.el.classList.contains('on')).map(t=>t.n);
      const want=nums.filter(isComposite);
      const ok = selected.length===want.length && selected.every(v=>want.includes(v));
      if(ok){ status.style.color='var(--ok)'; status.textContent='Composite tiles set: 6'; onSolved?.(); }
      else { status.style.color='var(--warn)'; status.textContent='Not quite. Tip: 1 is special; 2 & 3 are prime.'; }
    });
  }
  window.initDoorComposite=init;
})();
