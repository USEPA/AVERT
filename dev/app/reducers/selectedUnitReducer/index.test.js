import { fromJS } from 'immutable';
// reducers
import selectedUnitReducer from '../selectedUnitReducer';
// action types
import { CHANGE_SELECTED_UNIT } from '../../actions';

describe('selectedUnitReducer', () => {
  it('should return the initial state', () => {
    expect(
      selectedUnitReducer(undefined, {})
    ).toEqual(fromJS('Emission changes'));
  });

  it('should react to an action with the type CHANGE_SELECTED_UNIT', () => {
    expect(
      selectedUnitReducer(undefined, {
        type: CHANGE_SELECTED_UNIT,
        payload: {
          unitType: 'Percent change'
        }
      })
    ).toEqual(fromJS('Percent change'));
  });
})
