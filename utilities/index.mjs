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

/**
 * @param {string} filename
 */
function formatAnnualEmissionFactorsData(filename) {
  readFile(filename, "utf8", (readFileError, readFileData) => {
    if (readFileError) throw readFileError;

    const json = JSON.parse(readFileData);

    const result = json.reduce(
      /**
       * @param {{
       *  regions: {
       *    name: string,
       *    egus: {
       *      state: string,
       *      county: string,
       *      plant: string,
       *      orispl_code: number,
       *      unit_code: string,
       *      full_name: string,
       *      annual_data: {
       *        year: number,
       *        generation: number,
       *        heat: number,
       *        pm25: number,
       *        vocs: number,
       *        nh3: number
       *      }[]
       *    }[]
       *  }[]
       * }} object
       * @param {{
       * 'Region': string
       * 'State': string
       * 'Plant': string
       * 'ORSPL': string
       * 'Unit': string
       * 'Full Name': string
       * 'County': string
       * 'ORSPL|Unit|Region': string
       * '2017 - Generation': number
       * '2017 - Heat Input': number
       * '2017 - PM2.5': number
       * '2017 - VOCs': number
       * '2017 - NH3': number
       * '2018 - Generation': number
       * '2018 - Heat Input': number
       * '2018 - PM2.5': number
       * '2018 - VOCs': number
       * '2018 - NH3': number
       * '2019 - Generation': number
       * '2019 - Heat Input': number
       * '2019 - PM2.5': number
       * '2019 - VOCs': number
       * '2019 - NH3': number
       * '2020 - Generation': number
       * '2020 - Heat Input': number
       * '2020 - PM2.5': number
       * '2020 - VOCs': number
       * '2020 - NH3': number
       * '2021 - Generation': number
       * '2021 - Heat Input': number
       * '2021 - PM2.5': number
       * '2021 - VOCs': number
       * '2021 - NH3': number
       * '2022 - Generation': number
       * '2022 - Heat Input': number
       * '2022 - PM2.5': number
       * '2022 - VOCs': number
       * '2022 - NH3': number
       * '2023 - Generation': number
       * '2023 - Heat Input': number
       * '2023 - PM2.5': number
       * '2023 - VOCs': number
       * '2023 - NH3': number
       * }} item
       */
      (object, item) => {
        const region = object.regions.find((r) => r.name === item.Region);

        const data = {
          state: item.State,
          county: item.County,
          plant: item.Plant,
          orispl_code: Number(item.ORSPL),
          unit_code: item.Unit,
          full_name: item["Full Name"],
          annual_data: [
            {
              year: 2017,
              generation: item["2017 - Generation"],
              heat: item["2017 - Heat Input"],
              pm25: item["2017 - PM2.5"],
              vocs: item["2017 - VOCs"],
              nh3: item["2017 - NH3"],
            },
            {
              year: 2018,
              generation: item["2018 - Generation"],
              heat: item["2018 - Heat Input"],
              pm25: item["2018 - PM2.5"],
              vocs: item["2018 - VOCs"],
              nh3: item["2018 - NH3"],
            },
            {
              year: 2019,
              generation: item["2019 - Generation"],
              heat: item["2019 - Heat Input"],
              pm25: item["2019 - PM2.5"],
              vocs: item["2019 - VOCs"],
              nh3: item["2019 - NH3"],
            },
            {
              year: 2020,
              generation: item["2020 - Generation"],
              heat: item["2020 - Heat Input"],
              pm25: item["2020 - PM2.5"],
              vocs: item["2020 - VOCs"],
              nh3: item["2020 - NH3"],
            },
            {
              year: 2021,
              generation: item["2021 - Generation"],
              heat: item["2021 - Heat Input"],
              pm25: item["2021 - PM2.5"],
              vocs: item["2021 - VOCs"],
              nh3: item["2021 - NH3"],
            },
            {
              year: 2022,
              generation: item["2022 - Generation"],
              heat: item["2022 - Heat Input"],
              pm25: item["2022 - PM2.5"],
              vocs: item["2022 - VOCs"],
              nh3: item["2022 - NH3"],
            },
            {
              year: 2023,
              generation: item["2023 - Generation"],
              heat: item["2023 - Heat Input"],
              pm25: item["2023 - PM2.5"],
              vocs: item["2023 - VOCs"],
              nh3: item["2023 - NH3"],
            },
          ],
        };

        if (!region) {
          object.regions.push({
            name: item.Region,
            egus: [data],
          });
        } else {
          const regionIndex = object.regions.indexOf(region);
          object.regions[regionIndex].egus.push(data);
        }

        return object;
      },
      { regions: [] }
    );

    writeFile(filename, JSON.stringify(result), (writeFileError) => {
      if (writeFileError) throw writeFileError;

      const message = `${filename} formatted`;
      console.log(message);
    });
  });
}

// ------------ MOVES Emissions Rates ------------
// convertTsvToJson("./data/moves-emissions-rates.txt");

// convertJsonStringsToNumbers({
//   filename: "./data/moves-emissions-rates.json",
//   fields: ["VMT", "CO2", "NOX", "SO2", "PM25", "VOCs", "NH3"],
// });

// ------------ County FIPS ------------
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

// ------------ State Bus Sales and Stock ------------
// convertTsvToJson("./data/state-bus-sales-and-stock.txt");

// convertJsonStringsToNumbers({
//   filename: "./data/state-bus-sales-and-stock.json",
//   fields: [
//     "transitBusesSales",
//     "transitBusesStock",
//     "schoolBusesSales",
//     "schoolBusesStock",
//   ],
// });

// ------------ Annual Emission Factors ------------
// convertTsvToJson("./data/annual-emission-factors.txt");

// convertJsonStringsToNumbers({
//   filename: "./data/annual-emission-factors.json",
//   fields: [
//     "2017 - Generation",
//     "2017 - Heat Input",
//     "2017 - PM2.5",
//     "2017 - VOCs",
//     "2017 - NH3",
//     "2018 - Generation",
//     "2018 - Heat Input",
//     "2018 - PM2.5",
//     "2018 - VOCs",
//     "2018 - NH3",
//     "2019 - Generation",
//     "2019 - Heat Input",
//     "2019 - PM2.5",
//     "2019 - VOCs",
//     "2019 - NH3",
//     "2020 - Generation",
//     "2020 - Heat Input",
//     "2020 - PM2.5",
//     "2020 - VOCs",
//     "2020 - NH3",
//     "2021 - Generation",
//     "2021 - Heat Input",
//     "2021 - PM2.5",
//     "2021 - VOCs",
//     "2021 - NH3",
//     "2022 - Generation",
//     "2022 - Heat Input",
//     "2022 - PM2.5",
//     "2022 - VOCs",
//     "2022 - NH3",
//     "2023 - Generation",
//     "2023 - Heat Input",
//     "2023 - PM2.5",
//     "2023 - VOCs",
//     "2023 - NH3",
//   ],
// });

// formatAnnualEmissionFactorsData("./data/annual-emission-factors.json");
