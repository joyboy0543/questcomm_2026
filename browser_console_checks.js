// Checks on console:

// If photo is uploaded to Drive
(async () => {
    const fd = new FormData();
    fd.append('op', 'uploadPhoto');
    fd.append('agentName', 'Test Detective');
    fd.append('filename', 'test_upload.jpg');
    // 1x1 transparent PNG
    fd.append('imageBase64', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYV2P4z8DwHwAFkQIkQ9k8VQAAAABJRU5ErkJggg==');
    const r = await fetch(SCRIPT_URL, { method: 'POST', body: fd });
    const j = await r.json().catch(() => null);
    console.log('Drive test:', r.status, j);
})();

// If telemetry is added to the sheet
import('./modules/telemetry.js').then(async m => {
    const fd = new FormData();
    fd.append('op', 'start');
    fd.append('name', 'Test User');
    fd.append('codename', 'Alpha');
    fd.append('department', 'Forensics');
    fd.append('sessionId', m.SESSION_ID);
    const res = await fetch(m.SCRIPT_URL, { method: 'POST', body: fd });
    console.log('start row →', res.status);
});

// If telemetry is amended to the sheet
import('./modules/telemetry.js').then(async m => {
    await m.appendAttempt('photo puzzle', '999');   // Column must match header (case-insensitive)
    console.log('append attempt done');
});