const StateEmissions = require('./StateEmissions');
const StateEmissionsEngine = require('./StateEmissionsEngine');

// Controller
const StateEmissionsController = {
    get: function *get() {
        const entity = new StateEmissions();
        const engine = new StateEmissionsEngine();

        this.body = {
            stateEmissions: entity.toJSON(),
        };
    },
};

module.exports = StateEmissionsController;
