
(function(){
  const form=document.getElementById('briefingForm');
  const resumeLink=document.getElementById('resumeLink');
  if(localStorage.getItem('qc_open_case_title')){resumeLink.style.display='inline-block';}
  form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const name=document.getElementById('name').value.trim();
    if(!name){ alert('Agent Name is required'); return; }
    QC.saveProfile({
      team: document.getElementById('team').value.trim(),
      name,
      password: document.getElementById('password').value.trim(),
      investigatorId: document.getElementById('investigatorId').value.trim()
    });
    location.href='game.html';
  });
})();
