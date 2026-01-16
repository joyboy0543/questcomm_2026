// Tab switching & radio feed
const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');

tabs.forEach(t => t.addEventListener('click', () => {
  tabs.forEach(x => x.classList.remove('active'));
  t.classList.add('active');
  const id = t.dataset.tab;
  panels.forEach(p => p.hidden = p.id !== id);
}));

// Simple simulated radio feed
const feed = document.getElementById('feedScroll');
const feedMsgs = [
  'HQ: Dispatching update. All units stay sharp.',
  'Ops: New intel suggests the jewel was split into decoys.',
  'Analyst: Cipher shift might be positive. Try sliding right.',
  'Field: Network interference detected near vault corridor.',
  'Lab: Pattern device calibrated. Ready for sequence capture.'
];
function pushMsg(text){
  const el = document.createElement('div');
  el.className = 'msg';
  el.textContent = new Date().toLocaleTimeString()+ ' — ' + text;
  feed.appendChild(el);
}
let idx=0; setInterval(() => pushMsg(feedMsgs[idx++%feedMsgs.length]), 5000);

// Boot modules
window.addEventListener('DOMContentLoaded', () => {
  window.initCipherDesk?.();
  window.initMastermind?.();
  window.initPlanarity?.();
  window.initSimon?.();
});
