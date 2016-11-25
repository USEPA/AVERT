// action types
import {
  SELECT_REGION,
  START_DISPLACEMENT,
  COMPLETE_ANNUAL,
} from '../../actions';

const resultsFormat = {
  original: '',
  post: '',
  impact: '',
};

const defaultState = {
  status: "select_region",
  results: {
    generation: resultsFormat,
    totalEmissions: {
      so2: resultsFormat,
      nox: resultsFormat,
      co2: resultsFormat
    },
    emissionRates: {
      so2: resultsFormat,
      nox: resultsFormat,
      co2: resultsFormat
    },
  },
};

const annualDisplacementReducer = (state = defaultState, action) => {
  switch (action.type) {
    case SELECT_REGION:
      return {
        ...state,
        status: "ready",
      };

    case START_DISPLACEMENT:
      return {
        ...state,
        status: "started",
      };

    case COMPLETE_ANNUAL:
      return {
        ...state,
        status: "complete",
        results: action.data,
      };

    default:
      return state;
  }
};

export default annualDisplacementReducer;
