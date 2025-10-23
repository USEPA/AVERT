const { readFile } = require("node:fs/promises");
// ---
const config = require("./config");
const { calculateEmissionsChanges } = require("./calculations");

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
 * Storage Controller
 */
const storage = {
  list: (ctx) => {
    ctx.body = Object.keys(config.regions);
  },
  show: async (ctx, region) => {
    if (!(region in config.regions)) {
      ctx.throw(404, `${region} region not found`);
    }
    const fileName = `app/data/${config.regions[region].storage}`;
    const fileData = await readFile(fileName, { encoding: "utf8" });

    ctx.body = JSON.parse(fileData);
  },
};

/**
 * Emissions Controller
 */
const emissions = {
  calculate: async (ctx) => {
    const year = config.year;
    const body = await ctx.request.body;
    const { regionId, hourlyChanges } = body;

    const rdfFileName = `app/data/${config.regions[regionId].rdf}`;
    const rdfFileData = await readFile(rdfFileName, { encoding: "utf8" });
    const rdf = JSON.parse(rdfFileData);

    const neiFileName = "app/data/nei-emission-rates.json";
    const neiFileData = await readFile(neiFileName, { encoding: "utf8" });
    const neiEmissionRates = JSON.parse(neiFileData);

    ctx.body = calculateEmissionsChanges({
      year,
      rdf,
      neiEmissionRates,
      hourlyChanges
    });
  },
};

module.exports = {
  rdf,
  eere,
  storage,
  emissions,
};
