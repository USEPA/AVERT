import { dirname, resolve } from "node:path";
import { exit } from "node:process";
import { fileURLToPath } from "node:url";

import { XLSX, getExcelWorksheet } from "./excel.js";
import { renameObjectKeys, storeJsonData } from "./json.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * The data we're interested in spans 4 columns (J:M).
 *
 * @param {XLSX.WorkSheet} worksheet
 */
function parseMOVESsupplementWorksheet(worksheet) {
  const range = XLSX.utils.decode_range(worksheet["!ref"]);
  range.s.r = 5; // Start on Excel row 6 (SheetJS row 5)
  range.s.c = XLSX.utils.decode_col("J"); // Start on Excel column J ("State")
  range.e.c = XLSX.utils.decode_col("M"); // End on Excel column M ("Sales (2023)")

  const json = XLSX.utils.sheet_to_json(worksheet, {
    range: XLSX.utils.encode_range(range),
  });

  return json;
}

/**
 * @param {{}[]} data
 */
function renameStateLevelSalesDataKeys(data) {
  const keyMap = new Map([
    ["stateAbbr", "State"],
  ]);

  const result = renameObjectKeys(data, keyMap);

  return result;
}

function main() {
  const excelFilepath = process.argv[2];

  if (!excelFilepath) {
    console.error(`Usage: node parse-state-level-sales.js <excelFilepath>`);
    exit(1);
  }

  const worksheet = getExcelWorksheet(excelFilepath, "MOVESsupplement");
  const excelJsonData = parseMOVESsupplementWorksheet(worksheet);
  const formattedJsonData = renameStateLevelSalesDataKeys(excelJsonData);

  const jsonFilename = "state-level-sales.json";
  const jsonFilepath = resolve(__dirname, "../../client/src/data", jsonFilename);

  storeJsonData(formattedJsonData, jsonFilepath);
}

main();
