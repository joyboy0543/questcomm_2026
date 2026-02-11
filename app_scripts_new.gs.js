/*******************************************************
 * Sapphire Heist – Unified webhook (GameLog + PhotoLog)
 * PhotoLog: uploads THUMB + FULL to Drive, writes NO URLs.
 *******************************************************/
const SHEET_ID = '1AoScqRBU6H-V_JcS2_L1JRAXLwHs3EezTRe-Ev2THNU';
const TAB_GAME = 'GameLog';
const TAB_PHOTO = 'PhotoLog';

// --- Photo saving (both kept) ---
const SAVE_THUMB = true;
const SAVE_FULL = true;

// Drive folders (auto-created)
const FOLDER_THUMBS = 'SapphireHeist-PhotoThumbs';
const FOLDER_FULL = 'SapphireHeist-Photos-Full';

function doPost(e) {
    try {
        if (!e || !e.postData || !e.postData.contents) {
            return out({ ok: false, error: 'No body' });
        }
        var body = JSON.parse(e.postData.contents);
        var t = String(body.type || '').toLowerCase();
        if (t.startsWith('photo_')) return handlePhoto(body);
        return handleGame(body);
    } catch (err) {
        return out({ ok: false, error: String(err) });
    }
}

/* ---------------- GameLog (unchanged) ---------------- */
function handleGame(body) {
    var sessionId = String(body.session_id || '').trim();
    if (!sessionId) throw new Error('Missing session_id for GameLog');

    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sh = ss.getSheetByName(TAB_GAME);
    if (!sh) throw new Error('Tab not found: ' + TAB_GAME);

    var info = ensureHeader(sh, [
        'timestamp', 'name', 'codename', 'department', 'completed', 'session_id'
    ]);

    var now = new Date();
    var isCompletion = (body.completed === true || body.completed === 'true');

    if (!isCompletion) {
        var row = blankRow(info.lastCol);
        setIf(info, row, 'timestamp', now);
        setIf(info, row, 'name', body.name || '');
        setIf(info, row, 'codename', body.codename || '');
        setIf(info, row, 'department', body.department || '');
        setIf(info, row, 'completed', false);
        setIf(info, row, 'session_id', sessionId);
        sh.appendRow(row);
        return out({ ok: true, mode: 'game_append', sid: sessionId });
    }

    var sidCol = colOf(info, 'session_id');
    var lastRow = sh.getLastRow();
    if (lastRow < 2) throw new Error('No data rows to update (GameLog)');

    var vals = sh.getRange(2, sidCol, lastRow - 1, 1).getValues();
    var target = -1;
    for (var i = vals.length - 1; i >= 0; i--) {
        if (String(vals[i][0]).trim() === sessionId) { target = 2 + i; break; }
    }

    if (target === -1) {
        var row2 = blankRow(info.lastCol);
        setIf(info, row2, 'timestamp', now);
        setIf(info, row2, 'name', body.name || '');
        setIf(info, row2, 'codename', body.codename || '');
        setIf(info, row2, 'department', body.department || '');
        setIf(info, row2, 'completed', true);
        setIf(info, row2, 'session_id', sessionId);
        sh.appendRow(row2);
        return out({ ok: true, mode: 'game_append_fallback', sid: sessionId });
    }

    var compCols = colsOf(info, 'completed');
    if (!compCols.length) throw new Error('Missing completed column(s) in GameLog');
    compCols.forEach(function (c) { sh.getRange(target, c).setValue(true); });

    return out({ ok: true, mode: 'game_update', row: target, sid: sessionId, cols: compCols });
}

