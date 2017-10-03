// actions
import { SELECT_REGION } from 'app/actions';

const UPDATE_YEAR = 'avert/regions/UPDATE_YEAR';

// reducer
const initialState = {
  region: 0,
  year: 2015,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SELECT_REGION:
      return {
        ...state,
        region: action.region,
      };

    case UPDATE_YEAR:
      return {
        ...state,
        year: action.year,
      };

    default:
      return state;
  }
}

// action creators (selectRegion function defined in 'app/actions')
export function updateYear(year) {
  return {
    type: UPDATE_YEAR,
    payload: {
      year: year,
    },
  };
}
