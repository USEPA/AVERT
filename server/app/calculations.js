/**
 * @typedef {Object} EGUData
 * @property {string} state
 * @property {string} county
 * @property {number} lat
 * @property {number} lon
 * @property {string} fuel_type
 * @property {number} orispl_code
 * @property {string} unit_code
 * @property {string} full_name
 * @property {0|1} infreq_emissions_flag
 * @property {number[]} medians
 */

/**
 * @typedef {Object} RDFJSON
 * @property {{
 *  region_abbv: string,
 *  region_name: string,
 *  region_states: string
 * }} region
 * @property {{
 *  file_name: string[],
 *  mc_gen_runs: number,
 *  mc_runs: number,
 *  region_id: number,
 *  year: number
 * }} run
 * @property {{
 *  created_at: ?string[],
 *  id: number,
 *  max_ee_percent: number,
 *  max_ee_yearly_gwh: number,
 *  max_solar_wind_mwh: number,
 *  region_id: number,
 *  updated_at: ?string[],
 *  year: number
 * }} limits
 * @property {{
 *  day: number,
 *  hour: number,
 *  hour_of_year: number,
 *  hourly_limit: number,
 *  month: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12,
 *  regional_load_mw: number,
 *  year: number
 * }[]} regional_load
 * @property {number[]} load_bin_edges
 * @property {{
 *  generation: EGUData[],
 *  so2: EGUData[],
 *  so2_not: EGUData[],
 *  nox: EGUData[],
 *  nox_not: EGUData[],
 *  co2: EGUData[],
 *  co2_not: EGUData[],
 *  heat: EGUData[],
 *  heat_not: EGUData[]
 * }} data
 */

/**
 * @typedef {{
 *  generation: number,
 *  heat: number,
 *  pm25: number,
 *  vocs: number,
 *  nh3: number
 * }} NEIPollutantsEmissionRates
 */

/**
 * @typedef {{
 *  region: string,
 *  state: string,
 *  plant: string,
 *  orspl: number,
 *  unit: string,
 *  name: string,
 *  county: string,
 *  "orspl|unit|region": string,
 *  years: {
 *    "2017": NEIPollutantsEmissionRates,
 *    "2018": NEIPollutantsEmissionRates,
 *    "2019": NEIPollutantsEmissionRates,
 *    "2020": NEIPollutantsEmissionRates,
 *    "2021": NEIPollutantsEmissionRates,
 *    "2022": NEIPollutantsEmissionRates,
 *    "2023": NEIPollutantsEmissionRates,
 *    "2024": NEIPollutantsEmissionRates
 *  }
 * }} NEIEmissionRatesByEGU
 */

/**
 * Adds a number to an array of numbers, sorts it, and returns the index of the
 * number directly before the one that was inserted
 *
 * @param {number[]} array
 * @param {number} number
 */
function getPrecedingIndex(array, number) {
  // insert provided number into the provided array and sort it
  const sortedArray = array.concat(number).sort((a, b) => a - b);
  const numberIndex = sortedArray.indexOf(number);
  // return the index of the number directly before the inserted number
  if (array[numberIndex] === number) return numberIndex;
  return numberIndex - 1;
}

/**
 * Excel: "Pre" and "Post" calculation from "m_3_displaced_gen_emissions" module
 *
 * @param {{
 *  load: number,
 *  genA: number,
 *  genB: number,
 *  edgeA: number,
 *  edgeB: number
 * }} options
 */
function calculateLinear(options) {
  const { load, genA, genB, edgeA, edgeB } = options;
  const slope = (genA - genB) / (edgeA - edgeB);
  const intercept = genA - slope * edgeA;
  return load * slope + intercept;
}

/**
 * Rounds a number to three decimal places.
 * 
 * @param {number} num 
 */
function roundToThreeDecimals(num) {
  return Math.round(num * 1000) / 1000;
}

/**
 * Calculates emissions changes for a provided region.
 *
 * @param {{
 *  year: number,
 *  rdf: RDFJSON,
 *  neiEmissionRates: NEIEmissionRatesByEGU[],
 *  hourlyChanges: number[]
 * }} options
 */
