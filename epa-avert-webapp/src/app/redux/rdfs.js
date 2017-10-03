// actions
import {
  RECEIVE_REGION_RDF,
  RECEIVE_REGION_DEFAULTS,
} from 'app/actions';

// reducer
const initialState = {
  defaults: false,
  rdf: false,
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case RECEIVE_REGION_RDF:
      return {
        ...state,
        rdf: action.payload.rdf,
      };

    case RECEIVE_REGION_DEFAULTS:
      return {
        ...state,
        defaults: action.payload.defaults,
      };

    default:
      return state;
  }
};

// action creators (none)
