import { fromJS } from 'immutable';
// reducers
import activeStepReducer from '../activeStepReducer';
// action types
import { CHANGE_ACTIVE_STEP } from '../../actions';

describe('activeStepReducer', () => {
  it('should return the initial state', () => {
    expect(
      activeStepReducer(undefined, {})
    ).toEqual(fromJS(1));
  });

  it('should react to an action with the type CHANGE_ACTIVE_STEP', () => {
    expect(
      activeStepReducer(undefined, {
        type: CHANGE_ACTIVE_STEP,
        payload: {
          stepNumber: 2
        }
      })
    ).toEqual(fromJS(2));
  });
})
