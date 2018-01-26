import Avert from 'app/engines/Avert';
import Regions from 'app/utils/Regions';
import EereProfile from '/app/engines/EereProfile';

// data
import northeast_rdf from 'app/test/data/rdf_NE_2016.json';
import northeast_defaults from 'app/test/data/eere-defaults-northeast.json';

describe('AVERT engine', () => {
  describe('Getters and Setters', () => {
    let avert = new Avert();

    it('should use the most recently available year by default', () => {
      expect(avert.year).toBe('2015');
    });

    it('should import the regional slug when given a region ID', () => {
      avert.region = Regions.CALIFORNIA.id;

      expect(avert.region).toBe('CA');
    });

    it('should import region data when given the regional ID', () => {
      avert.region = Regions.CALIFORNIA.id;

      expect(avert.regionData.rdf).toBe(Regions.CALIFORNIA.rdf);
    });

    it('should accept an EERE Profile', () => {
      let profile = new EereProfile();
      profile.limits = {constantReductions: 5,renewables: 10};

      profile.windCapacity = 7;
      avert.setEereProfile(profile);

      expect(avert.eereProfile.windCapacity).toBe(7);
    });

    it('should accept an EERE regional default value for renewables', () => {
      avert.setDefaults(northeast_defaults);
      expect(avert.eereDefault.region).toBe('northeast');
    });

    it('should accept an RDF', () => {
      avert.setRdf(northeast_rdf);
      expect(avert.rdfClass.raw.region.region_name).toBe("Northeast");
    });

    it('should allow access to the first level validation limits', () => {
      expect(avert.firstLimits.max_ee_yearly_gwh).toBe(41900)
    });
  });

  describe('calculateEereLoad',() => {
    let avert = new Avert();
    let profile = new EereProfile();
    profile.limits = {constantReductions: 5,renewables: 10};
    profile.windCapacity = 7;

    avert.setEereProfile(profile);
    avert.setRdf(northeast_rdf);
    avert.setDefaults(northeast_defaults);


    it('should calculate Hourly EERE for given rdf', () => {
      avert.calculateEereLoad();
      expect(engine.hourlyEere[0].final_mw).toBe(-3.201540909);
    });
  });

});
