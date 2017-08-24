// action creators
import {
  ADD_RDF,
  RECEIVE_REGION,
  INVALIDATE_REGION,
  REQUEST_REGION,
  RECEIVE_DEFAULTS,
  INVALIDATE_DEFAULTS,
  REQUEST_DEFAULTS,
  OVERRIDE_REGION,
} from '../../actions';

const rdf = (state = {}, action) => {
  switch (action.type) {
    case ADD_RDF:
      return {
        id: action.id,
        text: action.text,
      };

    default:
      return state;
  }
};

const rdfs = (state = {
  defaults: false,
  rdf: false,
  debug: false,
}, action) => {
  switch (action.type) {
    case INVALIDATE_DEFAULTS:
      return state;
    case REQUEST_DEFAULTS:
      return state;
    case RECEIVE_DEFAULTS:
      return {
        ...state,
        defaults: action.payload.defaults,
      };
    case INVALIDATE_REGION:
      return state;
    case REQUEST_REGION:
      return state;
    case RECEIVE_REGION:
      return {
        ...state,
        rdf: action.payload.rdf,
      };
    case ADD_RDF:
      return [
        ...state,
        rdf(undefined, action),
      ];

    case OVERRIDE_REGION:
      return {
        ...state,
        debug: true,
      };

    default:
      return state;
  }
};

export default rdfs;
