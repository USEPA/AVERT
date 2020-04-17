const route = require('koa-route');

const rdf = require('./controllers/rdf');
const eere = require('./controllers/eere');
const displacement = require('./controllers/displacement');

const routes = [
  route.get('/api/v1', (ctx) => {
    ctx.body = 'AVERT web service is running...';
  }),

  // debugging only (not called in web app)
  route.get('/api/v1/rdf', rdf.list),

  // web app method: fetchRegion()
  // (from panel 1, user clicks 'Set EE/RE Impacts' button)
  route.get('/api/v1/rdf/:region', rdf.show),

  // debugging only (not called in web app)
  route.get('/api/v1/eere', eere.list),

  // web app method: fetchRegion()
  // (from panel 1, user clicks 'Set EE/RE Impacts' button)
  route.get('/api/v1/eere/:region', eere.show),

  // web app method: calculateDisplacement()
  // (from panel 2, user clicks 'Get Results' button)
  route.post('/api/v1/generation', displacement.calculateGeneration),
  route.post('/api/v1/so2', displacement.calculateSo2),
  route.post('/api/v1/nox', displacement.calculateNox),
  route.post('/api/v1/co2', displacement.calculateCo2),
  route.post('/api/v1/pm25', displacement.calculatePm25),
];

module.exports = routes;
