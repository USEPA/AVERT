import { fork } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function main() {
  const excelFilename = "avert-main-module-v4.4 (beta).xlsb";
  const excelFilepath = resolve(__dirname, "../../../sources/excel", excelFilename);

  // fork("./src/parse-county-fips.js", [excelFilepath]);
  // fork("./src/parse-default-ev-load-profiles.js", [excelFilepath]);
  // fork("./src/parse-ev-efficiency-assumptions.js", [excelFilepath]);
  // fork("./src/parse-fhwa-ldv-state-level-vmt.js", [excelFilepath]);
  // fork("./src/parse-historical-region-eere-data.js", [excelFilepath]);
  // fork("./src/parse-historical-state-eere-data.js", [excelFilepath]);
  // fork("./src/parse-moves-emission-rates.js", [excelFilepath]);
  // fork("./src/parse-nei-emission-rates.js", [excelFilepath]);
  // fork("./src/parse-pm25-brakewear-tirewear-ev-ice-ratios.js", [excelFilepath]);
  // fork("./src/parse-state-level-sales.js", [excelFilepath]);
  // fork("./src/parse-state-level-vmt.js", [excelFilepath]);
}

main();
