import { dirname, resolve } from "node:path";
import { exit } from "node:process";
import { fileURLToPath } from "node:url";

import { XLSX, getExcelWorksheet } from "./excel.js";
import { storeJsonData } from "./json.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * The data we're interested in spans 9 columns (B:J) and 50 rows (881–895).
 *
 * @param {XLSX.WorkSheet} worksheet
 */
function parseLibraryWorksheet(worksheet) {
  const range = XLSX.utils.decode_range(worksheet["!ref"]);
  range.s.r = 880; // Start on Excel row 881 (SheetJS row 880)
  range.e.r = 894; // End on Excel row 895 (SheetJS row 894)
  range.s.c = XLSX.utils.decode_col("B"); // Start on Excel column B ("AVERT Regions: Totals")
  range.e.c = XLSX.utils.decode_col("J"); // End on Excel column J ("Retail Impacts (GWh) -> EE")

  const json = XLSX.utils.sheet_to_json(worksheet, {
    range: XLSX.utils.encode_range(range),
  });

  /**
   * The parsed JSON data results in an array of objects with the following
   * field names:
   * - __EMPTY: column B ("AVERT Regions: Totals")
   * - Wind: column C ("Avg. Annual Capacity added 2021-2023 (MW) -> Wind")
   * - UPV: column D ("Avg. Annual Capacity added 2021-2023 (MW) -> UPV")
   * - Wind_1: column F ("Estimated Annual Wholesale Impacts (GWh) -> Wind")
   * - UPV_1: column G ("Estimated Annual Wholesale Impacts (GWh) -> UPV")
   * - EE_2: column J ("Retail Impacts (GWh) -> EE")
   * 
   * For some reason, columns E and H ("Avg. Annual Capacity added 2021-2023
   * (MW) -> EE" and "Estimated Annual Wholesale Impacts (GWh) -> EE") aren't
   * included, but we don't need them anyway. We'll remove the columns we don't
   * need (columns F and G) and rename column B's field as it gets parsed as
   * "__EMPTY" because the text we need ("AVERT Regions: Totals") is in the cell
   * above it.
   */
  const result = json.map((row) => {
    const { __EMPTY: Region, Wind, UPV, EE_2 } = row;
    return {
      Region,
      Wind,
      UPV,
      EE: EE_2,
    };
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

  const jsonFilename = "historical-region-eere-data.json";
  const jsonFilepath = resolve(__dirname, "../../client/src/data", jsonFilename);

  storeJsonData(excelJsonData, jsonFilepath);
}

main();
