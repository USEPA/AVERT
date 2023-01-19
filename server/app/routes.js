const route = require("koa-route");

const controllers = require("./controllers");

const routes = [
  route.get("/api/v1", (ctx) => {
    ctx.body = "AVERT web service is running...";
  }),

  // debugging only (not called in web app)
  route.get("/api/v1/rdf", controllers.rdf.list),

  // web app method: fetchRegion()
  // (from panel 1, user clicks 'Set EE/RE Impacts' button)
  route.get("/api/v1/rdf/:region", controllers.rdf.show),

  // debugging only (not called in web app)
  route.get("/api/v1/eere", controllers.eere.list),

  // web app method: fetchRegion()
  // (from panel 1, user clicks 'Set EE/RE Impacts' button)
  route.get("/api/v1/eere/:region", controllers.eere.show),

  // web app method: calculateDisplacement()
  // (from panel 2, user clicks 'Get Results' button)
  route.post("/api/v1/displacement", controllers.displacement.calculate),
  route.post('/api/v1/displacement/generation', controllers.displacement.calculateGeneration), // prettier-ignore
  route.post("/api/v1/displacement/so2", controllers.displacement.calculateSO2),
  route.post("/api/v1/displacement/nox", controllers.displacement.calculateNOx),
  route.post("/api/v1/displacement/co2", controllers.displacement.calculateCO2),
  route.post('/api/v1/displacement/nei', controllers.displacement.calculateNEIMetrics), // prettier-ignore
];

module.exports = routes;
