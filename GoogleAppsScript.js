/**
 * ============================================================
 * Google Apps Script — RSVP Birthday Invitation
 * ============================================================
 *
 * HƯỚNG DẪN SETUP:
 * 1. Mở Google Sheets mới → tạo sheet tên "RSVP" (hoặc để mặc định Sheet1)
 * 2. Dòng 1 (header) ghi các cột:
 *    Timestamp | Name | Role | Wishlist | Attending
 * 3. Extensions → Apps Script
 * 4. Xóa code mặc định, dán toàn bộ file này vào
 * 5. Deploy → New deployment → Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Copy Web App URL → dán vào CONFIG.gasEndpoint trong index.html
 * 7. (Tuỳ chọn) Chạy hàm setupSheet() một lần để tạo header tự động
 */

const SHEET_NAME = 'RSVP'; // Đổi nếu bạn đặt tên sheet khác

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(['Timestamp', 'Name', 'Role', 'Wishlist', 'Attending']);
    }

    // Đảm bảo có header
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
      .createTextOutput(JSON.stringify({ status: 'ok', message: 'RSVP saved' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Cho phép test bằng GET (mở URL trên trình duyệt)
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'ok',
      message: 'Birthday RSVP endpoint is running. Use POST to submit data.'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Chạy một lần để tạo sheet + header nếu chưa có
 */
function setupSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Timestamp', 'Name', 'Role', 'Wishlist', 'Attending']);
    sheet.getRange(1, 1, 1, 5).setFontWeight('bold');
  }
  Logger.log('Sheet ready: ' + SHEET_NAME);
}
