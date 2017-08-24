// action types
import {
  CHANGE_ACTIVE_STEP,
  TOGGLE_MODAL_OVERLAY,
  STORE_ACTIVE_MODAL,
  RESET_ACTIVE_MODAL,
  // REQUEST_DEFAULTS,
  RECEIVE_DEFAULTS,
  REQUEST_REGION,
  // RECEIVE_REGION,
  SUBMIT_CALCULATION,
  COMPLETE_CALCULATION,
  START_DISPLACEMENT,
  COMPLETE_MONTHLY,
  // COMPLETE_ANNUAL,
  INVALIDATE_DISPLACEMENT,
  REQUEST_DISPLACEMENT,
  RECEIVE_DISPLACEMENT,
  COMPLETE_ANNUAL_GENERATION,
  COMPLETE_ANNUAL_SO2,
  COMPLETE_ANNUAL_NOX,
  COMPLETE_ANNUAL_CO2,
  COMPLETE_ANNUAL_RATES,
  INCREMENT_PROGRESS
} from '../../actions';

const defaultState = {
  activeStep: 1,
  loading: false,
  modalOverlay: false,
  activeModalId: 0,
  closingModalId: 0,
  percentComplete: 0,
};

const panelReducer = (state = defaultState, action) => {
  switch (action.type) {
    case CHANGE_ACTIVE_STEP:
      return {
        ...state,
        activeStep: action.payload.stepNumber,
      };

    case TOGGLE_MODAL_OVERLAY:
      return {
        ...state,
        modalOverlay: !state.modalOverlay,
      };

    case STORE_ACTIVE_MODAL:
      return {
        ...state,
        activeModalId: action.activeModalId,
        closingModalId: 0,
      };

    case RESET_ACTIVE_MODAL:
      return {
        ...state,
        activeModalId: 0,
        closingModalId: action.activeModalId,
      };

    case INCREMENT_PROGRESS:
      return {
        ...state,
        percentComplete: ++state.percentComplete
      };

    case REQUEST_REGION:
    case SUBMIT_CALCULATION:
    case START_DISPLACEMENT:
      return {
        ...state,
        loading: true,
        percentComplete: 0,
      };

    case INVALIDATE_DISPLACEMENT:
      return state;

    case REQUEST_DISPLACEMENT:
      return state;

    case RECEIVE_DISPLACEMENT:
      return {
        ...state,
        loading: false,
      };

    case RECEIVE_DEFAULTS:
    // case RECEIVE_REGION:
    case COMPLETE_CALCULATION:
    case COMPLETE_MONTHLY:
    // case COMPLETE_ANNUAL:
      return {
        ...state,
        loading: false,
      };

    case COMPLETE_ANNUAL_GENERATION:
      return {
        ...state,
      };

    case COMPLETE_ANNUAL_SO2:
      return {
        ...state,
      };

    case COMPLETE_ANNUAL_NOX:
      return {
        ...state,
      };

    case COMPLETE_ANNUAL_CO2:
      return {
        ...state,
      };

    case COMPLETE_ANNUAL_RATES:
      return {
        ...state,
      };


    default:
      return state;
  }
};

export default panelReducer;
