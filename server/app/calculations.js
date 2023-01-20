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
 *  month: 1|2|3|4|5|6|7|8|9|10|11|12,
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
 * @typedef {'generation'|'so2'|'nox'|'co2'|'pm25'|'vocs'|'nh3'} Pollutant
 */

/**
 * @typedef {{
 *  1: { original: number, postEere: number },
 *  2: { original: number, postEere: number },
 *  3: { original: number, postEere: number },
 *  4: { original: number, postEere: number },
 *  5: { original: number, postEere: number },
 *  6: { original: number, postEere: number },
 *  7: { original: number, postEere: number },
 *  8: { original: number, postEere: number },
 *  9: { original: number, postEere: number },
 *  10: { original: number, postEere: number },
 *  11: { original: number, postEere: number },
 *  12: { original: number, postEere: number },
 * }} MonthlyDisplacement
 */

/**
 * @typedef {MonthlyDisplacement} PollutantRegionalData
 */

/**
 * @typedef {Object.<string, MonthlyDisplacement>} PollutantStateData
 */

/**
 * @typedef {Object.<string, Object.<string, MonthlyDisplacement>>} PollutantCountyData
 */

/**
 * @typedef {Object} PollutantDisplacement
 * @property {string} regionId
 * @property {number} originalTotal
 * @property {number} postEereTotal
 * @property {PollutantRegionalData} regionalData
 * @property {PollutantStateData} stateData
 * @property {PollutantCountyData} countyData
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
 * Caclulates displacement for a given metric.
 *
 * @param {{
 *  year: number,
 *  metric: 'generation'|'so2'|'nox'|'co2'|'nei',
 *  rdf: RDFJSON,
 *  neiData: NEIData
 *  hourlyEere: number[],
 *  debug: boolean
 * }} options
 */
