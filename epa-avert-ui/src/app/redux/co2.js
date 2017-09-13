import fetch from 'isomorphic-fetch';
import math from 'mathjs';

import { avert } from 'app/avert';
import { incrementProgress } from 'app/actions';

// actions
const REQUEST_CO2 = 'avert/co2/REQUEST_CO2';
const RECEIVE_CO2 = 'avert/co2/RECEIVE_CO2';
const RECEIVE_JOB_ID = 'avert/co2/RECEIVE_JOB_ID';
const POLL_SERVER_FOR_DATA = 'avert/co2/POLL_SERVER_FOR_DATA';

// reducer
export const initialState = {
  isFetching: false,
  jobId: 0,
  data: {},
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_CO2:
      return {
        ...state,
        isFetching: true,
      };

    case RECEIVE_CO2:
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
export function requestCo2() {
  return {
    type: REQUEST_CO2,
  };
}

export function receiveCo2(json) {
  return (dispatch) => {
    dispatch(incrementProgress());

    return dispatch({
      type: RECEIVE_CO2,
      json,
    });
  };
}

export function pollServerForData(json) {
  return (dispatch, getState) => {
    const { api, co2 } = getState();

    dispatch({
      type: POLL_SERVER_FOR_DATA,
      jobId: co2.jobId,
      json,
    });

    return fetch(`${api.baseUrl}/api/v1/jobs/${co2.jobId}`)
      .then(response => response.json())
      .then(json => {
        if (json.response === 'in progress') {
          return setTimeout(() => dispatch(pollServerForData(json)), api.pollingFrequency)
        }

        return dispatch(receiveCo2(json));
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

export function fetchCo2() {
  return (dispatch, getState) => {
    const { api } = getState();

    dispatch(requestCo2());

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

    return fetch(`${api.baseUrl}/api/v1/co2`, options)
      .then(response => response.json())
      .then(json => dispatch(receiveJobId(json)))
      .then(action => dispatch(pollServerForData()));
  };
}

// other
export const getCo2Data = (state) => state.co2.data;
export const getCo2Rate = (state) => ({
  original: math.round(
    math.divide(
      state.co2.data.original,
      state.generation.data.original
    ),
  2),
  post: math.round(
    math.divide(
      state.co2.data.post,
      state.generation.data.post
    ),
  2),
});