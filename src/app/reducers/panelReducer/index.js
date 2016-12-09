// action types
import {
  CHANGE_ACTIVE_STEP,
  // REQUEST_DEFAULTS,
  // RECEIVE_DEFAULTS,
  REQUEST_REGION,
  RECEIVE_REGION,
  SUBMIT_CALCULATION,
  COMPLETE_CALCULATION,
  START_DISPLACEMENT,
  FOO_COMPLETE_MONTHLY,
} from '../../actions';

const defaultState = {
  activeStep: 1,
  loading: false,
};

const panelReducer = (state = defaultState, action) => {
  switch (action.type) {
    case CHANGE_ACTIVE_STEP:
      return {
        ...state,
        activeStep: action.payload.stepNumber,
      };

    case REQUEST_REGION:
    case SUBMIT_CALCULATION:
    case START_DISPLACEMENT:
      return {
        ...state,
        loading: true,
      };

    case RECEIVE_REGION:
    case COMPLETE_CALCULATION:
    case FOO_COMPLETE_MONTHLY:
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
};

export default panelReducer;
