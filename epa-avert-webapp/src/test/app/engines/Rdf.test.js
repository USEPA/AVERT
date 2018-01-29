import Rdf from 'app/engines/Rdf';

// data
import rdfFile from 'test/data/rdf_NE_2016.json';
import defaultsFile from 'test/data/eere-defaults-northeast.json';

describe('RDF Entity', () => {
  let rdf = new Rdf({ rdf: rdfFile, defaults: defaultsFile });

  describe('set rdf', () => {
    it('should extract the region name', () => {
      expect(rdf._regionName).toBe('Northeast');
    });

    it('accepts an RDF json and extracts its regional load values', () => {
      expect(rdf.regionalLoads[0]).toBe(6473);
    });
  });

  describe('set defaults', () => {
    it('should accept a regional defaults file', () => {
      expect(rdf.defaults.region).toBe('northeast');
    });
  });

  describe('get softLimits', () => {
    it('extracts the second level validation soft limits', () => {
      expect(rdf.softLimits[0]).toBe(-970.95);
    });
  });

  describe('get hardLimits', () => {
    it('extracts the second level validation hard limits', () => {
      expect(rdf.hardLimits[0]).toBe(-1941.8999999999999);
    });
  });

  describe('get months', () => {
    it('should get the month for every data point', () => {
      expect(rdf.months[0]).toBe(1);
      expect(rdf.months[3672]).toBe(6);
    });
  });
});
