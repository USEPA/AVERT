const { readFile } = require("node:fs/promises");
// ---
const config = require("./config");
const {
  getDisplacement,
  calculateRegionalDisplacement,
} = require("./calculations");

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

    const fileName = `app/data/${config.regions[region].rdf}`;
    const fileData = await readFile(fileName, { encoding: "utf8" });

    ctx.body = JSON.parse(fileData);
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
    const fileName = `app/data/${config.regions[region].eere}`;
    const fileData = await readFile(fileName, { encoding: "utf8" });

    ctx.body = JSON.parse(fileData);
  },
};

/**
 * Receives EERE data and region, and returns displacement data.
 *
 * @param {*} ctx
 * @param {'generation'|'so2'|'nox'|'co2'|'nei'} metric
 */
async function calculateMetric(ctx, metric) {
  const year = config.year;
  const body = await ctx.request.body;
  const regionId = body.region;
  const hourlyEere = body.eereLoad;

  const rdfFileName = `app/data/${config.regions[regionId].rdf}`;
  const rdfFileData = await readFile(rdfFileName, { encoding: "utf8" });
  const rdf = JSON.parse(rdfFileData);

  const neiFileName = "app/data/annual-emission-factors.json";
  const neiFileData = await readFile(neiFileName, { encoding: "utf8" });
  const neiData = JSON.parse(neiFileData);

  // NOTE: setting the debug param to `true` will break the web app, so it must
  // stay set to `false`. it's only used in local development to debug hourly
  // displacement data for each EGU (see `app/calculations.js`)
  const debug = false;

  ctx.body = getDisplacement({ year, metric, rdf, neiData, hourlyEere, debug });
}

/**
 * Displacement Controller
 */
const displacement = {
  calculate: async (ctx) => {
    const year = config.year;
    const body = await ctx.request.body;
    const { regionId, hourlyEere } = body;

    const rdfFileName = `app/data/${config.regions[regionId].rdf}`;
    const rdfFileData = await readFile(rdfFileName, { encoding: "utf8" });
    const rdf = JSON.parse(rdfFileData);

    const neiFileName = "app/data/annual-emission-factors.json";
    const neiFileData = await readFile(neiFileName, { encoding: "utf8" });
    const neiData = JSON.parse(neiFileData);

    ctx.body = calculateRegionalDisplacement({ year, rdf, neiData, hourlyEere }); // prettier-ignore
  },
  calculateGeneration: (ctx) => calculateMetric(ctx, "generation"),
  calculateSO2: (ctx) => calculateMetric(ctx, "so2"),
  calculateNOx: (ctx) => calculateMetric(ctx, "nox"),
  calculateCO2: (ctx) => calculateMetric(ctx, "co2"),
  calculateNEIMetrics: (ctx) => calculateMetric(ctx, "nei"),
};

module.exports = {
  rdf,
  eere,
  displacement,
};
