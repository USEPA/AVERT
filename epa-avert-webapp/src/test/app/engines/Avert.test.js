// engines
import Avert from 'app/engines/Avert';
import EereProfile from 'app/engines/EereProfile';

// data
import rdfFile from 'test/data/rdf_NE_2016.json';
import defaultsFile from 'test/data/eere-defaults-northeast.json';

describe('AVERT engine', () => {
  describe('Getters and Setters', () => {
    let avert = new Avert();

    it('should accept an RDF', () => {
      avert.rdf = rdfFile;
      expect(avert.rdf._regionName).toBe('Northeast');
    });

    it('should accept an EERE regional default value for renewables', () => {
      avert.eereDefaults = defaultsFile;
      expect(avert._eereDefaults.region).toBe('northeast');
    });
  });

  describe('calculateEereLoad', () => {
    let avert = new Avert();
    let eereProfile = new EereProfile();

    eereProfile.limits = {
      hours: 8784,
      annualGwh: 100,
      renewables: 100,
    };
    eereProfile.windCapacity = 50;

    avert.region = 3;
    avert.rdf = rdfFile;
    avert.eereDefaults = defaultsFile;
    avert.eereProfile = eereProfile;

    it('should calculate Hourly EERE for given rdf', () => {
      avert.calculateEereLoad();
      expect(avert.eereLoad._hourlyEere[0].final_mw).toBe(-22.86814935);
    });
  });
});
