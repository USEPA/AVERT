import { fork } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function main() {
  const filename = "avert-main-module-v4.4 (beta)_ne.xlsb";
  const filepath = resolve(__dirname, "../../../sources/excel", filename);

  fork("./src/parse-moves-emission-rates.js", [filepath]);
}

main();
