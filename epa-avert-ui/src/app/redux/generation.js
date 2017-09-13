import fetch from 'isomorphic-fetch';

import { avert } from 'app/avert';
import { incrementProgress } from 'app/actions';

// actions
const REQUEST_GENERATION = 'avert/generation/REQUEST_GENERATION';
const RECEIVE_GENERATION = 'avert/generation/RECEIVE_GENERATION';
const RECEIVE_JOB_ID = 'avert/generation/RECEIVE_JOB_ID';
const POLL_SERVER_FOR_DATA = 'avert/generation/POLL_SERVER_FOR_DATA';

// reducer
export const initialState = {
  isFetching: false,
  jobId: 0,
  data: {},
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_GENERATION:
      return {
        ...state,
        isFetching: true,
      };

    case RECEIVE_GENERATION:
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
export function requestGeneration() {
  return {
    type: REQUEST_GENERATION,
  };
}

export function receiveGeneration(json) {
  return (dispatch) => {
    dispatch(incrementProgress());

    return dispatch({
      type: RECEIVE_GENERATION,
      json: json,
    });
  };
}

export function pollServerForData(json) {
  return (dispatch, getState) => {
    const { api, generation } = getState();

    dispatch({
      type: POLL_SERVER_FOR_DATA,
      jobId: generation.jobId,
      json,
    });

    return fetch(`${api.baseUrl}/api/v1/jobs/${generation.jobId}`)
      .then(response => response.json())
      .then(json => {
        if (json.response === 'in progress') {
          return setTimeout(() => dispatch(pollServerForData(json)), api.pollingFrequency)
        }

        return dispatch(receiveGeneration(json));
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

// other
export function fetchGeneration() {
  return (dispatch, getState) => {
    const { api } = getState();

    dispatch(requestGeneration());

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

    return fetch(`${api.baseUrl}/api/v1/generation`, options)
      .then(response => response.json())
      .then(json => dispatch(receiveJobId(json)))
      .then(action => dispatch(pollServerForData()));
  };
}

export const getGenerationData = (state) => state.generation.data;