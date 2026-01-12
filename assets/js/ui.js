
export function showCase(el){ el.classList.add('case-enter'); requestAnimationFrame(()=> el.classList.add('case-show')); }
export function setProgress(pct){ const bar=document.querySelector('#loading-tape > span'); if(bar) bar.style.width=`${pct}%`; }
