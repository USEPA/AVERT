import { fromJS } from 'immutable';
// reducers
import selectedAggregationReducer from '../selectedAggregationReducer';
// action types
import { CHANGE_SELECTED_AGGREGATION } from '../../actions';

describe('selectedAggregationReducer', () => {
  it('should return the initial state', () => {
    expect(
      selectedAggregationReducer(undefined, {})
    ).toEqual(fromJS('Region'));
  });

  it('should react to an action with the type CHANGE_SELECTED_AGGREGATION', () => {
    expect(
      selectedAggregationReducer(undefined, {
        type: CHANGE_SELECTED_AGGREGATION,
        payload: {
          aggregateLevel: 'State'
        }
      })
    ).toEqual(fromJS('State'));
  });
})
