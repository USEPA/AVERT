import Engine from 'app/avert/Engine';
import Regions from '../../../app/utils/Regions';
import EereProfile from '../../../app/avert/entities/EereProfile';

import northeast_rdf from '../../../assets/data/rdf_northeast_2015.json';
import mock_northeast_rdf from '../../../assets/data/mock_rdf_northeast_2015.json';
import northeast_defaults from '../../../assets/data/eere-defaults-northeast.json';

describe('AVERT engine', () => {
  describe('Getters and Setters', () => {
    let engine = new Engine();

    it('should use the most recently available year by default', () => {
      expect(engine.year).toBe('2015');
    });

    it('should import the regional slug when given a region ID', () => {
      engine.region = Regions.CALIFORNIA.id;

      expect(engine.region).toBe('CA');
    });

    it('should import region data when given the regional ID', () => {
      engine.region = Regions.CALIFORNIA.id;

      expect(engine.regionData.rdf).toBe(Regions.CALIFORNIA.rdf);
    });

    it('should accept an EERE Profile', () => {
      let profile = new EereProfile();
      profile.limits = {constantReductions: 5,renewables: 10};

      profile.windCapacity = 7;
      engine.setEereProfile(profile);

      expect(engine.eereProfile.windCapacity).toBe(7);
    });

    it('should accept an EERE regional default value for renewables', () => {
      engine.setDefaults(northeast_defaults);
      expect(engine.eereDefault.region).toBe('northeast');
    });

    it('should accept an RDF', () => {
      engine.setRdf(northeast_rdf);
      expect(engine.rdfClass.raw.region.region_name).toBe("Northeast");
    });

    it('should allow access to the first level validation limits', () => {
      expect(engine.firstLimits.max_ee_yearly_gwh).toBe(41900)
    });
  });

  describe('calculateEereLoad',() => {
    let engine = new Engine();
    let profile = new EereProfile();
    profile.limits = {constantReductions: 5,renewables: 10};
    profile.windCapacity = 7;

    engine.setEereProfile(profile);
    engine.setRdf(mock_northeast_rdf);
    engine.setDefaults(northeast_defaults);


    it('should calculate Hourly EERE for given rdf', () => {
      engine.calculateEereLoad();
      expect(engine.hourlyEere[0].final_mw).toBe(-3.201540909);
    });
  });

});
