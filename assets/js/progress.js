
const KEY = 'qc_progress_v1';
export function getProgress(){ try{ return JSON.parse(localStorage.getItem(KEY)||'{}'); }catch{ return {}; } }
export function setProgress(p){ localStorage.setItem(KEY, JSON.stringify(p)); }
export function advanceLevel(){ const p = getProgress(); p.level = (p.level||1)+1; setProgress(p); return p.level; }
export function initMap(){ const w = document.getElementById('poi-warehouse'); if(w){ w.addEventListener('click', ()=> alert('Warehouse lock shows tampering at 22:41.')); } }
