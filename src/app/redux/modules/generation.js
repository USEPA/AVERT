import fetch from 'isomorphic-fetch';
import {avert} from '../../avert';
import {incrementProgress} from '../../actions';
const REQUEST_GENERATION = 'avert/generation/REQUEST_GENERATION';
const RECEIVE_GENERATION = 'avert/generation/RECEIVE_GENERATION';
const INVALIDATE_GENERATION = 'avert/generation/INVALIDATE_GENERATION';

export const initialState = {
  isFetching: false,
  didInvalidate: false,
  data: {},
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case INVALIDATE_GENERATION:
      return {
        ...state,
        didInvalidate: true,
        data: {}
      };

    case REQUEST_GENERATION:
      return {
        ...state,
        isFetching: true,
      };

    case RECEIVE_GENERATION:
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

export const getIsFetching = (state) => state.generation.isFetching;
export const getDidInvalidate = (state) => state.generation.didInvalidate;
export const getGenerationData = (state) => state.generation.data;
export const getGenerationOriginal = (state) => state.generation.data.original;
export const getGenerationPost = (state) => state.generation.data.post;

export function invalidateGeneration () {
  return {
    type: INVALIDATE_GENERATION,
  }
}

export function requestGeneration () {
  return {
    type: REQUEST_GENERATION,
  }
}

export function receiveGeneration (json) {
  return dispatch => {
    dispatch(incrementProgress());
    return dispatch({
      type: RECEIVE_GENERATION,
      json
    })
  }
};

function fetchGeneration (url,region,eere) {
  return dispatch => {
    dispatch(requestGeneration());

    const options = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      body: JSON.stringify({rdf: avert.rdfClass.toJsonString(), region: region, eere: avert.hourlyEere}),
      // body: JSON.stringify({region: region, eere: eere}),
    };

    return fetch(`${url}/api/v1/generation`, options)
      .then(response => response.json())
      .then(json => dispatch(receiveGeneration(json)));
  }
}

function shouldFetchGeneration (dispatch, getState) {
  return true;
}

export function fetchGenerationIfNeeded () {
  return (dispatch, getState) => {
    const {api, rdfs, eere} = getState();

    if (shouldFetchGeneration(dispatch, getState)) {
      return dispatch(fetchGeneration(api.baseUrl,rdfs.rdf,eere.hourlyEere))
    }
  }
}