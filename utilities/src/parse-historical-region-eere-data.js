import { dirname, resolve } from "node:path";
import { exit } from "node:process";
import { fileURLToPath } from "node:url";

import { XLSX, getExcelWorksheet, parseExcelDoubleHeaderRowsData } from "./excel.js";
import { storeJsonData } from "./json.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * The data we're interested in spans 9 columns (B:J) and 16 rows (880–895).
 * 
 * The first column header ("AVERT Regions: Totals") is really the first header
 * row category.
 *
 * The next 3 column headers fall under the second header row category of "Avg.
 * Annual Capacity added 2021-2023 (MW)".
 * 
 * The next 4 column headers fall under the third header row category of
 * "Estimated Annual Wholesale Impacts (GWh)".
 * 
 * The last column header falls under the fourth header row category of "Retail
 * Impacts (GWh)".
 *
 * @param {XLSX.WorkSheet} worksheet
 */
function parseLibraryWorksheet(worksheet) {
  const range = XLSX.utils.decode_range(worksheet["!ref"]);
  range.s.r = 879; // Start on Excel row 880 (SheetJS row 879)
  range.e.r = 894; // End on Excel row 895 (SheetJS row 894)
  range.s.c = XLSX.utils.decode_col("B"); // Start on Excel column B ("AVERT Regions: Totals")
  range.e.c = XLSX.utils.decode_col("J"); // End on Excel column J ("Retail Impacts (GWh) -> EE")

  const json = XLSX.utils.sheet_to_json(worksheet, {
    range: XLSX.utils.encode_range(range),
    header: 1, // Output as an array of arrays, so we can work with the double header rows
  });

  const headerRow1 = json[0]; // First header row: 4 categories spanning cols 1, 2–4, 5–8, and 9
  const headerRow2 = json[1]; // Second header row: all 9 columns
  const dataRows = json.slice(2); // Remaining rows of data: all 9 columns

  /** Create an array of objects with field names from header rows */
  const result = parseExcelDoubleHeaderRowsData(headerRow1, headerRow2, dataRows);

  return result;
}

/**
 * @param {{}[]} data
 */
function parseExcelHistoricalRegionEEREData(data) {
  const result = data.map((item) => {
    const object = { ...item };

    delete object["Estimated Annual Wholesale Impacts (GWh)"];

    return object;
  });

  return result;
}

function main() {
  const excelFilepath = process.argv[2];

  if (!excelFilepath) {
    console.error(`Usage: node parse-historical-region-eere-data.js <excelFilepath>`);
    exit(1);
  }

  const worksheet = getExcelWorksheet(excelFilepath, "Library");
  const excelJsonData = parseLibraryWorksheet(worksheet);
  const formattedJsonData = parseExcelHistoricalRegionEEREData(excelJsonData);

  const jsonFilename = "historical-region-eere-data.json";
  const jsonFilepath = resolve(__dirname, "../../client/src/data", jsonFilename);

  storeJsonData(formattedJsonData, jsonFilepath);
}

main();
