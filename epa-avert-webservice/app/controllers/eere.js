const fs = require('fs');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);

const config = require('../config');

module.exports = {
  list: (ctx) => {
    // not used in web app, but helpful for debugging
    ctx.body = { availableRegions: Object.keys(config.regions) };
  },

  show: async (ctx, region) => {
    if (!(region in config.regions)) {
      ctx.throw(404, `${region} region not found`);
    }

    const defaultsFile = await readFile(config.regions[region].defaults);

    ctx.body = {
      region: region,
      response: 'ok',
      eereDefaults: JSON.parse(defaultsFile),
    }
  },
};
