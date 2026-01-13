
function setLS(k,v){ try{ localStorage.setItem(k, v); }catch(e){} }
function getLS(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
function okStatus(el,msg){ el.textContent = msg; el.style.color = '#51d98e'; }
function badStatus(el,msg){ el.textContent = msg; el.style.color = '#ff6b6b'; }
function enableNext(current){ if (typeof QCPDUnlockNext === 'function') QCPDUnlockNext(current); }
function enableFinal(){ if (typeof QCPDUnlockFinal === 'function') QCPDUnlockFinal(); }

// Page 1 — Agent Details (non-gated)
(function(){
  const preview = document.getElementById('p1preview');
  const note = document.getElementById('p1note');
  const status = document.getElementById('p1status');
  const btnSubmit = document.getElementById('p1submit');
  const btnUpload = document.getElementById('p1upload');
  const inputFile = document.getElementById('p1file');
  const btnClear = document.getElementById('p1clear');
  const btnCamera = document.getElementById('p1camera');

  if (!btnSubmit) return;

  // Restore stored values
  const imgData = getLS('qc_p1_img'); if (imgData) preview.src = imgData;
  const noteData = getLS('qc_p1_note'); if (noteData) note.value = noteData;

  // Upload flow
  btnUpload?.addEventListener('click', ()=> inputFile?.click());
  inputFile?.addEventListener('change', (ev)=>{
    const f = ev.target.files && ev.target.files[0]; if (!f) return;
    const r = new FileReader(); r.onload = ()=>{ preview.src = r.result; setLS('qc_p1_img', r.result); okStatus(status,'Photo loaded.'); };
    r.readAsDataURL(f);
  });
  // Clear photo
  btnClear?.addEventListener('click', ()=>{ setLS('qc_p1_img',''); preview.src = 'assets/photo_placeholder.png'; okStatus(status,'Photo cleared.'); });

  // Camera capture
  btnCamera?.addEventListener('click', async ()=>{
    try{
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // Create a temporary video to capture a frame
      const video = document.createElement('video');
      video.autoplay = true; video.srcObject = stream;
      await new Promise(res=> video.onloadedmetadata = res);
      // Take snapshot after a short delay
      setTimeout(()=>{
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth; canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);
        const data = canvas.toDataURL('image/png');
        preview.src = data; setLS('qc_p1_img', data); okStatus(status, 'Photo captured.');
        stream.getTracks().forEach(t=>t.stop());
      }, 300);
    } catch(err){ badStatus(status, 'Camera access denied or unavailable.'); }
  });

  // Save details (free text, optional seal)
  btnSubmit.addEventListener('click', ()=>{
    setLS('qc_p1_note', (note.value||'').trim());
    const seal = document.querySelector('input[name=seal]:checked');
    setLS('qc_p1_seal', seal ? seal.value : '');
    okStatus(status, 'Agent details saved.');
    // Not gating Page 2 anymore; it is already enabled by tabs.js
  });
})();

// Existing logic for Pages 2..6 remains the same; only Page 1 behavior changed
