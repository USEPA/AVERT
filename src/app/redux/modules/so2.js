import fetch from 'isomorphic-fetch';
import math from 'mathjs';
import {avert} from '../../avert';
import {incrementProgress} from '../../actions';

const REQUEST_SO2 = 'avert/generation/REQUEST_SO2';
const RECEIVE_SO2 = 'avert/generation/RECEIVE_SO2';
const INVALIDATE_SO2 = 'avert/generation/INVALIDATE_SO2';

export const initialState = {
  isFetching: false,
  didInvalidate: false,
  data: {},
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case INVALIDATE_SO2:
      return {
        ...state,
        didInvalidate: true,
        data: {}
      };

    case REQUEST_SO2:
      return {
        ...state,
        isFetching: true,
      };

    case RECEIVE_SO2:
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

export const getIsFetching = (state) => state.so2.isFetching;
export const getDidInvalidate = (state) => state.so2.didInvalidate;
export const getSo2Data = (state) => state.so2.data;
export const getSo2Rate = (state) => {
  const original = math.round(math.divide(state.so2.data.original, state.generation.data.original), 2);
  const post = math.round(math.divide(state.so2.data.post, state.generation.data.post), 2);
  return {
    original,
    post
  }
};


export function invalidateSo2 () {
  return {
    type: INVALIDATE_SO2,
  }
}

export function requestSo2 () {
  return {
    type: REQUEST_SO2,
  }
}

export function receiveSo2 (json) {
  return dispatch => {
    dispatch(incrementProgress());
    return dispatch({
      type: RECEIVE_SO2,
      json
    });
  }
}

function fetchSo2 (url,region,eere) {
  return dispatch => {
    dispatch(requestSo2());

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

    return fetch(`${url}/api/v1/so2`, options)
      .then(response => response.json())
      .then(json => dispatch(receiveSo2(json)))
      ;
  }
}

function shouldFetchSo2 (dispatch, getState) {
  return true;
}

export function fetchSo2IfNeeded () {
  return (dispatch, getState) => {
    const {api, rdfs, eere} = getState();

    if (shouldFetchSo2(dispatch, getState)) {
      return dispatch(fetchSo2(api.baseUrl,rdfs.rdf,eere.hourlyEere))
    }
  }
}