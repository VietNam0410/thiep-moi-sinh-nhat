const SHEET_NAME = 'RSVP';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(['Timestamp', 'Name', 'Role', 'Wishlist', 'Attending']);
    }
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', 'Name', 'Role', 'Wishlist', 'Attending']);
    }
    const timestamp = data.timestamp || new Date().toISOString();
    const name = data.name || '';
    const role = data.role || '';
    const wishlist = Array.isArray(data.wishlist)
      ? data.wishlist.join(', ')
      : (data.wishlist || '');
    const attending = data.attending === true || data.attending === 'true' ? 'Yes' : 'No';
    sheet.appendRow([timestamp, name, role, wishlist, attending]);
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'RSVP endpoint running' }))
    .setMimeType(ContentService.MimeType.JSON);
}
