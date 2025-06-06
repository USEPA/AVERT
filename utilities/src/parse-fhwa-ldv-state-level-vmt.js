import { dirname, resolve } from "node:path";
import { exit } from "node:process";
import { fileURLToPath } from "node:url";

import { XLSX, getExcelWorksheet } from "./excel.js";
import { storeJsonData } from "./json.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * The data we're interested in spans 2 columns (O:P). We don't need anything
 * to the right of (and including) the "2023 Annual VMT (million miles) - MOVES5"
 * column (Q).
 *
 * @param {XLSX.WorkSheet} worksheet
 */
function parseMOVESsupplementWorksheet(worksheet) {
  const range = XLSX.utils.decode_range(worksheet["!ref"]);
  range.s.r = 5; // Start on Excel row 6 (SheetJS row 5)
  range.s.c = XLSX.utils.decode_col("O"); // Start on Excel column O ("State")
  range.e.c = XLSX.utils.decode_col("P"); // End on Excel column P ("2023 Annual VMT (million miles) - FHWA")

  const json = XLSX.utils.sheet_to_json(worksheet, {
    range: XLSX.utils.encode_range(range),
  });

  return json;
}

function main() {
  const excelFilepath = process.argv[2];

  if (!excelFilepath) {
    console.error(`Usage: node parse-fhwa-ldv-state-level-vmt.js <excelFilepath>`);
    exit(1);
  }

  const worksheet = getExcelWorksheet(excelFilepath, "MOVESsupplement");
  const excelJsonData = parseMOVESsupplementWorksheet(worksheet);

  const jsonFilename = "fhwa-ldv-state-level-vmt.json";
  const jsonFilepath = resolve(__dirname, "../../client/src/data", jsonFilename);

  storeJsonData(excelJsonData, jsonFilepath);
}

main();
