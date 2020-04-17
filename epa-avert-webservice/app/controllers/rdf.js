const fs = require('fs');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);

const config = require('../config');

module.exports = {
  list: (ctx) => {
    // not used in web app, but helpful for debugging
    ctx.body = { regions: Object.keys(config.regions) };
  },

  show: async (ctx, region) => {
    if (!(region in config.regions)) {
      ctx.throw(404, `${region} region not found`);
    }

    const rdfFile = await readFile(config.regions[region].rdf);

    ctx.body = {
      region: region,
      response: 'ok',
      rdf: JSON.parse(rdfFile),
    }
  },
};
