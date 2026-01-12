
// Show ALL puzzles, with relative asset paths for GitHub Project Pages
export function mountAll(containerSel = '#puzzle-area'){
  const el = document.querySelector(containerSel);
  if (!el) return;
  el.innerHTML = '';
  const sections = [
    { id:'spot_the_anomaly', component: renderAnomaly },
    { id:'timeline_order',   component: renderTimeline },
    { id:'surveillance_gif', component: renderCCTV },
    { id:'cipher_note',      component: renderCipherNote },
  ];
  for (const p of sections){
    const section = document.createElement('section');
    section.className = `puzzle puzzle-${p.id}`;
    el.appendChild(section);
    p.component(section);
  }
}
function renderCipherNote(root){
  root.innerHTML = `
    <h3>Cipher Note</h3>
    <p>Decode: <code>Uifsf jt b tfdsfu wjtf; 22:41</code></p>
    <button class="btn" id="cipher-btn">Solve</button>
  `;
  root.querySelector('#cipher-btn').onclick = () => alert('There is a secret vise; 22:41 (Caesar +1)');
}
function renderAnomaly(root){
  root.innerHTML = `
    <h3>Spot the Anomaly</h3>
    <p>Which item does not belong in the evidence list?</p>
    <ul>
      <li>Lock picks</li>
      <li>Warehouse badge</li>
      <li>Beach towel</li>
    </ul>
  `;
}
function renderTimeline(root){
  root.innerHTML = `
    <h3>Timeline Order</h3>
    <p>Arrange events chronologically: [Entry, Camera glitch, Exit]</p>
  `;
}
function renderCCTV(root){
  const url = './assets/img/cctv_loop.gif';
  const imgId = 'cctv-img';
  root.innerHTML = `
    <h3>Surveillance Footage</h3>
    <div class="cctv">
      <img id="${imgId}" src="${url}" alt="CCTV">
      <div class="overlay time">22:41:07</div>
      <div class="overlay rec">REC ●</div>
    </div>
    <p>Question: What unusual event occurs at the <b>warehouse door</b>?</p>
    <button class="btn" id="cctv-submit">Submit Observation</button>
  `;
  root.querySelector('#cctv-submit').addEventListener('click', ()=> alert('Logged. Dispatch updated.'));
  const img = root.querySelector(`#${imgId}`);
  img.addEventListener('error', ()=>{ root.querySelector('.cctv').style.display = 'none'; });
}
