// modules/telemetry.js

// 1) Point to your unified Apps Script Web App (same one used by photo.html)
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzuWTxtwBr4sfEzOLulyqFQPJFfvsJvw-8MRBbYfRom5hccix0DyyfPS78AaD2jeKjFRw/exec';

// 2) Per-visit session (new every load)
const SESSION_ID = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

// 3) Optional event name via URL (e.g., ?event=Sapphire%202026)
function getEventFromQuery() {
    try {
        const p = new URLSearchParams(location.search);
        return (p.get('event') || '').trim();
    } catch {
        return '';
    }
}

// 4) Common sender: prefer fetch(JSON), fallback to sendBeacon
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
        } catch {
            // swallow
        }
    }
}

// 5) Public API

/**
 * Start a game session row (called on Agree).
 * The Apps Script will write this into the GameLog sheet with kind='session'
 */
export async function startSession({ name, codename, department }) {
    const payload = {
        type: 'game-session',
        sessionId: SESSION_ID,
        name: (name || '').trim(),
        codename: (codename || '').trim(),
        department: (department || '').trim(),
        event: getEventFromQuery(),
        ua: (typeof navigator !== 'undefined' && navigator.userAgent) ? navigator.userAgent : '',
        ts: Date.now()
    };
    await postJSON(payload);
}

/**
 * Append an attempt row (called on each Confirm).
 * The Apps Script will write this into the GameLog sheet with kind='attempt'
 */
export async function appendAttempt(puzzleKey, value) {
    const payload = {
        type: 'game-attempt',
        sessionId: SESSION_ID,
        puzzle: (puzzleKey || '').trim(),   // e.g., 'photo puzzle', 'riddle 1', 'doorway sequence'
        answer: (value || '').trim(),       // user-entered value
        event: getEventFromQuery(),
        // identity is optional here; if you want to attach the latest, we can read from localStorage:
        name: (typeof localStorage !== 'undefined' ? (localStorage.getItem('qcpd.name') || '') : ''),
        codename: (typeof localStorage !== 'undefined' ? (localStorage.getItem('qcpd.codename') || '') : ''),
        department: (typeof localStorage !== 'undefined' ? (localStorage.getItem('qcpd.department') || '') : ''),
        ua: (typeof navigator !== 'undefined' && navigator.userAgent) ? navigator.userAgent : '',
        ts: Date.now()
    };
    await postJSON(payload);
}