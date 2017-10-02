'use strict';

module.exports = (function () {
  function StateEmissions () {
    this.generation = {};
    this.so2 = {};
    this.nox = {};
    this.co2 = {};
  }

  StateEmissions.prototype.toJSON = function () {
    return {
      generation: this.generation,
      so2: this.so2,
      nox: this.nox,
      co2: this.co2
    }
  };

  StateEmissions.prototype.add = function (type, state, data) {
    this[type][state] = this[type][state] ? this[type][state] : 0;
    this[type][state] += data;
  };

  StateEmissions.prototype.export = function () {
    const states = Object.keys(this.generation);
    const data = states.map(function (state) {
      return {
        state: state,
        so2: this.so2,
        nox: this.nox,
        co2: this.co2,
      }
    });

    return {
      states: states,
      data: data,
    };
  };

  return StateEmissions;
})();
