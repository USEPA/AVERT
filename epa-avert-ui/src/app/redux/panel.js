// actions
const CHANGE_ACTIVE_STEP = 'avert/panel/CHANGE_ACTIVE_STEP';
const TOGGLE_MODAL_OVERLAY = 'avert/panel/TOGGLE_MODAL_OVERLAY';
const STORE_ACTIVE_MODAL = 'avert/panel/STORE_ACTIVE_MODAL';
const RESET_ACTIVE_MODAL = 'avert/panel/RESET_ACTIVE_MODAL';

import {
  INCREMENT_PROGRESS,
  REQUEST_REGION_RDF,
  RECEIVE_REGION_DEFAULTS,
} from 'app/actions';

// --- todo: define here, or import ---
import {
  SUBMIT_CALCULATION,
  START_DISPLACEMENT,
  RECEIVE_DISPLACEMENT,
  COMPLETE_CALCULATION,
  COMPLETE_MONTHLY,
} from 'app/actions';

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
    case SUBMIT_CALCULATION:
    case START_DISPLACEMENT:
      return {
        ...state,
        loading: true,
        loadingProgress: 0,
      };

    case RECEIVE_DISPLACEMENT:
    case RECEIVE_REGION_DEFAULTS:
    case COMPLETE_CALCULATION:
    case COMPLETE_MONTHLY:
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
}

// action creators
export function setActiveStep(number) {
  return {
    type: CHANGE_ACTIVE_STEP,
    payload: {
      stepNumber: number,
    },
  };
}

export function toggleModalOverlay() {
  return {
    type: TOGGLE_MODAL_OVERLAY,
  };
}

export function storeActiveModal(activeModalId) {
  return {
    type: STORE_ACTIVE_MODAL,
    activeModalId,
  };
}

export function resetActiveModal(activeModalId) {
  return {
    type: RESET_ACTIVE_MODAL,
    activeModalId,
  };
}