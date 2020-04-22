/**
 * @typedef {Object} RDF
 * @property {number[]} load_bin_edges
 * @property {RegionalLoad[]} regional_load
 * @property {PollutantData} data
 */

/**
 * @typedef {Object} RegionalLoad
 * @property {MonthNumber} month
 * @property {number} regional_load_mw
 */

/**
 * @typedef {1|2|3|4|5|6|7|8|9|10|11|12} MonthNumber
 */

/**
 * @typedef {Object} PollutantData
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
 * @typedef {EereData[]} EERE
 */

/**
 * @typedef {Object} EereData
 * @property {number} final_mw
 */

/**
 * @typedef {'generation'|'so2'|'nox'|'co2'|'pm25'} Pollutant
 */

/**
 * @typedef {Object.<string, number>} StateChanges
 */

/**
 * @typedef {Object} MonthlyChanges
 * @property {MonthlyValues} region
 * @property {Object.<string, MonthlyValues>} state
 * @property {Object.<string, Object.<string, MonthlyValues>>} county
 */

/**
 * @typedef {Object} MonthlyValues
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
 * @param {EERE} eere
 * @param {Pollutant} pollutant
 */
function getDisplacement(rdf, eere, pollutant) {
  // set ozoneData and nonOzoneData based on provided pollutant
  const ozoneData = rdf.data[pollutant];

  /** @type {LocationData[]|false} */
  const nonOzoneData = rdf.data[`${pollutant}_not`] || false;

  // set up structure of data collections (used in returned object's keys)
  /** @type {MonthlyValues} */
  const initialMonthlyValues = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0 };

  /** @type {MonthlyChanges} */
  const monthlyEmissionChanges = {
    region: initialMonthlyValues,
    state: {},
    county: {},
  };

  /** @type {MonthlyChanges} */
  const monthlyPercentageChanges = {
    region: initialMonthlyValues,
    state: {},
    county: {},
  };

  /** @type {MonthlyChanges} */
  const monthlyPreValues = {
    region: initialMonthlyValues,
    state: {},
    county: {},
  };

  /** @type {MonthlyChanges} */
  const monthlyPostValues = {
    region: initialMonthlyValues,
    state: {},
    county: {},
  };

  /** @type {StateChanges} */
  const stateEmissionChanges = {};

  // load bin edges
  const minEdge = rdf.load_bin_edges[0];
  const maxEdge = rdf.load_bin_edges[rdf.load_bin_edges.length - 1];

  // dataset medians (ozone and non-ozone)
  const ozoneMedians = ozoneData.map((data) => data.medians);
  const nonOzoneMedians = 
    nonOzoneData
      ? nonOzoneData.map((data) => data.medians)
      : false;

  /** @type {number[]} - used to calculate 'original' key */
  const preTotals = new Array(rdf.regional_load.length).fill(0);

  /** @type {number[]} - used to calculate 'post' key */
  const postTotals = new Array(rdf.regional_load.length).fill(0);

  /** @type {number[]} - used to calculate 'monthlyChanges' key */
  const deltas = new Array(rdf.regional_load.length).fill(0);

  // iterate over each hour in the year (8760 in non-leap years)
  for (let i = 0; i < rdf.regional_load.length; i++) {
    const month = rdf.regional_load[i].month;              // numeric month of load
    const preLoad = rdf.regional_load[i].regional_load_mw; // original regional load (mwh)
    const postLoad = preLoad + eere[i].final_mw;           // EERE-merged regional load (mwh)

    const preLoadInBounds = preLoad >= minEdge && preLoad <= maxEdge;
    const postLoadInBounds = postLoad >= minEdge && postLoad <= maxEdge;

    // check for outliers
    if (!(preLoadInBounds && postLoadInBounds)) continue;

    // get index of item closest to preLoad or postLoad in load_bin_edges array
    const preGenIndex = excelMatch(rdf.load_bin_edges, preLoad);
    const postGenIndex = excelMatch(rdf.load_bin_edges, postLoad);

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
      const state = location.state;
      const county = location.county;

      const preVal = calculateLinear({
        load: preLoad,
        genA: medians[preGenIndex],
        genB: medians[preGenIndex + 1],
        edgeA: rdf.load_bin_edges[preGenIndex],
        edgeB: rdf.load_bin_edges[preGenIndex + 1]
      });

      const postVal = calculateLinear({
        load: postLoad,
        genA: medians[postGenIndex],
        genB: medians[postGenIndex + 1],
        edgeA: rdf.load_bin_edges[postGenIndex],
        edgeB: rdf.load_bin_edges[postGenIndex + 1]
      });

      const data = {
        pre: preVal,
        post: postVal,
        delta: postVal - preVal,
      };

      // initialize and increment stateEmissionsChanges per state
      stateEmissionChanges[state] = stateEmissionChanges[state] || 0;
      stateEmissionChanges[state] += data.delta;

      // initialize and increment monthlyEmissionChanges per state and month
      monthlyEmissionChanges.state[state] = monthlyEmissionChanges.state[state] || {};
      monthlyEmissionChanges.state[state][month] = monthlyEmissionChanges.state[state][month] || 0;
      monthlyEmissionChanges.state[state][month] += data.delta;

      // initialize and increment monthlyPreValues per state and month
      monthlyPreValues.state[state] = monthlyPreValues.state[state] || {};
      monthlyPreValues.state[state][month] = monthlyPreValues.state[state][month] || 0;
      monthlyPreValues.state[state][month] += data.pre;

      // initialize and increment monthlyPostValues per state and month
      monthlyPostValues.state[state] = monthlyPostValues.state[state] || {};
      monthlyPostValues.state[state][month] = monthlyPostValues.state[state][month] || 0;
      monthlyPostValues.state[state][month] += data.post;

      // initialize and increment monthlyEmissionChanges per county, state, and month
      monthlyEmissionChanges.county[state] = monthlyEmissionChanges.county[state] || {};
      monthlyEmissionChanges.county[state][county] = monthlyEmissionChanges.county[state][county] || {};
      monthlyEmissionChanges.county[state][county][month] = monthlyEmissionChanges.county[state][county][month] || 0;
      monthlyEmissionChanges.county[state][county][month] += data.delta;

      // initialize and increment monthlyPreValues per county, state, and month
      monthlyPreValues.county[state] = monthlyPreValues.county[state] || {};
      monthlyPreValues.county[state][county] = monthlyPreValues.county[state][county] || {};
      monthlyPreValues.county[state][county][month] = monthlyPreValues.county[state][county][month] || 0;
      monthlyPreValues.county[state][county][month] += data.pre;

      // initialize and increment monthlyPostValues per county, state, and month
      monthlyPostValues.county[state] = monthlyPostValues.county[state] || {};
      monthlyPostValues.county[state][county] = monthlyPostValues.county[state][county] || {};
      monthlyPostValues.county[state][county][month] = monthlyPostValues.county[state][county][month] || 0;
      monthlyPostValues.county[state][county][month] += data.post;

      // initialize monthlyPercentageChanges per state and month (set outside of loop)
      monthlyPercentageChanges.state[state] = monthlyPercentageChanges.state[state] || {};
      monthlyPercentageChanges.state[state][month] = monthlyPercentageChanges.state[state][month] || 0;

      // initialize monthlyPercentageChanges per county, state, and month (set outside of loop)
      monthlyPercentageChanges.county[state] = monthlyPercentageChanges.county[state] || {};
      monthlyPercentageChanges.county[state][county] = monthlyPercentageChanges.county[state][county] || {};
      monthlyPercentageChanges.county[state][county][month] = monthlyPercentageChanges.county[state][county][month] || 0;

      // increment total and delta arrays with data
      preTotals[i] += data.pre;
      postTotals[i] += data.post;
      deltas[i] += data.delta;
    });

    // increment each data collection with accumulated values from total and delta arrays
    monthlyEmissionChanges.region[month] += deltas[i];
    monthlyPreValues.region[month] += preTotals[i];
    monthlyPostValues.region[month] += postTotals[i];
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
  states.forEach((state) => {
    monthNumbers.forEach((month) => {
      monthlyPercentageChanges.state[state][month] =
        (monthlyPostValues.state[state][month] - monthlyPreValues.state[state][month])
        / monthlyPreValues.state[state][month] * 100;
    });

    const counties = Object.keys(monthlyPreValues.county[state]);
    // calculate monthlyPercentageChanges each month in each county in each state in the region
    counties.forEach((county) => {
      monthNumbers.forEach((month) => {
        monthlyPercentageChanges.county[state][county][month] =
          (monthlyPostValues.county[state][county][month] - monthlyPreValues.county[state][county][month])
          / monthlyPreValues.county[state][county][month] * 100;
      });
    });
  });

  // total up the total arrays
  const preTotal = preTotals.reduce((acc, cur) => acc + (cur || 0), 0);
  const postTotal = postTotals.reduce((acc, cur) => acc + (cur || 0), 0);

  return {
    original: preTotal,
    post: postTotal,
    impact: postTotal - preTotal,
    monthlyChanges: {
      emissions: monthlyEmissionChanges,
      percentages: monthlyPercentageChanges,
    },
    stateChanges: stateEmissionChanges,
  };
}

module.exports = getDisplacement;
