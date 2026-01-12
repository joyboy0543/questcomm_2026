
// Puzzle pool + randomizer + CCTV puzzle
export function selectPuzzles(count = 3){ const p = [...pool].sort(()=>Math.random()-0.5); return p.slice(0, count); }
export function mountSelected(containerSel = '#puzzle-area', count = 3){
  const el = document.querySelector(containerSel); if(!el) return; el.innerHTML = '';
  for(const p of selectPuzzles(count)){
    const section = document.createElement('section'); section.className = `puzzle puzzle-${p.id}`; el.appendChild(section); p.component(section);
  }
}
const pool = [
  { id:'cipher_note',    weight:1, component: renderCipherNote },
  { id:'spot_the_anomaly', weight:1, component: renderAnomaly },
  { id:'timeline_order', weight:1, component: renderTimeline },
  { id:'surveillance_gif', weight:1, component: renderCCTV },
];
function renderCipherNote(root){ root.innerHTML = `<h3>Cipher Note</h3><p>Decode: <code>Uifsf jt b tfdsfu wjtf; 22:41</code></p><button class="btn" id="cipher-btn">Solve</button>`; root.querySelector('#cipher-btn').onclick = ()=> alert('There is a secret vise; 22:41 (Caesar +1)'); }
function renderAnomaly(root){ root.innerHTML = `<h3>Spot the Anomaly</h3><p>Which item does not belong in the evidence list?</p><ul><li>Lock picks</li><li>Warehouse badge</li><li>Beach towel</li></ul>`; }
function renderTimeline(root){ root.innerHTML = `<h3>Timeline Order</h3><p>Arrange events chronologically: [Entry, Camera glitch, Exit]</p>`; }
function renderCCTV(root){ root.innerHTML = `
  <h3>Surveillance Footage</h3>
  <div class="cctv">
    <img src="/assets/img/cctv_loop.gif" alt="CCTV">
    <div class="overlay time">22:41:07</div>
    <div class="overlay rec">REC ●</div>
  </div>
  <p>Question: What unusual event occurs at the <b>warehouse door</b>?</p>
  <button class="btn" id="cctv-submit">Submit Observation</button>`;
  root.querySelector('#cctv-submit').addEventListener('click', ()=> alert('Logged. Dispatch updated.'));
}
