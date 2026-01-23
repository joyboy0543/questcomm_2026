(function(){
  const state = JSON.parse(localStorage.getItem('qcpd.doors')||'{}');
  function save(){ localStorage.setItem('qcpd.doors', JSON.stringify(state)); }
  function radio(msg){ if(typeof window.radioHint==='function') radioHint(msg); }

  const v='20260116'; const pending={};
  function need(fn){ return typeof window[fn]!== 'function'; }
  function loadScript(src){ if(pending[src]) return pending[src]; return pending[src]=new Promise((res,rej)=>{ const s=document.createElement('script'); s.src=src+(src.includes('?')?'':'?v='+v); s.onload=res; s.onerror=()=>rej(new Error('Failed to load '+src)); document.head.appendChild(s); }); }
  async function ensure(keys){ const t=[]; if(keys.includes('one') && need('initDoorMinesweep4')) t.push(loadScript('modules/door_minesweep4.js')); if(keys.includes('two') && need('initDoorJewelLatin')) t.push(loadScript('modules/door_jewel_latin.js')); if(keys.includes('three') && need('initDoorLights3x3')) t.push(loadScript('modules/door_lights3x3.js')); if(t.length) await Promise.all(t); }

  function build(container){ container.innerHTML=`<div class="doors-hall">${['one','two','three'].map(k=>`<div class=\"door-card ${state[k]?.open?'open':''}\" data-door=\"${k}\"><div class=\"door-top\"><div class=\"door-face\" role=\"button\" aria-label=\"Open puzzle\"><img src=\"assets/door_white.svg\" alt=\"door\"/></div></div><div class=\"door-game\"><div class=\"game-host\" id=\"host-${k}\"></div><div class=\"digit-row\" style=\"display:none\"><input aria-label=\"Record digit\" maxlength=\"1\" inputmode=\"numeric\" pattern=\"[0-9]\" /><button>Record</button><span class=\"pill\" style=\"display:none\"><span class=\"record-pill\">✔ Recorded</span></span></div></div></div>`).join('')}</div>`;

    [...container.querySelectorAll('.door-card')].forEach(card=>{ const key=card.dataset.door; const host=card.querySelector('.game-host'); const face=card.querySelector('.door-face'); const row=card.querySelector('.digit-row'); const input=row.querySelector('input'); const btn=row.querySelector('button'); const pill=row.querySelector('.pill'); const correct={one:'3', two:'6', three:'7'}[key];

      function showInput(){ row.style.display='flex'; if(state[key]?.recorded){ input.value=correct; input.readOnly=true; pill.style.display='inline-block'; } else { input.value=''; input.readOnly=false; pill.style.display='none'; } }
      function record(){ if(input.value===correct){ input.readOnly=true; pill.style.display='inline-block'; state[key]={open:true, recorded:true, digit:correct}; save(); radio('A door puzzle was completed. Digit noted.'); checkAll(); } else { input.classList.add('shake'); setTimeout(()=>input.classList.remove('shake'),200); } }
      btn.addEventListener('click',record);

      async function mount(){ card.classList.add('open'); state[key]=state[key]||{open:true}; save(); try{ await ensure([key]); if(key==='one') window.initDoorMinesweep4?.(host, ()=>showInput()); else if(key==='two') window.initDoorJewelLatin?.(host, ()=>showInput()); else if(key==='three') window.initDoorLights3x3?.(host, ()=>showInput()); } catch(e){ host.innerHTML=`<div style=\"color:var(--warn)\">${e.message}</div>`; } }

      face.addEventListener('click', ()=>mount()); if(state[key]?.open) mount(); if(state[key]?.recorded) showInput();
    });
  }

  function checkAll(){ const s=JSON.parse(localStorage.getItem('qcpd.doors')||'{}'); if(s.one?.recorded && s.two?.recorded && s.three?.recorded){ if(!document.getElementById('doors-complete')){ const b=document.createElement('div'); b.id='doors-complete'; b.style.margin='12px 0'; b.style.padding='10px'; b.style.border='1px solid #284a63'; b.style.borderRadius='10px'; b.style.background='#0b1218'; b.innerHTML='<strong>Door Number Identified: 3 6 7</strong>'; document.querySelector('.doors-hall').before(b);} const st=JSON.parse(localStorage.getItem('qcpd.case1')||'{}'); st.doors=true; localStorage.setItem('qcpd.case1', JSON.stringify(st)); const t=document.querySelector('.tab[data-tab="colorcode"]'); if(t) t.classList.remove('disabled'); radio('Sequence complete. Door number 367 noted.'); } }

  window.initDoorsHall=function(container){ build(container); checkAll(); };
})();
