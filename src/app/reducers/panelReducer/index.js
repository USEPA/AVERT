// action types
import {
  CHANGE_ACTIVE_STEP,
  SELECT_REGION,
  COMPLETE_CALCULATION,
  UPDATE_EXCEEDANCES,
} from '../../actions';

const defaultState = {
  activeStep: 1,
  nextDisabled: true,
  regionScreen: true,
  eereScreen: false,
  resultsScreen: false,
};

const panelReducer = (state = defaultState, action) => {
  switch (action.type) {
    case CHANGE_ACTIVE_STEP:
      //TODO: determine if nextDisabled should be true to handle users navigating backwards
      return {
        ...state,
        activeStep: action.payload.stepNumber,
        nextDisabled: true,
      };

    case SELECT_REGION:
      return {
        ...state,
        nextDisabled: false,
        eereScreen: true,
      };

    case COMPLETE_CALCULATION:
      return {
        ...state,
        nextDisabled: false,
        resultsScreen: true,
      };

    // case UPDATE_EXCEEDANCES:
    //   return {
    //     ...state,
    //     nextDisabled: true,
    //     resultsScreen: false,
    //   };

    default:
      return state;
  }
};

export default panelReducer;
