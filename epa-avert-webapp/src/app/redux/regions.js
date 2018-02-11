// engine
import { avert } from 'app/actions';

// action types
export const SELECT_REGION = 'regions/SELECT_REGION';

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

// action creators
export const selectRegion = (regionId) => {
  return (dispatch) => {
    avert.region = regionId;

    dispatch({
      type: SELECT_REGION,
      region: regionId,
    });
  };
};
