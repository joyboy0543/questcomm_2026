(function(){
  const state = JSON.parse(localStorage.getItem('qcpd.doors')||'{}');
  function save(){ localStorage.setItem('qcpd.doors', JSON.stringify(state)); }
  function radio(msg){ if(typeof window.radioHint==='function') radioHint(msg); }
  function build(container){ container.innerHTML = `
    <div class="doors-hall">
      ${['one','two','three'].map((k,i)=>`
        <div class="door-card ${state[k]?.open? 'open':''}" data-door="${k}">
          <div class="door-top">
            <div class="door-face" role="button" aria-label="Open mini-game"><img src="assets/door_white.svg" alt="door"/></div>
            <div class="door-label">${['Door 1','Door 2','Door 3'][i]}</div>
          </div>
          <div class="door-game">
            <div class="game-host" id="host-${k}"></div>
            <div class="digit-row" style="display:none">
              <label>Enter digit:</label>
              <input maxlength="1" inputmode="numeric" pattern="[0-9]" />
              <button>Lock</button>
              <span class="lock-pill" style="display:none"><span class="locked-pill">✔ Locked</span></span>
            </div>
          </div>
        </div>`).join('')}
    </div>`;

    [...container.querySelectorAll('.door-card')].forEach((card, idx)=>{
      const key = card.dataset.door; const host = card.querySelector('.game-host');
      const face = card.querySelector('.door-face');
      const row = card.querySelector('.digit-row');
      const input = row.querySelector('input');
      const btn = row.querySelector('button');
      const pill = row.querySelector('.lock-pill');
      const correct = {one:'3', two:'6', three:'7'}[key];

      function showInput(){ row.style.display='flex'; if(state[key]?.locked){ input.value=correct; input.readOnly=true; pill.style.display='inline-block'; }
        else { input.value=''; input.readOnly=false; pill.style.display='none'; } }

      function lockIfCorrect(){ if(input.value===correct){ input.readOnly=true; pill.style.display='inline-block'; state[key]={open:true, locked:true, digit:correct}; save(); radio(`${['Door 1','Door 2','Door 3'][idx]} cleared. Digit recorded.`); checkAll(); } else { input.classList.add('shake'); setTimeout(()=>input.classList.remove('shake'),200); } }
      btn.addEventListener('click', lockIfCorrect);

      function mountGame(){ card.classList.add('open'); state[key] = state[key]||{open:true}; save();
        if(key==='one') window.initDoorMinesweep4?.(host, ()=>{ showInput(); });
        if(key==='two') window.initDoorComposite?.(host, ()=>{ showInput(); });
        if(key==='three') window.initDoorPath7?.(host, ()=>{ showInput(); });
      }

      face.addEventListener('click', ()=>{ mountGame(); });
      if(state[key]?.open){ mountGame(); }
      if(state[key]?.locked){ showInput(); }
    });
  }

  function checkAll(){
    const s = JSON.parse(localStorage.getItem('qcpd.doors')||'{}');
    if(s.one?.locked && s.two?.locked && s.three?.locked){
      if(!document.getElementById('doors-complete')){
        const banner = document.createElement('div'); banner.id='doors-complete';
        banner.style.margin='12px 0'; banner.style.padding='10px'; banner.style.border='1px solid #284a63'; banner.style.borderRadius='10px';
        banner.style.background='#0b1218'; banner.innerHTML = '<strong>Access Code Identified: 3 6 7</strong>';
        document.querySelector('.doors-hall').before(banner);
      }
      const st = JSON.parse(localStorage.getItem('qcpd.case1')||'{}'); st.doors=true; localStorage.setItem('qcpd.case1', JSON.stringify(st));
      const t = document.querySelector('.tab[data-tab="colorcode"]'); if(t) t.classList.remove('disabled');
      radio('Doors sequence complete. Code 367 logged.');
    }
  }

  window.initDoorsHall = function(container){ build(container); checkAll(); };
})();
