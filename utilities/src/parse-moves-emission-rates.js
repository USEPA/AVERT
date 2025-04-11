import { dirname, resolve } from "node:path";
import { exit } from "node:process";
import { fileURLToPath } from "node:url";

import { XLSX, getExcelWorksheet, parseExcelArraysData } from "./excel.js";
import { renameObjectKeys, storeJsonData } from "./json.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * The data we're interested in spans 26 columns (B:AA). We don't need anything
 * to the right of (and including) the "Regional Weight" column (AB).
 *
 * The first 6 columns ("Year", "Month", "State", "Vehicle Category", "Vehicle
 * Type", and "Fuel Type") are all found within the second header row.
 *
 * The next 10 columns of data fall under the first header row category of
 * "First-Year State Data".
 *
 * The final 10 columns of data fall under the second header row category of
 * "Fleet Average State Data".
 *
 * Those last 20 columns of data found within those two categories also all have
 * a header in the second header row. When we parse the data, we'll want to nest
 * those columns under their category header.
 *
 * @param {XLSX.WorkSheet} worksheet
 */
function parseMOVESEmissionRatesWorksheet(worksheet) {
  const range = XLSX.utils.decode_range(worksheet["!ref"]);
  range.s.r = 4; // Start on Excel row 5 (SheetJS row 4) as that's the first double header row with "First-Year State Data"
  range.s.c = XLSX.utils.decode_col("B"); // Start on Excel column B ("Year")
  range.e.c = XLSX.utils.decode_col("AA"); // End on Excel column AA ("Fleet Average VMT -> Electric (miles)")

  const json = XLSX.utils.sheet_to_json(worksheet, {
    range: XLSX.utils.encode_range(range),
    header: 1, // Output as an array of arrays, so we can work with the double header rows
  });

  const headerRow1 = json[0]; // First header row: 2 categories spanning cols 7–16 and 17–26 (first 6 columns are empty)
  const headerRow2 = json[1]; // Second header row: all 26 columns
  const dataRows = json.slice(2); // Remaining rows of data: all 26 columns

  /** Create an array of objects with field names from header rows */
  const result = parseExcelArraysData(headerRow1, headerRow2, dataRows);

  return result;
}

/**
 * @param {{}[]} data
 */
function renameMOVESEmissionRatesDataKeys(data) {
  const keyMap = new Map([
    ["Year", "year"],
    ["Month", "month"],
    ["State", "state"],
    ["Vehicle Category", "vehicleCategory"],
    ["Vehicle Type", "vehicleType"],
    ["Fuel Type", "fuelType"],
    ["First-Year State Data", "firstYear"],
    ["Fleet Average State Data", "fleetAverage"],
    ["VMT (miles)", "vmt"],
    ["Atmospheric CO2 (lb/mile)", "co2"],
    ["Oxides of Nitrogen (NOx) (lb/mile)", "nox"],
    ["Sulfur Dioxide (SO2) (lb/mile)", "so2"],
    ["Primary Exhaust PM2.5 - Total (lb/mile)", "pm25Exhaust"],
    ["Primary PM2.5 - Brakewear Particulate (lb/mile)", "pm25Brakewear"],
    ["Primary PM2.5 - Tirewear Particulate (lb/mile)", "pm25Tirewear"],
    ["VOCs (Evaporative, Exhaust, Refueling) (lb/mile)", "vocs"],
    ["Ammonia (NH3) (lb/mile)", "nh3"],
    ["First-Year VMT - Electric (miles)", "vmtElectric"],
    ["Fleet Average VMT - Electric (miles)", "vmtElectric"],
  ]);

  const result = renameObjectKeys(data, keyMap);

  return result;
}

function main() {
  const excelFilepath = process.argv[2];

  if (!excelFilepath) {
    console.error(`Usage: node parse-moves-emission-rates.js <excelFilepath>`);
    exit(1);
  }

  const worksheet = getExcelWorksheet(excelFilepath, "MOVESEmissionRates");
  const excelJsonData = parseMOVESEmissionRatesWorksheet(worksheet);
  const formattedJsonData = renameMOVESEmissionRatesDataKeys(excelJsonData);

  const jsonFilename = "moves-emission-rates.json";
  const jsonFilepath = resolve(__dirname, "../../client/src/data", jsonFilename);

  storeJsonData(formattedJsonData, jsonFilepath);
}

main();
