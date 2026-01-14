
window.QC = {
  saveProfile({department,name,password}){
    localStorage.setItem('qc_dept', department||'');
    localStorage.setItem('qc_name', name||'');
    localStorage.setItem('qc_password', password||'');
    localStorage.setItem('qc_profile_ts', String(Date.now()));
    localStorage.setItem('qc_p1_ok','1');
  },
  loadProfile(){ return {
    department: localStorage.getItem('qc_dept')||'',
    name: localStorage.getItem('qc_name')||''
  }; },
  badge(el){ const {department,name}=this.loadProfile(); const div=document.getElementById(el); if(!div) return; div.innerHTML=''; const chip=document.createElement('div'); chip.className='chip'; chip.innerHTML = `👮 <strong>${name||'Agent'}</strong> • ${department||'—'}`; div.appendChild(chip); },
  chips(){ const el=document.getElementById('progress'); if(!el) return; el.innerHTML=''; const defs=[['Briefing','qc_p1_ok'],['Cipher','qc_p2_ok'],['Logic','qc_p3_ok'],['Network','qc_p4_ok'],['Pattern','qc_p5_ok'],['Clearance','qc_p6_unlocked']]; defs.forEach(([label,key])=>{ const chip=document.createElement('div'); chip.className='progress-chip'; const dot=document.createElement('span'); dot.className='dot'; chip.appendChild(dot); const txt=document.createElement('span'); txt.textContent=label; chip.appendChild(txt); if(localStorage.getItem(key)==='1'){ chip.classList.add('solved'); } el.appendChild(chip); }); },
  async chime(){ try{ const AudioCtx = window.AudioContext || window.webkitAudioContext; const ctx = new AudioCtx(); const o = ctx.createOscillator(); const g = ctx.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(640, ctx.currentTime); g.gain.setValueAtTime(0.0001, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime+0.02); g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime+0.40); o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime+0.42); }catch(e){} }
};
