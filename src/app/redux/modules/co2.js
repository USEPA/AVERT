import fetch from 'isomorphic-fetch';
import math from 'mathjs';
import {avert} from '../../avert';
import {incrementProgress} from '../../actions';

const REQUEST_CO2 = 'avert/generation/REQUEST_CO2';
const RECEIVE_CO2 = 'avert/generation/RECEIVE_CO2';
const INVALIDATE_CO2 = 'avert/generation/INVALIDATE_CO2';

export const initialState = {
  isFetching: false,
  didInvalidate: false,
  data: {},
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case INVALIDATE_CO2:
      return {
        ...state,
        didInvalidate: true,
        data: {}
      };

    case REQUEST_CO2:
      return {
        ...state,
        isFetching: true,
      };

    case RECEIVE_CO2:
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

export const getIsFetching = (state) => state.co2.isFetching;
export const getDidInvalidate = (state) => state.co2.didInvalidate;
export const getCo2Data = (state) => state.co2.data;
export const getCo2Rate = (state) => {
  const original = math.round(math.divide(state.co2.data.original, state.generation.data.original), 2);
  const post = math.round(math.divide(state.co2.data.post, state.generation.data.post), 2);
  return {
    original,
    post
  }
};

export function invalidateCo2 () {
  return {
    type: INVALIDATE_CO2,
  }
}

export function requestCo2 () {
  return {
    type: REQUEST_CO2,
  }
}

export function receiveCo2 (json) {
  return dispatch => {
    dispatch(incrementProgress());
    return dispatch({
      type: RECEIVE_CO2,
      json
    });
  }
}

function fetchCo2 (url,region,eere) {
  return dispatch => {
    dispatch(requestCo2());

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

    return fetch(`${url}/api/v1/co2`, options)
      .then(response => response.json())
      .then(json => dispatch(receiveCo2(json)));
  }
}

function shouldFetchCo2 (dispatch, getState) {
  return true;
}

export function fetchCo2IfNeeded () {
  return (dispatch, getState) => {
    const {api, rdfs, eere} = getState();

    if (shouldFetchCo2(dispatch, getState)) {
      return dispatch(fetchCo2(api.baseUrl,rdfs.rdf,eere.hourlyEere))
    }
  }
}