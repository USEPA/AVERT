// actions
import {
  SELECT_REGION,
  START_DISPLACEMENT,
  RECEIVE_DISPLACEMENT,
  COMPLETE_ANNUAL,
} from 'app/actions';

// reducer
const format = {
  original: '',
  post: '',
  impact: '',
};

const initialState = {
  status: 'select_region',
  results: {
    generation: format,
    totalEmissions: {
      so2: format,
      nox: format,
      co2: format
    },
    emissionRates: {
      so2: format,
      nox: format,
      co2: format
    },
  },
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SELECT_REGION:
      return {
        ...state,
        status: 'ready',
      };

    case START_DISPLACEMENT:
      return {
        ...state,
        status: 'started',
      };

    case RECEIVE_DISPLACEMENT:
    case COMPLETE_ANNUAL:
      return {
        ...state,
        status: 'complete',
        results: action.data,
      };

    default:
      return state;
  }
};
