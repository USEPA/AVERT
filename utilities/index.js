import { fork } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function main() {
  const excelFilename = "avert-main-module-v4.4 (beta).xlsb";
  const excelFilepath = resolve(__dirname, "../../../sources/excel", excelFilename);

  // fork("./src/parse-moves-emission-rates.js", [excelFilepath]);
  // fork("./src/parse-county-fips.js", [excelFilepath]);
}

main();
