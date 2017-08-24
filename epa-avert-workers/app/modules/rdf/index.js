const thunkify = require('thunkify');
const fs = require('fs');
const regions = require('../../types/regions');

// Controller
const RdfController = {
    list: function *() {
        var availableRegions = Object.keys(regions);
        this.body = {
            availableRegions: availableRegions
        };
    },
    show: function *(region) {
        var read = thunkify(fs.readFile);

        let response = 'not found';
        let rdf = false;
        if(region in regions){
            response = 'ok';
            rdf = yield read(regions[region].rdf);
            rdf = JSON.parse(rdf);
        }

        this.body = {
            region: region,
            response: response,
            rdf: rdf,
        }
    }
};

module.exports = RdfController;
