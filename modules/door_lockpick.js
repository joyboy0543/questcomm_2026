(function(){
  function init(host, onSolved){
    host.innerHTML = '<strong>Six at Shear</strong> — Align all six pins to open the lock.';
    const wrap = document.createElement('div'); wrap.className='lockpick'; host.appendChild(wrap);

    const pins=[]; const TOL=10; // px tolerance band height
    for(let i=0;i<6;i++){
      const pin=document.createElement('div'); pin.className='pin';
      const band=document.createElement('div'); band.className='band';
      const thumb=document.createElement('div'); thumb.className='thumb';
      pin.append(band, thumb); wrap.appendChild(pin);
      const H=160; const target = Math.floor(Math.random()*(H-30-30))+30; // avoid edges
      band.style.top = (target-6)+'px';
      let dragging=false;
      function setThumb(y){ y=Math.max(8, Math.min(H-8, y)); thumb.style.top=(y-8)+'px'; }
      pin.addEventListener('pointerdown', (e)=>{ dragging=true; pin.setPointerCapture(e.pointerId); move(e); });
      pin.addEventListener('pointermove', move);
      pin.addEventListener('pointerup', up);
      function move(e){ if(!dragging) return; const rect=pin.getBoundingClientRect(); const y=e.clientY-rect.top; setThumb(y); }
      function up(){ if(!dragging) return; dragging=false; const y=parseFloat(thumb.style.top)+8; if(Math.abs(y-target)<=TOL){ pin.classList.add('set'); setThumb(target); check(); } else { pin.classList.remove('set'); }
      }
      pins.push({pin});
    }

    function check(){
      const all = pins.every(p=>p.pin.classList.contains('set'));
      if(all){ const msg=document.createElement('div'); msg.style.color='var(--ok)'; msg.style.marginTop='6px'; msg.textContent='Pins at shear: 6'; host.appendChild(msg); onSolved?.(); }
    }
  }

  window.initDoorLockpick = init;
})();
