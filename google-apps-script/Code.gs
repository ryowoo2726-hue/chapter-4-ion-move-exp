const FOLDER_ID = 'PASTE_DRIVE_FOLDER_ID_HERE';
const ADMIN_PIN = '2726';
const STEPS_CONFIG_KEY = 'ION_STEPS_CONFIG';

function doGet(e) {
  try {
    const action = e.parameter.action;
    if (action === 'getConfig') {
      const stepsJson = PropertiesService.getScriptProperties().getProperty(STEPS_CONFIG_KEY);
      return json({
        ok: true,
        steps: stepsJson ? JSON.parse(stepsJson) : null
      });
    }

    return json({ ok: false, error: 'unknown action' });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    if (data.action === 'saveConfig') {
      if (String(data.pin || '') !== ADMIN_PIN) {
        return json({ ok: false, error: 'invalid pin' });
      }
      if (!Array.isArray(data.steps) || data.steps.length === 0) {
        return json({ ok: false, error: 'invalid steps' });
      }

      PropertiesService
        .getScriptProperties()
        .setProperty(STEPS_CONFIG_KEY, JSON.stringify(data.steps));

      return json({ ok: true });
    }

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
