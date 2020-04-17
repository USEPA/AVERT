const fs = require('fs');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);

const config = require('./config');
const Rdf = require('./engines/Rdf');
const DisplacementsEngine = require('./engines/DisplacementsEngine');

/**
 * RDF Controller
 */
const rdf = {
  list: (ctx) => {
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

/**
 * EERE Controller
 */
const eere = {
  list: (ctx) => {
    ctx.body = { regions: Object.keys(config.regions) };
  },
  show: async (ctx, region) => {
    if (!(region in config.regions)) {
      ctx.throw(404, `${region} region not found`);
    }
    const eereDefaultsFile = await readFile(config.regions[region].defaults);
    ctx.body = {
      region: region,
      response: 'ok',
      eereDefaults: JSON.parse(eereDefaultsFile),
    }
  },
}

/**
 * Receive eere data and region, and return displacement data
 * (used in Displacement Controller)
 */
const calculatePollutant = async (ctx, pollutant) => {
  const body = await ctx.request.body;
  // instantiate new Rdf from rdf data file
  const rdfFile = await readFile(config.regions[body.region].rdf);
  const rdf = new Rdf(JSON.parse(rdfFile, 'utf8')).toJSON();
  // get pollutant data from new DisplacementEngine instance
  const engine = new DisplacementsEngine(rdf, body.eere);
  let data;
  if (pollutant === 'generation') data = engine.getGeneration();
  if (pollutant === 'so2') data = engine.getSo2Total();
  if (pollutant === 'nox') data = engine.getNoxTotal();
  if (pollutant === 'co2') data = engine.getCo2Total();
  if (pollutant === 'pm25') data = engine.getPm25Total();
  // return data to web app
  ctx.body = {
    response: 'ok',
    data: data,
  }
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
