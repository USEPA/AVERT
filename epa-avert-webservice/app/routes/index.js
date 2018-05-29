const route = require('koa-route');

const rdf = require('../controllers/rdf');
const eere = require('../controllers/eere');
const queue = require('../controllers/queue');
const jobs = require('../controllers/jobs');

module.exports = [
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
  route.post('/api/v1/generation', queue.addGeneration),
  route.post('/api/v1/so2', queue.addSo2),
  route.post('/api/v1/nox', queue.addNox),
  route.post('/api/v1/co2', queue.addCo2),
  route.post('/api/v1/pm25', queue.addPm25),

  // web app method: calculateDisplacement()
  // (from panel 2, user clicks 'Get Results' button)
  route.get('/api/v1/jobs/:id', jobs.get),
];
