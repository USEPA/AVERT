/**
 * @typedef {Object} RDF
 * @property {RdfData} data
 * @property {RdfLimits} limits
 * @property {number[]} load_bin_edges
 * @property {RdfRegion} region
 * @property {RdfRegionalLoad[]} regional_load
 * @property {RdfRun} run
 */

/**
 * @typedef {Object} RdfData
 * @property {LocationData[]} generation
 * @property {LocationData[]} so2
 * @property {LocationData[]} so2_not
 * @property {LocationData[]} nox
 * @property {LocationData[]} nox_not
 * @property {LocationData[]} co2
 * @property {LocationData[]} co2_not
 * @property {LocationData[]} pm25
 * @property {LocationData[]} pm25_not
 */

/**
 * @typedef {Object} LocationData
 * @property {string} state
 * @property {string} county
 * @property {number[]} medians
 */

/**
 * @typedef {Object} RdfLimits
 * @property {string[]} created_at
 * @property {number} id
 * @property {number} max_ee_percent
 * @property {number} max_ee_yearly_gwh
 * @property {number} max_solar_wind_mwh
 * @property {number} region_id
 * @property {string[]} updated_at
 * @property {number} year
 */

/**
 * @typedef {Object} RdfRegion
 * @property {string} region_abbv
 * @property {string} region_name
 * @property {string} region_states
 */

/**
 * @typedef {Object} RdfRegionalLoad
 * @property {MonthNumber} month
 * @property {number} regional_load_mw
 */

/**
 * @typedef {1|2|3|4|5|6|7|8|9|10|11|12} MonthNumber
 */

/**
 * @typedef {Object} RdfRun
 * @property {string[]} file_name
 * @property {number} mc_gen_runs
 * @property {number} mc_runs
 * @property {number} region_id
 * @property {number} year
 */

/**
 * @typedef {Object} MonthlyChanges
 * @property {DataByMonth} region
 * @property {Object.<string, DataByMonth>} state
 * @property {Object.<string, Object.<string, DataByMonth>>} county
 */

/**
* @typedef {Object} MonthlyDisplacement
* @property {DataByMonth} original
* @property {DataByMonth} postEere
*/

/**
 * @typedef {Object} DataByMonth
 * @property {number} MonthNumber
 */

/**
 * @param {Object} options
 * @param {number} options.load
 * @param {number} options.genA
 * @param {number} options.genB
 * @param {number} options.edgeA
 * @param {number} options.edgeB
 */
function calculateLinear({ load, genA, genB, edgeA, edgeB }) {
  const slope = (genA - genB) / (edgeA - edgeB);
  const intercept = genA - (slope * edgeA);
  return load * slope + intercept;
};

/**
 * @param {number[]} array
 * @param {number} lookup
 */
function excelMatch(array, lookup) {
  const sortedArray = array.concat(lookup).sort((a, b) => a - b);
  const index = sortedArray.indexOf(lookup);
  // return index of item directly before lookup item in sorted array
  if (array[index] === lookup) return index;
  return index - 1;
};

/**
 * Caclulates displacement for a given pollutant.
 * @param {RDF} rdf
 * @param {number[]} eereLoad
 * @param {'generation'|'so2'|'nox'|'co2'|'pm25'} pollutant
 */
function getDisplacement(rdf, eereLoad, pollutant) {
  // set ozoneData and nonOzoneData based on provided pollutant
  const ozoneData = rdf.data[pollutant];

  /** @type {LocationData[]|false} */
  const nonOzoneData = rdf.data[`${pollutant}_not`] || false;

  // set up structure of data collections (used in returned object's keys)
  /** @type {MonthlyChanges} */
  const monthlyEmissionChanges = {
    region: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0 },
    state: {},
    county: {},
  };

  /** @type {MonthlyChanges} */
  const monthlyPercentageChanges = {
    region: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0 },
    state: {},
    county: {},
  };

  /** @type {MonthlyChanges} */
  const monthlyPreValues = {
    region: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0 },
    state: {},
    county: {},
  };

  /** @type {MonthlyChanges} */
  const monthlyPostValues = {
    region: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0 },
    state: {},
    county: {},
  };

