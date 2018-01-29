// actions
import { SELECT_REGION } from 'app/actions';

// reducer
const initialState = {
  region: 0,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SELECT_REGION:
      return {
        ...state,
        region: action.region,
      };

    default:
      return state;
  }
}

// action creators (selectRegion function defined in 'app/actions')
