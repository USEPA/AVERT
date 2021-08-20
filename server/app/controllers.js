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
 * @param {'generation'|'so2'|'nox'|'co2'|'pm25'|'vocs'|'nh3'} metric 
 */
async function calculateMetric(ctx, metric) {
  const body = await ctx.request.body;
  // parse rdf data from file
  const file = await readFile(`app/data/${config.regions[body.region].rdf}`);
  const rdf = JSON.parse(file);
  ctx.body = getDisplacement(rdf, body.eereLoad, metric);
};

/**
 * Displacement Controller
 */
const displacement = {
  calculateGeneration: (ctx) => calculateMetric(ctx, 'generation'),
  calculateSO2: (ctx) => calculateMetric(ctx, 'so2'),
  calculateNOx: (ctx) => calculateMetric(ctx, 'nox'),
  calculateCO2: (ctx) => calculateMetric(ctx, 'co2'),
  calculatePM25: (ctx) => calculateMetric(ctx, 'pm25'),
  calculateVOCs: (ctx) => calculateMetric(ctx, 'vocs'),
  calculateNH3: (ctx) => calculateMetric(ctx, 'nh3'),
}

module.exports = {
  rdf,
  eere,
  displacement,
};
