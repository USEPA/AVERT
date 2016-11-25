// action creators
import { ADD_RDF } from '../../actions';

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
}

const rdfs = (state = [], action) => {
  switch (action.type) {
    case ADD_RDF:
      return [
        ...state,
        rdf(undefined, action),
      ];

    default:
      return state;
  }
}

export default rdfs;
