import fetch from 'isomorphic-fetch';
import math from 'mathjs';
import {avert} from '../../avert';
import {incrementProgress} from '../../actions';

const REQUEST_NOX = 'avert/nox/REQUEST_NOX';
const RECEIVE_NOX = 'avert/nox/RECEIVE_NOX';
const INVALIDATE_NOX = 'avert/nox/INVALIDATE_NOX';
const RECEIVE_JOB_ID = 'avert/nox/RECEIVE_JOB_ID';
const POLL_SERVER_FOR_DATA = 'avert/nox/POLL_SERVER_FOR_DATA';

export const initialState = {
  isFetching: false,
  didInvalidate: false,
  jobId: 0,
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

    case RECEIVE_JOB_ID:
      return {
        ...state,
        jobId: action.json.job
      }

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

export function pollServerForData(json) {
  return (dispatch,getState) => {
    const {api,nox} = getState();

    dispatch({
      type: POLL_SERVER_FOR_DATA,
      jobId: nox.jobId,
      json,
    });

    return fetch(`${api.baseUrl}/api/v1/jobs/${nox.jobId}`)
      .then(response => response.json())
      .then(json => {
        if(json.response === 'in progress') {
          return setTimeout(() => dispatch(pollServerForData(json)),30000)
        }

        return dispatch(receiveNox(json));
      });
  }
}

export function receiveJobId(json) {
  return dispatch => {
    return dispatch({
      type: RECEIVE_JOB_ID,
      json,
    });
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
      // .then(json => dispatch(receiveNox(json)));
      .then(json => dispatch(receiveJobId(json)))
      .then(action => dispatch(pollServerForData()))
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