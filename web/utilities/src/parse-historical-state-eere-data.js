import { dirname, resolve } from "node:path";
import { exit } from "node:process";
import { fileURLToPath } from "node:url";

import { XLSX, getExcelWorksheet, parseExcelDoubleHeaderRowsData } from "./excel.js";
import { storeJsonData } from "./json.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * The data we're interested in spans 7 columns (B:H) and 51 rows (900–950). We
 * don't need anything to the right of (and including) the "Total" column (I).
 *
 * The first column header ("States: Totals") is really the first header row
 * category.
 *
 * The next 3 column headers fall under the second header row category of "Avg.
 * Annual Capacity added 2021-2023 (MW)".
 *
 * The last 3 column headers fall under the third header row category of
 * "Estimated Annual Impacts (GWh)".
 *
 * @param {XLSX.WorkSheet} worksheet
 */
function parseLibraryWorksheet(worksheet) {
  const range = XLSX.utils.decode_range(worksheet["!ref"]);
  range.s.r = 899; // Start on Excel row 900 (SheetJS row 899)
  range.e.r = 949; // End on Excel row 950 (SheetJS row 949)
  range.s.c = XLSX.utils.decode_col("B"); // Start on Excel column B ("States: Totals")
  range.e.c = XLSX.utils.decode_col("H"); // End on Excel column H ("Estimated Annual Impacts (GWh) -> EE (Retail)")

  const json = XLSX.utils.sheet_to_json(worksheet, {
    range: XLSX.utils.encode_range(range),
    header: 1, // Output as an array of arrays, so we can work with the double header rows
  });

  const headerRow1 = json[0]; // First header row: 3 categories spanning cols 1, 2–4, and 5–7
  const headerRow2 = json[1]; // Second header row: all 7 columns
  const dataRows = json.slice(2); // Remaining rows of data: all 7 columns

  /** Create an array of objects with field names from header rows */
  const result = parseExcelDoubleHeaderRowsData(headerRow1, headerRow2, dataRows);

  return result;
}

/**
 * @param {{}[]} data
 */
function parseExcelHistoricalStateEEREData(data) {
  const result = data.map((item) => {
    const object = { ...item };

    const capacityAdded = object["Avg. Annual Capacity added 2021-2023 (MW)"];

    delete capacityAdded["EE (Retail)"]

    return object;
  });

  return result;
}

function main() {
  const excelFilepath = process.argv[2];

  if (!excelFilepath) {
    console.error(`Usage: node parse-historical-state-eere-data.js <excelFilepath>`);
    exit(1);
  }

  const worksheet = getExcelWorksheet(excelFilepath, "Library");
  const excelJsonData = parseLibraryWorksheet(worksheet);
  const formattedJsonData = parseExcelHistoricalStateEEREData(excelJsonData);

  const jsonFilename = "historical-state-eere-data.json";
  const jsonFilepath = resolve(__dirname, "../../client/src/data", jsonFilename);

  storeJsonData(formattedJsonData, jsonFilepath);
}

main();
