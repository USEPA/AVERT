const thunkify = require('thunkify');
const fs = require('fs');
const regions = require('../../types/regions');

// Controller
const EereController = {
    list: function *list() {
        var availableRegions = Object.keys(regions);
        this.body = {
            availableRegions: availableRegions
        };
    },
    show: function *show(region) {
        var read = thunkify(fs.readFile);

        let response = 'not found';
        let eereDefaults = false;
        if(region in regions){
            response = 'ok';
            eereDefaults = yield read(regions[region].defaults);
            eereDefaults = JSON.parse(eereDefaults);
        } else {
            this.throw(404, 'invalid region');
        }

        this.body = {
            region: region,
            response: response,
            eereDefaults: eereDefaults,
        }
    }
};

module.exports = EereController;
