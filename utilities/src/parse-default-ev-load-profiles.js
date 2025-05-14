import { dirname, resolve } from "node:path";
import { exit } from "node:process";
import { fileURLToPath } from "node:url";

import { XLSX, getExcelWorksheet, parseExcelDoubleHeaderRowsData } from "./excel.js";
import { renameObjectKeys, storeJsonData } from "./json.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * The data we're interested in spans 13 columns (B:N) and 26 rows (782–807).
 *
 * The first column header ("Hour Ending") is found within the second header
 * row.
 *
 * The next 2 column headers fall under the first header row category of "LDVs".
 * 
 * That's repeated with more 2 column headers falling under the following first
 * row categories: "Transit buses", "School Buses", "Short-haul trucks", "Comb.
 * long-haul trucks" and "Refuse trucks".
 *
 * Those last 12 column headers found within those six categories also all have
 * a header in the second header row. When we parse the data, we'll want to nest
 * those columns under their category header.
 *
 * @param {XLSX.WorkSheet} worksheet
 */
function parseLibraryWorksheet(worksheet) {
  const range = XLSX.utils.decode_range(worksheet["!ref"]);
  range.s.r = 781; // Start on Excel row 782 (SheetJS row 781)
  range.e.r = 806; // End on Excel row 807 (SheetJS row 806)
  range.s.c = XLSX.utils.decode_col("B"); // Start on Excel column B ("Hour Ending")
  range.e.c = XLSX.utils.decode_col("N"); // End on Excel column J ("Refuse trucks -> Weekend")

  const json = XLSX.utils.sheet_to_json(worksheet, {
    range: XLSX.utils.encode_range(range),
    header: 1, // Output as an array of arrays, so we can work with the double header rows
  });

  const headerRow1 = json[0]; // First header row: 6 categories spanning cols 2–3, 4–5, 6–7, 8–9, 10–11, and 12–13 (first column is empty)
  const headerRow2 = json[1]; // Second header row: all 13 columns
  const dataRows = json.slice(2); // Remaining rows of data: all 13 columns

  /** Create an array of objects with field names from header rows */
  const result = parseExcelDoubleHeaderRowsData(headerRow1, headerRow2, dataRows);

  return result;
}

/**
 * @param {{}[]} data
 */
function renameDefaultEVLoadProfilesDataKeys(data) {
  const keyMap = new Map([
    ["Transit Buses", "Transit buses"],
    ["School Buses", "School buses"],
    ["Comb. long-haul trucks", "Long-haul trucks"],
    ["Weekday", "weekday"],
    ["Weekend", "weekend"],
  ]);

  const result = renameObjectKeys(data, keyMap);

  return result;
}

function main() {
  const excelFilepath = process.argv[2];

  if (!excelFilepath) {
    console.error(`Usage: node parse-default-ev-load-profiles.js <excelFilepath>`);
    exit(1);
  }

  const worksheet = getExcelWorksheet(excelFilepath, "Library");
  const excelJsonData = parseLibraryWorksheet(worksheet);
  const formattedJsonData = renameDefaultEVLoadProfilesDataKeys(excelJsonData);

  const jsonFilename = "default-ev-load-profiles.json";
  const jsonFilepath = resolve(__dirname, "../../client/src/data", jsonFilename);

  storeJsonData(formattedJsonData, jsonFilepath);
}

main();
