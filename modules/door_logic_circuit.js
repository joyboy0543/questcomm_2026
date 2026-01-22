(function(){
  function init(host,onSolved){
    host.innerHTML='';
    const wrap=document.createElement('div'); wrap.className='logic-wrap';
    const title=document.createElement('div'); title.innerHTML='<strong>Logic Circuit</strong> — Set A, B, C so every rule lights green.';

    const row=document.createElement('div'); row.className='logic-row';
    const sA=mkSwitch('A'), sB=mkSwitch('B'), sC=mkSwitch('C');
    row.append(sA.el,sB.el,sC.el);

    const list=document.createElement('div'); list.className='logic-list';

    // Six constraints (indicators) — must all evaluate true
    const rules=[
      {expr:'A XOR B',        fn:(A,B,C)=> (A^B)===1},
      {expr:'B → C',          fn:(A,B,C)=> (!B)||C},
      {expr:'NOT(A ∧ C)',     fn:(A,B,C)=> !(A&&C)},
      {expr:'A XOR C',        fn:(A,B,C)=> (A^C)===1},
      {expr:'A ∨ B ∨ C',      fn:(A,B,C)=> A||B||C},
      {expr:'A = NOT C',      fn:(A,B,C)=> A===(!C)}
    ];

    const bulbs = rules.map(r=>{ const it=document.createElement('div'); it.className='logic-item';
      const e=document.createElement('div'); e.className='expr'; e.textContent=r.expr; const b=document.createElement('span'); b.className='bulb'; it.append(e,b); list.appendChild(it); return b; });

    const status=document.createElement('div'); status.style.minHeight='1.2rem';

    wrap.append(title,row,list,status); host.appendChild(wrap);

    function mkSwitch(name){ const el=document.createElement('button'); el.className='switch'; el.setAttribute('data-on','0'); el.textContent=name+': OFF'; el.addEventListener('click',()=>{ const v=el.getAttribute('data-on')==='1'?0:1; el.setAttribute('data-on',String(v)); el.textContent=name+': '+(v?'ON':'OFF'); evaluate(); }); return {el}; }

    function val(btn){ return btn.getAttribute('data-on')==='1'?1:0; }

    function evaluate(){ const A=val(sA.el), B=val(sB.el), C=val(sC.el); let ok=true; rules.forEach((r,i)=>{ const on=r.fn(A,B,C); bulbs[i].classList.toggle('on',on); if(!on) ok=false; }); if(ok){ status.style.color='var(--ok)'; status.textContent='Indicators green: 6'; onSolved?.(); } else { status.style.color=''; status.textContent=''; } }

    // initial render
    evaluate();
  }
  window.initDoorLogicCircuit=init;
})();
