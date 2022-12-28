import { readFile, writeFile } from "node:fs";

/**
 * @param {string} input
 */
function convertTsvToJson(input) {
  readFile(input, "utf8", (readFileError, readFileData) => {
    if (readFileError) throw readFileError;

    const [headers, ...rows] = readFileData
      .trim()
      .split(/\r?\n/)
      .map((row) => row.split("\t"));

    const json = rows.reduce((collection, row) => {
      const object = headers.reduce((result, header, index) => {
        result[header] = row[index];
        return result;
      }, {});

      return collection.concat(object);
    }, []);

    const filename = input.replace(".txt", "");

    writeFile(`${filename}.json`, JSON.stringify(json), (writeFileError) => {
      if (writeFileError) throw writeFileError;

      const message = `${filename}.txt converted to ${filename}.json`;
      console.log(message);
    });
  });
}

/**
 * @param {object} options
 * @param {string} options.filename
 * @param {string[]} options.fields
 */
function convertJsonStringsToNumbers({ filename, fields }) {
  readFile(filename, "utf8", (readFileError, readFileData) => {
    if (readFileError) throw readFileError;

    const json = JSON.parse(readFileData);

    const result = json.map((object) => {
      Object.entries(object).forEach(([key, value]) => {
        if (fields.includes(key)) object[key] = Number(value);
      });

      return object;
    });

    writeFile(filename, JSON.stringify(result), (writeFileError) => {
      if (writeFileError) throw writeFileError;

      const message =
        `${filename} updated with values from ` +
        `"${fields.join(", ")}" fields converted to numbers`;
      console.log(message);
    });
  });
}

// convertTsvToJson("./data/moves-emissions-rates.txt");

// convertJsonStringsToNumbers({
//   filename: "./data/moves-emissions-rates.json",
//   fields: ["VMT", "CO2", "NOX", "SO2", "PM25", "VOCs", "NH3", "regionalWeight"],
// });

// convertTsvToJson("./data/county-fips.txt");

// convertJsonStringsToNumbers({
//   filename: "./data/county-fips.json",
//   fields: [
//     "Passenger Cars VMT",
//     "Passenger Trucks and Light Commercial Trucks VMT",
//     "Transit Buses VMT",
//     "School Buses VMT",
//     "Share of State VMT - Passenger Cars",
//     "Share of State VMT - Passenger Trucks and Light Commercial trucks",
//     "Share of State VMT - Transit Buses",
//     "Share of State VMT - School Buses",
//   ],
// });
