import StateEmissionsEngine from '../../../app/avert/engines/StateEmissionsEngine';

describe('StateEmissionsEngine', () => {

  const engine = new StateEmissionsEngine();
  const annualData = {
    totalEmissions: {
      so2: { stateChanges: {}},
      nox: { stateChanges: {}},
      co2: { stateChanges: {}},
    }
  };

  beforeEach(() => {
    annualData.totalEmissions.so2.stateChanges = {};
    annualData.totalEmissions.nox.stateChanges = {};
    annualData.totalEmissions.co2.stateChanges = {};
  });

  it('should extract states from annual data', () => {
    annualData.totalEmissions.so2.stateChanges = {A: 0, B: 0, C: 0};

    const data = engine.extract(annualData);
    expect(data.states).toEqual(['A','B','C']);
  });

  it('should extract emissions for each state from annual data', () => {
    const exampleData = {A: 1, B: 2, C: 3};
    annualData.totalEmissions.so2.stateChanges = exampleData;
    annualData.totalEmissions.nox.stateChanges = exampleData;
    annualData.totalEmissions.co2.stateChanges = exampleData;

    const data = engine.extract(annualData);

    expect(data.data).toEqual([
      {state: 'A', so2: 1, nox: 1, co2: 1},
      {state: 'B', so2: 2, nox: 2, co2: 2},
      {state: 'C', so2: 3, nox: 3, co2: 3},
    ]);
  });

  it('should sort states alphabetically', () => {
    annualData.totalEmissions.so2.stateChanges = {Z: 0, B: 0, W: 0,  D: 0, };
    const data = engine.extract(annualData);
    expect(data.states).toEqual(['B','D','W','Z']);
  });

  it('should sort data alphabetically by the states attribute', () => {
    const exampleData = {Z: 1, B: 2, W: 3, D: 4};
    annualData.totalEmissions.so2.stateChanges = exampleData;
    annualData.totalEmissions.nox.stateChanges = exampleData;
    annualData.totalEmissions.co2.stateChanges = exampleData;

    const data = engine.extract(annualData);

    expect(data.data).toEqual([
      {state: 'B', so2: 2, nox: 2, co2: 2},
      {state: 'D', so2: 4, nox: 4, co2: 4},
      {state: 'W', so2: 3, nox: 3, co2: 3},
      {state: 'Z', so2: 1, nox: 1, co2: 1},
    ]);
  });
});