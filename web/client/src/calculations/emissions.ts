import { type RDFJSON } from "@/redux/reducers/geography";
import {
  type SelectedRegionsMonthlyEmissionChangesTotals,
  type VehicleEmissionChangesByGeography,
} from "@/calculations/transportation";
import { type EmptyObject, sortObjectByKeys } from "@/utilities";
import { type RegionId, type StateId } from "@/config";

export type EmissionsChanges = ReturnType<typeof calculateEmissionsChanges>;
export type AggregatedEmissionsData = ReturnType<
  typeof calculateAggregatedEmissionsData
>;
export type CombinedSectorsEmissionsData = ReturnType<
  typeof createCombinedSectorsEmissionsData
>;

const emissionsFields = [
  "generation",
  "so2",
  "nox",
  "co2",
  "pm25",
  "vocs",
  "nh3",
] as const;

type EmissionsFields = (typeof emissionsFields)[number];

type EguData = EmissionsChanges["egus"][string];

export type EmissionsData = {
  [field in EmissionsFields]: {
    power: {
      annual: { pre: number; post: number };
      monthly: {
        [month: number]: { pre: number; post: number };
      };
    } | null;
    vehicle: {
      annual: number;
      monthly: {
        [month: number]: number;
      } | null;
    };
  };
};

export type EmissionsFlagsField = EguData["emissionsFlags"][number];

type NEIPollutantsEmissionRates = {
  generation: number;
  heat: number;
  pm25: number;
  vocs: number;
  nh3: number;
};

type NEIEmissionRatesByEGU = {
  region: string;
  state: string;
  plant: string;
  orspl: number;
  unit: string;
  name: string;
  county: string;
  "orspl|unit|region": string;
  years: {
    "2017": NEIPollutantsEmissionRates;
    "2018": NEIPollutantsEmissionRates;
    "2019": NEIPollutantsEmissionRates;
    "2020": NEIPollutantsEmissionRates;
    "2021": NEIPollutantsEmissionRates;
    "2022": NEIPollutantsEmissionRates;
    "2023": NEIPollutantsEmissionRates;
    "2024": NEIPollutantsEmissionRates;
  };
};

type RDFDataField = keyof RDFJSON["data"];

/**
 * Adds a number to an array of numbers, sorts it, and returns the index of the
 * number directly before the one that was inserted
 *
 * Excel: Functionaly similar to the code associated with "matchedArray" in the
 * "m_3_displaced_gen_emissions" Visual Basic module.
 */
function getPrecedingIndex(array: number[], number: number) {
  /** Insert the provided number into the provided array and sort it. */
  const sortedArray = array.concat(number).sort((a, b) => a - b);
  const numberIndex = sortedArray.indexOf(number);
  /** Return the index of the number directly before the inserted number. */
  if (array[numberIndex] === number) return numberIndex;
  return numberIndex - 1;
}

/**
 * Excel: "pre" and "post" calculation from the "m_3_displaced_gen_emissions"
 * Visual Basic module before the "delta" is determined.
 */
function calculateLinear(options: {
  load: number;
  genA: number;
  genB: number;
  edgeA: number;
  edgeB: number;
}) {
  const { load, genA, genB, edgeA, edgeB } = options;
  const slope = (genA - genB) / (edgeA - edgeB);
  const intercept = genA - slope * edgeA;
  return load * slope + intercept;
}

// /**
//  * Rounds a number a specified number of decimal places.
//  */
// function roundToDecimalPlaces(options: {
//   number: number;
//   decimalPlaces: number;
// }) {
//   const { number, decimalPlaces } = options;
//   const factor = Math.pow(10, decimalPlaces);
//   return Math.round(number * factor) / factor;
// }