/**
   * monthly original and post-eere calculated values for each state
   * @type {MonthlyDisplacement}
   */
  const regionalData = {}

  /**
   * monthly original and post-eere calculated values for each state
   * @type {Object.<string, MonthlyDisplacement>}
   */
  const stateData = {}

  /**
   * monthly original and post-eere calculated values for each county within each state
   * @type {Object.<string, Object.<string, MonthlyDisplacement>>}
   */
  const countyData = {}

  // load bin edges
  const firstEdge = rdf.load_bin_edges[0];
  const lastEdge = rdf.load_bin_edges[rdf.load_bin_edges.length - 1];

  // dataset medians (ozone and non-ozone)
  const ozoneMedians = ozoneData.map((data) => data.medians);
  const nonOzoneMedians = 
    nonOzoneData
      ? nonOzoneData.map((data) => data.medians)
      : false;

  /** @type {number[]} - used to calculate 'originalTotal' returned data */
  const originalTotals = new Array(rdf.regional_load.length).fill(0);

  /** @type {number[]} - used to calculate 'postEereTotal' returned data */
  const postEereTotals = new Array(rdf.regional_load.length).fill(0);

  /** @type {number[]} - used to calculate 'monthlyChanges' key */
  const deltas = new Array(rdf.regional_load.length).fill(0);

  // iterate over each hour in the year (8760 in non-leap years)
  for (let i = 0; i < rdf.regional_load.length; i++) {
    const month = rdf.regional_load[i].month;                   // numeric month of load
    const originalLoad = rdf.regional_load[i].regional_load_mw; // original regional load (mwh)
    const postEereLoad = originalLoad + eereLoad[i];            // EERE-merged regional load (mwh)

    const originalLoadInBounds = originalLoad >= firstEdge && originalLoad <= lastEdge;
    const postEereLoadInBounds = postEereLoad >= firstEdge && postEereLoad <= lastEdge;

    // filter out outliers
    if (!(originalLoadInBounds && postEereLoadInBounds)) continue;

    // get index of item closest to originalLoad or postEereLoad in load_bin_edges array
    const originalLoadBinIndex = excelMatch(rdf.load_bin_edges, originalLoad);
    const postEereLoadBinIndex = excelMatch(rdf.load_bin_edges, postEereLoad);

    // set activeMedians, based on passed nonOzoneMedians value and month
    const activeMedians =
      nonOzoneMedians
        ? (month >= 5 && month <= 9) ? ozoneMedians : nonOzoneMedians
        : ozoneMedians;

    // iterate over each location in ozoneData (e.g. rdf.data.generation)
    // the total number of iterations varies per region...
    // (less than 100 for the RM region; more than 1000 for the SE region)
    ozoneData.forEach((location, index) => {
      const medians = activeMedians[index];
      const stateId = location.state;
      const county = location.county;

      const calculatedOriginal = calculateLinear({
        load: originalLoad,
        genA: medians[originalLoadBinIndex],
        genB: medians[originalLoadBinIndex + 1],
        edgeA: rdf.load_bin_edges[originalLoadBinIndex],
        edgeB: rdf.load_bin_edges[originalLoadBinIndex + 1]
      });

      const calculatedPostEere = calculateLinear({
        load: postEereLoad,
        genA: medians[postEereLoadBinIndex],
        genB: medians[postEereLoadBinIndex + 1],
        edgeA: rdf.load_bin_edges[postEereLoadBinIndex],
        edgeB: rdf.load_bin_edges[postEereLoadBinIndex + 1]
      });

      const calculatedDelta = calculatedPostEere - calculatedOriginal;

      // initialize the data structures for the region, each state, each county,
      // and each month if they haven't yet been set up, and increment by the
      // calculated original and calculated post-eere values for each day of the
      // month to arrive at cumulative total original and post-eere values for
      // the month for each data structure
      // NOTE: in the web app, we could just use `countyData` and derive state
      // totals and the region total by adding up values, but storing them
      // individually here is computationally smarter as it means we don't need
      // to re-iterate over data structures later to sum those totals
      regionalData[`month${month}`] = regionalData[`month${month}`] || {};
      regionalData[`month${month}`].original = regionalData[`month${month}`].original || 0;
      regionalData[`month${month}`].postEere = regionalData[`month${month}`].postEere || 0;
      regionalData[`month${month}`].original += calculatedOriginal;
      regionalData[`month${month}`].postEere += calculatedPostEere;

      stateData[stateId] = stateData[stateId] || {};
      stateData[stateId][`month${month}`] = stateData[stateId][`month${month}`] || {};
      stateData[stateId][`month${month}`].original = stateData[stateId][`month${month}`].original || 0;
      stateData[stateId][`month${month}`].postEere = stateData[stateId][`month${month}`].postEere || 0;
      stateData[stateId][`month${month}`].original += calculatedOriginal;
      stateData[stateId][`month${month}`].postEere += calculatedPostEere;

      countyData[stateId] = countyData[stateId] || {};
      countyData[stateId][county] = countyData[stateId][county] || {};
      countyData[stateId][county][`month${month}`] = countyData[stateId][county][`month${month}`] || {};
      countyData[stateId][county][`month${month}`].original = countyData[stateId][county][`month${month}`].original || 0;
      countyData[stateId][county][`month${month}`].postEere = countyData[stateId][county][`month${month}`].postEere || 0;
      countyData[stateId][county][`month${month}`].original += calculatedOriginal;
      countyData[stateId][county][`month${month}`].postEere += calculatedPostEere;

      // initialize and increment monthlyEmissionChanges per state and month
      monthlyEmissionChanges.state[stateId] = monthlyEmissionChanges.state[stateId] || {};
      monthlyEmissionChanges.state[stateId][month] = monthlyEmissionChanges.state[stateId][month] || 0;
      monthlyEmissionChanges.state[stateId][month] += calculatedDelta;

      // initialize and increment monthlyEmissionChanges per county, state, and month
      monthlyEmissionChanges.county[stateId] = monthlyEmissionChanges.county[stateId] || {};
      monthlyEmissionChanges.county[stateId][county] = monthlyEmissionChanges.county[stateId][county] || {};
      monthlyEmissionChanges.county[stateId][county][month] = monthlyEmissionChanges.county[stateId][county][month] || 0;
      monthlyEmissionChanges.county[stateId][county][month] += calculatedDelta;

      // initialize and increment monthlyPreValues per state and month
      monthlyPreValues.state[stateId] = monthlyPreValues.state[stateId] || {};
      monthlyPreValues.state[stateId][month] = monthlyPreValues.state[stateId][month] || 0;
      monthlyPreValues.state[stateId][month] += calculatedOriginal;

      // initialize and increment monthlyPreValues per county, state, and month
      monthlyPreValues.county[stateId] = monthlyPreValues.county[stateId] || {};
      monthlyPreValues.county[stateId][county] = monthlyPreValues.county[stateId][county] || {};
      monthlyPreValues.county[stateId][county][month] = monthlyPreValues.county[stateId][county][month] || 0;
      monthlyPreValues.county[stateId][county][month] += calculatedOriginal;

      // initialize and increment monthlyPostValues per state and month
      monthlyPostValues.state[stateId] = monthlyPostValues.state[stateId] || {};
      monthlyPostValues.state[stateId][month] = monthlyPostValues.state[stateId][month] || 0;
      monthlyPostValues.state[stateId][month] += calculatedPostEere;

      // initialize and increment monthlyPostValues per county, state, and month
      monthlyPostValues.county[stateId] = monthlyPostValues.county[stateId] || {};
      monthlyPostValues.county[stateId][county] = monthlyPostValues.county[stateId][county] || {};
      monthlyPostValues.county[stateId][county][month] = monthlyPostValues.county[stateId][county][month] || 0;
      monthlyPostValues.county[stateId][county][month] += calculatedPostEere;

      // initialize monthlyPercentageChanges per state and month (set outside of loop)
      monthlyPercentageChanges.state[stateId] = monthlyPercentageChanges.state[stateId] || {};
      monthlyPercentageChanges.state[stateId][month] = monthlyPercentageChanges.state[stateId][month] || 0;

      // initialize monthlyPercentageChanges per county, state, and month (set outside of loop)
      monthlyPercentageChanges.county[stateId] = monthlyPercentageChanges.county[stateId] || {};
      monthlyPercentageChanges.county[stateId][county] = monthlyPercentageChanges.county[stateId][county] || {};
      monthlyPercentageChanges.county[stateId][county][month] = monthlyPercentageChanges.county[stateId][county][month] || 0;

      // increment total and delta arrays with data
      originalTotals[i] += calculatedOriginal;
      postEereTotals[i] += calculatedPostEere;
      deltas[i] += calculatedDelta;
    });

    // increment each data collection with accumulated values from total and delta arrays
    monthlyEmissionChanges.region[month] += deltas[i];
    monthlyPreValues.region[month] += originalTotals[i];
    monthlyPostValues.region[month] += postEereTotals[i];
  }

  /** @type {MonthNumber[]} */
  const monthNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  // calculate monthlyPercentageChanges each month in the region
  monthNumbers.forEach((month) => {
    monthlyPercentageChanges.region[month] =
      (monthlyPostValues.region[month] - monthlyPreValues.region[month])
      / monthlyPreValues.region[month] * 100;
  });

  const states = Object.keys(monthlyPreValues.state);
  // calculate monthlyPercentageChanges each month in each state in the region
  states.forEach((stateId) => {
    monthNumbers.forEach((month) => {
      monthlyPercentageChanges.state[stateId][month] =
        (monthlyPostValues.state[stateId][month] - monthlyPreValues.state[stateId][month])
        / monthlyPreValues.state[stateId][month] * 100;
    });

    const counties = Object.keys(monthlyPreValues.county[stateId]);
    // calculate monthlyPercentageChanges each month in each county in each state in the region
    counties.forEach((county) => {
      monthNumbers.forEach((month) => {
        monthlyPercentageChanges.county[stateId][county][month] =
          (monthlyPostValues.county[stateId][county][month] - monthlyPreValues.county[stateId][county][month])
          / monthlyPreValues.county[stateId][county][month] * 100;
      });
    });
  });

  return {
    regionId: rdf.region.region_abbv,
    pollutant: pollutant,
    originalTotal: originalTotals.reduce((acc, cur) => acc + (cur || 0), 0),
    postEereTotal: postEereTotals.reduce((acc, cur) => acc + (cur || 0), 0),
    regionalData,
    stateData,
    countyData,
    // TODO: remove monthlyChanges after app's been updated to use above data
    monthlyChanges: {
      emissions: monthlyEmissionChanges,
      percentages: monthlyPercentageChanges,
    },
  };
}

module.exports = getDisplacement;
