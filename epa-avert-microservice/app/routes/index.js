const route = require('koa-route');

const rdf = require('../modules/rdf');
const eere = require('../modules/eere');
const displacements = require('../modules/displacements');
const jobs = require('../modules/jobs');

module.exports = [
  route.get('/', function* () {
    this.body = 'AVERT web service is running...';
  }),

  // debugging
  route.get('/api/v1/rdf', rdf.list),
  // web app: panel 1, user clicks 'Set EE/RE Impacts' button
  route.get('/api/v1/rdf/:region', rdf.show),

  // debugging
  route.get('/api/v1/eere', eere.list),
  // web app: panel 1, user clicks 'Set EE/RE Impacts' button
  route.get('/api/v1/eere/:region', eere.show),

  route.post('/api/v1/generation', displacements.calculateGeneration),
  route.post('/api/v1/so2', displacements.calculateSo2),
  route.post('/api/v1/nox', displacements.calculateNox),
  route.post('/api/v1/co2', displacements.calculateCo2),

  route.post('/api/v1/jobs', jobs.post),
  route.get('/api/v1/jobs/:id', jobs.get),
];
