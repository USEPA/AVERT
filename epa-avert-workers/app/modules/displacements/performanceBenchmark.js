const Engine = require('./DisplacementsEngine');
const sampleEere = require('./sampleEere.json').eere;
const californiaRdf = require('../../data/rdf_california_2015.json');
const californiaDefaults = require('../../data/eere-defaults-california.json');
const Rdf = require('../rdf/Rdf');

console.log('Running');

console.log('RDF');

// console.time('rdf');
const rdf = new Rdf({ rdf: californiaRdf, defaults: californiaDefaults });
// console.timeEnd('rdf'); // 2.928ms, 3.312mx

console.time('engine');
const engine = new Engine(rdf, sampleEere);
const total = engine.getSo2Total();
console.timeEnd('engine'); // 22917.330ms

// console.time('calculateMedians');

// const engine = new Engine(rdf, sampleEere);
// const median = engine.calculateMedians()
// console.timeEnd('calculateMedians');