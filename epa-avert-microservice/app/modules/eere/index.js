const thunkify = require('thunkify');
const fs = require('fs');
const regions = require('../../lib/regions');

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

    const eereFile = yield read(regions[region].defaults);

    // return response, region, and eereDefaults (used by web app)
    this.body = {
      region: region,
      response: 'ok',
      eereDefaults: JSON.parse(eereFile),
    }
  },
};
