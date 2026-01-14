
function setLS(k,v){ try{ localStorage.setItem(k, v); }catch(e){} }
function getLS(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
function okStatus(el,msg){ el.textContent = msg; el.style.color = '#51d98e'; document.getElementById('ariaStatus').textContent = msg; QC.chips(); }
function badStatus(el,msg){ el.textContent = msg; el.style.color = '#ff6b6b'; document.getElementById('ariaStatus').textContent = msg; }
function enableNext(current){ if (typeof QCPDUnlockNext === 'function') QCPDUnlockNext(current); }
function enableFinal(){ if (typeof QCPDUnlockFinal === 'function') QCPDUnlockFinal(); }

// Cipher Desk — Caesar shift
(function(){ const shift=document.getElementById('shift'); const decodedSpan=document.getElementById('decoded'); const confirm=document.getElementById('cipherConfirm'); const submit=document.getElementById('cipherSubmit'); const status=document.getElementById('cipherStatus'); if(!shift) return; const encoded='UFTU'; function decode(s){ const a='ABCDEFGHIJKLMNOPQRSTUVWXYZ'; return ''.padEnd(encoded.length).split('').map((_,i)=>{ const idx=a.indexOf(encoded[i]); return a[(idx - s + 26)%26]; }).join(''); } function render(){ const s=parseInt(shift.value||'0',10); decodedSpan.textContent=decode(s); } render(); shift.addEventListener('input', render); submit.addEventListener('click',()=>{ const word=(confirm.value||'').trim().toUpperCase(); if(word==='TEST'){ okStatus(status,'Correct.'); setLS('qc_p2_ok','1'); QC.chime(); enableNext(2); } else badStatus(status,'Incorrect.'); }); })();

// Logic Board — simple deduction
(function(){ const sel=document.getElementById('logicAnswer'); const btn=document.getElementById('logicSubmit'); const status=document.getElementById('logicStatus'); if(!btn) return; btn.addEventListener('click',()=>{ const v=sel.value; if(v==='C'){ okStatus(status,'Correct.'); setLS('qc_p3_ok','1'); QC.chime(); enableNext(3); } else badStatus(status,'Not quite.'); }); })();

// Field Network — order
(function(){ const sel=document.getElementById('route'); const btn=document.getElementById('routeSubmit'); const status=document.getElementById('routeStatus'); if(!btn) return; btn.addEventListener('click',()=>{ const vals=Array.from(sel.selectedOptions).map(o=>o.value); const target=['Alpha','Bravo','Charlie','Delta']; if(vals.join('→')===target.join('→')){ okStatus(status,'Route validated.'); setLS('qc_p4_ok','1'); QC.chime(); enableNext(4); } else badStatus(status,'Invalid route. Select nodes in order.'); }); })();

// Pattern Lab — memory
(function(){ const btns=[1,2,3,4].map(i=>document.getElementById('pbtn'+i)); const start=document.getElementById('patternStart'); const status=document.getElementById('patternStatus'); if(!start) return; const seq=[]; let user=[]; function flash(i){ const b=btns[i-1]; if(!b) return; const old=b.style.boxShadow; b.style.boxShadow='0 0 14px #2db2ff'; setTimeout(()=>{ b.style.boxShadow=old; },350); } function play(){ let t=0; seq.forEach(n=>{ setTimeout(()=>flash(n), t); t+=450; }); } btns.forEach((b,idx)=> b.addEventListener('click',()=>{ user.push(idx+1); const cur=user.length; if(user[cur-1]!==seq[cur-1]){ badStatus(status,'Mismatch. Restarting.'); user=[]; } else if(user.length===seq.length){ okStatus(status,'Round cleared.'); user=[]; if(seq.length>=4){ setLS('qc_p5_ok','1'); QC.chime(); enableFinal(); } else { seq.push(1+Math.floor(Math.random()*4)); play(); } } })); start.addEventListener('click',()=>{ seq.length=0; user.length=0; seq.push(1+Math.floor(Math.random()*4)); play(); okStatus(status,'Watch the sequence.'); }); })();

// Clearance — reflect current unlock
(function(){ const p6Locked=document.getElementById('p6locked'); const p6Open=document.getElementById('p6open'); const ok2=getLS('qc_p2_ok')==='1', ok3=getLS('qc_p3_ok')==='1', ok4=getLS('qc_p4_ok')==='1', ok5=getLS('qc_p5_ok')==='1'; const all=ok2&&ok3&&ok4&&ok5; if(all){ p6Locked.style.display='none'; p6Open.classList.remove('hidden'); setLS('qc_p6_unlocked','1'); } })();
