
(function(){
  const form=document.getElementById('briefingForm');
  form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const name=document.getElementById('name').value.trim();
    if(!name){ alert('Name is required'); return; }
    const dept=document.getElementById('dept').value;
    const pwd=document.getElementById('password').value.trim();
    QC.saveProfile({department:dept,name,pwd});
    location.href='game.html';
  });
})();
