const fs = require('fs');
const thunkify = require('thunkify');

const regions = require('../lib/regions');

const read = thunkify(fs.readFile);

module.exports = {
  list: function* () {
    // return availale regions (not used in web app, but helpful for debugging)
    this.body = {
      availableRegions: Object.keys(regions)
    };
  },

  show: function* (region) {
    if (!(region in regions)) {
      this.throw(404, 'invalid region');
    }

    const rdfFile = yield read(regions[region].rdf);

    // return response, region, and rdf (used by web app)
    this.body = {
      region: region,
      response: 'ok',
      rdf: JSON.parse(rdfFile),
    }
  },
};
