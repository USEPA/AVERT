import { dirname, resolve } from "node:path";
import { exit } from "node:process";
import { fileURLToPath } from "node:url";

import { XLSX, getExcelWorksheet } from "./excel.js";
import { storeJsonData } from "./json.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * The data we're interested in spans 6 columns (B:G) and 141 rows (990–1130).
 *
 * @param {XLSX.WorkSheet} worksheet
 */
function parseLibraryWorksheet(worksheet) {
  const range = XLSX.utils.decode_range(worksheet["!ref"]);
  range.s.r = 989; // Start on Excel row 990 (SheetJS row 989)
  range.e.r = 1129; // End on Excel row 1130 (SheetJS row 1129)
  range.s.c = XLSX.utils.decode_col("B"); // Start on Excel column B ("Year")
  range.e.c = XLSX.utils.decode_col("G"); // End on Excel column G ("Primary PM2.5 Tirewear Emissions Rate: EV/ICE Ratio")

  const json = XLSX.utils.sheet_to_json(worksheet, {
    range: XLSX.utils.encode_range(range),
  });

  return json;
}

function main() {
  const excelFilepath = process.argv[2];

  if (!excelFilepath) {
    console.error(`Usage: node parse-pm25-brakewear-tirewear-ev-ice-ratios.js <excelFilepath>`);
    exit(1);
  }

  const worksheet = getExcelWorksheet(excelFilepath, "Library");
  const excelJsonData = parseLibraryWorksheet(worksheet);

  const jsonFilename = "pm25-brakewear-tirewear-ev-ice-ratios.json";
  const jsonFilepath = resolve(__dirname, "../../client/src/data", jsonFilename);

  storeJsonData(excelJsonData, jsonFilepath);
}

main();
