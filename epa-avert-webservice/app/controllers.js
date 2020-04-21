const fs = require('fs');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);

const config = require('./config');
const getDisplacement = require('./engines/DisplacementsEngine');

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
 * 
 * @param {*} ctx 
 * @param {'generation' | 'so2' | 'nox' | 'co2' | 'pm25'} pollutant 
 */
async function calculatePollutant(ctx, pollutant) {
  const body = await ctx.request.body;
  // parse rdf data from file
  const file = await readFile(`app/data/${config.regions[body.region].rdf}`);
  const rdf = JSON.parse(file);
  ctx.body = getDisplacement(rdf, body.eere, pollutant);
};

/**
 * Displacement Controller
 */
const displacement = {
  calculateGeneration: (ctx) => calculatePollutant(ctx, 'generation'),
  calculateSo2: (ctx) => calculatePollutant(ctx, 'so2'),
  calculateNox: (ctx) => calculatePollutant(ctx, 'nox'),
  calculateCo2: (ctx) => calculatePollutant(ctx, 'co2'),
  calculatePm25: (ctx) => calculatePollutant(ctx, 'pm25'),
}

module.exports = {
  rdf,
  eere,
  displacement,
};
