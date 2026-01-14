(function(){
  var form=document.getElementById('briefingForm');
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var name=document.getElementById('name').value.trim();
    if(!name){ alert('Name is required'); return; }
    var dept=document.getElementById('dept').value;
    var pwd=document.getElementById('password').value.trim();
    QC.saveProfile({department:dept,name:name,password:pwd});
    location.href='game.html';
  });
})();