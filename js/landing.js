
(function(){
  const qs = QC.getQS();
  const team = document.getElementById('team');
  const name = document.getElementById('name');
  const password = document.getElementById('password');
  const investigatorId = document.getElementById('investigatorId');
  if (qs.team) team.value = qs.team;
  if (qs.name) name.value = qs.name;
  if (qs.password) password.value = qs.password;
  if (qs.investigatorId) investigatorId.value = qs.investigatorId;

  const hasResume = localStorage.getItem('qc_open_case_title');
  if (hasResume){
    document.getElementById('resumeBox').style.display='block';
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
