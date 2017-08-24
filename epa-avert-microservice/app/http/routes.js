const route = require('koa-route');
// const avert = require('../modules/avert');
const displacements = require('../modules/displacements');
const eere = require('../modules/eere');
const example = require('../modules/example');
const rdf = require('../modules/rdf');
const jobs = require('../modules/jobs');

const app = [
    route.get('/', example.hello),
    route.post('/api/v1/jobs', jobs.post),
    route.get('/api/v1/jobs/:id', jobs.get),
    route.get('/api/v1/displacements', displacements.get),
    route.post('/api/v1/displacements', displacements.calculateDisplacements),
    route.post('/api/v1/generation', displacements.calculateGeneration),
    route.post('/api/v1/so2', displacements.calculateSo2),
    route.post('/api/v1/nox', displacements.calculateNox),
    route.post('/api/v1/co2', displacements.calculateCo2),
    route.get('/api/v1/rdf',rdf.list),
    route.get('/api/v1/rdf/:region',rdf.show),
    route.get('/api/v1/eere', eere.list),
    route.get('/api/v1/eere/:region', eere.show)
];

module.exports = app;