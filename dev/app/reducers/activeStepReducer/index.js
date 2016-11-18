// action types
import { CHANGE_ACTIVE_STEP } from '../../actions';

const activeStepReducer = (state = 1, action) => {
  switch(action.type) {
    case CHANGE_ACTIVE_STEP:
      return action.payload.stepNumber;
    default:
      return state;
  }
};

export default activeStepReducer;
