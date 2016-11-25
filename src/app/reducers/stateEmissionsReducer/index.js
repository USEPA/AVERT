// action types
import {
  SELECT_REGION,
  START_DISPLACEMENT,
  COMPLETE_STATE,
  FOO_COMPLETE_STATE,
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

    case FOO_COMPLETE_STATE:
      console.warn('FOO_COMPLETE_STATE', action);

      return {
        ...state,
        state: "complete",
        results: action.data,
      };

    default:
      return state;
  }
};

export default stateEmissionsReducer;
