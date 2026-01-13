
(function(){
  const qs = QC.getQS();
  ['team','name','password','investigatorId'].forEach(k=>{
    const el = document.getElementById(k);
    if (qs[k]) el.value = qs[k];
  });
  const hasResume = localStorage.getItem('qc_open_case_title');
  if (hasResume){
    const link = document.getElementById('resumeLink');
    link.style.display='inline-flex'; link.href='game.html';
  }
  document.getElementById('briefingForm').addEventListener('submit', (e)=>{
    e.preventDefault();
    QC.saveProfile({
      team: team.value.trim(),
      name: name.value.trim(),
      password: password.value.trim(),
      investigatorId: investigatorId.value.trim()
    });
    const url = new URL('game.html', location.href);
    ['team','name','password','investigatorId'].forEach(k=>{
      const v = document.getElementById(k).value.trim();
      url.searchParams.set(k, v);
    });
    location.href = url.toString();
  });
})();
