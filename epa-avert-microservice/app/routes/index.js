const route = require('koa-route');

const rdf = require('../controllers/rdf');
const eere = require('../controllers/eere');
const displacements = require('../controllers/displacements');
const jobs = require('../controllers/jobs');

module.exports = [
  route.get('/', function* () {
    this.body = 'AVERT web service is running...';
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
  route.post('/api/v1/generation', displacements.calculateGeneration),
  route.post('/api/v1/so2', displacements.calculateSo2),
  route.post('/api/v1/nox', displacements.calculateNox),
  route.post('/api/v1/co2', displacements.calculateCo2),

  // web app method: calculateDisplacement()
  // (from panel 2, user clicks 'Get Results' button)
  route.get('/api/v1/jobs/:id', jobs.get),
];
