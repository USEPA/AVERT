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
      data = engine.getDisplacedGeneration(engine.rdf.raw.data.generation, false, 'generation');
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

  describe('Displaced Generations - Monthly Changes', () => {
    let engine = new AnnualDisplacementEngine(rdf, eere.hourlyEere);
    let data = engine.getDisplacedGeneration(engine.rdf.raw.data.generation, false, 'generation');

    it('should contain monthly emission changes', () => {
      expect(Object.keys(data.monthlyChanges)).toContain('emissions');
    });

    it('should contain monthly percent changes', () => {
      expect(Object.keys(data.monthlyChanges)).toContain('percentages');
    });

    describe('Monthly Changes - Emissions', () => {
      describe('Region level monthly emissions', () => {
        it('should contain regional data', () => {
          expect(Object.keys(data.monthlyChanges.emissions)).toContain('region');
        });

        it('should extract every month if using actual NE data', () => {
          if (!usingMock) {
            expect(Object.keys(data.monthlyChanges.emissions.region)).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']);
          }
        });

        it('should extract only the first month if using mock NE data', () => {
          if (usingMock) {
            expect(Object.keys(data.monthlyChanges.emissions.region)).toEqual(['1']);
          }
        });

        it('should have have January generation emission value of -0.25033370701134317 when using mock NE data', () => {
          if (usingMock) {
            expect(data.monthlyChanges.emissions.region[1]).toBe(-0.25033370701134317);
          }
        });

        it('should have have January generation emission value of -1608.8198956026513 when using real NE data', () => {
          if (!usingMock) {
            expect(data.monthlyChanges.emissions.region[1]).toBe(-1608.8198956026513);
          }
        });
      });

      describe('State level monthly emissions', () => {
        it('should contain each state with data', () => {
          expect(Object.keys(data.monthlyChanges.emissions.state)).toContain('NY');
        });

        it('should extract every month if using actual NE data', () => {
          if (!usingMock) {
            expect(Object.keys(data.monthlyChanges.emissions.state.NY))
              .toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']);
          }
        });

        it('should contain january for each state', () => {
          expect(Object.keys(data.monthlyChanges.emissions.state.NY)).toContain("1");
        });

        it('should aggregate state data into months', () => {
          if (usingMock) {
            expect(data.monthlyChanges.emissions.state.NY[1]).toBe(-0.29548786970313756);
          } else {
            expect(data.monthlyChanges.emissions.state.NY[1]).toBe(-854.9121809831477);
          }
        });
      });

      describe('County level monthly emissions', () => {
        it('should index counties by state', () => {
          expect(Object.keys(data.monthlyChanges.emissions.county)).toContain('NY');
        });

        it('should have every county in the state with data', () => {
          expect(Object.keys(data.monthlyChanges.emissions.county['NY'])).toContain('Albany');
        });

        it('should contain every month', () => {
          expect(Object.keys(data.monthlyChanges.emissions.county.NY.Albany)).toContain('1');
        });

        it('should aggregate avoided emissions into each month', () => {
          if(usingMock) {
            expect(data.monthlyChanges.emissions.county.NY.Albany[1]).toBe(-0.18776868948081926);
          } else {
            expect(data.monthlyChanges.emissions.county.NY.Albany[1]).toBe(-20.200556652153903);
          }
        });
      });
    });

    describe('Monthly Changes - Percentage ', () => {
      describe('Region level monthly percentages', () => {
        it('should contain regional data', () => {
          expect(Object.keys(data.monthlyChanges.percentages)).toContain('region');
        });

        it('should have an object index for each month', () => {
          if(usingMock) {
            expect(Object.keys(data.monthlyChanges.percentages.region)).toEqual(["1"]);
          } else {
            expect(Object.keys(data.monthlyChanges.percentages.region))
              .toEqual(["1","2","3","4","5","6","7","8","9","10","11","12"]);
          }
        });

        it('should have an avoided percent change of -0.2503 in January when using mock data', () => {
          if(usingMock) {
            expect(data.monthlyChanges.percentages.region[1]).toBe(-0.25033370701134317);
          }
        });
      });

      describe('State level monthly percentages', () => {
        it('should contain states', () => {
          expect(Object.keys(data.monthlyChanges.percentages)).toContain('state');
        });

        it('should contain each state that has data', () => {
          if(usingMock) {
            expect(Object.keys(data.monthlyChanges.percentages.state)).toEqual(['NH','NY','NJ','MA']);
          } else {
            expect(Object.keys(data.monthlyChanges.percentages.state))
              .toEqual(["NH", "NY", "NJ", "MA", "CT", "VT", "RI", "ME"]);
          }
        });

        it('should group data by months for each state', () => {
          if(usingMock) {
            expect(Object.keys(data.monthlyChanges.percentages.state.NY)).toEqual(["1"]);
          } else {
            expect(Object.keys(data.monthlyChanges.percentages.state.NY))
              .toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']);
          }
        });

        it('should aggregate data into each month', () => {
          if(usingMock) {
            expect(data.monthlyChanges.percentages.state.NY[1]).toBe(-0.27954464553214947);
          } else {
            expect(data.monthlyChanges.percentages.state.NY[1]).toBe(-854.9121809831477);
          }
        });
      });

      describe('County level monthly percentage changes', () => {
        it('should contain counties', () => {
          expect(Object.keys(data.monthlyChanges.percentages)).toContain('county');
        });

        it('should have an index of all states', () => {
          if(usingMock) {
            expect(Object.keys(data.monthlyChanges.percentages.county)).toEqual(['NH','NY','NJ','MA']);
          } else {
            expect(Object.keys(data.monthlyChanges.percentages.county))
              .toEqual(["NH", "NY", "NJ", "MA", "CT", "VT", "RI", "ME"]);
          }
        });

        it('should have every county in the state with data', () => {
          expect(Object.keys(data.monthlyChanges.percentages.county['NY'])).toContain('Albany');
        });

        it('should contain every month', () => {
          expect(Object.keys(data.monthlyChanges.percentages.county.NY.Albany)).toContain('1');
        });

        it('should aggregate avoided percentages into each month', () => {
          if(usingMock) {
            expect(data.monthlyChanges.percentages.county.NY.Albany[1]).toBe(-0.14223868293835307);
          } else {
            expect(data.monthlyChanges.percentages.county.NY.Albany[1]).toBe(-20.200556652153903);
          }
        });
      })
    });
  });



  describe('Displaced Generations - State Changes', () => {
    let engine = new AnnualDisplacementEngine(rdf, eere.hourlyEere);
    let data = engine.getDisplacedGeneration(engine.rdf.raw.data.generation, false, 'generation');

    it('should contain emission changes by state', () => {
      expect(Object.keys(data)).toContain('stateChanges');
    });

    it('should contain a list of states for the region', () => {
      if(usingMock) {
        expect(Object.keys(data.stateChanges)).toEqual(['NH','NY','NJ','MA']);
      } else {
        expect(Object.keys(data.stateChanges)).toEqual(["NH", "NY", "NJ", "MA", "CT", "VT", "RI", "ME"]);
      }
    });

    it('should aggregate the emissions for NH', () => {
      if(usingMock) {
        expect(data.stateChanges.NH).toBe(0.05833865343725364);
      } else {
        expect(data.stateChanges.NH).toBe(-563.8124004921106);
      }
    });

    // describe('StateEmissions class', () => {
    //   it('should use the StateEmissions class', () => {
    //     expect(engine.stateEmissions.constructor.name).toBe('StateEmissions');
    //   });
    //
    //   it('should be able to aggregate emissions by state', () => {
    //     if(usingMock) {
    //       expect(Object.keys(engine.stateEmissions.generation)).toEqual(['NH','NY','NJ','MA']);
    //     }
    //   });
    //
    //   it('should aggregate the emissions for NH', () => {
    //     if(usingMock) {
    //       expect(engine.stateEmissions.generation.NH).toBe(0.05833865343725364);
    //     } else {
    //       expect(engine.stateEmissions.generation.NH).toBe(-563.8124004921106);
    //     }
    //   });
    //
    //   it('should export states', () => {
    //     expect(engine.stateEmissions.export()).toEqual(["NH", "NY", "NJ", "MA"]);
    //   })
    // });
  });
});
//
// describe('MonthlyEmissions class', () => {
//   let usingMock = true;
//
//   let rdf = new Rdf({rdf: northeast_rdf, defaults: northeast_defaults});
//   let profile = new EereProfile();
//   profile.limits = {constantReductions: 5, renewables: 10};
//   profile.windCapacity = 7;
//   let eere = new EereEngine(profile, rdf);
//   eere.calculateEereLoad();
//   let engine2 = new AnnualDisplacementEngine(rdf, eere.hourlyEere);
//   let data2;
//
//   it('should run', () => {
//     data2 = engine2.getDisplacedGeneration(engine2.rdf.raw.data.generation, false, 'generation');
//   });
//
//   it('should contain monthly emission changes', () => {
//     expect(Object.keys(engine2.monthlyEmissions.generation)).toContain('emissions');
//   });
//
//   it('should contain monthly percent changes', () => {
//     expect(Object.keys(engine2.monthlyEmissions.generation)).toContain('percentages');
//   });
//
//   describe('Monthly Changes - Emissions', () => {
//     describe('Region level monthly emissions', () => {
//       it('should contain regional data', () => {
//         expect(Object.keys(engine2.monthlyEmissions.generation.emissions)).toContain('region');
//       });
//
//       it('should extract every month if using actual NE data', () => {
//         if (!usingMock) {
//           expect(Object.keys(engine2.monthlyEmissions.generation.emissions.region)).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']);
//         }
//       });
//
//       it('should extract only the first month if using mock NE data', () => {
//         if (usingMock) {
//           expect(Object.keys(engine2.monthlyEmissions.generation.emissions.region)).toEqual(['1']);
//         }
//       });
//
//       it('should have have January generation emission value of -0.25033370701134317 when using mock NE data', () => {
//         if (usingMock) {
//           // console.log('............','Engine Count',engine2.count);
//           // console.log('............','Separate Count',engine2.monthlyEmissions.count);
//           expect(engine2.monthlyEmissions.generation.emissions.region[1]).toBe(-0.25033370701134317);
//         }
//       });
//     });
//
//     describe('State level monthly emissions', () => {
//       it('should contain each state with data', () => {
//         expect(Object.keys(engine2.monthlyEmissions.generation.emissions.state)).toContain('NY');
//       });
//
//       it('should extract every month if using actual NE data', () => {
//         if (!usingMock) {
//           expect(Object.keys(engine2.monthlyEmissions.generation.emissions.state.NY))
//             .toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']);
//         }
//       });
//
//       it('should contain january for each state', () => {
//         expect(Object.keys(engine2.monthlyEmissions.generation.emissions.state.NY)).toContain("1");
//       });
//
//       it('should aggregate state data into months', () => {
//         if (usingMock) {
//           expect(engine2.monthlyEmissions.generation.emissions.state.NY[1]).toBe(-0.29548786970313756);
//         } else {
//           expect(engine2.monthlyEmissions.generation.emissions.state.NY[1]).toBe(-854.9121809831477);
//         }
//       });
//     });
//
//     describe('County level monthly emissions', () => {
//       it('should index counties by state', () => {
//         expect(Object.keys(engine2.monthlyEmissions.generation.emissions.county)).toContain('NY');
//       });
//
//       it('should have every county in the state with data', () => {
//         expect(Object.keys(engine2.monthlyEmissions.generation.emissions.county['NY'])).toContain('Albany');
//       });
//
//       it('should contain every month', () => {
//         expect(Object.keys(engine2.monthlyEmissions.generation.emissions.county.NY.Albany)).toContain('1');
//       });
//
//       it('should aggregate avoided emissions into each month', () => {
//         if(usingMock) {
//           expect(engine2.monthlyEmissions.generation.emissions.county.NY.Albany[1]).toBe(-0.18776868948081926);
//           // console.log('...............',engine2.monthlyEmissions.generation);
//         } else {
//           expect(engine2.monthlyEmissions.generation.emissions.county.NY.Albany[1]).toBe(-20.200556652153903);
//         }
//       });
//     });
//   });
// });