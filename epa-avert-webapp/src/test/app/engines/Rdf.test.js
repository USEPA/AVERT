import Rdf from 'app/engines/Rdf';

// data
import northeast_rdf from 'app/test/data/rdf_NE_2016.json';
import northeast_defaults from 'app/test/data/eere-defaults-northeast.json';

describe('RDF Entity', () => {
  let rdf = new Rdf({ rdf: northeast_rdf, defaults: northeast_defaults });

  describe('setRdf', () => {
    it('should allow access to original data file', () => {
      expect(rdf.raw.regional_load[0].regional_load_mw).toBe(9585);
    });

    it('should extract the region name', () => {
      expect(rdf.regionName).toBe('Northeast');
    });

    it('accepts an RDF json and extracts its regional load values', () => {
      expect(rdf.regionalLoads[0]).toBe(9585);
    });

    it('extracts the percent limit from json as a percentage', () => {
      expect(rdf.percentLimit).toBe(.15);
    });
  });

  describe('setSecondValidationLimits', () => {
    it('extracts the second level validation soft limits', () => {
      expect(rdf.softLimits[0]).toBe(-1437.75);
    });

    it('extracts the second level validation hard limits', () => {
      expect(rdf.hardLimits[0]).toBe(-2875.5);
    });
  });

  describe('setDefaults', () => {
    it('should accept a regional defaults file', () => {
      expect(rdf.defaults.region).toBe('northeast');
    });
  });

  describe('extractLoadBinEdges', () => {
    it('should take RDF JSON values and convert them into an array', () => {
      let mock = new Rdf();
      let edges = mock.extractLoadBinEdges({load_bin_edges: [{123: 123},{456: 456}, {789: 789}]});
      expect(Object.keys(edges[2])[0]).toBe("789");
    });

    it('should take the RDF load bin edges and convert it into an array', () => {
      expect(rdf.edges[5]).toBe(7118);
    });
  });

  describe('extractMonths', () => {
    it('should get the month for every data point', () => {
      expect(rdf.months[0]).toBe(1);
      expect(rdf.months[3624]).toBe(6);
    });
  });

  describe('Median extraction methods', () => {
    it('should extract generation medians arrays from the rdf', () => {

      expect(rdf.generation[0].medians[0]).toBe(11.08);
    });
  });
});
