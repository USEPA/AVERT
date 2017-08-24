const expect = require('expect');
const Engine = require('./DisplacementsEngine');
const sampleEere = require('./sampleEere.json').eere;
const californiaRdf = require('../../data/rdf_california_2015.json');
const californiaDefaults = require('../../data/eere-defaults-california.json');
const Rdf = require('../rdf/Rdf');

describe('Displacements engine', () => {
    let data = {};
    function setUp() {
        const rdf = new Rdf({rdf: californiaRdf, defaults: californiaDefaults});
        const engine = new Engine(rdf, sampleEere);
        data = engine.getSo2Total();
    }

    setUp();

    it('should have original SO2 == 7926547', (done) => {
        expect(data.original).toBe(7926547);
        done();
    });

    it('should have post SO2 == 7869575', (done) => {
        expect(data.post).toBe(7869575);
        done();
    });
});