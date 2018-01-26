'use strict';

const math = require('mathjs');

// helper function for initializing default values of an object's key
function init (object, key, fallback) {
  (object[key] != null) ? object[key] : object[key] = fallback;
}

function calculateLinear ({ load, genA, genB, edgeA, edgeB }) {
  const slope = (genA - genB) / (edgeA - edgeB);
  const intercept = genA - (slope * edgeA);
  return load * slope + intercept;
};

function excelMatch (array, lookup) {
  const sortedArray = array.concat(lookup).sort(function (a, b) { return a - b; });
  const index = sortedArray.indexOf(lookup);
  // return index of item directly before lookup item in sorted array
  if (array[index] === lookup) { return index; }
  return index - 1;
};



module.exports = (function () {
  function DisplacementsEngine (rdf, hourlyEere) {
    this.rdf = rdf;
    this.hourlyEere = hourlyEere;
  }

  DisplacementsEngine.prototype.getGeneration = function () {
    return this.getDisplacedGeneration(this.rdf.raw.data.generation, false, 'generation');
  };

  DisplacementsEngine.prototype.getSo2Total = function () {
    return this.getDisplacedGeneration(this.rdf.raw.data.so2, this.rdf.raw.data.so2_not, 'so2');
  };

  DisplacementsEngine.prototype.getNoxTotal = function () {
    return this.getDisplacedGeneration(this.rdf.raw.data.nox, this.rdf.raw.data.nox_not, 'nox');
  };

  DisplacementsEngine.prototype.getCo2Total = function () {
    return this.getDisplacedGeneration(this.rdf.raw.data.co2, this.rdf.raw.data.co2_not, 'co2');
  };

  DisplacementsEngine.prototype.getPm25Total = function () {
    return this.getDisplacedGeneration(this.rdf.raw.data.pm25, this.rdf.raw.data.pm25_not, 'pm25');
  };

  DisplacementsEngine.prototype.getDisplacedGeneration = function (dataSet, dataSetNonOzone, type) {
    // set up structure of data collections (used in returned object's keys)
    const monthlyEmissions = { regional: {}, state: {} };
    const monthlyEmissionChanges = { region: {}, state: {}, county: {} };
    const monthlyPercentageChanges = { region: {}, state: {}, county: {} };
    const monthlyPreValues = { region: {}, state: {}, county: {} };
    const monthlyPostValues = { region: {}, state: {}, county: {} };
    const stateEmissionChanges = {};

    // load bin edges
    const edges = this.rdf.edges;
    const min = edges[0];
    const max = edges[edges.length - 1];

    // medians (ozone and non-ozone)
    const medians = dataSet.map(function (item) { return item.medians; });
    const mediansNonOzone = (dataSetNonOzone)
      ? dataSetNonOzone.map(function (item) { return item.medians; })
      : false;

    // array of regional load (mwh) for each hour of the year
    const loadArrayOriginal = this.rdf.regionalLoads;
    //
    const loadArrayPost = loadArrayOriginal.map(function (item, index) {
      return math.sum(item, this.hourlyEere[index].final_mw)
    }, this);

    // setup total and delta arrays
    // (total arrays used to calculate returned 'original' and 'post' keys with data)
    // (detla array used to calculate returned 'monthlyEmissions' and 'monthlyChanges' keys)
    let preTotalArray = [];
    let postTotalArray = [];
    let deltaVArray = [];

    // iterate over each hour in the year (8760 in non-leap years)
    for (let i = 0; i < loadArrayOriginal.length; i++) {
      const load = loadArrayOriginal[i]; // regional load mwh (number)
      const month = this.rdf.months[i]; // month of load (number, 1-12)
      const postLoad = loadArrayPost[i]; //

      // check for outliers
      if (!(load >= min && load <= max && postLoad >= min && postLoad <= max)) continue;

      // initialize total and delta arrays to '0'
      preTotalArray[i] = 0;
      postTotalArray[i] = 0;
      deltaVArray[i] = 0;

      // initialize each data collection's month to '0' if it hasn't been set
      init(monthlyEmissions.regional, month, 0);
      init(monthlyEmissionChanges.region, month, 0);
      init(monthlyPercentageChanges.region, month, 0);
      init(monthlyPreValues.region, month, 0);
      init(monthlyPostValues.region, month, 0);

      //
      const preGenIndex = excelMatch(edges, load);
      const postGenIndex = excelMatch(edges, postLoad);

      // set activeMedians, based on passed mediansNonOzone value and month
      const activeMedians = (mediansNonOzone)
        ? (month >= 5 && month <= 9) ? medians : mediansNonOzone
        : medians;
      // if (i === 0) console.log(activeMedians.length);

      // iterate over activeMedians (number varies per region)
      // ('RM' region: under 100. 'SE' region: over 1000)
      for (let j = 0; j < activeMedians.length; j ++) {
        const median = activeMedians[j]; // active median (number)
        const state = dataSet[j].state; // state abbreviation (string)
        const county = dataSet[j].county; // county name (string)

        const preVal = calculateLinear({
          load: load,
          genA: median[preGenIndex],
          genB: median[preGenIndex + 1],
          edgeA: edges[preGenIndex],
          edgeB: edges[preGenIndex + 1]
        });

        const postVal = calculateLinear({
          load: postLoad,
          genA: median[postGenIndex],
          genB: median[postGenIndex + 1],
          edgeA: edges[postGenIndex],
          edgeB: edges[postGenIndex + 1]
        });

        const deltaV = postVal - preVal;

        const data = {
          pre: preVal,
          post: postVal,
          delta: deltaV,
        };

        // initialize monthlyEmissions object structure per state, if it hasn't been set
        init(monthlyEmissions.state, state, { data: {}, pre: {}, post: {}, counties: {} });

        // increment monthlyEmissions per state and month
        init(monthlyEmissions.state[state].data, month, 0);
        monthlyEmissions.state[state].data[month] += deltaV;

        init(monthlyEmissions.state[state].pre, month, 0);
        monthlyEmissions.state[state].pre[month] += preVal;

        init(monthlyEmissions.state[state].post, month, 0);
        monthlyEmissions.state[state].post[month] += postVal;

        // initialize monthlyEmissions object structure per state county, if it hasn't been set
        init(monthlyEmissions.state[state].counties, county, { data: {}, pre: {}, post: {} });

        // increment monthlyEmissions per state county and month
        init(monthlyEmissions.state[state].counties[county].data, month, 0);
        monthlyEmissions.state[state].counties[county].data[month] += deltaV;

        init(monthlyEmissions.state[state].counties[county].pre, month, 0);
        monthlyEmissions.state[state].counties[county].pre[month] += preVal;

        init(monthlyEmissions.state[state].counties[county].post, month, 0);
        monthlyEmissions.state[state].counties[county].post[month] += postVal;

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

        // initialize monthlyPercentageChanges per state and month
        // (set outside of loop)
        init(monthlyPercentageChanges.state, state, {});
        init(monthlyPercentageChanges.state[state], month, 0);

        // initialize monthlyPercentageChanges per county, state, and month
        // (set outside of loop)
        init(monthlyPercentageChanges.county, state, {});
        init(monthlyPercentageChanges.county[state], county, {});
        init(monthlyPercentageChanges.county[state][county], month, 0);

        // increment total and delta arrays with data
        preTotalArray[i] += data.pre;
        postTotalArray[i] += data.post;
        deltaVArray[i] += data.delta;
      }

      // increment each data collection with accumulated values from total and delta arrays
      monthlyEmissions.regional[month] += deltaVArray[i];
      monthlyEmissionChanges.region[month] += deltaVArray[i];
      monthlyPreValues.region[month] += preTotalArray[i];
      monthlyPostValues.region[month] += postTotalArray[i];
    }

    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    // calculate monthlyPercentageChanges each month in the region
    months.forEach(function (month) {
      monthlyPercentageChanges.region[month] =
        (monthlyPostValues.region[month] - monthlyPreValues.region[month])
        / monthlyPreValues.region[month] * 100;
    });

    const states = Object.keys(monthlyPreValues.state);
    // calculate monthlyPercentageChanges each month in each state in the region
    states.forEach(function (state) {
      months.forEach(function (month) {
        monthlyPercentageChanges.state[state][month] =
          (monthlyPostValues.state[state][month] - monthlyPreValues.state[state][month])
          / monthlyPreValues.state[state][month] * 100;
      });

      const counties = Object.keys(monthlyPreValues.county[state]);
      // calculate monthlyPercentageChanges each month in each county in each state in the region
      counties.forEach(function (county) {
        months.forEach(function (month) {
          monthlyPercentageChanges.county[state][county][month] =
            (monthlyPostValues.county[state][county][month] - monthlyPreValues.county[state][county][month])
            / monthlyPreValues.county[state][county][month] * 100;
        });
      });
    });

    // total up the total arrays
    const preTotal = preTotalArray.reduce(function (acc, value) {
      return acc + (value || 0);
    }, 0);
    const postTotal = postTotalArray.reduce(function (acc, value) {
      return acc + (value || 0);
    }, 0);

    return {
      original: Number(preTotal),
      post: Number(postTotal),
      impact: Number(math.subtract(postTotal, preTotal)),
      monthlyEmissions: monthlyEmissions,
      monthlyChanges: {
        emissions: monthlyEmissionChanges,
        percentages: monthlyPercentageChanges,
      },
      stateChanges: stateEmissionChanges,
    };
  };

  return DisplacementsEngine;
})();
