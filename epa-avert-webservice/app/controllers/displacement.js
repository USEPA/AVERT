const fs = require('fs');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);

const regions = require('../lib/regionsEnum');
const Rdf = require('../engines/Rdf');
const DisplacementsEngine = require('../engines/DisplacementsEngine');

// receive eere data and region, and return displacement data
const calculatePollutant = async (ctx, pollutant) => {
  const body = await ctx.request.body;
  // instantiate new Rdf from rdf data file
  const rdfFile = await readFile(regions[body.region].rdf);
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

module.exports = {
  calculateGeneration: (ctx) => calculatePollutant(ctx, 'generation'),
  calculateSo2: (ctx) => calculatePollutant(ctx, 'so2'),
  calculateNox: (ctx) => calculatePollutant(ctx, 'nox'),
  calculateCo2: (ctx) => calculatePollutant(ctx, 'co2'),
  calculatePm25: (ctx) => calculatePollutant(ctx, 'pm25'),
};
