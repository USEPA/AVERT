import stateEmissionsReducer from '../../../app/reducers/stateEmissionsReducer';
import * as types from '../../../app/actions';

describe('stateEmissionsReducer', () => {
  it('should return an initial state', () => {
    expect(stateEmissionsReducer(undefined, {})).toEqual({results: [], status: 'select_region'});
  });

  it('should handle COMPLETE_STATE', () => {
    expect(stateEmissionsReducer([], {type: types.COMPLETE_STATE, data: 'Foo'}))
      .toEqual({results: "Foo", status: "complete"})
  });
});