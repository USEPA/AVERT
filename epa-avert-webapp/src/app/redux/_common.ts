// -----------------------------------------------------------------------------
// initial state for pollutants (generation, so2, nox, co2, pm25) used in other reducers
// -----------------------------------------------------------------------------
const initialPollutantState = {
  isFetching: false,
  data: {
    original: 0,
    post: 0,
    impact: 0,
    monthlyChanges: {
      emissions: {
        region: {
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
          6: 0,
          7: 0,
          8: 0,
          9: 0,
          10: 0,
          11: 0,
          12: 0,
        },
        state: {},
        county: {},
      },
      percentages: {
        region: {
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
          6: 0,
          7: 0,
          8: 0,
          9: 0,
          10: 0,
          11: 0,
          12: 0,
        },
        state: {},
        county: {},
      },
    },
    stateChanges: {},
  },
  error: false,
};

export { initialPollutantState };