function getDisplacement(options) {
  const { year, metric, rdf, neiData, hourlyEere, debug } = options;

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
   */

  /**
   * this displacements object's keys will be one of type `Pollutant`, with
   * the key's values being the calculated displacement data for that pollutant.
   * an object with pollutants as keys is the return value from this function
   * because if the provided `metric` parameter equals "nei", displacements will
   * be calculated for multiple pullutants (PM2.5, VOCs, and NH3), with each
   * pollutant's calculated displacement data being stored as the value of the
   * pollutant's key of this `displacements` object.
   * @type {Object.<string, PollutantDisplacement>}
   */
  const displacements = {};

  /** used to calculate PM2.5, VOCs, and NH3's emission rates */
  const regionalNeiEgus =
    metric === "nei"
      ? neiData.regions.find((r) => r.name === rdf.region.region_name).egus
      : [];

  // set ozoneSeasonData and nonOzoneSeasonData based on provided metric
  const ozoneSeasonData =
    metric === "nei"
      ? rdf.data.heat // ozone season heat input (MMBtu)
      : rdf.data[metric];

  /** @type {EGUData[]|null} */
  const nonOzoneSeasonData =
    metric === "nei"
      ? rdf.data.heat_not // non-ozone season heat input (MMBtu)
      : rdf.data[`${metric}_not`] || null; // NOTE: there's no non-ozone season for generation

  const ozoneSeasonMedians = ozoneSeasonData.map((eguData) => eguData.medians);

  const nonOzoneSeasonMedians = nonOzoneSeasonData
    ? nonOzoneSeasonData.map((eguData) => eguData.medians)
    : null;

  const loadBinEdges = rdf.load_bin_edges;
  const firstLoadBinEdge = loadBinEdges[0];
  const lastLoadBinEdge = loadBinEdges[loadBinEdges.length - 1];

  // array of pollutants, based on passed metric argument:
  // - if the passed metric is "nei", the pollutants array will be ["pm25", "vocs", "nh3"]
  // - else, the passed metric is either "generation", "so2", "nox", or "co2", and the
  //   pollutants array will hold a single value of the passed metric...e.g. ["generation"]
  /** @type {Pollutant[]} */
  const pollutants = metric === "nei" ? ["pm25", "vocs", "nh3"] : [metric];

  // as with the `displacements` object, the following five object's string keys are of type `Pollutant`:
  /** @type {Object.<string, PollutantRegionalData} - monthly original and post-eere calculated values for the region, by pollutant */
  const regionalData = {};

  /** @type {Object.<string, PollutantStateData} - monthly original and post-eere calculated values for each state, by pollutant */
  const stateData = {};

  /** @type {Object.<string, PollutantCountyData} - monthly original and post-eere calculated values for each county within each state, by pollutant */
  const countyData = {};

  // NOTE: hourlyData is used for debugging only, as the resulting object is huge
  /** @type {Object.<string, Object} - hourly original and post-eere calculated values for every EGU, by pollutant */
  const hourlyData = {};

  /** @type {Object.<string, number[]} - used to calculate 'originalTotal' returned data, by pollutant */
  const hourlyOriginalTotals = {};

  /** @type {Object.<string, number[]} - used to calculate 'postEereTotal' returned data, by pollutant */
  const hourlyPostEereTotals = {};

  const totalHours = rdf.regional_load.length;

  pollutants.forEach((pollutant) => {
    regionalData[pollutant] = {};
    stateData[pollutant] = {};
    countyData[pollutant] = {};
    hourlyOriginalTotals[pollutant] = new Array(totalHours).fill(0);
    hourlyPostEereTotals[pollutant] = new Array(totalHours).fill(0);
  });

  /**
   * Iterate over each hour in the year (8760 in non-leap years)
   */
  for (const [i, hourlyLoadData] of rdf.regional_load.entries()) {
    const month = hourlyLoadData.month; // numeric month of load

    const originalLoad = hourlyLoadData.regional_load_mw; // original regional load (mwh) for the hour
    const postEereLoad = originalLoad + hourlyEere[i]; // EERE-merged regional load (mwh) for the hour

    const originalLoadInBounds = originalLoad >= firstLoadBinEdge && originalLoad <= lastLoadBinEdge; // prettier-ignore
    const postEereLoadInBounds = postEereLoad >= firstLoadBinEdge && postEereLoad <= lastLoadBinEdge; // prettier-ignore

    // filter out outliers
    if (!(originalLoadInBounds && postEereLoadInBounds)) continue;

    // get index of load bin edge closest to originalLoad or postEereLoad
    const originalLoadBinEdgeIndex = getPrecedingIndex(loadBinEdges, originalLoad); // prettier-ignore
    const postEereLoadBinEdgeIndex = getPrecedingIndex(loadBinEdges, postEereLoad); // prettier-ignore

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
      const medians = datasetMedians[eguIndex]; // use the medians from either the ozone season or non-ozone season datasets
      const stateId = egu.state;
      const county = egu.county;

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
        egu.infreq_emissions_flag === 1
          ? calculatedOriginal
          : calculateLinear({
              load: postEereLoad,
              genA: medians[postEereLoadBinEdgeIndex],
              genB: medians[postEereLoadBinEdgeIndex + 1],
              edgeA: loadBinEdges[postEereLoadBinEdgeIndex],
              edgeB: loadBinEdges[postEereLoadBinEdgeIndex + 1],
            });

      // store `calculatedOriginal` and `calculatedPostEere` values in objects,
      // with their keys corresponding to the pollutant. these objects will be
      // used to build up the additive data that's eventually returned for each
      // pollutant. using these intermediate `original` and `postEere` objects
      // may seem redundant at first, but is necssary because when the provided
      // `metric` parameter equals "nei", the same `calculatedOriginal` and
      // `calculatedPostEere` values are used for PM2.5, VOCs, and NH3 pollutants

      // as with the `displacements` object, the following two object's string keys are of type `Pollutant`:
      /** @type {Object.<string, number} - calculated original number, by pollutant */
      const original = {};

      /** @type {Object.<string, number} - calculated post-eere number, by pollutant */
      const postEere = {};

      pollutants.forEach((pollutant) => {
        original[pollutant] = calculatedOriginal;
        postEere[pollutant] = calculatedPostEere;

        // NEI factor applied for PM2.5, VOCs, and NH3 pollutants
        if (metric === "nei") {
          const matchedEgu = regionalNeiEgus.find((n) => {
            const orisplCodeMatches = n.orispl_code === egu.orispl_code;
            const unitCodeMatches = n.unit_code === egu.unit_code;
            return orisplCodeMatches && unitCodeMatches;
          });
          // NEI EGU data for the given year
          const neiEguData = matchedEgu.annual_data.find((d) => d.year === year); // prettier-ignore
          original[pollutant] *= neiEguData[pollutant];
          postEere[pollutant] *= neiEguData[pollutant];
        }

        // initialize the data structures for the region, each state, each county,
        // and each month if they haven't yet been set up, and increment by the
        // calculated original and calculated post-eere values for each day of the
        // month to arrive at cumulative total original and post-eere values for
        // the month for each data structure

        // NOTE: in the web app, we could just use `countyData` and derive state
        // totals and the region total by adding up values, but storing them
        // individually here is computationally smarter as it means we don't need
        // to re-iterate over data structures later to sum those totals

        regionalData[pollutant][month] ??= { original: 0, postEere: 0 };
        regionalData[pollutant][month].original += original[pollutant];
        regionalData[pollutant][month].postEere += postEere[pollutant];

        stateData[pollutant][stateId] ??= {};
        stateData[pollutant][stateId][month] ??= { original: 0, postEere: 0 };
        stateData[pollutant][stateId][month].original += original[pollutant];
        stateData[pollutant][stateId][month].postEere += postEere[pollutant];

        countyData[pollutant][stateId] ??= {};
        countyData[pollutant][stateId][county] ??= {};
        countyData[pollutant][stateId][county][month] ??= { original: 0, postEere: 0 }; // prettier-ignore
        countyData[pollutant][stateId][county][month].original += original[pollutant]; // prettier-ignore
        countyData[pollutant][stateId][county][month].postEere += postEere[pollutant]; // prettier-ignore

        // NOTE: hourlyData isn't returned normally as the resulting object is
        // huge (several hundred MB). this is just added as a means to verify
        // hourly calculations for each EGU when developing locally.
        // to temporaily enable this, update the `calculateMetric()` method in
        // `app/controllers.js` to pass the `debug` parameter's value as `true`

        // AGAIN, THIS IS FOR DEBUGGING ONLY – DO NOT ENABLE THIS FOR PRODUCTION,
        // as the returned `hourlyData` object is massive, and when debug is set
        // to `true`, this function also won't return the summed regional, state,
        // and county data the web app needs
        if (debug) {
          hourlyData[pollutant] ??= [];
          hourlyData[pollutant][i] ??= {
            hour: i + 1,
            month,
            year,
            originalLoad,
            postEereLoad,
          };

          // NOTE: to generate data for a specific EGU, and not all EGUs,
          // un-comment out the code below and update it with the specific EGU's
          // ORISPL code and unit code and comment out the next several lines of
          // code inside this `if` statement block

          // if (egu.orispl_code === 50865 && egu.unit_code === '1') {
          //   hourlyData[pollutant][i].orisplCode ??= egu.orispl_code;
          //   hourlyData[pollutant][i].unitCode ??= egu.unit_code;
          //   hourlyData[pollutant][i].name ??= egu.full_name;
          //   hourlyData[pollutant][i].state ??= stateId;
          //   hourlyData[pollutant][i].county ??= county;
          //   hourlyData[pollutant][i].original ??= original[pollutant];
          //   hourlyData[pollutant][i].postEere ??= postEere[pollutant];
          // }

          hourlyData[pollutant][i].egus ??= [];
          hourlyData[pollutant][i].egus[eguIndex] ??= {
            orisplCode: egu.orispl_code,
            unitCode: egu.unit_code,
            name: egu.full_name,
            state: stateId,
            county,
            original: original[pollutant],
            postEere: postEere[pollutant],
          };
        }

        // increment hourly total arrays for each EGU for the given hour
        hourlyOriginalTotals[pollutant][i] += original[pollutant];
        hourlyPostEereTotals[pollutant][i] += postEere[pollutant];
      });
    });
  }

  pollutants.forEach((pollutant) => {
    displacements[pollutant] = {
      regionId: rdf.region.region_abbv,
      originalTotal: hourlyOriginalTotals[pollutant].reduce((a, b) => a + (b || 0), 0), // prettier-ignore
      postEereTotal: hourlyPostEereTotals[pollutant].reduce((a, b) => a + (b || 0), 0), // prettier-ignore
      regionalData: regionalData[pollutant],
      stateData: stateData[pollutant],
      countyData: countyData[pollutant],
    };
  });

  if (debug) {
    pollutants.forEach((pollutant) => {
      delete displacements[pollutant].regionalData;
      delete displacements[pollutant].stateData;
      delete displacements[pollutant].countyData;
      displacements[pollutant].hourlyData = hourlyData[pollutant];
    });
  }

  return displacements;
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

  const dataFields = ["generation", "so2", "nox", "co2", "pm25", "vocs", "nh3"];

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
      const neiFields = ["pm25", "vocs", "nh3"];

      const ozoneSeasonData = neiFields.includes(field)
        ? rdf.data.heat
        : rdf.data[field];

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

module.exports = {
  getDisplacement,
  calculateEmissionsChanges,
};
