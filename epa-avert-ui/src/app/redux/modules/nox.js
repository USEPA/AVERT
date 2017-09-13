import fetch from 'isomorphic-fetch';
import math from 'mathjs';

import { avert } from 'app/avert';
import { incrementProgress } from 'app/actions';

// actions
const REQUEST_NOX = 'avert/nox/REQUEST_NOX';
const RECEIVE_NOX = 'avert/nox/RECEIVE_NOX';
const RECEIVE_JOB_ID = 'avert/nox/RECEIVE_JOB_ID';
const POLL_SERVER_FOR_DATA = 'avert/nox/POLL_SERVER_FOR_DATA';

// reducer
export const initialState = {
  isFetching: false,
  jobId: 0,
  data: {},
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_NOX:
      return {
        ...state,
        isFetching: true,
      };

    case RECEIVE_NOX:
      return {
        ...state,
        isFetching: false,
        data: action.json.data,
      };

    case RECEIVE_JOB_ID:
      return {
        ...state,
        jobId: action.json.job,
      };

    default:
      return state;
  }
}

// action creators
export function requestNox() {
  return {
    type: REQUEST_NOX,
  };
}

export function receiveNox(json) {
  return (dispatch) => {
    dispatch(incrementProgress());

    return dispatch({
      type: RECEIVE_NOX,
      json,
    });
  };
}

export function pollServerForData(json) {
  return (dispatch, getState) => {
    const { api, nox } = getState();

    dispatch({
      type: POLL_SERVER_FOR_DATA,
      jobId: nox.jobId,
      json,
    });

    return fetch(`${api.baseUrl}/api/v1/jobs/${nox.jobId}`)
      .then(response => response.json())
      .then(json => {
        if (json.response === 'in progress') {
          return setTimeout(() => dispatch(pollServerForData(json)), api.pollingFrequency)
        }

        return dispatch(receiveNox(json));
      });
  };
}

export function receiveJobId(json) {
  return (dispatch) => {
    return dispatch({
      type: RECEIVE_JOB_ID,
      json,
    });
  };
}

export function fetchNox () {
  return (dispatch, getState) => {
    const { api } = getState();

    dispatch(requestNox());

    const options = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      body: JSON.stringify({
        region: avert.regionData.slug,
        eere: avert.hourlyEere
      }),
    };

    return fetch(`${api.baseUrl}/api/v1/nox`, options)
      .then(response => response.json())
      .then(json => dispatch(receiveJobId(json)))
      .then(action => dispatch(pollServerForData()));
  };
}

// other
export const getNoxData = (state) => state.nox.data;
export const getNoxRate = (state) => ({
  original: math.round(
    math.divide(
      state.nox.data.original,
      state.generation.data.original
    ),
  2),
  post: math.round(
    math.divide(
      state.nox.data.post,
      state.generation.data.post
    ),
  2),
});