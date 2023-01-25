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

  // web app method: fetchEmissionsChanges()
  // (from panel 2, user clicks 'Get Results' button)
  route.post("/api/v1/emissions", controllers.emissions.calculate),
];

module.exports = routes;
