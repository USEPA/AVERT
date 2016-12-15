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
  COMPLETE_MONTHLY,
  // COMPLETE_ANNUAL,
  COMPLETE_ANNUAL_GENERATION,
  COMPLETE_ANNUAL_SO2,
  COMPLETE_ANNUAL_NOX,
  COMPLETE_ANNUAL_CO2,
  COMPLETE_ANNUAL_RATES,
} from '../../actions';

const defaultState = {
  activeStep: 1,
  loading: false,
  percentComplete: 0,
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
        percentComplete: 0,
      };

    case RECEIVE_REGION:
    case COMPLETE_CALCULATION:
    case COMPLETE_MONTHLY:
    // case COMPLETE_ANNUAL:
      return {
        ...state,
        loading: false,
        percentComplete: 100,
      };

    case COMPLETE_ANNUAL_GENERATION:
      return {
        ...state,
        percentComplete: 20,
      };

    case COMPLETE_ANNUAL_SO2:
      return {
        ...state,
        percentComplete: 40,
      };

    case COMPLETE_ANNUAL_NOX:
      return {
        ...state,
        percentComplete: 60,
      };

    case COMPLETE_ANNUAL_CO2:
      return {
        ...state,
        percentComplete: 80,
      };

    case COMPLETE_ANNUAL_RATES:
      return {
        ...state,
        percentComplete: 85,
      };


    default:
      return state;
  }
};

export default panelReducer;
