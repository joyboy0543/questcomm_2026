
const cache = new Map();
const files = {
  ding: '/assets/sounds/ding.ogg',
  click: '/assets/sounds/click.ogg',
  radio_beep: '/assets/sounds/radio_beep.ogg',
};
export function primeAudio(){
  Object.values(files).forEach(url => {
    const a = new Audio(); a.src = url; a.preload = 'auto'; a.muted = true; a.play().catch(()=>{});
  });
}
export function sfx(name, volume = 0.6){
  const url = files[name]; if (!url) return;
  let a = cache.get(url);
  if (!a){ a = new Audio(url); a.preload = 'auto'; cache.set(url, a); }
  a.volume = volume; a.currentTime = 0; a.play().catch(err => console.warn(`SFX '${name}' failed:`, err));
}
export async function playRadio(lines = [], pauseMs = 1200){
  for (const line of lines){ sfx('radio_beep', 0.5); await showToast(line); await wait(pauseMs); }
}
function wait(ms){ return new Promise(r=>setTimeout(r, ms)); }
function showToast(text){
  return new Promise(r=>{
    const el = document.createElement('div'); el.className = 'radio-toast'; el.textContent = text; document.body.appendChild(el);
    setTimeout(()=> el.classList.add('show'), 20);
    setTimeout(()=>{ el.classList.remove('show'); setTimeout(()=>{ el.remove(); r(); }, 300); }, 2200);
  });
}
