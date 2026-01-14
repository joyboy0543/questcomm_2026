
function setLS(k,v){ try{ localStorage.setItem(k, v); }catch(e){} }
function getLS(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
function okStatus(el,msg){ el.textContent = msg; el.style.color = '#51d98e'; document.getElementById('ariaStatus').textContent = msg; QC.chips(); }
function badStatus(el,msg){ el.textContent = msg; el.style.color = '#ff6b6b'; document.getElementById('ariaStatus').textContent = msg; }
function enableNext(current){ if (typeof QCPDUnlockNext === 'function') QCPDUnlockNext(current); }
function enableFinal(){ if (typeof QCPDUnlockFinal === 'function') QCPDUnlockFinal(); }

// Cipher Desk — robust Caesar shift
(function(){ var shift=document.getElementById('shift'); var decodedSpan=document.getElementById('decoded'); var confirm=document.getElementById('cipherConfirm'); var submit=document.getElementById('cipherSubmit'); var status=document.getElementById('cipherStatus'); if(!shift) return; var encoded='UFTU'; var A='ABCDEFGHIJKLMNOPQRSTUVWXYZ'; function decode(s){ var out=''; for(var i=0;i<encoded.length;i++){ var idx=A.indexOf(encoded[i]); out += A[(idx - s + 26)%26]; } return out; } function render(){ var s=parseInt(shift.value||'0',10); decodedSpan.textContent=decode(s); } render(); shift.addEventListener('input', render); submit.addEventListener('click',function(){ var word=(confirm.value||'').trim().toUpperCase(); if(word==='TEST'){ okStatus(status,'Correct.'); setLS('qc_p2_ok','1'); QC.chime(); enableNext(3); } else badStatus(status,'Incorrect.'); }); })();

// Logic Board — simple deduction
(function(){ var sel=document.getElementById('logicAnswer'); var btn=document.getElementById('logicSubmit'); var status=document.getElementById('logicStatus'); if(!btn) return; btn.addEventListener('click',function(){ var v=sel.value; if(v==='C'){ okStatus(status,'Correct.'); setLS('qc_p3_ok','1'); QC.chime(); enableNext(4); } else badStatus(status,'Not quite.'); }); })();

// Field Network — order
(function(){ var sel=document.getElementById('route'); var btn=document.getElementById('routeSubmit'); var status=document.getElementById('routeStatus'); if(!btn) return; btn.addEventListener('click',function(){ var vals=Array.from(sel.selectedOptions).map(function(o){return o.value}); var target=['Alpha','Bravo','Charlie','Delta']; if(vals.length===4 && vals.every(function(v,i){return v===target[i]})){ okStatus(status,'Route validated.'); setLS('qc_p4_ok','1'); QC.chime(); enableNext(5); } else badStatus(status,'Invalid route. Select nodes in order.'); }); })();

// Pattern Lab — memory
(function(){ var btns=[1,2,3,4].map(function(i){return document.getElementById('pbtn'+i)}); var start=document.getElementById('patternStart'); var status=document.getElementById('patternStatus'); if(!start) return; var seq=[]; var user=[]; function flash(i){ var b=btns[i-1]; if(!b) return; var old=b.style.boxShadow; b.style.boxShadow='0 0 14px #2db2ff'; setTimeout(function(){ b.style.boxShadow=old; },350); } function play(){ var t=0; seq.forEach(function(n){ setTimeout(function(){flash(n)}, t); t+=450; }); } btns.forEach(function(b,idx){ b.addEventListener('click',function(){ user.push(idx+1); var cur=user.length; if(user[cur-1]!==seq[cur-1]){ badStatus(status,'Mismatch. Restarting.'); user=[]; } else if(user.length===seq.length){ okStatus(status,'Round cleared.'); user=[]; if(seq.length>=4){ setLS('qc_p5_ok','1'); QC.chime(); enableFinal(); } else { seq.push(1+Math.floor(Math.random()*4)); play(); } } }); }); start.addEventListener('click',function(){ seq.length=0; user.length=0; seq.push(1+Math.floor(Math.random()*4)); play(); okStatus(status,'Watch the sequence.'); }); })();

// Clearance — reflect current unlock
(function(){ var p6Locked=document.getElementById('p6locked'); var p6Open=document.getElementById('p6open'); var admin = getLS('qc_admin')==='1'; var ok2=getLS('qc_p2_ok')==='1', ok3=getLS('qc_p3_ok')==='1', ok4=getLS('qc_p4_ok')==='1', ok5=getLS('qc_p5_ok')==='1'; var all=ok2&&ok3&&ok4&&ok5; if(all||admin){ p6Locked.style.display='none'; p6Open.classList.remove('hidden'); setLS('qc_p6_unlocked','1'); } })();
