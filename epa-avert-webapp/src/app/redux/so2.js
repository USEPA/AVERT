// engines
import { avert } from 'app/engines';
// action creators
import { incrementProgress } from 'app/redux/annualDisplacement';

// action types
export const REQUEST_SO2 = 'so2/REQUEST_SO2';
export const RECEIVE_SO2 = 'so2/RECEIVE_SO2';
export const RECEIVE_JOB_ID = 'so2/RECEIVE_JOB_ID';
export const POLL_SERVER_FOR_DATA = 'so2/POLL_SERVER_FOR_DATA';

// reducer
const initialState = {
  isFetching: false,
  jobId: 0,
  data: {},
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_SO2:
      return {
        ...state,
        isFetching: true,
      };

    case RECEIVE_SO2:
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
export const pollServerForData = () => {
  return (dispatch, getState) => {
    const { api, so2 } = getState();

    dispatch({
      type: POLL_SERVER_FOR_DATA,
      jobId: so2.jobId,
    });

    // fetch so2 data via job id
    return fetch(`${api.baseUrl}/api/v1/jobs/${so2.jobId}`)
      .then(response => response.json())
      .then(json => {
        // recursively call function if response from server is 'in progress'
        if (json.response === 'in progress') {
          return setTimeout(() => dispatch(pollServerForData()), api.pollingFrequency)
        }
        dispatch(incrementProgress());
        dispatch({
          type: RECEIVE_SO2,
          json: json,
        });
      });
  };
};

export const fetchSo2 = () => {
  return (dispatch, getState) => {
    const { api } = getState();

    dispatch({ type: REQUEST_SO2 });

    // post so2 data for region and receive a job id
    const options = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      body: JSON.stringify({
        region: avert.regionSlug,
        eere: avert.eereLoad.hourlyEere
      }),
    };
    return fetch(`${api.baseUrl}/api/v1/so2`, options)
      .then(response => response.json())
      .then(json => {
        dispatch({
          type: RECEIVE_JOB_ID,
          json: json,
        });
        dispatch(pollServerForData());
      });
  };
};