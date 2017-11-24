'use strict';

module.exports = (function () {
  function StateEmissions () {
    this.generation = {};
    this.so2 = {};
    this.nox = {};
    this.co2 = {};
  }

  StateEmissions.prototype.add = function (type, state, data) {
    this[type][state] = this[type][state] ? this[type][state] : 0;
    this[type][state] += data;
  };

  return StateEmissions;
})();