/* ---------------- PhotoLog (no URL writing) ---------------- */
function handlePhoto(body) {
    var sessionId = String(body.session_id || '').trim();
    if (!sessionId) throw new Error('Missing session_id for PhotoLog');

    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sh = ss.getSheetByName(TAB_PHOTO);
    if (!sh) throw new Error('Tab not found: ' + TAB_PHOTO);

    // Only these columns are used in PhotoLog
    var info = ensureHeader(sh, ['timestamp', 'name', 'feedback', 'session_id']);

    var t = String(body.type || '').toLowerCase();
    var now = new Date();
    var name = String(body.name || '').trim();
    var feedback = String(body.feedback || '').trim();

    if (t === 'photo_open') {
        var row = blankRow(info.lastCol);
        setIf(info, row, 'timestamp', now);
        setIf(info, row, 'name', name);
        setIf(info, row, 'feedback', feedback);
        setIf(info, row, 'session_id', sessionId);
        sh.appendRow(row);
        return out({ ok: true, mode: 'photo_append', sid: sessionId });
    }

    // find row by session_id
    var sidCol = colOf(info, 'session_id');
    var lastRow = sh.getLastRow();
    var target = -1;
    if (lastRow >= 2) {
        var vals = sh.getRange(2, sidCol, lastRow - 1, 1).getValues();
        for (var i = vals.length - 1; i >= 0; i--) {
            if (String(vals[i][0]).trim() === sessionId) { target = 2 + i; break; }
        }
    }
    if (target === -1) {
        var row2 = blankRow(info.lastCol);
        setIf(info, row2, 'timestamp', now);
        setIf(info, row2, 'name', name);
        setIf(info, row2, 'feedback', feedback);
        setIf(info, row2, 'session_id', sessionId);
        sh.appendRow(row2);
        target = sh.getLastRow();
    }

    if (t === 'photo_update') {
        if (hasCol(info, 'name') && name) sh.getRange(target, colOf(info, 'name')).setValue(name);
        if (hasCol(info, 'feedback')) sh.getRange(target, colOf(info, 'feedback')).setValue(feedback);
        return out({ ok: true, mode: 'photo_update_text', row: target, sid: sessionId });
    }

    if (t === 'photo_capture') {
        // Accept both; upload both; DO NOT write URLs into the sheet
        var thumbB64 = String(body.thumbB64 || '');
        var fullB64 = String(body.fullB64 || '');

        if (SAVE_THUMB && thumbB64) {
            var folderT = getOrCreateFolder_(FOLDER_THUMBS);
            var fileNameT = 'thumb_' + sessionId + '_' + ts_() + '.jpg';
            var blobT = Utilities.newBlob(Utilities.base64Decode(thumbB64), 'image/jpeg', fileNameT);
            var fileT = folderT.createFile(blobT);
            try { fileT.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW); } catch (_) { }
        }

        if (SAVE_FULL && fullB64) {
            var folderF = getOrCreateFolder_(FOLDER_FULL);
            var fileNameF = 'photo_' + sessionId + '_' + ts_() + '.jpg';
            var blobF = Utilities.newBlob(Utilities.base64Decode(fullB64), 'image/jpeg', fileNameF);
            var fileF = folderF.createFile(blobF);
            try { fileF.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW); } catch (_) { }
        }

        // Optional: update name/feedback if provided, but no URL writing
        if (hasCol(info, 'name') && name) sh.getRange(target, colOf(info, 'name')).setValue(name);
        if (hasCol(info, 'feedback')) sh.getRange(target, colOf(info, 'feedback')).setValue(feedback);

        return out({ ok: true, mode: 'photo_update_media', row: target, sid: sessionId });
    }

    return out({ ok: false, error: 'Unknown photo type: ' + t });
}

/* ---------------- Utilities ---------------- */
function out(obj) {
    return ContentService.createTextOutput(JSON.stringify(obj))
        .setMimeType(ContentService.MimeType.JSON);
}
function blankRow(n) { return new Array(n).fill(''); }
function ensureHeader(sh, names) {
    var lastCol = Math.max(names.length, sh.getLastColumn());
    var header = sh.getRange(1, 1, 1, lastCol).getValues()[0].map(v => String(v || ''));
    var lower = header.map(h => h.trim().toLowerCase());
    names.forEach(function (n) {
        var t = n.trim().toLowerCase();
        if (lower.indexOf(t) === -1) {
            lastCol += 1;
            sh.getRange(1, lastCol).setValue(n);
            header.push(n);
            lower.push(t);
        }
    });
    var first = {}, multi = {};
    lower.forEach(function (k, i) {
        if (!(k in first)) first[k] = i + 1;
        if (!(k in multi)) multi[k] = [];
        multi[k].push(i + 1);
    });
    return {
        lastCol: Math.max(lastCol, sh.getLastColumn()),
        first: first,
        multi: multi
    };
}
function colOf(info, name) {
    var k = String(name).trim().toLowerCase();
    if (!(k in info.first)) throw new Error('Missing column: ' + name);
    return info.first[k];
}
function colsOf(info, name) {
    var k = String(name).trim().toLowerCase();
    return info.multi[k] || [];
}
function setIf(info, row, name, val) {
    var c = info.first[String(name).trim().toLowerCase()];
    if (c) row[c - 1] = val;
}
function hasCol(info, name) {
    return (String(name).trim().toLowerCase() in info.first);
}
function getOrCreateFolder_(name) {
    var it = DriveApp.getFoldersByName(name);
    if (it.hasNext()) return it.next();
    return DriveApp.createFolder(name);
}
function ts_() {
    return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd_HHmmss');
}