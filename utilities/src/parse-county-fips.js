import { dirname, resolve } from "node:path";
import { exit } from "node:process";
import { fileURLToPath } from "node:url";

import { XLSX, getExcelWorksheet, parseExcelArraysData } from "./excel.js";
import { storeJsonData } from "./json.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * The data we're interested in spans 47 columns (B:AT). We don't need anything
 * to the right of (and including) the "Notes" column (AU).
 *
 * The first 9 columns ("State and County FIPS Code", "State Name",
 * "County Name", "AVERT Region", "Postal State Code", "County Name Long",
 * "Key", "Passenger cars VMT - original MOVES5", and
 * "Passenger trucks VMT - original MOVES5") are all found within the second
 * header row.
 *
 * The next 14 columns of data fall under the first header row category of
 * "VMT".
 * 
 * The next 14 columns of data fall under the second header row category of
 * "Share of State VMT".
 * 
 * The next 5 columns of data fall under the third header row category of
 * "VMT - Collapsed".
 *
 * The final 5 columns of data fall under the fourth header row category of
 * "Share of State VMT - Collapsed".
 *
 * Those last 38 columns of data found within those four categories also all
 * have a header in the second header row. When we parse the data, we'll want to
 * nest those columns under their category header.
 *
 * @param {XLSX.WorkSheet} worksheet
 */
function parseCountyFIPSWorksheet(worksheet) {
  const range = XLSX.utils.decode_range(worksheet["!ref"]);
  range.s.r = 2; // Start on Excel row 3 (SheetJS row 2) as that's the first double header row with "VMT"
  range.s.c = XLSX.utils.decode_col("B"); // Start on Excel column B ("State and County FIPS Code")
  range.e.c = XLSX.utils.decode_col("AV"); // End on Excel column AT ("Share of State VMT - Collapsed -> Refuse trucks")

  const json = XLSX.utils.sheet_to_json(worksheet, {
    range: XLSX.utils.encode_range(range),
    header: 1, // Output as an array of arrays, so we can work with the double header rows
  });

  const headerRow1 = json[0]; // First header row: 4 categories spanning cols 10–23, 24–37, 38–42, and 43–47 (first 9 columns are empty)
  const headerRow2 = json[1]; // Second header row: all 47 columns
  const dataRows = json.slice(2); // Remaining rows of data: all 47 columns

  /** Create an array of objects with field names from header rows */
  const result = parseExcelArraysData(headerRow1, headerRow2, dataRows);

  return result;
}

function main() {
  const excelFilepath = process.argv[2];

  if (!excelFilepath) {
    console.error(`Usage: node parse-county-fips.js <excelFilepath>`);
    exit(1);
  }

  const worksheet = getExcelWorksheet(excelFilepath, "CountyFIPS");
  const excelJsonData = parseCountyFIPSWorksheet(worksheet);

  const jsonFilename = "county-fips.json";
  const jsonFilepath = resolve(__dirname, "../../client/src/data", jsonFilename);

  storeJsonData(excelJsonData, jsonFilepath);
}

main();
