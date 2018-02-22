const fs = require('fs');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);

const regions = require('../lib/regions');

module.exports = {
  list: (ctx) => {
    // not used in web app, but helpful for debugging
    ctx.body = { availableRegions: Object.keys(regions) };
  },

  show: async (ctx, region) => {
    if (!(region in regions)) ctx.throw(404, `${region} region not found`);

    const rdfFile = await readFile(regions[region].rdf);

    ctx.body = {
      region: region,
      response: 'ok',
      rdf: JSON.parse(rdfFile),
    }
  },
};
