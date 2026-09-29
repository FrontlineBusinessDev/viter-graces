import ExcelJS from "exceljs";

const LOGO_URL = "/img/SideLogo.png";
const LOGO_ASPECT_RATIO = 90 / 251; // SideLogo.png's natural height/width
const LOGO_ROW_HEIGHT = 46; // points
const HEADER_ROWS = 6; // logo row + 3 banner rows + accent row + blank spacer
const DEFAULT_COL_PX = 64; // Excel's default column width (8.43 chars) in pixels

const THEME = {
  green: "FF1B5E20",
  lightGreen: "FFC8E6C9",
  darkGreenText: "FF1B5E20",
  yellow: "FFFFC107",
  yellowText: "FFFFF59D",
};

let logoBufferPromise = null;
function getLogoBuffer() {
  if (!logoBufferPromise) {
    logoBufferPromise = fetch(LOGO_URL)
      .then((res) => (res.ok ? res.arrayBuffer() : null))
      .catch(() => null);
  }
  return logoBufferPromise;
}

function downloadBuffer(buffer, fileName) {
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

function fillCell(cell, color) {
  cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: color } };
}

// Builds and downloads an .xlsx with the Graces logo (its own row, so it never
// overlaps the text banner beneath it) followed by `rows` (a plain array of
// arrays: one row per array, one cell per element). `headerRowIndexes` marks
// which entries in `rows` are labels/column headers to highlight in green.
export async function exportRowsToXlsx({
  rows,
  fileName,
  title,
  sheetName = "Export",
  headerRowIndexes = [],
}) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(sheetName);

  const colCount = Math.max(1, ...rows.map((row) => row.length));

  // Row 1: logo only - kept clear of text so the image can never overlap it.
  sheet.mergeCells(1, 1, 1, colCount);
  sheet.getRow(1).height = LOGO_ROW_HEIGHT;

  // Rows 2-4: green title banner, row 5: yellow accent underline.
  for (let r = 2; r <= 4; r += 1) {
    sheet.mergeCells(r, 1, r, colCount);
  }
  sheet.mergeCells(5, 1, 5, colCount);

  sheet.getRow(2).height = 28;
  fillCell(sheet.getCell(2, 1), THEME.green);
  const titleCell = sheet.getCell(2, 1);
  titleCell.value = "GRACES";
  titleCell.font = { size: 18, bold: true, color: { argb: THEME.yellowText } };
  titleCell.alignment = { horizontal: "center", vertical: "middle" };

  sheet.getRow(3).height = 18;
  fillCell(sheet.getCell(3, 1), THEME.green);
  const subtitleCell = sheet.getCell(3, 1);
  subtitleCell.value = title || sheetName;
  subtitleCell.font = { size: 11, bold: true, color: { argb: "FFFFFFFF" } };
  subtitleCell.alignment = { horizontal: "center", vertical: "middle" };

  sheet.getRow(4).height = 15;
  fillCell(sheet.getCell(4, 1), THEME.green);
  const generatedCell = sheet.getCell(4, 1);
  generatedCell.value = `Generated: ${new Date().toLocaleString()}`;
  generatedCell.font = { size: 9, color: { argb: THEME.yellowText } };
  generatedCell.alignment = { horizontal: "center", vertical: "middle" };

  sheet.getRow(5).height = 5;
  fillCell(sheet.getCell(5, 1), THEME.yellow);

  const logoBuffer = await getLogoBuffer();
  if (logoBuffer) {
    const imageId = workbook.addImage({ buffer: logoBuffer, extension: "png" });
    const logoWidth = Math.min(140, colCount * DEFAULT_COL_PX * 0.5);
    const logoHeight = logoWidth * LOGO_ASPECT_RATIO;
    // ponytail: centers using Excel's default column width, not each column's
    // actual (possibly resized) width - close enough for a header banner.
    const sheetWidthPx = colCount * DEFAULT_COL_PX;
    const leftOffsetCols = Math.max(0, (sheetWidthPx - logoWidth) / 2 / DEFAULT_COL_PX);
    // vertically centered within row 1 only, so it can't bleed into row 2
    const rowHeightPx = (LOGO_ROW_HEIGHT * 4) / 3;
    const topOffsetRows = Math.max(0, (rowHeightPx - logoHeight) / 2 / rowHeightPx);
    sheet.addImage(imageId, {
      tl: { col: leftOffsetCols, row: topOffsetRows },
      ext: { width: logoWidth, height: logoHeight },
    });
  }

  rows.forEach((row, rowIndex) => {
    const excelRow = HEADER_ROWS + rowIndex + 1;
    const isHeaderRow = headerRowIndexes.includes(rowIndex);
    row.forEach((value, colIndex) => {
      const cell = sheet.getCell(excelRow, colIndex + 1);
      cell.value = value;
      if (isHeaderRow) {
        fillCell(cell, THEME.lightGreen);
        cell.font = { size: 10, bold: true, color: { argb: THEME.darkGreenText } };
      }
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  downloadBuffer(buffer, fileName.endsWith(".xlsx") ? fileName : `${fileName}.xlsx`);
}
