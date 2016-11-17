import { fromJS } from 'immutable';
// reducers
import selectedRegionReducer from '../selectedRegionReducer';
// action types
import { CHANGE_SELECTED_REGION } from '../../actions';

describe('selectedRegionReducer', () => {
  it('should return the initial state', () => {
    expect(
      selectedRegionReducer(undefined, {})
    ).toEqual(fromJS(''));
  });

  it('should react to an action with the type CHANGE_SELECTED_REGION', () => {
    expect(
      selectedRegionReducer(undefined, {
        type: CHANGE_SELECTED_REGION,
        payload: {
          regionName: 'California'
        }
      })
    ).toEqual(fromJS('California'));
  });
})
