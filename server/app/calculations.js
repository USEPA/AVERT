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
 * @typedef {Object} NEIData
 * @property {{
 *  name: string,
 *  egus: {
 *    state: string,
 *    county: string,
 *    plant: string,
 *    orispl_code: number,
 *    unit_code: string,
 *    full_name: string,
 *    annual_data: {
 *      year: number,
 *      generation: number,
 *      heat: number,
 *      pm25: number,
 *      vocs: number,
 *      nh3: number
 *    }[]
 *  }[]
 * }[]} regions
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
 * TODO
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
 * Calculates emissions changes for a provided region.
 *
 * @param {{
 *  year: number,
 *  rdf: RDFJSON,
 *  neiData: NEIData
 *  hourlyEere: number[]
 * }} options
 */
function calculateEmissionsChanges(options) {
  const { year, rdf, neiData, hourlyEere } = options;

  /**
   * NOTE: Emissions rates for generation, so2, nox, and co2 are calculated with
   * data in the RDF's `data` object under it's corresponding key: ozone season
   * data matches the field exactly (e.g. `data.so2`, `data.nox`) and non-ozone
   * season data has a `_not` suffix in the field name (e.g. `data.so2_not`,
   * `data.nox_not`). There's no non-ozone season for generation, so it always
   * uses `data.generation`, regardless of ozone season.
   *
   * Emissions rates for pm2.5, vocs, and nh3 are calculated with both annual
   * point-source data from the National Emissions Inventory (`neiData`) and the
   * `heat` and `heat_not` fields in the RDF's `data` object (for ozone and
   * non-ozone season respectively).
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
   *    emissionsFlags: ('generation' | 'so2' | 'nox' | 'co2' | 'heat')[];
   *    data: {
   *      generation: { [month: number]: { original: number; postEere: number } },
   *      so2: { [month: number]: { original: number; postEere: number } },
   *      nox: { [month: number]: { original: number; postEere: number } },
   *      co2: { [month: number]: { original: number; postEere: number } },
   *      pm25: { [month: number]: { original: number; postEere: number } },
   *      vocs: { [month: number]: { original: number; postEere: number } },
   *      nh3: { [month: number]: { original: number; postEere: number } }
   *    }}
   * }}
   */
  const result = {};

  /** @type {("generation" | "so2" | "nox" | "co2" | "pm25" | "vocs" | "nh3")[]} */
  const dataFields = ["generation", "so2", "nox", "co2", "pm25", "vocs", "nh3"];

  /** @type {("pm25" | "vocs" | "nh3")[]} */
  const neiFields = ["pm25", "vocs", "nh3"];

  const regionalNeiEgus = neiData.regions.find((region) => {
    return region.name === rdf.region.region_name;
  })?.egus;

  const regionId = rdf.region.region_abbv;

  const loadBinEdges = rdf.load_bin_edges;
  const firstLoadBinEdge = loadBinEdges[0];
  const lastLoadBinEdge = loadBinEdges[loadBinEdges.length - 1];

  /**
   * Iterate over each hour in the year (8760 in non-leap years)
   */
  for (const [i, hourlyLoad] of rdf.regional_load.entries()) {
    const month = hourlyLoad.month; // numeric month of load

    const originalLoad = hourlyLoad.regional_load_mw; // original regional load (mwh) for the hour
    const postEereLoad = originalLoad + hourlyEere[i]; // EERE-merged regional load (mwh) for the hour

    const originalLoadInBounds = originalLoad >= firstLoadBinEdge && originalLoad <= lastLoadBinEdge; // prettier-ignore
    const postEereLoadInBounds = postEereLoad >= firstLoadBinEdge && postEereLoad <= lastLoadBinEdge; // prettier-ignore

    // filter out outliers
    if (!(originalLoadInBounds && postEereLoadInBounds)) continue;

    // get index of load bin edge closest to originalLoad or postEereLoad
    const originalLoadBinEdgeIndex = getPrecedingIndex(loadBinEdges, originalLoad); // prettier-ignore
    const postEereLoadBinEdgeIndex = getPrecedingIndex(loadBinEdges, postEereLoad); // prettier-ignore

    /**
     * Iterate over each data field: generation, so2, nox, co2...
     */
    dataFields.forEach((field) => {
      /**
       * NOTE: PM2.5, VOCs, and NH3 always use the `heat` or `heat_not` fields
       * of the RDF's `data` object
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
       * dataset for the current month
       */
      const datasetMedians = !nonOzoneSeasonMedians
        ? ozoneSeasonMedians
        : month >= 5 && month <= 9
        ? ozoneSeasonMedians
        : nonOzoneSeasonMedians;

      /**
       * Iterate over each electric generating unit (EGU). The total number of
       * EGUs varries per region (less than 100 for the RM region; more than
       * 1000 for the SE region)
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

        const calculatedOriginal = calculateLinear({
          load: originalLoad,
          genA: medians[originalLoadBinEdgeIndex],
          genB: medians[originalLoadBinEdgeIndex + 1],
          edgeA: loadBinEdges[originalLoadBinEdgeIndex],
          edgeB: loadBinEdges[originalLoadBinEdgeIndex + 1],
        });

        /**
         * Handle special exclusions for emissions changes at specific EGUs
         * (specifically added for errors with SO2 reporting, but the RDFs were
         * updated to include the `infreq_emissions_flag` for all pollutants for
         * consistency, which allows other pollutants at specific EGUs to be
         * excluded in the future)
         */
        const calculatedPostEere =
          infreq_emissions_flag === 1
            ? calculatedOriginal
            : calculateLinear({
                load: postEereLoad,
                genA: medians[postEereLoadBinEdgeIndex],
                genB: medians[postEereLoadBinEdgeIndex + 1],
                edgeA: loadBinEdges[postEereLoadBinEdgeIndex],
                edgeB: loadBinEdges[postEereLoadBinEdgeIndex + 1],
              });

        /**
         * Conditionally multiply NEI factor to calculated original and postEere
         * values
         */
        const matchedEgu = regionalNeiEgus?.find((neiEgu) => {
          const orisplCodeMatches = neiEgu.orispl_code === orispl_code;
          const unitCodeMatches = neiEgu.unit_code === unit_code;
          return orisplCodeMatches && unitCodeMatches;
        });
        const neiEguData = matchedEgu?.annual_data.find((d) => d.year === year);
        const neiFieldData = neiEguData?.[field];

        const original =
          neiFields.includes(field) && neiFieldData !== undefined
            ? calculatedOriginal * neiFieldData
            : calculatedOriginal;

        const postEere =
          neiFields.includes(field) && neiFieldData !== undefined
            ? calculatedPostEere * neiFieldData
            : calculatedPostEere;

        /**
         * Conditionally initialize each EGU's metadata
         */
        result[eguId] ??= {
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
         * flags, as emissions "replacement" will be needed for that pollutant
         */
        if (
          infreq_emissions_flag === 1 &&
          !result[eguId].emissionsFlags.includes(field)
        ) {
          result[eguId].emissionsFlags.push(field);
        }

        /**
         * Conditionally initialize the field's monthly data
         */
        result[eguId].data[field][month] ??= { original: 0, postEere: 0 };

        /**
         * Increment the field's monthly original and postEere values
         */
        result[eguId].data[field][month].original += original;
        result[eguId].data[field][month].postEere += postEere;
      });
    });
  }

  return result;
}

module.exports = { calculateEmissionsChanges };
