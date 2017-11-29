'use strict';

const math = require('mathjs');

// helper function for initializing default values of an object's key
function init(object, key, fallback) {
  (object[key] != null) ? object[key] : object[key] = fallback;
}

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

  DisplacementsEngine.prototype.getDisplacedGeneration = function (dataSet, dataSetNonOzone, type) {
    const monthlyEmissions = {
      regional: {
        data: {}, pre: {}, post: {}
      },
      state: {}
    };
    const monthlyEmissionChanges = {
      region: {}, state: {}, county: {}
    };
    const monthlyPercentageChanges = {
      region: {}, state: {}, county: {}
    };
    const monthlyPreValues = {
      region: {}, state: {}, county: {}
    };
    const monthlyPostValues = {
      region: {}, state: {}, county: {}
    };
    const stateEmissionChanges = {};

    const edges = this.rdf.edges;
    const min = edges[0];
    const max = edges[edges.length - 1];

    const medians = dataSet.map(function (item) { return item.medians; });

    const mediansNonOzone = (dataSetNonOzone)
      ? dataSetNonOzone.map(function (item) { return item.medians; })
      : false;

    const loadArrayPost = this.rdf.regionalLoads.map(function (item, index) {
      return math.sum(item, this.hourlyEere[index].final_mw)
    }, this);

    let preTotalArray = [];
    let postTotalArray = [];
    let deltaVArray = [];

    for (let i = 0; i < this.rdf.regionalLoads.length; i ++) {
      const load = this.rdf.regionalLoads[i];
      const month = this.rdf.months[i];
      const postLoad = loadArrayPost[i];

      // check for outliers
      if (!(load >= min && load <= max && postLoad >= min && postLoad <= max)) continue;

      preTotalArray[i] = 0;
      postTotalArray[i] = 0;
      deltaVArray[i] = 0;

      init(monthlyEmissions.regional, month, 0);
      init(monthlyEmissionChanges.region, month, 0);
      init(monthlyPercentageChanges.region, month, 0);
      init(monthlyPreValues.region, month, 0);
      init(monthlyPostValues.region, month, 0);

      // set active medians, based on mediansNonOzone value and month
      const activeMedians = (mediansNonOzone)
        ? (month >= 5 && month <= 9) ? medians : mediansNonOzone
        : medians;

      const preGenIndex = this.excelMatch(edges, load);
      const postGenIndex = this.excelMatch(edges, postLoad);

      for (let j = 0; j < activeMedians.length; j ++) {
        const data = this.calculateMedians(activeMedians, j, dataSet, load, preGenIndex, edges, postLoad, postGenIndex, monthlyEmissions, month);

        preTotalArray[i] += data.pre;
        postTotalArray[i] += data.post;
        deltaVArray[i] += data.delta;

        const state = dataSet[j].state;
        const county = dataSet[j].county;

        // State - Total Emissions
        init(stateEmissionChanges, state, 0);
        stateEmissionChanges[state] += data.delta;

        // State - Monthly - Emissions
        init(monthlyEmissionChanges.state, state, {});
        init(monthlyEmissionChanges.state[state], month, 0);
        monthlyEmissionChanges.state[state][month] += data.delta;

        // State - Monthly - Percent
        init(monthlyPercentageChanges.state, state, {});
        init(monthlyPercentageChanges.state[state], month, 0);
        // monthlyPercentageChanges.state[state][month] += data.percentDifference;

        init(monthlyPreValues.state, state, {});
        init(monthlyPreValues.state[state], month, 0);
        monthlyPreValues.state[state][month] += data.pre;

        init(monthlyPostValues.state, state, {});
        init(monthlyPostValues.state[state], month, 0);
        monthlyPostValues.state[state][month] += data.post;

        // County - Monthly Emissions
        init(monthlyEmissionChanges.county, state, {});
        init(monthlyEmissionChanges.county[state], county, {});
        init(monthlyEmissionChanges.county[state][county], month, 0);
        monthlyEmissionChanges.county[state][county][month] += data.delta;

        // County - Monthly - Percentages
        init(monthlyPercentageChanges.county, state, {});
        init(monthlyPercentageChanges.county[state], county, {});
        init(monthlyPercentageChanges.county[state][county], month, 0);
        // monthlyPercentageChanges.county[state][county][month] += data.percentDifference;

        init(monthlyPreValues.county, state, {});
        init(monthlyPreValues.county[state], county, {});
        init(monthlyPreValues.county[state][county], month, 0);
        monthlyPreValues.county[state][county][month] += data.pre;

        init(monthlyPostValues.county, state, {});
        init(monthlyPostValues.county[state], county, {});
        init(monthlyPostValues.county[state][county], month, 0);
        monthlyPostValues.county[state][county][month] += data.post;
      }

      monthlyEmissions.regional[month] += deltaVArray[i];
      monthlyEmissionChanges.region[month] += deltaVArray[i];
      // monthlyPercentageChanges.region[month] += deltaVArray[i];
      monthlyPreValues.region[month] += preTotalArray[i];
      monthlyPostValues.region[month] += postTotalArray[i];
    }

    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    months.forEach(function (month) {
      monthlyPercentageChanges.region[month] = (monthlyPostValues.region[month] - monthlyPreValues.region[month]) / monthlyPreValues.region[month] * 100;
    });

    Object.keys(monthlyPreValues.state).forEach(function (state) {
      months.forEach(function (month) {
        monthlyPercentageChanges.state[state][month] = (monthlyPostValues.state[state][month] - monthlyPreValues.state[state][month]) / monthlyPreValues.state[state][month] * 100;
      });

      Object.keys(monthlyPreValues.county[state]).forEach(function (county) {
        months.forEach(function (month) {
          monthlyPercentageChanges.county[state][county][month] = (monthlyPostValues.county[state][county][month] - monthlyPreValues.county[state][county][month]) / monthlyPreValues.county[state][county][month] * 100;
        });
      });
    });

    const preTotal = preTotalArray.reduce(function (sum, n) {
      return sum + (n || 0)
    }, 0);
    const postTotal = postTotalArray.reduce(function (sum, n) {
      return sum + (n || 0)
    }, 0);

    return {
      original: parseInt(preTotal, 10),
      post: parseInt(postTotal, 10),
      impact: parseInt(math.subtract(postTotal, preTotal), 10),
      monthlyEmissions: monthlyEmissions,
      monthlyChanges: {
        emissions: monthlyEmissionChanges,
        percentages: monthlyPercentageChanges,
      },
      stateChanges: stateEmissionChanges,
    };
  };

  DisplacementsEngine.prototype.calculateMedians = function (medians, index, data, load, preIndex, edges, postLoad, postIndex, monthlyEmissions, month) {
    const median = medians[index];
    const state = data[index].state;
    const county = data[index].county;
    const preVal = this.calculateLinear(load, median[preIndex], median[preIndex + 1], edges[preIndex], edges[preIndex + 1]);
    const postVal = this.calculateLinear(postLoad, median[postIndex], median[postIndex + 1], edges[postIndex], edges[postIndex + 1]);
    const deltaV = this.calculateDeltaV(postVal, preVal);
    const percentDifference = preVal !== 0 ? deltaV / preVal * 100 : 0;

    this.extractStateEmissions(monthlyEmissions, state, month, deltaV, preVal, postVal);
    this.extractCountyEmissions(monthlyEmissions, state, county, month, deltaV, preVal, postVal);

    return {
      pre: preVal,
      post: postVal,
      delta: deltaV,
      percentDifference: percentDifference
    }
  };

  DisplacementsEngine.prototype.excelMatch = function (array, lookup) {
    const sortedHaystack = array.concat(lookup).sort(function (a, b) {
      return a - b;
    });
    const index = sortedHaystack.indexOf(lookup);

    if (array[index] === lookup) return array.indexOf(sortedHaystack[index]);

    return array.indexOf(sortedHaystack[index - 1]);
  };

  DisplacementsEngine.prototype.calculateLinear = function (load, genA, genB, edgeA, edgeB) {
    const slope = (genA - genB) / (edgeA - edgeB);
    const intercept = genA - (slope * edgeA);

    return load * slope + intercept;
  };

  DisplacementsEngine.prototype.calculateDeltaV = function (postVal, preVal) {
    return postVal - preVal;
  };

  DisplacementsEngine.prototype.extractStateEmissions = function (monthlyEmissions, state, month, deltaV, preVal, postVal) {
    // Initialize empty States if they don't already exist
    init(monthlyEmissions.state, state, { data: {}, pre: {}, post: {}, counties: {} });

    // Initialize 0 value for the month if it hasn't been started
    init(monthlyEmissions.state[state].data, month, 0);
    monthlyEmissions.state[state].data[month] += deltaV;

    init(monthlyEmissions.state[state].pre, month, 0);
    monthlyEmissions.state[state].pre[month] += preVal;

    init(monthlyEmissions.state[state].post, month, 0);
    monthlyEmissions.state[state].post[month] += postVal;
  };

  DisplacementsEngine.prototype.extractCountyEmissions = function (monthlyEmissions, state, county, month, deltaV, preVal, postVal) {
    // Initialize empty County if it doesn't already exist
    init(monthlyEmissions.state[state].counties, county, { data: {}, pre: {}, post: {} });

    // Initialize 0 value for the month if it hasn't been started
    init(monthlyEmissions.state[state].counties[county].data, month, 0);
    monthlyEmissions.state[state].counties[county].data[month] += deltaV;

    init(monthlyEmissions.state[state].counties[county].pre, month, 0);
    monthlyEmissions.state[state].counties[county].pre[month] += preVal;

    init(monthlyEmissions.state[state].counties[county].post, month, 0);
    monthlyEmissions.state[state].counties[county].post[month] += postVal;
  };

  return DisplacementsEngine;
})();