/**
 * *****************************************************************************
 * NOTE: This is a TypeScript version of the `calculateEmissionsChanges()`
 * function found in the server app (`server/app/calculations.js`). This
 * TypeScript version of the function isn't actually used in the client app, but
 * it's return type (`EmissionsChanges`) is used. Ideally, we'd use this version
 * within the client app and calculate the emissions changes in the client app,
 * but the calculations are too intesive and lock the UI, which is why we
 * offload them to the server app, and receive the results through API calls.
 *
 * TLDR; much of the code in this file is for reference only (except for the
 * return type, which is currently used) in case we're able update the client
 * app at some point in the future in a way where we can handle the emissions
 * calculations in the client app alone.
 * *****************************************************************************
 *
 * Calculates emissions changes for a provided region.
 *
 * Excel: "m_3_displaced_gen_emissions" Visual Basic module, starting on line 82
 * which begins with the following code:
 * ```vb
 *  'This gets the dimensions of various arrays
 *  Sheets("Data").Activate
 *  Dim lastColRow2 As Double
 *  Dim lastRowColA As Double
 *  Dim lastRowColJ As Double
 * ```
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
function calculateEmissionsChanges(options: {
  year: number;
  rdf: RDFJSON;
  neiEmissionRates: NEIEmissionRatesByEGU[];
  hourlyChanges: number[];
}) {
  const { year, rdf, neiEmissionRates, hourlyChanges } = options;

  type OzoneSeasonDataField = (RDFDataField & EmissionsFields) | "heat";

  /**
   * NOTE: `hourly`, `monthly`, and `yearly` values are commented out below and
   * not returned from this function, as their values are not used, as we really
   * need at a minimum, monthly data at the county level (which we can then
   * build up to state, region, and total monthly and annual values). We'll
   * leave the `hourly`, `monthly`, and `yearly` calculations here (commented
   * out) as they can be useful in validating/testing values with the Excel app
   * when developing locally.
   */

  // /**
  //  * Cumulative hourly emissions impacts from all electric generating units
  //  * (EGUs) for each pollutant/emissions field.
  //  *
  //  * Excel: Columns I, J, and K of the various pollutant/emissions sheets
  //  * ("Generation", "SO2", "NOx", "CO2", "PM25", "VOCs", and "NH3"). For example,
  //  * for the "SO2" sheet, those columns are:
  //  *   - "Orig SO2 (lb)" (column I) which is the hourly "pre" value.
  //  *   - "Post Change SO2 (lb)" (column J) which is the hourly "post" value.
  //  *   - "Sum: All Units (lb)" (column K) which is the hourly "impacts" value.
  //  * Also the "totalArray" variable in the "m_3_displaced_gen_emissions" Visual
  //  * Basic module.
  //  */
  // const hourly = {} as {
  //   [regionId in RegionId]: {
  //     [emissionsField in EmissionsFields]: {
  //       [hour: number]: {
  //         pre: number;
  //         post: number;
  //         impacts: number;
  //       };
  //     };
  //   };
  // };

  // /**
  //  * Cumulative monthly emissions impacts from all electric generating units
  //  * (EGUs) for each pollutant/emissions field.
  //  *
  //  * Excel: This value isn't stored in Excel, but each EGU's monthly impacts
  //  * values are – see the 12 rows of monthly data for each EGU below the last
  //  * hourly row and below the EGU annual totals row and NEI emission rates row
  //  * (emissions rates row shown for NEI pollutants only). So this monthly value
  //  * could be calculated as the sum of each EGU's the monthly impacts values.
  //  */
  // const monthly = {} as {
  //   [regionId in RegionId]: {
  //     [emissionsField in EmissionsFields]: {
  //       [month: number]: {
  //         pre: number;
  //         post: number;
  //         impacts: number;
  //       };
  //     };
  //   };
  // };

  // /**
  //  * Total yearly emissions impacts from all electric generating units for each
  //  * pollutant/emissions field.
  //  *
  //  * NOTE: This value isn't stored in Excel, but the yearly impacts value could
  //  * be calculated as the sum of the hourly impacts (which are stored in Excel):
  //  * `=SUM(K4:K8787)`.
  //  */
  // const yearly = {} as {
  //   [regionId in RegionId]: {
  //     [emissionsField in EmissionsFields]: {
  //       pre: number;
  //       post: number;
  //       impacts: number;
  //     };
  //   };
  // };

  /**
   * Monthly emissions changes data for each electric generating unit.
   *
   * NOTE: Emissions rates for generation, so2, nox, and co2 are calculated with
   * data in the RDF's `data` object under it's corresponding key: ozone season
   * data matches the field exactly (e.g. `data.so2`, `data.nox`) and non-ozone
   * season data has a `_not` suffix in the field name (e.g. `data.so2_not`,
   * `data.nox_not`). There's no non-ozone season for generation, so it always
   * uses `data.generation`, regardless of ozone season.
   *
   * Emissions rates for pm2.5, vocs, and nh3 are calculated with both annual
   * point-source data from the National Emissions Inventory
   * (`neiEmissionRates`) and the `heat` and `heat_not` fields in the RDF's
   * `data` object (for ozone and non-ozone season respectively).
   *
   * Excel: The "Total, Post Change" row below the last hourly row store the
   * monthly impacts value for each EGU (pre and post values are not stored in
   * Excel).
   */
  const egus = {} as {
    [eguId: string]: {
      region: string;
      state: string;
      county: string;
      lat: number;
      lon: number;
      fuelType: string;
      orisplCode: number;
      unitCode: string;
      name: string;
      emissionsFlags: ("generation" | "so2" | "nox" | "co2" | "heat")[];
      data: {
        monthly: {
          [field in EmissionsFields]: {
            [month: number]: {
              pre: number;
              post: number;
            };
          };
        };
      };
    };
  };

  const regionId = rdf.region.region_abbv as RegionId;
  const regionName = rdf.region.region_name;

  const regionalNeiEmissionRates = neiEmissionRates.filter((item) => {
    return item.region === regionName;
  });

  /**
   * Excel: "genBlockArray" variable in the "m_3_displaced_gen_emissions" Visual
   * Basic module.
   */
  const loadBinEdges = rdf.load_bin_edges;

  const firstLoadBinEdge = loadBinEdges[0];
  const lastLoadBinEdge = loadBinEdges[loadBinEdges.length - 1];

  /**
   * Iterate over each hour in the year (8760 hours for non-leap years or 8784
   * hours for leap years).
   */
  for (const [i, hourlyLoad] of rdf.regional_load.entries()) {
    // const hour = hourlyLoad.hour_of_year;
    const month = hourlyLoad.month;

    /**
     * Original regional load (mwh) for the hour.
     *
     * Excel: "Regional Load (MW)" (column D) of the various pollutant/emissions
     * sheets ("Generation", "SO2", "NOx", etc.) and also the first item in the
     * "loadArray" variable in the "m_3_displaced_gen_emissions" Visual Basic
     * module.
     */
    const preLoad = hourlyLoad.regional_load_mw;

    /**
     * Post impacts regional load (mwh) for the hour.
     *
     * Excel: "Load after Energy Change" (column F) of the various pollutant/
     * emissions sheets ("Generation", "SO2", "NOx", etc.) and also the third
     * item in the "loadArray" variable in the "m_3_displaced_gen_emissions"
     * Visual Basic module.
     *
     * NOTE: `hourlyChanges[i]` is the "Energy Change Profile" (column E) of the
     * various pollutant/emissions sheets ("Generation", "SO2", "NOx", etc.) and
     * also the second item in the "loadArray" variable in the
     * "m_3_displaced_gen_emissions" Visual Basic module.
     */
    const postLoad = preLoad + hourlyChanges[i];

    /** Ensure the pre and post load is in bounds. */
    const preLoadInBounds = preLoad >= firstLoadBinEdge && preLoad <= lastLoadBinEdge; // prettier-ignore
    const postLoadInBounds = postLoad >= firstLoadBinEdge && postLoad <= lastLoadBinEdge; // prettier-ignore

    if (!(preLoadInBounds && postLoadInBounds)) continue;

    /** Get the index of the load bin edge closest to the preLoad and postLoad values. */
    const preLoadBinEdgeIndex = getPrecedingIndex(loadBinEdges, preLoad);
    const postLoadBinEdgeIndex = getPrecedingIndex(loadBinEdges, postLoad);

    /** Iterate over each of the RDF's ozone data fields */
    (["generation", "so2", "nox", "co2", "heat"] as const).forEach((field) => {
      const ozoneSeasonData = rdf.data[field];

      const nonOzoneSeasonData =
        field === "generation"
          ? null // NOTE: there's no non-ozone season for generation
          : rdf.data[`${field}_not` as RDFDataField];

      const ozoneSeasonMedians = ozoneSeasonData.map((egu) => egu.medians);

      const nonOzoneSeasonMedians = nonOzoneSeasonData
        ? nonOzoneSeasonData.map((egu) => egu.medians)
        : null;

      /**
       * Ozone season is between May and September, so use the correct medians
       * dataset for the current month.
       *
       * Excel: "plantDataArray" in the "m_3_displaced_gen_emissions" Visual
       * Basic module.
       */
      const datasetMedians = !nonOzoneSeasonMedians
        ? ozoneSeasonMedians
        : month >= 5 && month <= 9
          ? ozoneSeasonMedians
          : nonOzoneSeasonMedians;

      /**
       * Iterate over each electric generating unit (EGU). The total number of
       * EGUs varries per region (less than 100 for the RM region; more than
       * 1000 for the SE region).
       */
      ozoneSeasonData.forEach((egu, eguIndex) => {
        const {
          state,
          county,
          lat,
          lon,
          fuel_type,
          orispl_code,
          unit_code,
          full_name,
          infreq_emissions_flag,
        } = egu;

        const eguId = `${regionId}_${state}_${orispl_code}_${unit_code}`;
        const medians = datasetMedians[eguIndex];

        /**
         * Excel: "pre" calculation from the "m_3_displaced_gen_emissions"
         * Visual Basic module before the "delta" is determined.
         */
        const calculatedPre = calculateLinear({
          load: preLoad,
          genA: medians[preLoadBinEdgeIndex],
          genB: medians[preLoadBinEdgeIndex + 1],
          edgeA: loadBinEdges[preLoadBinEdgeIndex],
          edgeB: loadBinEdges[preLoadBinEdgeIndex + 1],
        });

        /**
         * Handle special exclusions for emissions changes at specific EGUs
         * (specifically added for errors with SO2 reporting, but the RDFs were
         * updated to include the `infreq_emissions_flag` for all pollutants for
         * consistency, which allows other pollutants at specific EGUs to be
         * excluded in the future).
         *
         * Excel: "post" calculation from the "m_3_displaced_gen_emissions"
         * Visual Basic module before the "delta" is determined.
         */
        const calculatedPost =
          infreq_emissions_flag === 1
            ? calculatedPre
            : calculateLinear({
                load: postLoad,
                genA: medians[postLoadBinEdgeIndex],
                genB: medians[postLoadBinEdgeIndex + 1],
                edgeA: loadBinEdges[postLoadBinEdgeIndex],
                edgeB: loadBinEdges[postLoadBinEdgeIndex + 1],
              });

        // /**
        //  * Determine the number of decimal places to values to, based on the
        //  * pollution/emissions field.
        //  */
        // const decimalPlaces =
        //   field === "generation" ||
        //   field === "co2" ||
        //   field === "so2" ||
        //   field === "nox"
        //     ? 3
        //     : field === "pm25" || field === "vocs" || field === "nh3"
        //       ? 6
        //       : 0;

        /**
         * NOTE: PM2.5, VOCs, and NH3 always use the `heat` or `heat_not` fields
         * of the RDF's `data` object, and their calculated `pre` and `post`
         * values need to be multiplied by the NEI emission rates for the EGU.
         */
        (field === "heat"
          ? (["pm25", "vocs", "nh3"] as const)
          : [field]
        ).forEach((emissionsField) => {
          /**
           * Conditionally multiply NEI factor to calculated pre and post values.
           */
          const conditionallyMatchedEgu =
            field === "heat"
              ? regionalNeiEmissionRates.find((item) => {
                  return item.orspl === orispl_code && item.unit === unit_code;
                })
              : null;

          const neiEguData =
            conditionallyMatchedEgu?.years?.[
              year.toString() as keyof NEIEmissionRatesByEGU["years"]
            ];

          const neiFieldData =
            neiEguData?.[emissionsField as keyof NEIPollutantsEmissionRates];

          const pre =
            neiFieldData !== undefined
              ? calculatedPre * neiFieldData
              : calculatedPre;

          const post =
            neiFieldData !== undefined
              ? calculatedPost * neiFieldData
              : calculatedPost;

          // const pre =
          //   neiFieldData !== undefined
          //     ? roundToDecimalPlaces({
          //         number: calculatedPre * neiFieldData,
          //         decimalPlaces,
          //       })
          //     : calculatedPre;

          // const post =
          //   neiFieldData !== undefined
          //     ? roundToDecimalPlaces({
          //         number: calculatedPost * neiFieldData,
          //         decimalPlaces,
          //       })
          //     : calculatedPost;

          // const impacts = post - pre;

          // /**
          //  * Conditionally initialize the emissionsField's hourly impacts from
          //  * all EGUs.
          //  */
          // hourly[regionId] ??= {
          //   generation: {},
          //   so2: {},
          //   nox: {},
          //   co2: {},
          //   pm25: {},
          //   vocs: {},
          //   nh3: {},
          // };
          // hourly[regionId][emissionsField][hour] ??= {
          //   pre: 0,
          //   post: 0,
          //   impacts: 0,
          // };

          // /**
          //  * Increment the emissionsField's hourly pre, post, and impacts values
          //  * from all EGUs and round the accumulated impacts value.
          //  */
          // hourly[regionId][emissionsField][hour].pre += pre;
          // hourly[regionId][emissionsField][hour].post += post;
          // hourly[regionId][emissionsField][hour].impacts += impacts;

          // hourly[regionId][emissionsField][hour].impacts = roundToDecimalPlaces({
          //   number: hourly[regionId][emissionsField][hour].impacts,
          //   decimalPlaces,
          // });

          // /**
          //  * Conditionally initialize the emissionsField's monthly impacts from
          //  * all EGUs.
          //  */
          // monthly[regionId] ??= {
          //   generation: {},
          //   so2: {},
          //   nox: {},
          //   co2: {},
          //   pm25: {},
          //   vocs: {},
          //   nh3: {},
          // };
          // monthly[regionId][emissionsField][month] ??= {
          //   pre: 0,
          //   post: 0,
          //   impacts: 0,
          // };

          // /**
          //  * Increment the emissionsField's monthly pre, post, and impacts values
          //  * from all EGUs and round the accumulated impacts value.
          //  */
          // monthly[regionId][emissionsField][month].pre += pre;
          // monthly[regionId][emissionsField][month].post += post;
          // monthly[regionId][emissionsField][month].impacts += impacts;

          // monthly[regionId][emissionsField][month].impacts = roundToDecimalPlaces({
          //   number: monthly[regionId][emissionsField][month].impacts,
          //   decimalPlaces,
          // });

          // /**
          //  * Conditionally initialize the emissionsField's yearly impacts from
          //  * all EGUs.
          //  */
          // yearly[regionId] ??= {
          //   generation: { pre: 0, post: 0, impacts: 0 },
          //   so2: { pre: 0, post: 0, impacts: 0 },
          //   nox: { pre: 0, post: 0, impacts: 0 },
          //   co2: { pre: 0, post: 0, impacts: 0 },
          //   pm25: { pre: 0, post: 0, impacts: 0 },
          //   vocs: { pre: 0, post: 0, impacts: 0 },
          //   nh3: { pre: 0, post: 0, impacts: 0 },
          // };

          // /**
          //  * Increment the emissionsField's yearly pre, post, and impacts values
          //  * from all EGUs and round the accumulated impacts value.
          //  */
          // yearly[regionId][emissionsField].pre += pre;
          // yearly[regionId][emissionsField].post += post;
          // yearly[regionId][emissionsField].impacts += impacts;

          // yearly[regionId][emissionsField].impacts = roundToDecimalPlaces({
          //   number: yearly[regionId][emissionsField].impacts,
          //   decimalPlaces,
          // });

          /**
           * Conditionally initialize each EGU's metadata and monthly data
           * structure for each emissionsField.
           */
          egus[eguId] ??= {
            region: regionId,
            state: state,
            county: county,
            lat: lat,
            lon: lon,
            fuelType: fuel_type,
            orisplCode: orispl_code,
            unitCode: unit_code,
            name: full_name,
            emissionsFlags: [],
            data: {
              monthly: {
                generation: {},
                so2: {},
                nox: {},
                co2: {},
                pm25: {},
                vocs: {},
                nh3: {},
              },
            },
          };

          /**
           * Conditionally add emissionsField (e.g. so2, nox, co2) to EGU's
           * emissions flags, as emissions "replacement" will be needed for that
           * emissions field/pollutant.
           */
          if (
            infreq_emissions_flag === 1 &&
            !egus[eguId].emissionsFlags.includes(
              emissionsField as OzoneSeasonDataField,
            )
          ) {
            egus[eguId].emissionsFlags.push(
              emissionsField as OzoneSeasonDataField,
            );
          }

          /**
           * Conditionally initialize the EGU's monthly data for the
           * emissionsField.
           */
          egus[eguId].data.monthly[emissionsField][month] ??= {
            pre: 0,
            post: 0,
          };

          /**
           * Increment the EGU's monthly pre and post values for the
           * emissionsField.
           */
          egus[eguId].data.monthly[emissionsField][month].pre += pre;
          egus[eguId].data.monthly[emissionsField][month].post += post;
        });
      });
    });
  }

  // return { hourly, monthly, yearly, egus };
  return { egus };
}

