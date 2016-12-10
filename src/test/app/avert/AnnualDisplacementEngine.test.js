import AnnualDisplacementEngine from '../../../app/avert/engines/AnnualDisplacementEngine';
// import northeast_rdf from '../../../assets/data/rdf_northeast_2015.json';
import northeast_rdf from '../../../assets/data/mock_rdf_northeast_2015.json';
import Rdf from '../../../app/avert/entities/Rdf';
import EereProfile from '../../../app/avert/entities/EereProfile';
import northeast_defaults from '../../../assets/data/eere-defaults-northeast.json';
import EereEngine from '../../../app/avert/engines/EereEngine';

describe('AnnualDisplacementEngine', () => {

  const usingMock = true;

  const rdf = new Rdf({rdf: northeast_rdf, defaults: northeast_defaults});
  let profile = new EereProfile();
  profile.limits = {constantReductions: 5, renewables: 10};
  profile.windCapacity = 7;
  let eere = new EereEngine(profile, rdf);
  eere.calculateEereLoad();

  describe('constructor', () => {
    it('should accept an rdf class', () => {
      let engine = new AnnualDisplacementEngine(rdf, []);
      expect(engine.rdf.raw.data.generation[0].medians[0]).toBe(11.08);
    });

    it('should accept a raw rdf', () => {
      let engine = new AnnualDisplacementEngine(northeast_rdf, []);
      expect(engine.rdf.data.generation[0].medians[0]).toBe(11.08);
    });

    it('should accept hourly EERE values', () => {
      let engine = new AnnualDisplacementEngine(rdf, eere.hourlyEere);
      expect(engine.hourlyEere[0].final_mw).toBe(eere.hourlyEere[0].final_mw);
    });
  });

  describe('excelMatch', () => {
    let engine = new AnnualDisplacementEngine();
    it('should tell me the index of an array closest to my lookup', () => {
      let array = [1, 2, 3, 4, 5];
      let lookup = 3;

      let index = engine.excelMatch(array, lookup);

      expect(index).toBe(2);
    });

    it('should tell me the index when comparing decimals', () => {
      let array = [1.5, 5.3, 7.1];
      let lookup = 6.2;

      let index = engine.excelMatch(array, lookup);

      expect(index).toBe(1);
    });

    it('should tell me the index even if array is unsorted', () => {
      let array = [7, 5, 6, 1];
      let lookup = 5.1;

      let index = engine.excelMatch(array, lookup);

      expect(index).toBe(1);
    });

  });

  describe('calculateLinear', () => {
    let engine = new AnnualDisplacementEngine();

    it('should calculate the linear regression', () => {
      let x = 5;
      let numA = 3;
      let numB = 5;
      let denA = 8;
      let denB = 9;

      let y = engine.calculateLinear(x, numA, numB, denA, denB);

      let slope = (numA - numB) / (denA - denB);
      let b = numA - (slope * denA);
      let result = x * slope + b;
      expect(y).toBe(result);
    });
  });

  describe('getDisplacedGenerations', () => {
    let engine = new AnnualDisplacementEngine(rdf, eere.hourlyEere);
    let data;
    it('should calculate displaced generations', () => {
      data = engine.getDisplacedGeneration(engine.rdf.raw.data.generation, false, false);
    });

    it('should calculate original generation values before displacing with EERE', () => {
      if (usingMock) {
        expect(data.original).toBe(11906);
      } else {
        expect(data.original).toBe(117925585);
      }
    });

    it('should calculate displaced generation values using an EERE profile', () => {
      if (usingMock) {
        expect(data.post).toBe(11905);
      } else {
        expect(data.post).toBe(117913373);
      }
    });

    it('should calculate the difference between the displaced and original values', () => {
      if (usingMock) {
        expect(data.impact).toBe(0);
      } else {
        expect(data.impact).toBe(-12212);
      }
    });

    it('should extract monthly emissions for the region', () => {
      if (usingMock) {
        expect(data.monthlyEmissions.regional[1]).toBe(-0.25033370701134317);
      } else {
        expect(data.monthlyEmissions.regional[1]).toBe(-1608.8198956026513);
      }
    });

    it('should extract monthly emissions for the states', () => {
      if (usingMock) {
        expect(data.monthlyEmissions.state['NY'].data[1]).toBe(-0.29548786970313756);
      } else {
        expect(data.monthlyEmissions.state['NY'].data[1]).toBe(-854.9121809831477);
      }
    });

    it('should extract pre displacement emissions for the states', () => {
      if (usingMock) {
        expect(data.monthlyEmissions.state['NY'].pre[1]).toBe(6396.073583675235);
      } else {
        expect(data.monthlyEmissions.state['NY'].pre[1]).toBe(5076037.604181951);
      }
    });

    it('should extract post displacement emissions for the states', () => {
      if (usingMock) {
        expect(data.monthlyEmissions.state['NY'].post[1]).toBe(6395.778095805532);
      } else {
        expect(data.monthlyEmissions.state['NY'].post[1]).toBe(5075182.69200098);
      }
    });

    it('should extract counties from states', () => {
      if (usingMock) {
        expect(Object.keys(data.monthlyEmissions.state['NY'].counties)).toContain('Albany');
      } else {
        expect(Object.keys(data.monthlyEmissions.state['NY'].counties)).toContain('Albany');
      }
    });

    it('should extract monthly emissions from counties', () => {
      if (usingMock) {
        expect(data.monthlyEmissions.state['NY'].counties['Albany'].data[1]).toBe(-0.18776868948081926);
      } else {
        expect(data.monthlyEmissions.state['NY'].counties['Albany'].data[1]).toBe(-20.200556652153903);
      }
    });

    it('should extract pre displacement monthly emissions from counties', () => {
      if (usingMock) {
        expect(data.monthlyEmissions.state['NY'].counties['Albany'].pre[1]).toBe(3952.6102266230396);
      } else {
        expect(data.monthlyEmissions.state['NY'].counties['Albany'].pre[1]).toBe(393452.8946859535);
      }
    });

    it('should extract post displacement monthly emissions from counties', () => {
      if (usingMock) {
        expect(data.monthlyEmissions.state['NY'].counties['Albany'].post[1]).toBe(3952.422457933559);
      } else {
        expect(data.monthlyEmissions.state['NY'].counties['Albany'].post[1]).toBe(393432.69412930013);
      }
    });
  });
});
