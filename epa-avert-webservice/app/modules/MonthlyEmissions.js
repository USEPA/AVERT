'use strict';

module.exports = (function () {
  function MonthlyEmissions () {
    this.generation = {
      emissions: { region: {}, state: {}, county: {} },
      percentages: { region: {}, state: {}, county: {} },
    };

    this.so2 = {
      emissions: { region: {}, state: {}, county: {} },
      percentages: { region: {}, state: {}, county: {} },
    };

    this.nox = {
      emissions: { region: {}, state: {}, county: {} },
      percentages: { region: {}, state: {}, county: {} },
    };

    this.co2 = {
      emissions: { region: {}, state: {}, county: {} },
      percentages: { region: {}, state: {}, county: {} },
    };

    this.count = 0;
  }

  MonthlyEmissions.prototype.addRegion = function (type, emissionsOrPercentages, month, data) {
    if (typeof this[type][emissionsOrPercentages].region[month] === 'undefined') {
      this[type][emissionsOrPercentages].region[month] = 0
    }

    this[type][emissionsOrPercentages].region[month] += data;
  };

  MonthlyEmissions.prototype.addState = function (type, emissionsOrPercentages, state, month, data) {
    this.count ++;
    if (typeof this[type][emissionsOrPercentages].state[state] === 'undefined') {
      this[type][emissionsOrPercentages].state[state] = {}
    }

    if (typeof this[type][emissionsOrPercentages].state[state][month] === 'undefined') {
      this[type][emissionsOrPercentages].state[state][month] = 0;
    }

    this[type][emissionsOrPercentages].state[state][month] += data;
  };

  MonthlyEmissions.prototype.addCounty = function (type, emissionsOrPercentages, state, county, month, data) {
    if (typeof this[type][emissionsOrPercentages].county[state] === 'undefined') {
      this[type][emissionsOrPercentages].county[state] = {}
    }

    if (typeof this[type][emissionsOrPercentages].county[state][county] === 'undefined') {
      this[type][emissionsOrPercentages].county[state][county] = {}
    }

    if (typeof this[type][emissionsOrPercentages].county[state][county][month] === 'undefined') {
      this[type][emissionsOrPercentages].county[state][county][month] = 0;
    }

    this[type][emissionsOrPercentages].county[state][county][month] += data;
  };

  return MonthlyEmissions;
})();
