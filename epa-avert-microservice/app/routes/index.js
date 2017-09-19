const route = require('koa-route');

const jobs = require('../modules/jobs');
const displacements = require('../modules/displacements');
const rdf = require('../modules/rdf');
const eere = require('../modules/eere');

module.exports = [
  route.get('/', function* () {
    this.body = 'AVERT web service is running...';
  }),

  route.post('/api/v1/jobs', jobs.post),
  route.get('/api/v1/jobs/:id', jobs.get),

  route.post('/api/v1/displacements', displacements.calculateDisplacements),
  route.get('/api/v1/displacements', displacements.get),

  route.post('/api/v1/generation', displacements.calculateGeneration),

  route.post('/api/v1/so2', displacements.calculateSo2),
  route.post('/api/v1/nox', displacements.calculateNox),
  route.post('/api/v1/co2', displacements.calculateCo2),

  route.get('/api/v1/rdf',rdf.list),
  route.get('/api/v1/rdf/:region',rdf.show),

  route.get('/api/v1/eere', eere.list),
  route.get('/api/v1/eere/:region', eere.show),
];
