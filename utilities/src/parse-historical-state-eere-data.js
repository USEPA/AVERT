import { dirname, resolve } from "node:path";
import { exit } from "node:process";
import { fileURLToPath } from "node:url";

import { XLSX, getExcelWorksheet } from "./excel.js";
import { storeJsonData } from "./json.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * The data we're interested in spans 7 columns (B:H) and 50 rows (901–950). We
 * don't need anything to the right of (and including) the "Total" column (I).
 *
 * @param {XLSX.WorkSheet} worksheet
 */
function parseLibraryWorksheet(worksheet) {
  const range = XLSX.utils.decode_range(worksheet["!ref"]);
  range.s.r = 900; // Start on Excel row 901 (SheetJS row 900)
  range.e.r = 949; // End on Excel row 950 (SheetJS row 949)
  range.s.c = XLSX.utils.decode_col("B"); // Start on Excel column B ("States: Totals")
  range.e.c = XLSX.utils.decode_col("H"); // End on Excel column H ("Estimated Annual Retail Impacts (GWh) -> EE")

  const json = XLSX.utils.sheet_to_json(worksheet, {
    range: XLSX.utils.encode_range(range),
  });

  /**
   * The parsed JSON data results in an array of objects with the following
   * field names:
   * - __EMPTY: column B ("States: Totals")
   * - Wind: column C ("Avg. Annual Capacity added 2021-2023 (MW) -> Wind")
   * - UPV: column D ("Avg. Annual Capacity added 2021-2023 (MW) -> UPV")
   * - EE (Retail): column E ("Avg. Annual Capacity added 2021-2023 (MW) -> EE (Retail)")
   * - EE: column H ("Estimated Annual Retail Impacts (GWh) -> EE")
   * 
   * Columns F and G ("Estimated Annual Retail Impacts (GWh) -> Wind" and
   * "Estimated Annual Retail Impacts (GWh) -> UPV") are empty, so they're
   * automatically skipped by SheetJS. We'll remove the columns we don't need
   * (column E) and rename the column B's field as it gets parsed as "__EMPTY"
   * because the text we need ("States: Totals") is in the cell above it.
   */
  const result = json.map((row) => {
    const { __EMPTY: State, Wind, UPV, EE } = row;
    return {
      State,
      Wind,
      UPV,
      EE,
    };
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

  const jsonFilename = "historical-state-eere-data.json";
  const jsonFilepath = resolve(__dirname, "../../client/src/data", jsonFilename);

  storeJsonData(excelJsonData, jsonFilepath);
}

main();
