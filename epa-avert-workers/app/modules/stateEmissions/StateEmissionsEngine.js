'use strict';

const StateEmissions = (function () {
    function StateEmisisons () {}

    StateEmisisons.prototype.extract = function (annualData) {
        const states = Object.keys(annualData.totalEmissions.so2.stateChanges).sort();

        const data = states.map(function (state) {
            return {
                state: state,
                so2: annualData.totalEmissions.so2.stateChanges[state],
                nox: annualData.totalEmissions.nox.stateChanges[state],
                co2: annualData.totalEmissions.co2.stateChanges[state],
            }
        }).sort(function (a, b) {
            const stateA = a.state.toUpperCase();
            const stateB = b.state.toUpperCase();

            if (stateA < stateB) return - 1;

            if (stateA > stateB) return 1;

            return 0;
        });

        return {
            states: states,
            data: data,
        };
    };

    return StateEmisisons;
})();

module.exports = StateEmissions;