/**
 * Creates initial (empty) monthly power sector data.
 */
function createEmptyMonthlyPowerData() {
  const result = [...Array(12)].reduce(
    (object, _item, index) => {
      object[index + 1] = { pre: 0, post: 0 };
      return object;
    },
    {} as EguData["data"]["monthly"][keyof EguData["data"]["monthly"]],
  );

  return result;
}

/**
 * Creates initial (empty) monthly transportation sector data.
 */
function createEmptyMonthlyVehicleData() {
  const result = [...Array(12)].reduce(
    (object, _item, index) => {
      object[index + 1] = 0;
      return object;
    },
    {} as { [month: number]: number },
  );

  return result;
}

/**
 * Creates the intial structure of monthly and annual emissions data for each
 * pollutant.
 */
function createInitialEmissionsData() {
  const result = emissionsFields.reduce((object, field) => {
    object[field] = {
      power: {
        annual: { pre: 0, post: 0 },
        monthly: createEmptyMonthlyPowerData(),
      },
      vehicle: {
        annual: 0,
        monthly: null,
      },
    };

    return object;
  }, {} as EmissionsData);

  return result;
}

/**
 * Sum the provided EGUs emissions data into monthly and annual pre and post
 * values for each pollutant.
 */
export function calculateAggregatedEmissionsData(
  emissionChanges: EmissionsChanges,
) {
  if (Object.keys(emissionChanges.egus).length === 0) {
    return null;
  }

  const result = Object.values(emissionChanges.egus).reduce(
    (object, eguData) => {
      const regionId = eguData.region as RegionId;
      const stateId = eguData.state as StateId;
      const county = eguData.county;

      object.regions[regionId] ??= createInitialEmissionsData();
      object.states[stateId] ??= createInitialEmissionsData();
      object.counties[stateId] ??= {};
      object.counties[stateId][county] ??= createInitialEmissionsData();

      Object.entries(eguData.data.monthly).forEach(([fieldKey, fieldValue]) => {
        const field = fieldKey as keyof typeof eguData.data.monthly;

        Object.entries(fieldValue).forEach(([monthKey, monthValue]) => {
          const month = Number(monthKey);
          const { pre, post } = monthValue;

          if (object.total[field].power) {
            object.total[field].power.annual.pre += pre;
            object.total[field].power.annual.post += post;

            object.total[field].power.monthly[month].pre += pre;
            object.total[field].power.monthly[month].post += post;
          }

          if (object.regions[regionId][field].power) {
            object.regions[regionId][field].power.annual.pre += pre;
            object.regions[regionId][field].power.annual.post += post;

            object.regions[regionId][field].power.monthly[month].pre += pre;
            object.regions[regionId][field].power.monthly[month].post += post;
          }

          if (object.states[stateId][field].power) {
            object.states[stateId][field].power.annual.pre += pre;
            object.states[stateId][field].power.annual.post += post;

            object.states[stateId][field].power.monthly[month].pre += pre;
            object.states[stateId][field].power.monthly[month].post += post;
          }

          if (object.counties[stateId][county][field].power) {
            object.counties[stateId][county][field].power.annual.pre += pre;
            object.counties[stateId][county][field].power.annual.post += post;

            object.counties[stateId][county][field].power.monthly[month].pre += pre; // prettier-ignore
            object.counties[stateId][county][field].power.monthly[month].post += post; // prettier-ignore
          }
        });
      });

      return object;
    },
    {
      total: createInitialEmissionsData(),
      regions: {},
      states: {},
      counties: {},
    } as {
      total: EmissionsData;
      regions: { [regionId in RegionId]: EmissionsData };
      states: { [stateId in StateId]: EmissionsData };
      counties: { [stateId in StateId]: { [county: string]: EmissionsData } };
    },
  );

  return result;
}

