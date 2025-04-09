import * as fs from "node:fs";
import { exit } from "node:process";
import { Readable } from "node:stream";

import * as XLSX from "xlsx";

XLSX.set_fs(fs);
XLSX.stream.set_readable(Readable);

/**
 * @param {string} filename
 * @param {string} sheetName
 */
function getExcelWorksheet(filename, sheetName) {
  if (!fs.existsSync(filename)) {
    console.error(`File "${filename}" does not exist.`);
    exit(1);
  }

  console.log(`Reading file: ${filename}`);

  const workbook = XLSX.readFile(filename);
  const worksheet = workbook.Sheets[sheetName];

  if (!worksheet) {
    console.error(`Worksheet "${sheetName}" does not exist in the workbook.`);
    exit(1);
  }

  return worksheet;
}

/**
 * NOTE: The data we're interested in spans 26 columns (B:AA). We don't need
 * anything to the right of (and including) the "Regional Weight" column (AB).
 *
 * The first six columns (Year, Month, State, Vehicle Category, Vehicle Type,
 * and Fuel Type) are all found within the second header row.
 *
 * The next 10 columns of data fall under the first header row category of
 * "First-Year State Data".
 *
 * The final 10 columns of data fall under the first header row category of
 * "Fleet Average State Data".
 *
 * Those last 20 columns of data found within those two categories also all have
 * a header in the second header row. When we parse the data, we'll want to nest
 * those columns under their category header.
 *
 * @param {XLSX.WorkSheet} worksheet
 */
function parseMovesEmissionData(worksheet) {
  const range = XLSX.utils.decode_range(worksheet["!ref"]);
  range.s.r = 4; // start on Excel row 5 (SheetJS row 4) as that's the first double header row with "First-Year State Data"
  range.s.c = XLSX.utils.decode_col("B"); // start on Excel column B ("Year")
  range.e.c = XLSX.utils.decode_col("AA"); // end on Excel column AA ("Fleet Average VMT - Electric (miles)")

  const json = XLSX.utils.sheet_to_json(worksheet, {
    range: XLSX.utils.encode_range(range),
    header: 1, // output as an array of arrays, so we can work with the double header rows
  });

  const headerRow1 = json[0]; // first header row: 2 categories spanning cols 7–16 and 17–26
  const headerRow2 = json[1]; // second header row: all 26 columns
  const dataRows = json.slice(2); // remaining rows of data: all 26 columns

  /** Loop over each row of data and build up objects for each */
  const result = dataRows.reduce((array, row) => {
    if (row.length === 0) return array; // skip empty rows of data

    const object = {};

    /** NOTE: will be one of the 2 categories found in header row 1 */
    let headerCategoryName;

    /** Loop over the row's 26 columns of data, building up the object */
    row.forEach((value, index) => {
      /**
       * NOTE: Header row 2 will always have the value needed for the header
       * field name...it just might get nested under a header category as well.
       * We'll replace any new line characters with a space.
       */
      const headerFieldName = headerRow2[index].replace(/\n/g, " ");

      /**
       * NOTE: If a header row 1 value exists, its the start of a new category.
       * As with the header field name, we'll replace any new line characters
       * with a space.
       */
      if (headerRow1[index]) {
        headerCategoryName = headerRow1[index].replace(/\n/g, " ");
        object[headerCategoryName] = {};
      }

      /**
       * NOTE: If the category has not yet been set, we're still within the
       * first six columns of data, so there isn't a category to nest the header
       * field under.
       */
      if (!headerCategoryName) {
        object[headerFieldName] = value;
        /**
         * NOTE: Else, the category has been set and we're within one of the
         * last 20 columns of data, so we'll nest the header field under the
         * last set category.
         */
      } else {
        object[headerCategoryName][headerFieldName] = value;
      }
    });

    array.push(object);

    return array;
  }, []);

  return result;
}

/**
 * Recursively renames all keys in an object or an array based on the provided keyMap.
 *
 * @param {Object|Array} data - The input data (object or array) to transform.
 * @param {Map} keyMap - A Map where the key is the old field name and the value is the new field name.
 * @returns {Object|Array} - A new data structure with keys renamed.
 */
function renameObjectKeys(data, keyMap) {
  if (Array.isArray(data)) {
    return data.map((item) => renameObjectKeys(item, keyMap));
  }

  if (typeof data === "object") {
    return Object.keys(data).reduce((object, oldKey) => {
      const newKey = keyMap.has(oldKey) ? keyMap.get(oldKey) : oldKey;

      object[newKey] = renameObjectKeys(data[oldKey], keyMap);

      return object;
    }, {});
  }

  return data;
}

/**
 * @param {{}[]} data
 */
function renameMovesEmissionDataKeys(data) {
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

/**
 * @param {JSON} data
 * @param {string} filepath
 */
function storeJsonData(data, filepath) {
  fs.writeFile(filepath, JSON.stringify(data), (err) => {
    if (err) throw err;
    console.log(`JSON file: ${filepath}`);
  });
}

function main() {
  const filename = process.argv[2];

  if (!filename) {
    console.error(`Usage: node parse-moves-emission-rates.js <filename>`);
    exit(1);
  }

  const worksheet = getExcelWorksheet(filename, "MOVESEmissionRates");
  const jsonData = parseMovesEmissionData(worksheet);
  const data = renameMovesEmissionDataKeys(jsonData);

  storeJsonData(data, "./dist/moves-emission-rates.json");
}

main();
