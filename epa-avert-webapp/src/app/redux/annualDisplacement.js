// actions
import { SELECT_REGION } from 'app/redux/regions';

import {
  START_DISPLACEMENT,
  RECEIVE_DISPLACEMENT,
} from 'app/actions';

// reducer
const origPostImpact = {
  original: '',
  post: '',
  impact: '',
};

const origPost = {
  original: '',
  post: '',
};


const initialState = {
  status: 'select_region',
  results: {
    generation: origPostImpact,
    totalEmissions: {
      so2: origPostImpact,
      nox: origPostImpact,
      co2: origPostImpact,
      pm25: origPostImpact,
    },
    emissionRates: {
      so2: origPost,
      nox: origPost,
      co2: origPost,
      pm25: origPost,
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
      return {
        ...state,
        status: 'complete',
        results: action.data,
      };

    default:
      return state;
  }
};
