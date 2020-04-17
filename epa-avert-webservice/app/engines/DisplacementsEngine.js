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

class DisplacementsEngine {
  constructor(rdf, hourlyEere) {
    this._rdf = rdf;
    this._hourlyEere = hourlyEere;
  }

  getGeneration() {
    const { generation } = this._rdf.raw.data;
    return this._getDisplacedGeneration(generation, false, 'generation');
  }

  getSo2Total() {
    const { so2, so2_not } = this._rdf.raw.data;
    return this._getDisplacedGeneration(so2, so2_not, 'so2');
  }

  getNoxTotal() {
    const { nox, nox_not } = this._rdf.raw.data;
    return this._getDisplacedGeneration(nox, nox_not, 'nox');
  }

  getCo2Total() {
    const { co2, co2_not } = this._rdf.raw.data;
    return this._getDisplacedGeneration(co2, co2_not, 'co2');
  }

  getPm25Total() {
    const { pm25, pm25_not } = this._rdf.raw.data;
    return this._getDisplacedGeneration(pm25, pm25_not, 'pm25');
  }

  _getDisplacedGeneration(dataSet, dataSetNonOzone, type) {
    const { edges, regionalLoads, months } = this._rdf;
    const hourlyEere = this._hourlyEere;

    // set up structure of data collections (used in returned object's keys)
    const monthlyEmissionChanges = { region: {}, state: {}, county: {} };
    const monthlyPercentageChanges = { region: {}, state: {}, county: {} };
    const monthlyPreValues = { region: {}, state: {}, county: {} };
    const monthlyPostValues = { region: {}, state: {}, county: {} };
    const stateEmissionChanges = {};

    // load bin edges
    const min = edges[0];
    const max = edges[edges.length - 1];

    // location medians (ozone and non-ozone)
    const medians = dataSet.map((location) => location.medians);
    const mediansNonOzone = 
      dataSetNonOzone
        ? dataSetNonOzone.map((location) => location.medians)
        : false;

    // EERE-merged array of region load (mwh) array for each hour of the year
    const loadArrayPost = regionalLoads.map((year, index) => {
      return year + hourlyEere[index].final_mw;
    });

    // setup total and delta arrays
    // (total arrays used to calculate returned 'original' and 'post' keys with data)
    // (detla array used to calculate returned 'monthlyChanges' keys)
    let preTotalArray = [];
    let postTotalArray = [];
    let deltaVArray = [];

    // iterate over each hour in the year (8760 in non-leap years)
    for (let i = 0; i < regionalLoads.length; i++) {
      const load = regionalLoads[i]; // original regional load mwh (number)
      const month = months[i]; // month of load (number, 1-12)
      const postLoad = loadArrayPost[i]; // EERE-merged regional load mwh (number)

      // check for outliers
      if (!(load >= min && load <= max && postLoad >= min && postLoad <= max)) continue;

      // initialize total and delta arrays to '0'
      preTotalArray[i] = 0;
      postTotalArray[i] = 0;
      deltaVArray[i] = 0;

      // initialize each data collection's month to '0' if it hasn't been set
      init(monthlyEmissionChanges.region, month, 0);
      init(monthlyPercentageChanges.region, month, 0);
      init(monthlyPreValues.region, month, 0);
      init(monthlyPostValues.region, month, 0);

      // get index of item closest to load (or postLoad) in edges array
      const preGenIndex = excelMatch(edges, load);
      const postGenIndex = excelMatch(edges, postLoad);

      // set activeMedians, based on passed mediansNonOzone value and month
      const activeMedians = (mediansNonOzone)
        ? (month >= 5 && month <= 9) ? medians : mediansNonOzone
        : medians;

      // iterate over each location in the dataSet (number varies per region)
      // ('RM' region: under 100. 'SE' region: over 1000)
      for (let j = 0; j < dataSet.length; j ++) {
        const medians = activeMedians[j]; // active medians (array of numbers)
        const state = dataSet[j].state; // state abbreviation (string)
        const county = dataSet[j].county; // county name (string)

        const preVal = calculateLinear({
          load: load,
          genA: medians[preGenIndex],
          genB: medians[preGenIndex + 1],
          edgeA: edges[preGenIndex],
          edgeB: edges[preGenIndex + 1]
        });

        const postVal = calculateLinear({
          load: postLoad,
          genA: medians[postGenIndex],
          genB: medians[postGenIndex + 1],
          edgeA: edges[postGenIndex],
          edgeB: edges[postGenIndex + 1]
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
}

module.exports = DisplacementsEngine;
