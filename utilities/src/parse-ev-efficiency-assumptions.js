import { dirname, resolve } from "node:path";
import { exit } from "node:process";
import { fileURLToPath } from "node:url";

import { XLSX, getExcelWorksheet } from "./excel.js";
import { storeJsonData } from "./json.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * @param {(string|number)[]} headerRow 
 * @param {(string|number)[][]} dataRows 
 */
function parseExcelEVEfficiencyData(headerRow, dataRows) {
  /**
   * Extract the years columns from headerRow, skipping the first column
   * ("National average")
   */
  const years = headerRow.slice(1);

  // /**
  //  * EV efficiency data by vehicle type then year
  //  * 
  //  * @type { [vehicleType: string]: { [year: string]: number } }
  //  */
  // const result = years.reduce((object, year, index) => {
  //   object[year] = dataRows.reduce((yearObject, row) => {
  //     const vehicleType = row[0];
  //     const value = row[index + 1];
  //     yearObject[vehicleType] = value;
  //     return yearObject;
  //   }, {});

  //   return object;
  // }, {});

  /**
   * EV efficiency data by year then vehicle type
   * 
   * @type { [year: string]: { [vehicleType: string]: number } }
   */
  const result = dataRows.reduce((object, row) => {
    const vehicleType = row[0];
    const values = row.slice(1);

    object[vehicleType] = years.reduce((vehicleObject, year, index) => {
      vehicleObject[year] = values[index];
      return vehicleObject;
    }, {});

    return object;
  }, {});

  return result;
}

/**
 * The data we're interested in spans 9 columns (B:J) and 17 rows (201–217). We
 * don't need anything to the right of (and including) the "2024-2029 Average"
 * column (K).
 *
 * @param {XLSX.WorkSheet} worksheet
 */
function parseLibraryWorksheet(worksheet) {
  const range = XLSX.utils.decode_range(worksheet["!ref"]);
  range.s.r = 200; // Start on Excel row 201 (SheetJS row 200)
  range.e.r = 216; // End on Excel row 217 (SheetJS row 216)
  range.s.c = XLSX.utils.decode_col("B"); // Start on Excel column B ("National average")
  range.e.c = XLSX.utils.decode_col("J"); // End on Excel column J ("2029")

  const json = XLSX.utils.sheet_to_json(worksheet, {
    range: XLSX.utils.encode_range(range),
    header: 1, // Output as an array of arrays, so we can transpose the rows and columns
  });

  /** The second and third columns (C and D) don't contain data we need, so remove them */
  const allRows = json.map((row) => [row[0], ...row.slice(3)]);

  const headerRow = allRows[0];
  const dataRows = allRows.slice(1);

  const result = parseExcelEVEfficiencyData(headerRow, dataRows);

  return result;
}

function main() {
  const excelFilepath = process.argv[2];

  if (!excelFilepath) {
    console.error(`Usage: node parse-ev-efficiency-assumptions.js <excelFilepath>`);
    exit(1);
  }

  const worksheet = getExcelWorksheet(excelFilepath, "Library");
  const excelJsonData = parseLibraryWorksheet(worksheet);

  const jsonFilename = "ev-efficiency-assumptions.json";
  const jsonFilepath = resolve(__dirname, "../../client/src/data", jsonFilename);

  storeJsonData(excelJsonData, jsonFilepath);
}

main();
