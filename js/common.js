
window.QC = {
  getQS() { const o={}; new URLSearchParams(location.search).forEach((v,k)=>o[k]=v); return o; },
  saveProfile({team,name,password,investigatorId}){
    localStorage.setItem('qc_team', team||'');
    localStorage.setItem('qc_name', name||'');
    localStorage.setItem('qc_password', password||'');
    localStorage.setItem('qc_investigator_id', investigatorId||'');
    localStorage.setItem('qc_profile_ts', String(Date.now()));
  },
  loadProfile(){ return {
    team: localStorage.getItem('qc_team')||'',
    name: localStorage.getItem('qc_name')||'',
    password: localStorage.getItem('qc_password')||'',
    investigatorId: localStorage.getItem('qc_investigator_id')||''
  }; },
  badge(el){
    const {team,name,investigatorId}=this.loadProfile();
    const div=document.getElementById(el); if(!div) return; div.innerHTML='';
    const chip=document.createElement('div'); chip.className='chip';
    chip.innerHTML = `👮 <strong>${name||'Agent'}</strong> — Team ${team||'—'} — ID ${investigatorId||'—'}`;
    div.appendChild(chip);
  }
};
