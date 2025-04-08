import * as fs from "node:fs";
import { exit } from "node:process";
import { Readable } from "node:stream";

import * as XLSX from "xlsx";

XLSX.set_fs(fs);
XLSX.stream.set_readable(Readable);

/**
 * @param {string} filename
 * @param {string} sheetName
 */
function parseExcelFile(filename, sheetName) {
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

  const json = XLSX.utils.sheet_to_json(worksheet);

  return json;
}

/**
 * @param {JSON} data
 */
function storeJsonData(data) {
  const filepath = `./dist/moves-emissions-data.json`;

  fs.writeFile(filepath, JSON.stringify(data), (err) => {
    if (err) throw err;
    console.log(filepath);
  });
}

function main() {
  const filename = process.argv[2];
  const sheetName = "MOVESEmissionRates";

  if (!filename) {
    console.error(`Usage: node parse-moves-emissions-data.js <filename>`);
    exit(1);
  }

  const data = parseExcelFile(filename, sheetName);

  storeJsonData(data);
}

main();
