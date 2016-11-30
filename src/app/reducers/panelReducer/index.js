// action types
import {
  CHANGE_ACTIVE_STEP,
  SELECT_REGION,
  SUBMIT_CALCULATION,
  COMPLETE_CALCULATION,
  START_DISPLACEMENT,
  FOO_COMPLETE_MONTHLY,
  //UPDATE_EXCEEDANCES,
} from '../../actions';

const defaultState = {
  activeStep: 1,
  loading: false,
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

    case SUBMIT_CALCULATION:
      return {
        ...state,
        loading: true,
      };

    case COMPLETE_CALCULATION:
      return {
        ...state,
        loading: false,
        nextDisabled: false,
        resultsScreen: true,
      };

    case START_DISPLACEMENT:
      return {
        ...state,
        loading: true,
      };

    case FOO_COMPLETE_MONTHLY:
      return {
        ...state,
        loading: false,
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
