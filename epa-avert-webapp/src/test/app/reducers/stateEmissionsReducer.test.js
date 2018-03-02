import stateEmissionsReducer, { COMPLETE_STATE_EMISSIONS } from 'app/redux/stateEmissions'; // prettier-ignore

describe('stateEmissionsReducer', () => {
  it('should return an initial state', () => {
    expect(stateEmissionsReducer(undefined, {})).toEqual({
      status: 'select_region',
      states: [],
      data: [],
    });
  });

  it('should handle COMPLETE_STATE_EMISSIONS', () => {
    expect(
      stateEmissionsReducer(undefined, {
        type: COMPLETE_STATE_EMISSIONS,
        states: ['Foo'],
        data: ['Bar'],
      }),
    ).toEqual({
      status: 'complete',
      states: ['Foo'],
      data: ['Bar'],
    });
  });
});
