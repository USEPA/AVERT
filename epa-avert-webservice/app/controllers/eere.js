const fs = require('fs');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);

const regions = require('../lib/regionsEnum');

module.exports = {
  list: (ctx) => {
    // not used in web app, but helpful for debugging
    ctx.body = { availableRegions: Object.keys(regions) };
  },

  show: async (ctx, region) => {
    if (!(region in regions)) ctx.throw(404, `${region} region not found`);

    const defaultsFile = await readFile(regions[region].defaults);

    ctx.body = {
      region: region,
      response: 'ok',
      eereDefaults: JSON.parse(defaultsFile),
    }
  },
};
