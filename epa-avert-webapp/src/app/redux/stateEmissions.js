// action types
import { SELECT_REGION } from 'app/redux/regions';
import { START_DISPLACEMENT } from 'app/redux/annualDisplacement';
export const COMPLETE_STATE_EMISSIONS = 'stateEmissions/COMPLETE_STATE_EMISSIONS';

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

export const completeStateEmissions = (data) => ({
  type: COMPLETE_STATE_EMISSIONS,
  data: data,
});
