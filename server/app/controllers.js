const fs = require('fs');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);

const config = require('./config');
const getDisplacement = require('./calculations');

/**
 * RDF Controller
 */
const rdf = {
  list: (ctx) => {
    ctx.body = Object.keys(config.regions);
  },
  show: async (ctx, region) => {
    if (!(region in config.regions)) {
      ctx.throw(404, `${region} region not found`);
    }
    const file = await readFile(`app/data/${config.regions[region].rdf}`);
    ctx.body = JSON.parse(file);
  },
};

/**
 * EERE Controller
 */
const eere = {
  list: (ctx) => {
    ctx.body = Object.keys(config.regions);
  },
  show: async (ctx, region) => {
    if (!(region in config.regions)) {
      ctx.throw(404, `${region} region not found`);
    }
    const file = await readFile(`app/data/${config.regions[region].eere}`);
    ctx.body = JSON.parse(file);
  },
}

/**
 * Receives EERE data and region, and returns displacement data.
 * @param {*} ctx 
 * @param {'generation'|'so2'|'nox'|'co2'|'nei'} metric
 */
async function calculateMetric(ctx, metric) {
  const year = config.year;
  const body = await ctx.request.body;
  const eereLoad = body.eereLoad;
  // parse rdf (and potentially nei) data from files
  const rdfData = await readFile(`app/data/${config.regions[body.region].rdf}`);
  const rdfJson = JSON.parse(rdfData);
  let neiJson = null;
  if (metric === 'nei') {
    const neiData = await readFile('app/data/annual-emission-factors.json');
    neiJson = JSON.parse(neiData);
  }
  // NOTE: setting the debug param to `true` will break the web app, so it must
  // stay set to `false`. it's only used in local development to debug hourly
  // displacement data for each EGU (see `app/calculations.js`)
  ctx.body = getDisplacement({ year, metric, rdfJson, neiJson, eereLoad, debug: false });
};

/**
 * Displacement Controller
 */
const displacement = {
  calculateGeneration: (ctx) => calculateMetric(ctx, 'generation'),
  calculateSO2: (ctx) => calculateMetric(ctx, 'so2'),
  calculateNOx: (ctx) => calculateMetric(ctx, 'nox'),
  calculateCO2: (ctx) => calculateMetric(ctx, 'co2'),
  calculateNEIMetrics: (ctx) => calculateMetric(ctx, 'nei'),
}

module.exports = {
  rdf,
  eere,
  displacement,
};
