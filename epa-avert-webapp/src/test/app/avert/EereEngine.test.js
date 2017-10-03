import EereEngine from '../../../app/avert/engines/EereEngine';
import EereProfile from '../../../app/avert/entities/EereProfile';
import northeast_rdf from '../../../assets/data/rdf_northeast_2015.json';
import northeast_defaults from '../../../assets/data/eere-defaults-northeast.json';
import Rdf from '../../../app/avert/entities/Rdf';
import Region from '../../../app/utils/Regions';

describe('EERE Engine', () => {
  let genericProfile = new EereProfile();
  genericProfile.limits = {constantReductions: 1000,renewables: 1000};
  genericProfile.annualGwh = 500;
  let rdf = new Rdf({ rdf: northeast_rdf, defaults: northeast_defaults, });
  let genericEngine = new EereEngine(genericProfile,rdf,Region.NORTHEAST);

  describe('constructor', () => {
    let profile = new EereProfile();
    profile.limits = {constantReductions: 1000,renewables: 1000};
    profile.annualGwh = 500;

    let engine = new EereEngine(profile,rdf,Region.NORTHEAST);

    it('should accept an rdf', () => {
      expect(engine.rdf.regionName).toBe('Northeast');
    });

    it('should accept an EERE Profile', () => {
      expect(engine.profile.annualGwh).toBe(500);
    });
  });

  describe('calculateHourlyReduction', () => {
    let profile = new EereProfile();
    profile.limits = {constantReductions: 1000,renewables: 1000};
    profile.annualGwh = 500;
    let engine = new EereEngine(profile,rdf,Region.NORTHEAST);

    it('should take an EERE profile and return a constant reduction for all hours', () => {
      let constantReduction = engine.calculateHourlyReduction(10);
      let comparison = (profile.annualGwh * 1000) / 10;
      expect(constantReduction).toBe(comparison);
    });
  });

  describe('calculateTopPercentile', () => {
    let profile = new EereProfile();
    profile.limits = {constantReductions: 1000,renewables: 1000};
    profile.topHours = 10;

    let engine = new EereEngine(profile,rdf,Region.NORTHEAST);

    it('should return the top percentage of loads given a variable percentage', () => {
      engine.calculateTopPercentile([1,2,3,4,5,6,7,8,9,10]);
      expect(engine.topPercentile).toBe(9.5);
    });

    it('should return the top percentage of mixed loads', () => {
      engine.calculateTopPercentile([100,5,77,76,70,1,2,9]);
      expect(engine.topPercentile).toBe(93.1);
    });
  });


  describe('doesExceed',() => {
    it('should take a load smaller than a limit and say it has not been exceeded', () => {
      let data = genericEngine.doesExceedFormatted(5, 10, 100);
      expect(data).toBe(0);
    });

    it('should take a load bigger than a limit and return percentage it is bigger', () => {
      let data = genericEngine.doesExceedFormatted(1100, 1000, 15);
      expect(data).toBe(16.5);
    });
  });


  describe('hourlyEereLoad', () => {
    let profile = new EereProfile();
    profile.limits = {constantReductions: 5,renewables: 10};
    profile.windCapacity = 7;
    let engine = new EereEngine(profile,rdf,Region.NORTHEAST);

    describe('first load from northeast',() => {
      let data = engine.hourlyEereCb(rdf.regionalLoads[0],0);
      it('should have should the final_mw -3.201540909', () => {
        expect(data.final_mw).toBe(-3.201540909);
      });

      it('should have the soft_limit -1437.75', () => {
        expect(data.soft_limit).toBe(-1437.75);
      });

      it('should have the hard_limit -2875.5', () => {
        expect(data.hard_limit).toBe(-2875.5);
      });

      it('should not exceed the soft limit', () => {
        expect(data.soft_exceedance).toBe(0);
      });

      it('should not exceed the hard limit', () => {
        expect(data.hard_exceedance).toBe(0);
      });
    });

    it('should return -2.84466707 when given second load from northeast',() => {
      let data = engine.hourlyEereCb(rdf.regionalLoads[1],1);
      expect(data.final_mw).toBe(-2.84466707);
    });

    it('should return -0.294443758 when given the four-thousandth load from northeast',() => {
      let data = engine.hourlyEereCb(rdf.regionalLoads[3999],3999);
      expect(data.final_mw).toBe(-0.294443758);
    });

    it('should return -1.230497695 when given the 8760th load from northeast',() => {
      let data = engine.hourlyEereCb(rdf.regionalLoads[8699],8699);
      expect(data.final_mw).toBe(-1.230497695);
    });
  });


  describe('calculateEereLoad',() => {
    let profile = new EereProfile();
    profile.limits = {constantReductions: 5,renewables: 10};
    profile.windCapacity = 7;
    let engine = new EereEngine(profile,rdf,Region.NORTHEAST);

    it('should calculate Hourly EERE for given rdf', () => {
      engine.calculateEereLoad();
      expect(engine.hourlyEere[0].final_mw).toBe(-3.201540909);
    });
  });
});