// actions
import {
  SELECT_REGION,
  START_DISPLACEMENT,
  COMPLETE_STATE_EMISSIONS,
} from 'app/actions';

// reducer
const initialState = {
  status: 'select_region',
  results: {
    states: [],
    data: [],
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

    case COMPLETE_STATE_EMISSIONS:
      return {
        ...state,
        status: 'complete',
        results: action.data,
      };

    default:
      return state;
  }
}
