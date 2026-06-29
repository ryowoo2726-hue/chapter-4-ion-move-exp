const FOLDER_ID = 'PASTE_DRIVE_FOLDER_ID_HERE';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const studentId = String(data.studentId || '').trim();

    if (!/^[0-9A-Za-z_-]{1,30}$/.test(studentId) || !data.fileBase64) {
      return json({ ok: false, error: 'invalid payload' });
    }

    const bytes = Utilities.base64Decode(data.fileBase64);
    const blob = Utilities.newBlob(
      bytes,
      'application/pdf',
      `${studentId}_ion_report_${Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyyMMdd_HHmmss')}.pdf`
    );
    const file = DriveApp.getFolderById(FOLDER_ID).createFile(blob);

    return json({ ok: true, fileId: file.getId(), url: file.getUrl() });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function json(value) {
  return ContentService
    .createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}
