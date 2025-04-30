import { dirname, resolve } from "node:path";
import { exit } from "node:process";
import { fileURLToPath } from "node:url";

import { XLSX, getExcelWorksheet, parseExcelDoubleHeaderRowsData } from "./excel.js";
import { renameObjectKeys, storeJsonData } from "./json.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * The data we're interested in spans 48 columns (B:AW).
 *
 * The first 8 column headers ("Region", "State", "Plant", "ORSPL", "Unit",
 * "Full Name", "County", "ORSPL|Unit|Region") are all found within the second
 * header row.
 *
 * The next 5 column headers fall under the first header row category of "2017".
 * 
 * That's repeated with more 5 column headers falling under the following first
 * row categories: "2018", "2019", "2020", "2021", "2022", "2023" and "2024".
 *
 * Those last 40 column headers found within those eight categories also all
 * have a header in the second header row. When we parse the data, we'll want to
 * nest those columns under their category header.
 *
 * @param {XLSX.WorkSheet} worksheet
 */
function parseNEIEmissionRatesWorksheet(worksheet) {
  const range = XLSX.utils.decode_range(worksheet["!ref"]);
  range.s.r = 4; // Start on Excel row 5 (SheetJS row 4) as that's the first double header row with "2017"
  range.s.c = XLSX.utils.decode_col("B"); // Start on Excel column B ("Region")
  range.e.c = XLSX.utils.decode_col("AW"); // End on Excel column AW ("2024 -> NH3")

  const json = XLSX.utils.sheet_to_json(worksheet, {
    range: XLSX.utils.encode_range(range),
    header: 1, // Output as an array of arrays, so we can work with the double header rows
  });

  const headerRow1 = json[0]; // First header row: 8 categories spanning cols 9–13, 14–18, 19–23, 24–28, 29–33, 34–38, 39–43, and 44–48 (first 8 columns are empty)
  const headerRow2 = json[1]; // Second header row: all 48 columns
  const dataRows = json.slice(2); // Remaining rows of data: all 48 columns

  /** Create an array of objects with field names from header rows */
  const result = parseExcelDoubleHeaderRowsData(headerRow1, headerRow2, dataRows);

  return result;
}

/**
 * @param {{}[]} data
 */
function renameNEIEmissionRatesDataKeys(data) {
  const keyMap = new Map([
    ["Generation", "generation"],
    ["Heat Input", "heat"],
    ["PM2.5", "pm25"],
    ["VOCs", "vocs"],
    ["NH3", "nh3"],
  ]);

  const result = renameObjectKeys(data, keyMap);

  return result;
}

function main() {
  const excelFilepath = process.argv[2];

  if (!excelFilepath) {
    console.error(`Usage: node parse-nei-emission-rates.js <excelFilepath>`);
    exit(1);
  }

  const worksheet = getExcelWorksheet(excelFilepath, "NEI_EmissionRates");
  const excelJsonData = parseNEIEmissionRatesWorksheet(worksheet);
  const formattedJsonData = renameNEIEmissionRatesDataKeys(excelJsonData);

  const jsonFilename = "nei-emission-rates.json";
  const jsonFilepath = resolve(__dirname, "../../server/app/data", jsonFilename);

  storeJsonData(formattedJsonData, jsonFilepath);
}

main();
