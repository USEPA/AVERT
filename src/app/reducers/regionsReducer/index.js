// action types
import {
  UPDATE_YEAR,
  SELECT_REGION,
} from '../../actions';

const initialState = {
  region: '',
  year: 2015,
};

const regionsReducer = (state = initialState, action) => {
  switch(action.type) {
    case SELECT_REGION:
      return {
        ...state,
        region: action.region
      };

    case UPDATE_YEAR:
      return {
        ...state,
        year: action.year
      };

    default:
      return state;
  }
};

export default regionsReducer;
