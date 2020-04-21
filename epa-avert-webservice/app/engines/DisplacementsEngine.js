'use strict';

// helper function for initializing default values of an object's key
function init(object, key, fallback) {
  (object[key] != null) ? object[key] : object[key] = fallback;
}

function calculateLinear({ load, genA, genB, edgeA, edgeB }) {
  const slope = (genA - genB) / (edgeA - edgeB);
  const intercept = genA - (slope * edgeA);
  return load * slope + intercept;
};

function excelMatch(array, lookup) {
  const sortedArray = array.concat(lookup).sort((a, b) => a - b);
  const index = sortedArray.indexOf(lookup);
  // return index of item directly before lookup item in sorted array
  if (array[index] === lookup) return index;
  return index - 1;
};

/**
 * Caclulates displacement for a given pollutant.
 * 
 * @param {*} rdf 
 * @param {*} eere 
 * @param {'generation' | 'so2' | 'nox' | 'co2' | 'pm25'} pollutant 
 */
function getDisplacement(rdf, eere, pollutant) {
  // conditionally set ozoneData and nonOzoneData based on provided pollutant
  let ozoneData = [];
  let nonOzoneData = [];

  if (pollutant === 'generation') {
    ozoneData = rdf.data.generation;
    nonOzoneData = false;
  }

  if (pollutant === 'so2') {
    ozoneData = rdf.data.so2;
    nonOzoneData = rdf.data.so2_not;
  }

  if (pollutant === 'nox') {
    ozoneData = rdf.data.nox;
    nonOzoneData = rdf.data.nox_not;
  }

  if (pollutant === 'co2') {
    ozoneData = rdf.data.co2;
    nonOzoneData = rdf.data.co2_not;
  }

  if (pollutant === 'pm25') {
    ozoneData = rdf.data.pm25;
    nonOzoneData = rdf.data.pm25_not;
  }

  // set up structure of data collections (used in returned object's keys)
  const monthlyEmissionChanges = { region: {}, state: {}, county: {} };
  const monthlyPercentageChanges = { region: {}, state: {}, county: {} };
  const monthlyPreValues = { region: {}, state: {}, county: {} };
  const monthlyPostValues = { region: {}, state: {}, county: {} };
  const stateEmissionChanges = {};

  // load bin edges
  const minEdge = rdf.load_bin_edges[0];
  const maxEdge = rdf.load_bin_edges[rdf.load_bin_edges.length - 1];

  // location medians (ozone and non-ozone)
  const ozoneMedians = ozoneData.map((data) => data.medians);
  const nonOzoneMedians = 
    nonOzoneData
      ? nonOzoneData.map((data) => data.medians)
      : false;

  // setup total and delta arrays
  // (total arrays used to calculate returned 'original' and 'post' keys with data)
  // (detla array used to calculate returned 'monthlyChanges' keys)
  let preTotalArray = [];
  let postTotalArray = [];
  let deltaVArray = [];

  // iterate over each hour in the year (8760 in non-leap years)
  for (let i = 0; i < rdf.regional_load.length; i++) {
    const load = rdf.regional_load[i].regional_load_mw; // original regional load mwh (number)
    const month = rdf.regional_load[i].month;           // month of load (number, 1-12)
    const postLoad = load + eere[i].final_mw;           // EERE-merged regional load mwh (number)

    // check for outliers
    if (!(load >= minEdge && load <= maxEdge && postLoad >= minEdge && postLoad <= maxEdge)) continue;

    // initialize total and delta arrays to '0'
    preTotalArray[i] = 0;
    postTotalArray[i] = 0;
    deltaVArray[i] = 0;

    // initialize each data collection's month to '0' if it hasn't been set
    init(monthlyEmissionChanges.region, month, 0);
    init(monthlyPercentageChanges.region, month, 0);
    init(monthlyPreValues.region, month, 0);
    init(monthlyPostValues.region, month, 0);

    // get index of item closest to load (or postLoad) in load_bin_edges array
    const preGenIndex = excelMatch(rdf.load_bin_edges, load);
    const postGenIndex = excelMatch(rdf.load_bin_edges, postLoad);

    // set activeMedians, based on passed nonOzoneMedians value and month
    const activeMedians =
      nonOzoneMedians
        ? (month >= 5 && month <= 9) ? ozoneMedians : nonOzoneMedians
        : ozoneMedians;

    // iterate over each location in the ozoneData (number varies per region)
    // ('RM' region: under 100. 'SE' region: over 1000)
    for (let j = 0; j < ozoneData.length; j ++) {
      const medians = activeMedians[j]; // active medians (array of numbers)
      const state = ozoneData[j].state; // state abbreviation (string)
      const county = ozoneData[j].county; // county name (string)

      const preVal = calculateLinear({
        load: load,
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
      init(stateEmissionChanges, state, 0);
      stateEmissionChanges[state] += data.delta;

      // initialize and increment monthlyEmissionChanges per state and month
      init(monthlyEmissionChanges.state, state, {});
      init(monthlyEmissionChanges.state[state], month, 0);
      monthlyEmissionChanges.state[state][month] += data.delta;

      // initialize and increment monthlyPreValues per state and month
      init(monthlyPreValues.state, state, {});
      init(monthlyPreValues.state[state], month, 0);
      monthlyPreValues.state[state][month] += data.pre;

      // initialize and increment monthlyPostValues per state and month
      init(monthlyPostValues.state, state, {});
      init(monthlyPostValues.state[state], month, 0);
      monthlyPostValues.state[state][month] += data.post;

      // initialize and increment monthlyEmissionChanges per county, state, and month
      init(monthlyEmissionChanges.county, state, {});
      init(monthlyEmissionChanges.county[state], county, {});
      init(monthlyEmissionChanges.county[state][county], month, 0);
      monthlyEmissionChanges.county[state][county][month] += data.delta;

      // initialize and increment monthlyPreValues per county, state, and month
      init(monthlyPreValues.county, state, {});
      init(monthlyPreValues.county[state], county, {});
      init(monthlyPreValues.county[state][county], month, 0);
      monthlyPreValues.county[state][county][month] += data.pre;

      // initialize and increment monthlyPostValues per county, state, and month
      init(monthlyPostValues.county, state, {});
      init(monthlyPostValues.county[state], county, {});
      init(monthlyPostValues.county[state][county], month, 0);
      monthlyPostValues.county[state][county][month] += data.post;

      // initialize monthlyPercentageChanges per state and month (set outside of loop)
      init(monthlyPercentageChanges.state, state, {});
      init(monthlyPercentageChanges.state[state], month, 0);

      // initialize monthlyPercentageChanges per county, state, and month (set outside of loop)
      init(monthlyPercentageChanges.county, state, {});
      init(monthlyPercentageChanges.county[state], county, {});
      init(monthlyPercentageChanges.county[state][county], month, 0);

      // increment total and delta arrays with data
      preTotalArray[i] += data.pre;
      postTotalArray[i] += data.post;
      deltaVArray[i] += data.delta;
    }

    // increment each data collection with accumulated values from total and delta arrays
    monthlyEmissionChanges.region[month] += deltaVArray[i];
    monthlyPreValues.region[month] += preTotalArray[i];
    monthlyPostValues.region[month] += postTotalArray[i];
  }

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
  const preTotal = preTotalArray.reduce((acc, value) => acc + (value || 0), 0);
  const postTotal = postTotalArray.reduce((acc, value) => acc + (value || 0), 0);

  return {
    original: Number(preTotal),
    post: Number(postTotal),
    impact: Number(postTotal - preTotal),
    monthlyChanges: {
      emissions: monthlyEmissionChanges,
      percentages: monthlyPercentageChanges,
    },
    stateChanges: stateEmissionChanges,
  };
}

module.exports = getDisplacement;
