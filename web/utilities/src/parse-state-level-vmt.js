import { dirname, resolve } from "node:path";
import { exit } from "node:process";
import { fileURLToPath } from "node:url";

import { XLSX, getExcelWorksheet } from "./excel.js";
import { storeJsonData } from "./json.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * The data we're interested in spans 4 columns (B:E). We don't need anything
 * to the right of (and including) the "VMT per vehicle" column (F).
 *
 * @param {XLSX.WorkSheet} worksheet
 */
function parseMOVESsupplementWorksheet(worksheet) {
  const range = XLSX.utils.decode_range(worksheet["!ref"]);
  range.s.r = 5; // Start on Excel row 6 (SheetJS row 5)
  range.s.c = XLSX.utils.decode_col("B"); // Start on Excel column B ("State")
  range.e.c = XLSX.utils.decode_col("E"); // End on Excel column E ("2023 Stock (million vehicles)")

  const json = XLSX.utils.sheet_to_json(worksheet, {
    range: XLSX.utils.encode_range(range),
  });

  return json;
}

function main() {
  const excelFilepath = process.argv[2];

  if (!excelFilepath) {
    console.error(`Usage: node parse-state-level-vmt.js <excelFilepath>`);
    exit(1);
  }

  const worksheet = getExcelWorksheet(excelFilepath, "MOVESsupplement");
  const excelJsonData = parseMOVESsupplementWorksheet(worksheet);

  const jsonFilename = "state-level-vmt.json";
  const jsonFilepath = resolve(__dirname, "../../client/src/data", jsonFilename);

  storeJsonData(excelJsonData, jsonFilepath);
}

main();
