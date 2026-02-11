/*******************************************************
 * Sapphire Heist – Unified webhook (GameLog + PhotoLog)
 * Now supports: full-size uploads (optional) + thumbnails
 *******************************************************/
const SHEET_ID = 'SHEET_ID_HERE';  // ← your spreadsheet ID
const TAB_GAME = 'GameLog';
const TAB_PHOTO = 'PhotoLog';

// ==== Photo saving switches ====
const SAVE_THUMB = true;  // keep thumbnails (old behavior)
const SAVE_FULL = true;  // keep full-size photos
// Which URL should go into the main "thumbnail/photo" column?
const PREFER_FULL_IN_MAIN_COLUMN = false; // false=thumb in main, true=full in main

// Drive folders (auto-created on first use)
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

/* ---------------- GameLog ---------------- */
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

/* ---------------- PhotoLog (with full-size support) ---------------- */
function handlePhoto(body) {
    var sessionId = String(body.session_id || '').trim();
    if (!sessionId) throw new Error('Missing session_id for PhotoLog');

    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sh = ss.getSheetByName(TAB_PHOTO);
    if (!sh) throw new Error('Tab not found: ' + TAB_PHOTO);

    // Ensure core headers; add photo_full when SAVE_FULL is enabled
    var baseHeaders = ['timestamp', 'name', 'feedback', 'thumbnail/photo', 'session_id'];
    if (SAVE_FULL) baseHeaders.push('photo_full');
    var info = ensureHeader(sh, baseHeaders);

    var t = String(body.type || '').toLowerCase();
    var now = new Date();
    var name = String(body.name || '').trim();
    var feedback = String(body.feedback || '').trim();

    if (t === 'photo_open') {
        var row = blankRow(info.lastCol);
        setIf(info, row, 'timestamp', now);
        setIf(info, row, 'name', name);
        setIf(info, row, 'feedback', feedback);
        setIf(info, row, 'thumbnail/photo', '');
        setIf(info, row, 'session_id', sessionId);
        if (SAVE_FULL && hasCol(info, 'photo_full')) setIf(info, row, 'photo_full', '');
        sh.appendRow(row);
        return out({ ok: true, mode: 'photo_append', sid: sessionId });
    }

    // Find existing row by session_id
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
        // If user hit capture/update without open
        var row2 = blankRow(info.lastCol);
        setIf(info, row2, 'timestamp', now);
        setIf(info, row2, 'name', name);
        setIf(info, row2, 'feedback', feedback);
        setIf(info, row2, 'thumbnail/photo', '');
        setIf(info, row2, 'session_id', sessionId);
        if (SAVE_FULL && hasCol(info, 'photo_full')) setIf(info, row2, 'photo_full', '');
        sh.appendRow(row2);
        target = sh.getLastRow();
    }

    if (t === 'photo_update') {
        if (hasCol(info, 'name') && name) sh.getRange(target, colOf(info, 'name')).setValue(name);
        if (hasCol(info, 'feedback')) sh.getRange(target, colOf(info, 'feedback')).setValue(feedback);
        return out({ ok: true, mode: 'photo_update_text', row: target, sid: sessionId });
    }

    if (t === 'photo_capture') {
        // Expect thumbB64 (optional) and fullB64 (optional)
        var thumbB64 = String(body.thumbB64 || '');
        var fullB64 = String(body.fullB64 || '');

        var thumbUrl = '';
        var fullUrl = '';

        if (SAVE_THUMB && thumbB64) {
            var folderT = getOrCreateFolder_(FOLDER_THUMBS);
            var blobT = Utilities.newBlob(Utilities.base64Decode(thumbB64), 'image/jpeg', 'thumb_' + Date.now() + '.jpg');
            var fileT = folderT.createFile(blobT);
            try { fileT.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW); } catch (_) { }
            thumbUrl = 'https://drive.google.com/uc?export=view&id=' + fileT.getId();
        }

        if (SAVE_FULL && fullB64) {
            var folderF = getOrCreateFolder_(FOLDER_FULL);
            var blobF = Utilities.newBlob(Utilities.base64Decode(fullB64), 'image/jpeg', 'photo_' + Date.now() + '.jpg');
            var fileF = folderF.createFile(blobF);
            try { fileF.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW); } catch (_) { }
            fullUrl = 'https://drive.google.com/uc?export=view&id=' + fileF.getId();
        }

        // Which URL goes to the main "thumbnail/photo" column?
        var mainUrl = '';
        if (PREFER_FULL_IN_MAIN_COLUMN) {
            mainUrl = fullUrl || thumbUrl;    // full preferred, fallback to thumb
        } else {
            mainUrl = thumbUrl || fullUrl;    // thumb preferred, fallback to full
        }

        if (hasCol(info, 'thumbnail/photo')) sh.getRange(target, colOf(info, 'thumbnail/photo')).setValue(mainUrl);
        if (hasCol(info, 'name') && name) sh.getRange(target, colOf(info, 'name')).setValue(name);
        if (hasCol(info, 'feedback')) sh.getRange(target, colOf(info, 'feedback')).setValue(feedback);

        // If you keep both and have a dedicated 'photo_full' column, store the full URL there
        if (SAVE_FULL && hasCol(info, 'photo_full')) {
            sh.getRange(target, colOf(info, 'photo_full')).setValue(fullUrl || '');
        }

        return out({ ok: true, mode: 'photo_update_media', row: target, sid: sessionId, main: mainUrl, full: fullUrl, thumb: thumbUrl });
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