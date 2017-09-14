// action types
import { SELECT_REGION } from 'app/actions';

import {
  START_DISPLACEMENT,
  COMPLETE_STATE,
} from '../../actions';

const defaultState = {
  status: "select_region",
  results: [],
};

const stateEmissionsReducer = (state = defaultState, action) => {
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

    case COMPLETE_STATE:
      return {
        ...state,
        status: "complete",
        results: action.data,
      };

    default:
      return state;
  }
};

export default stateEmissionsReducer;