/**
 * Combines transportation sector and power sector emissions data.
 */
export function createCombinedSectorsEmissionsData(options: {
  aggregatedEmissionsData: AggregatedEmissionsData;
  selectedRegionsMonthlyEmissionChangesTotals:
    | SelectedRegionsMonthlyEmissionChangesTotals
    | EmptyObject;
  vehicleEmissionChangesByGeography:
    | VehicleEmissionChangesByGeography
    | EmptyObject;
}) {
  const {
    aggregatedEmissionsData,
    selectedRegionsMonthlyEmissionChangesTotals,
    vehicleEmissionChangesByGeography,
  } = options;

  if (
    !aggregatedEmissionsData ||
    Object.keys(selectedRegionsMonthlyEmissionChangesTotals).length === 0 ||
    Object.keys(vehicleEmissionChangesByGeography).length === 0
  ) {
    return null;
  }

  /**
   * Format `selectedRegionsMonthlyEmissionChangesTotals` for storing regional
   * and total monthly emission changes per pollutant.
   */
  const monthlyVehicleEmissionChangesData = Object.entries(
    selectedRegionsMonthlyEmissionChangesTotals,
  ).reduce(
    (object, [regionKey, regionValue]) => {
      const regionId = regionKey as keyof typeof selectedRegionsMonthlyEmissionChangesTotals; // prettier-ignore

      object[regionId] ??= { co2: {}, nox: {}, so2: {}, pm25: {}, vocs: {}, nh3: {} }; // prettier-ignore

      Object.entries(regionValue).forEach(
        ([regionMonthKey, regionMonthValue]) => {
          const month = Number(regionMonthKey);

          Object.entries(regionMonthValue).forEach(([key, value]) => {
            const pollutant = key as keyof typeof regionMonthValue;

            /** Conditionally convert CO2 pounds into tons. */
            const result = pollutant === "co2" ? value / 2000 : value;

            object[regionId][pollutant][month] = -1 * result;
            object.regionTotals[pollutant][month] ??= 0;
            object.regionTotals[pollutant][month] += -1 * result;
          });
        },
      );

      return object;
    },
    {
      regionTotals: { co2: {}, nox: {}, so2: {}, pm25: {}, vocs: {}, nh3: {} },
    } as {
      [regionId in RegionId | "regionTotals"]: {
        [pollutant in "co2" | "nox" | "so2" | "pm25" | "vocs" | "nh3"]: {
          [month: number]: number;
        };
      };
    },
  );

  /** Start with power sector emissions data. */
  const result = { ...aggregatedEmissionsData };

  /** Add total transportation sector emissions data. */
  Object.keys(result.total).forEach((key) => {
    const pollutant = key as keyof typeof result.total;

    const annualVehicleData =
      pollutant !== "generation" &&
      pollutant in vehicleEmissionChangesByGeography.total
        ? vehicleEmissionChangesByGeography.total[pollutant]
        : 0;

    const monthlyVehicleData =
      pollutant !== "generation" &&
      pollutant in monthlyVehicleEmissionChangesData.regionTotals
        ? monthlyVehicleEmissionChangesData.regionTotals[pollutant]
        : null;

    result.total[pollutant].vehicle.annual = annualVehicleData;
    result.total[pollutant].vehicle.monthly = monthlyVehicleData;
  });

  /** Add region level transportation sector emissions data. */
  Object.keys(vehicleEmissionChangesByGeography.regions).forEach((key) => {
    const regionId = key as keyof typeof vehicleEmissionChangesByGeography.regions; // prettier-ignore

    /** Initialize region data if it doesn't already exist. */
    result.regions[regionId] ??= {
      generation: { power: null, vehicle: { annual: 0, monthly: null } },
      so2: { power: null, vehicle: { annual: 0, monthly: null } },
      nox: { power: null, vehicle: { annual: 0, monthly: null } },
      co2: { power: null, vehicle: { annual: 0, monthly: null } },
      pm25: { power: null, vehicle: { annual: 0, monthly: null } },
      vocs: { power: null, vehicle: { annual: 0, monthly: null } },
      nh3: { power: null, vehicle: { annual: 0, monthly: null } },
    };

    const region = result.regions[regionId];

    Object.keys(region).forEach((key) => {
      const pollutant = key as keyof typeof region;

      const annualVehicleData =
        pollutant !== "generation" &&
        pollutant in vehicleEmissionChangesByGeography.regions[regionId]
          ? vehicleEmissionChangesByGeography.regions[regionId][pollutant]
          : 0;

      const monthlyVehicleData =
        pollutant !== "generation" &&
        pollutant in monthlyVehicleEmissionChangesData[regionId]
          ? monthlyVehicleEmissionChangesData[regionId][pollutant]
          : null;

      region[pollutant].vehicle.annual = annualVehicleData;
      region[pollutant].vehicle.monthly = monthlyVehicleData;
    });
  });

  /** Add state level transportation sector annual emissions data. */
  Object.keys(vehicleEmissionChangesByGeography.states).forEach((key) => {
    const stateId = key as keyof typeof vehicleEmissionChangesByGeography.states; // prettier-ignore

    /** Initialize state data if it doesn't already exist. */
    result.states[stateId] ??= {
      generation: { power: null, vehicle: { annual: 0, monthly: null } },
      so2: { power: null, vehicle: { annual: 0, monthly: null } },
      nox: { power: null, vehicle: { annual: 0, monthly: null } },
      co2: { power: null, vehicle: { annual: 0, monthly: null } },
      pm25: { power: null, vehicle: { annual: 0, monthly: null } },
      vocs: { power: null, vehicle: { annual: 0, monthly: null } },
      nh3: { power: null, vehicle: { annual: 0, monthly: null } },
    };

    const state = result.states[stateId];

    Object.keys(state).forEach((key) => {
      const pollutant = key as keyof typeof state;

      const annualVehicleData =
        pollutant !== "generation" &&
        pollutant in vehicleEmissionChangesByGeography.states[stateId]
          ? vehicleEmissionChangesByGeography.states[stateId][pollutant]
          : 0;

      state[pollutant].vehicle.annual = annualVehicleData;
    });
  });

  /** Update state level transportation sector monthly emissions data. */
  Object.keys(result.states).forEach((key) => {
    const stateId = key as keyof typeof result.states;
    const state = result.states[stateId];

    Object.keys(state).forEach((key) => {
      const pollutant = key as keyof typeof state;

      state[pollutant].vehicle.monthly =
        state[pollutant].vehicle.annual === 0
          ? createEmptyMonthlyVehicleData()
          : null;
    });
  });

  /** Add county level transportation sector annual emissions data. */
  Object.entries(vehicleEmissionChangesByGeography.counties).forEach(
    ([key, value]) => {
      const stateId = key as keyof typeof vehicleEmissionChangesByGeography.counties; // prettier-ignore

      Object.keys(value).forEach((countyName) => {
        result.counties[stateId] ??= {};

        /** Initialize county data if it doesn't already exist. */
        result.counties[stateId][countyName] ??= {
          generation: { power: null, vehicle: { annual: 0, monthly: null } },
          so2: { power: null, vehicle: { annual: 0, monthly: null } },
          nox: { power: null, vehicle: { annual: 0, monthly: null } },
          co2: { power: null, vehicle: { annual: 0, monthly: null } },
          pm25: { power: null, vehicle: { annual: 0, monthly: null } },
          vocs: { power: null, vehicle: { annual: 0, monthly: null } },
          nh3: { power: null, vehicle: { annual: 0, monthly: null } },
        };

        const county = result.counties[stateId][countyName];

        Object.keys(county).forEach((key) => {
          const pollutant = key as keyof typeof county;

          const annualVehicleData =
            pollutant !== "generation" &&
            pollutant in vehicleEmissionChangesByGeography.counties[stateId][countyName] // prettier-ignore
              ? vehicleEmissionChangesByGeography.counties[stateId][countyName][pollutant] // prettier-ignore
              : 0;

          county[pollutant].vehicle.annual = annualVehicleData;
        });
      });
    },
  );

  /** Update county level transportation sector monthly emissions data. */
  Object.entries(result.counties).forEach(([key, value]) => {
    const stateId = key as keyof typeof result.counties;

    Object.keys(value).forEach((countyName) => {
      const county = result.counties[stateId][countyName];

      Object.keys(county).forEach((key) => {
        const pollutant = key as keyof typeof county;

        county[pollutant].vehicle.monthly =
          county[pollutant].vehicle.annual === 0
            ? createEmptyMonthlyVehicleData()
            : null;
      });
    });
  });

  /** Sort results alphabetically. */
  result.regions = sortObjectByKeys(result.regions);
  result.states = sortObjectByKeys(result.states);
  result.counties = sortObjectByKeys(result.counties);
  result.counties = Object.entries(result.counties).reduce(
    (object, [stateId, counties]) => {
      object[stateId as StateId] = sortObjectByKeys(counties);
      return object;
    },
    {} as typeof result.counties,
  );

  return result;
}