function calculateEmissionsChanges(options) {
  const { year, rdf, neiEmissionRates, hourlyChanges } = options;

  /**
   * Cumulative hourly emissions impacts from all electric generating units
   * (EGUs) for each pollutant/emissions field.
   *
   * Excel: "Sum: All Units (lb)" (or in the case of the "CO2" Excel sheet,
   * "Sum: All Units (tons)") column (K) of the various pollutant/emissions
   * sheets: "Generation", "SO2", "NOx", "CO2", "PM25", "VOCs", and "NH3".
   *
   * @type {{
   *  [regionId: string]: {
   *    [emissionsField: string]: {
   *      [hour: number]: number
   *    }
   *  }
   * }}
   */
  const hourlyImpacts = {};

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
   * @type {{
   *  [eguId: string]: {
   *    region: string,
   *    state: string,
   *    county: string,
   *    lat: number,
   *    lon: number,
   *    fuelType: string,
   *    orisplCode: number,
   *    unitCode: string,
   *    name: string,
   *    emissionsFlags: ("generation" | "so2" | "nox" | "co2" | "heat")[];
   *    monthly: {
   *      [field: "generation" | "so2" | "nox" | "co2" | "pm25" | "vocs" | "nh3"]: {
   *        [month: number]: {
   *          pre: number,
   *          post: number
   *        }
   *      }
   *    }
   * }}
   */
  const egus = {};

  /** @type {("generation" | "so2" | "nox" | "co2" | "pm25" | "vocs" | "nh3")[]} */
  const emissionsFields = ["generation", "so2", "nox", "co2", "pm25", "vocs", "nh3"];

  /** @type {("pm25" | "vocs" | "nh3")[]} */
  const neiFields = ["pm25", "vocs", "nh3"];

  const regionId = rdf.region.region_abbv;

  const loadBinEdges = rdf.load_bin_edges;
  const firstLoadBinEdge = loadBinEdges[0];
  const lastLoadBinEdge = loadBinEdges[loadBinEdges.length - 1];

  /**
   * Iterate over each hour in the year (8760 in non-leap years)
   */
  for (const [i, hourlyLoad] of rdf.regional_load.entries()) {
    const hour = hourlyLoad.hour_of_year;
    const month = hourlyLoad.month; // numeric month of load

    const preLoad = hourlyLoad.regional_load_mw; // original regional load (mwh) for the hour
    const postLoad = preLoad + hourlyChanges[i]; // merged regional energy profile (mwh) for the hour

    const preLoadInBounds = preLoad >= firstLoadBinEdge && preLoad <= lastLoadBinEdge; // prettier-ignore
    const postLoadInBounds = postLoad >= firstLoadBinEdge && postLoad <= lastLoadBinEdge; // prettier-ignore

    // filter out outliers
    if (!(preLoadInBounds && postLoadInBounds)) continue;

    // get index of load bin edge closest to preLoad or postLoad
    const preLoadBinEdgeIndex = getPrecedingIndex(loadBinEdges, preLoad);
    const postLoadBinEdgeIndex = getPrecedingIndex(loadBinEdges, postLoad);

    /**
     * Iterate over each emissions field: generation, so2, nox, co2...
     */
    emissionsFields.forEach((field) => {
      /**
       * NOTE: PM2.5, VOCs, and NH3 always use the `heat` or `heat_not` fields
       * of the RDF's `data` object.
       */

      /** @type {EGUData[]} */
      const ozoneSeasonData = neiFields.includes(field)
        ? rdf.data.heat
        : rdf.data[field];

      /** @type {?EGUData[]} */
      const nonOzoneSeasonData =
        field === "generation"
          ? null // NOTE: there's no non-ozone season for generation
          : neiFields.includes(field)
          ? rdf.data.heat_not
          : rdf.data[`${field}_not`];

      const ozoneSeasonMedians = ozoneSeasonData.map((egu) => egu.medians);

      const nonOzoneSeasonMedians = nonOzoneSeasonData
        ? nonOzoneSeasonData.map((egu) => egu.medians)
        : null;

      /**
       * Ozone season is between May and September, so use the correct medians
       * dataset for the current month.
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

        /**
         * Conditionally multiply NEI factor to calculated pre and post values.
         */
        const matchedEgu = neiEmissionRates.find((item) => {
          return item.orspl === orispl_code && item.unit === unit_code;
        });

        /** @type NEIPollutantsEmissionRates | undefined */
        const neiEguData = matchedEgu?.years?.[year.toString()];

        /** @type number | undefined */
        const neiFieldData = neiEguData?.[field];

        const pre =
          neiFields.includes(field) && neiFieldData !== undefined
            ? calculatedPre * neiFieldData
            : calculatedPre;

        const post =
          neiFields.includes(field) && neiFieldData !== undefined
            ? calculatedPost * neiFieldData
            : calculatedPost;

        /**
         * Conditionally initialize the field's hourly impacts.
         */
        hourlyImpacts[regionId] ??= {
          generation: {},
          so2: {},
          nox: {},
          co2: {},
          pm25: {},
          vocs: {},
          nh3: {},
        };
        hourlyImpacts[regionId][field][hour] ??= 0;

        /**
         * Add the rounded difference between the calculated post and pre values
         * and then round the accumulated value.
         */
        hourlyImpacts[regionId][field][hour] += roundToThreeDecimals(post - pre);
        hourlyImpacts[regionId][field][hour] = roundToThreeDecimals(hourlyImpacts[regionId][field][hour]);

        /**
         * Conditionally initialize each EGU's metadata.
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
          monthly: {
            generation: {},
            so2: {},
            nox: {},
            co2: {},
            pm25: {},
            vocs: {},
            nh3: {},
          },
        };

        /**
         * Conditionally add field (e.g. so2, nox, co2) to EGU's emissions
         * flags, as emissions "replacement" will be needed for that pollutant.
         */
        if (
          infreq_emissions_flag === 1 &&
          !egus[eguId].emissionsFlags.includes(field)
        ) {
          egus[eguId].emissionsFlags.push(field);
        }

        /**
         * Conditionally initialize the field's monthly data.
         */
        egus[eguId].monthly[field][month] ??= { pre: 0, post: 0 };

        /**
         * Increment the field's monthly pre and post values.
         */
        egus[eguId].monthly[field][month].pre += pre;
        egus[eguId].monthly[field][month].post += post;
      });
    });
  }

  return { hourlyImpacts, egus };
}

module.exports = { calculateEmissionsChanges };
