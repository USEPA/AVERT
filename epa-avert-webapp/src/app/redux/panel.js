// action types
import { REQUEST_REGION_RDF, RECEIVE_REGION_DEFAULTS } from 'app/redux/rdfs';
import { SUBMIT_EERE_CALCULATION, COMPLETE_EERE_CALCULATION } from 'app/redux/eere'; // prettier-ignore
import { COMPLETE_MONTHLY_EMISSIONS } from 'app/redux/monthlyEmissions';
import { INCREMENT_PROGRESS, START_DISPLACEMENT, RECEIVE_DISPLACEMENT } from 'app/redux/annualDisplacement'; // prettier-ignore
export const CHANGE_ACTIVE_STEP = 'panel/CHANGE_ACTIVE_STEP';
export const TOGGLE_MODAL_OVERLAY = 'panel/TOGGLE_MODAL_OVERLAY';
export const STORE_ACTIVE_MODAL = 'panel/STORE_ACTIVE_MODAL';
export const RESET_ACTIVE_MODAL = 'panel/RESET_ACTIVE_MODAL';

// reducer
const initialState = {
  activeStep: 1,
  loading: false,
  loadingProgress: 0,
  modalOverlay: false,
  activeModalId: 0,
  closingModalId: 0,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case INCREMENT_PROGRESS:
      return {
        ...state,
        loadingProgress: ++state.loadingProgress,
      };

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

    case REQUEST_REGION_RDF:
    case SUBMIT_EERE_CALCULATION:
    case START_DISPLACEMENT:
      return {
        ...state,
        loading: true,
        loadingProgress: 0,
      };

    case RECEIVE_REGION_DEFAULTS:
    case COMPLETE_EERE_CALCULATION:
    case RECEIVE_DISPLACEMENT:
    case COMPLETE_MONTHLY_EMISSIONS:
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
}

// action creators
export const setActiveStep = (stepNumber) => ({
  type: CHANGE_ACTIVE_STEP,
  payload: {
    stepNumber: stepNumber,
  },
});

export const toggleModalOverlay = () => ({
  type: TOGGLE_MODAL_OVERLAY,
});

export const storeActiveModal = (modalId) => ({
  type: STORE_ACTIVE_MODAL,
  activeModalId: modalId,
});

export const resetActiveModal = (modalId) => ({
  type: RESET_ACTIVE_MODAL,
  activeModalId: modalId,
});
