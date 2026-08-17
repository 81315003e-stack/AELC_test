/**
 * Art Adventure - teacher backend
 *
 * Receives one submission per student and appends it as a row.
 * Deploy: Extensions > Apps Script, paste this file, then
 * Deploy > New deployment > Web app
 *   Execute as: Me
 *   Who has access: Anyone
 * Copy the /exec URL into APPS_SCRIPT_URL in index.html.
 */

const SHEET_NAME = 'Responses';

const HEADERS = [
  'submittedAt', 'classCode', 'seat',
  'idea', 'ideaLabel', 'galleryName',
  'colourA', 'colourB', 'colourResult', 'colourHex',
  'shape', 'drawingBlank',
  'reflectColour', 'reflectShape', 'reflectDraw', 'mostLikeMe',
  'mixResets', 'sameColourTries', 'canvasClears', 'strokes', 'walkAways',
  'stationOrder', 'secColour', 'secShape', 'secDraw', 'totalSeconds',
  'drawingPng'
];

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = getSheet_();

    sheet.appendRow([
      data.submittedAt || new Date().toISOString(),
      data.classCode || '',
      data.seat || '',
      data.idea || '',
      data.ideaLabel || '',
      data.galleryName || '',
      pick_(data, 'works.color.a'),
      pick_(data, 'works.color.b'),
      pick_(data, 'works.color.result'),
      pick_(data, 'works.color.hex'),
      pick_(data, 'works.shape.name'),
      pick_(data, 'works.draw.blank'),
      pick_(data, 'reflect.color'),
      pick_(data, 'reflect.shape'),
      pick_(data, 'reflect.draw'),
      pick_(data, 'reflect.mostLikeMe'),
      pick_(data, 'log.mixResets'),
      pick_(data, 'log.sameColourTries'),
      pick_(data, 'log.canvasClears'),
      pick_(data, 'log.strokes'),
      pick_(data, 'log.walkAways'),
      (pick_(data, 'log.order') || []).join(' > '),
      pick_(data, 'log.seconds.color'),
      pick_(data, 'log.seconds.shape'),
      pick_(data, 'log.seconds.draw'),
      pick_(data, 'log.totalSeconds'),
      truncate_(data.drawing || '', 45000)
    ]);

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function doGet() {
  return json_({ ok: true, message: 'Art Adventure endpoint is running.' });
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/** Reads a nested path like 'works.color.a' without throwing. */
function pick_(obj, path) {
  const parts = path.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length; i++) {
    if (cur === null || cur === undefined) return '';
    cur = cur[parts[i]];
  }
  return cur === null || cur === undefined ? '' : cur;
}

/** A spreadsheet cell holds at most 50000 characters. */
function truncate_(str, max) {
  return str.length > max ? '' : str;
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
