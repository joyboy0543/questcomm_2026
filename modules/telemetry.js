// modules/telemetry.js

// Use the same Web App as photo.html
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzuWTxtwBr4sfEzOLulyqFQPJFfvsJvw-8MRBbYfRom5hccix0DyyfPS78AaD2jeKjFRw/exec';

// Per-visit session (new every load)
export const SESSION_ID = (typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

function getEventFromQuery() {
    try {
        const p = new URLSearchParams(location.search);
        return (p.get('event') || '').trim();
    } catch { return ''; }
}

function getUA() {
    return (typeof navigator !== 'undefined' && navigator.userAgent) ? navigator.userAgent : '';
}

function getIdentity() {
    const name = (typeof localStorage !== 'undefined' ? (localStorage.getItem('qcpd.name') || '') : '');
    let codename = (typeof localStorage !== 'undefined' ? (localStorage.getItem('qcpd.codename') || '') : '');
    const department = (typeof localStorage !== 'undefined' ? (localStorage.getItem('qcpd.department') || '') : '');
    if (!codename) {
        codename = makeCodename();
        try { localStorage.setItem('qcpd.codename', codename); } catch { }
    }
    return {
        name: (name || 'Detective'),
        codename,
        department
    };
}

function makeCodename() {
    const animals = ['Eagle', 'Falcon', 'Raven', 'Viper', 'Lynx', 'Cobra', 'Wolf', 'Orca', 'Panther', 'Kestrel', 'Otter', 'Fox', 'Bear'];
    const a = animals[Math.floor(Math.random() * animals.length)];
    const n = Math.floor(100 + Math.random() * 900);
    return `${a}-${n}`;
}

// Sender (prefers fetch JSON, fallback to beacon)
async function postJSON(payload) {
    try {
        await fetch(SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            keepalive: true
        });
        return;
    } catch (e) {
        try {
            const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
            if (navigator.sendBeacon) navigator.sendBeacon(SCRIPT_URL, blob);
        } catch { }
    }
}

/** Start a session (Agree). Upserts a row into GameLog with started=1. */
export async function startSession({ name, codename, department }) {
    // Merge with local identity and defaults
    const local = getIdentity();
    const payload = {
        type: 'game-session',
        sessionId: SESSION_ID,
        name: (name || local.name || 'Detective').trim(),
        codename: (codename || local.codename || makeCodename()).trim(),
        department: (department || local.department || '').trim(),
        event: getEventFromQuery(),
        ua: getUA(),
        ts: Date.now()
    };
    // Persist any provided fields
    try {
        if (payload.name) localStorage.setItem('qcpd.name', payload.name);
        if (payload.codename) localStorage.setItem('qcpd.codename', payload.codename);
        if (payload.department) localStorage.setItem('qcpd.department', payload.department);
    } catch { }
    await postJSON(payload);
    // Also mark started flag as progress
    await markSection('started', 1);
}

/** Mark a section as done/undone. Sections: started, photo, riddle1, potion, doorway, corridor, completed */
export async function markSection(sectionKey, done = 1) {
    const id = getIdentity();
    const payload = {
        type: 'game-progress',
        sessionId: SESSION_ID,
        section: String(sectionKey || '').toLowerCase(),
        value: done ? 1 : 0,
        event: getEventFromQuery(),
        name: id.name,
        codename: id.codename,
        department: id.department,
        ua: getUA(),
        ts: Date.now()
    };
    await postJSON(payload);
}

/** Optional audit per attempt (writes to GameAttempts sheet). */
export async function appendAttempt(puzzleKey, value) {
    const id = getIdentity();
    const payload = {
        type: 'game-attempt',
        sessionId: SESSION_ID,
        puzzle: (puzzleKey || '').trim(),
        answer: (value || '').trim(),
        event: getEventFromQuery(),
        name: id.name,
        codename: id.codename,
        department: id.department,
        ua: getUA(),
        ts: Date.now()
    };
    await postJSON(payload);
}