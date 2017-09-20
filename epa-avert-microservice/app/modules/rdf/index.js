const thunkify = require('thunkify');
const fs = require('fs');
const regions = require('../../lib/regions');

const read = thunkify(fs.readFile);

module.exports = {
  list: function* () {
    this.body = {
      availableRegions: Object.keys(regions)
    };
  },
  show: function* (region) {
    if (!(region in regions)) {
      this.throw(404, 'invalid region');
    }

    const rdfFile = yield read(regions[region].rdf);

    this.body = {
      region: region,
      response: 'ok',
      rdf: JSON.parse(rdfFile),
    }
  }
};
