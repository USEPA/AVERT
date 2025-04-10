import * as fs from "node:fs";
import { exit } from "node:process";
import { Readable } from "node:stream";

import * as XLSX from "xlsx";

XLSX.set_fs(fs);
XLSX.stream.set_readable(Readable);

export { XLSX };

/**
 * @param {string} filename
 * @param {string} sheetName
 */
export function getExcelWorksheet(filename, sheetName) {
  if (!fs.existsSync(filename)) {
    console.error(`File "${filename}" does not exist.`);
    exit(1);
  }

  console.log(`Reading file: ${filename}`);

  const workbook = XLSX.readFile(filename);
  const worksheet = workbook.Sheets[sheetName];

  if (!worksheet) {
    console.error(`Worksheet "${sheetName}" does not exist in the workbook.`);
    exit(1);
  }

  return worksheet;
}