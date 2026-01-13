
window.QC = {
  getQS() {
    const obj = {};
    new URLSearchParams(location.search).forEach((v,k)=>obj[k]=v);
    return obj;
  },
  saveProfile({team, name}){
    localStorage.setItem('qc_team', team || '');
    localStorage.setItem('qc_name', name || '');
    localStorage.setItem('qc_profile_ts', String(Date.now()));
  },
  loadProfile(){
    return {
      team: localStorage.getItem('qc_team') || '',
      name: localStorage.getItem('qc_name') || ''
    };
  },
  badge(el){
    const {team,name} = this.loadProfile();
    const div = document.getElementById(el);
    if (!div) return;
    div.innerHTML = '';
    if (team || name){
      const chip = document.createElement('div');
      chip.className = 'chip';
      chip.innerHTML = `👮 <strong>${name||'Agent'}</strong> — Team ${team||'—'}`;
      div.appendChild(chip);
    }
  }
};
