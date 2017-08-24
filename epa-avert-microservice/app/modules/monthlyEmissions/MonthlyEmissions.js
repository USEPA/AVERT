'use strict';

const MonthlyEmissions = (function () {
    function MonthlyEmissions () {

        const locationLevels = {
            region: {},
            state: {},
            county: {},
        };

        const standardStructure = {
            emissions: locationLevels,
            percentages: locationLevels,
        };

        this.generation = standardStructure;
        this.so2 = standardStructure;
        this.nox = standardStructure;
        this.co2 = standardStructure;

        this.count = 0;
    }

    MonthlyEmissions.prototype.toJSON = function() {
        return {
            generation: this.generation,
            so2: this.so2,
            nox: this.nox,
            co2: this.co2,
            count: this.count,
        };
    };

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

module.exports = MonthlyEmissions;