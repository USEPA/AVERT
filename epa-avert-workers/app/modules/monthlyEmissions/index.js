const MonthlyEmissions = require('./MonthlyEmissions');
const MonthlyEmissionsEngine = require('./MonthlyEmissionsEngine');

// Controller
const MonthlyEmissionsController = {
    get: function *get() {
        const entity = new MonthlyEmissions();
        const engine = new MonthlyEmissionsEngine();

        this.body = {
            monthlyEmissions: entity.toJSON(),
        };
    },
};

module.exports = MonthlyEmissionsController;
