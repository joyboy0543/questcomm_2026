
(function(){
  const nameField=document.getElementById('name');
  const form=document.getElementById('briefingForm');
  const resumeLink=document.getElementById('resumeLink');
  const hasResume=localStorage.getItem('qc_open_case_title');
  if(hasResume){resumeLink.style.display='inline-block';}
  form.addEventListener('submit',(e)=>{
    e.preventDefault();
    if(!nameField.value.trim()){alert('Agent Name is required');return;}
    localStorage.setItem('qc_name',nameField.value.trim());
    localStorage.setItem('qc_team',document.getElementById('team').value.trim());
    localStorage.setItem('qc_investigator_id',document.getElementById('investigatorId').value.trim());
    localStorage.setItem('qc_password',document.getElementById('password').value.trim());
    window.location.href='game.html';
  });
})();
