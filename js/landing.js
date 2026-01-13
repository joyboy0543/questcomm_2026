
(function(){
  const qs = QC.getQS();
  const team = document.getElementById('team');
  const name = document.getElementById('name');
  if (qs.team) team.value = qs.team;
  if (qs.name) name.value = qs.name;

  // Resume availability
  const hasResume = localStorage.getItem('qc_open_case_title');
  if (hasResume){
    document.getElementById('resumeBox').style.display='block';
    const link = document.getElementById('resumeLink');
    link.style.display='inline-flex';
    link.href = 'game.html';
  }

  document.getElementById('briefingForm').addEventListener('submit', (e)=>{
    e.preventDefault();
    QC.saveProfile({team: team.value.trim(), name: name.value.trim()});
    const url = new URL('game.html', location.href);
    url.searchParams.set('team', team.value.trim());
    url.searchParams.set('name', name.value.trim());
    location.href = url.toString();
  });
})();
