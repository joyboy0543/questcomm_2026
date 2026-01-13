
function checkP1(){
  const v = document.getElementById('p1').value.trim().toUpperCase();
  const ok = v === 'SHIFT';
  const el = document.getElementById('p1status');
  el.textContent = ok ? 'Correct: Proceed to Puzzle 2.' : 'Not quite. Hint: Caesar +3.';
  el.style.color = ok ? '#51d98e' : '#ff6b6b';
  if (ok) localStorage.setItem('qc_p1', '1');
}
function checkP2(){
  const v = document.getElementById('p2').value.trim().toUpperCase();
  const ok = v === 'AX24';
  const el = document.getElementById('p2status');
  el.textContent = ok ? 'Correct: Proceed to Puzzle 3.' : 'Try again. Only one isn't a multiple of 4+1.';
  el.style.color = ok ? '#51d98e' : '#ff6b6b';
  if (ok) localStorage.setItem('qc_p2', '1');
}
function checkP3(){
  const v = (document.getElementById('p3').value||'').trim().toUpperCase();
  const ok = v === 'SAPPHIRE';
  const el = document.getElementById('p3status');
  el.textContent = ok ? 'Case breakthrough! Jewel key confirmed.' : 'Think color and gemstone.';
  el.style.color = ok ? '#51d98e' : '#ff6b6b';
  if (ok) localStorage.setItem('qc_p3', '1');
}
