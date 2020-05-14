// config
import { Region } from 'app/config';
// engines
import Rdf from 'app/engines/Rdf';
import EereEngine from 'app/engines/EereEngine';
import EereProfile from 'app/engines/EereProfile';

// data
import rdfFile from 'test/data/rdf_NE_2016.json';
import defaultsFile from 'test/data/eere-defaults-northeast.json';

describe('EERE Engine', () => {
  let region = Region.NORTHEAST;
  let rdf = new Rdf({ rdf: rdfFile, defaults: defaultsFile });
  let eereProfile = new EereProfile();
  eereProfile.limits = {
    hours: 8784,
    annualGwh: 1000,
    renewables: 1000,
  };

  describe('constructor', () => {
    eereProfile.annualGwh = 500;
    let eereEngine = new EereEngine(eereProfile, rdf, region);

    it('should accept an rdf', () => {
      expect(eereEngine._rdf._regionName).toBe('Northeast');
    });

    it('should accept an EERE Profile', () => {
      expect(eereEngine._eereProfile.annualGwh).toBe(500);
    });
  });

  describe('_calculateHourlyMwReduction', () => {
    eereProfile.annualGwh = 500;
    let eereEngine = new EereEngine(eereProfile, rdf, region);

    it('should take an EERE eereProfile and return a constant reduction for all hours', () => {
      expect(eereEngine._hourlyMwReduction).toBe(56.92167577413479);
    });
  });

  describe('_doesExceed', () => {
    eereProfile.annualGwh = 500;
    let eereEngine = new EereEngine(eereProfile, rdf, region);

    it('should take a load smaller than a limit and say it has not been exceeded', () => {
      let data = eereEngine._doesExceed(5, 10, 100);
      expect(data).toBe(0);
    });

    it('should take a load bigger than a limit and return percentage it is bigger', () => {
      let data = eereEngine._doesExceed(1100, 1000, 15);
      expect(data).toBe(16.5);
    });
  });

  describe('_calculateExceedancesAndHourlyEere', () => {
    eereProfile.limits = {
      hours: 8784,
      annualGwh: 5,
      renewables: 10,
    };
    eereProfile.windCapacity = 7;
    let eereEngine = new EereEngine(eereProfile, rdf, region);

    describe('first load from northeast', () => {
      const firstLoad = eereEngine._hourlyEere[0];

      it('should store the current_load_mw', () => {
        expect(firstLoad.current_load_mw).toBe(6473);
      });

      it('should calculate the final_mw', () => {
        expect(firstLoad.final_mw).toBe(-63.10017899606176);
      });

      it('should calculate the soft_limit', () => {
        expect(firstLoad.soft_limit).toBe(-970.95);
      });

      it('should calculate the hard_limit', () => {
        expect(firstLoad.hard_limit).toBe(-1941.8999999999999);
      });

      it('should not exceed the soft limit', () => {
        expect(firstLoad.soft_exceedance).toBe(0);
      });

      it('should not exceed the hard limit', () => {
        expect(firstLoad.hard_exceedance).toBe(0);
      });
    });
  });
});
