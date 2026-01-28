// modules/telemetry.js
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyTx-QL4JV3ujreEHhZXQOwzsu2_t1PCKyapKWTo7Qp85pgwOVF6Nio3h-OwBiRCgH5Dg/exec';

// Per-visit session (new every load)
const SESSION_ID = crypto.randomUUID();

// Start a row on landing/agree
export async function startSession({ name, codename, department }) {
    const form = new FormData();
    form.append('op', 'start');
    form.append('name', name || '');
    form.append('codename', codename || '');
    form.append('department', department || '');
    form.append('sessionId', SESSION_ID);
    await fetch(SCRIPT_URL, { method: 'POST', body: form }); // append-only, no-cors needed
}

// Append an attempt to a given sheet column
export async function appendAttempt(key, value) {
    const form = new FormData();
    form.append('op', 'append');
    form.append('sessionId', SESSION_ID);
    form.append('key', key);     // must match header, e.g. "photo puzzle"
    form.append('value', value); // your attempt string
    await fetch(SCRIPT_URL, { method: 'POST', body: form });
}