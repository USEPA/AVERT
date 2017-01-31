import fetch from 'isomorphic-fetch';
import math from 'mathjs';
import {avert} from '../../avert';
import {incrementProgress} from '../../actions';

const REQUEST_NOX = 'avert/generation/REQUEST_NOX';
const RECEIVE_NOX = 'avert/generation/RECEIVE_NOX';
const INVALIDATE_NOX = 'avert/generation/INVALIDATE_NOX';

export const initialState = {
  isFetching: false,
  didInvalidate: false,
  data: {},
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case INVALIDATE_NOX:
      return {
        ...state,
        didInvalidate: true,
        data: {}
      };

    case REQUEST_NOX:
      return {
        ...state,
        isFetching: true,
      };

    case RECEIVE_NOX:
      return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        data: action.json.data,
      };

    default:
      return state;
  }
}

export const getIsFetching = (state) => state.nox.isFetching;
export const getDidInvalidate = (state) => state.nox.didInvalidate;
export const getNoxData = (state) => state.nox.data;
export const getNoxRate = (state) => {
  const original = math.round(math.divide(state.nox.data.original, state.generation.data.original), 2);
  const post = math.round(math.divide(state.nox.data.post, state.generation.data.post), 2);
  return {
    original,
    post
  }
};

export function invalidateNox () {
  return {
    type: INVALIDATE_NOX,
  }
}

export function requestNox () {
  return {
    type: REQUEST_NOX,
  }
}

export function receiveNox (json) {
  return dispatch => {
    dispatch(incrementProgress());
    return dispatch({
      type: RECEIVE_NOX,
      json
    })
  }
}

function fetchNox (url,region,eere) {
  return dispatch => {
    dispatch(requestNox());

    const options = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      // body: JSON.stringify({rdf: avert.rdfClass.toJsonString(), eere: avert.hourlyEere}),
      body: JSON.stringify({rdf: avert.rdfClass.toJsonString(), region: region, eere: avert.hourlyEere}),
      // body: JSON.stringify({region: region, eere: eere}),
    };

    return fetch(`${url}/api/v1/nox`, options)
      .then(response => response.json())
      .then(json => dispatch(receiveNox(json)));
  }
}

function shouldFetchNox (dispatch, getState) {
  return true;
}

export function fetchNoxIfNeeded () {
  return (dispatch, getState) => {
    const {api, rdfs, eere} = getState();

    if (shouldFetchNox(dispatch, getState)) {
      return dispatch(fetchNox(api.baseUrl,rdfs.rdf,eere.hourlyEere))
    }
  }
}