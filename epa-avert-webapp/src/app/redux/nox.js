// engines
import { avert } from 'app/engines';
// action creators
import { incrementProgress } from 'app/redux/annualDisplacement';

// action types
export const REQUEST_NOX = 'nox/REQUEST_NOX';
export const RECEIVE_NOX = 'nox/RECEIVE_NOX';
export const RECEIVE_ERROR = 'nox/RECEIVE_ERROR';
export const RECEIVE_JOB_ID = 'nox/RECEIVE_JOB_ID';
export const POLL_SERVER_FOR_DATA = 'nox/POLL_SERVER_FOR_DATA';

// reducer
const initialState = {
  isFetching: false,
  jobId: 0,
  data: {},
  error: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_NOX:
      return {
        ...state,
        isFetching: true,
        data: initialState.data,
        error: initialState.error,
      };

    case RECEIVE_NOX:
      return {
        ...state,
        isFetching: false,
        data: action.json.data,
      };

    case RECEIVE_ERROR:
      return {
        ...state,
        isFetching: false,
        error: true,
      };

    case RECEIVE_JOB_ID:
      return {
        ...state,
        jobId: action.jobId,
      };

    default:
      return state;
  }
}

// action creators
export const pollServerForData = () => {
  return (dispatch, getState) => {
    const { api, nox } = getState();

    dispatch({
      type: POLL_SERVER_FOR_DATA,
      jobId: nox.jobId,
    });

    const headers = new Headers();
    headers.append('pragma', 'no-cache');
    headers.append('cache-control', 'no-cache');

    // fetch nox data via job id
    return fetch(`${api.baseUrl}/api/v1/jobs/${nox.jobId}`, {
      headers: headers,
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.response === 'error') {
          dispatch({ type: RECEIVE_ERROR });
        }

        if (json.response === 'processing') {
          return setTimeout(
            () => dispatch(pollServerForData()),
            api.pollingFrequency,
          );
        }

        if (json.response === 'ok') {
          dispatch(incrementProgress());
          dispatch({
            type: RECEIVE_NOX,
            json: json,
          });
        }
      });
  };
};

export const fetchNox = () => {
  return (dispatch, getState) => {
    const { api } = getState();

    dispatch({ type: REQUEST_NOX });

    // post nox data for region and receive a job id
    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        region: avert.regionSlug,
        eere: avert.eereLoad.hourlyEere,
      }),
    };
    return fetch(`${api.baseUrl}/api/v1/nox`, options)
      .then((response) => response.json())
      .then((json) => {
        dispatch({
          type: RECEIVE_JOB_ID,
          jobId: json.jobId,
        });
        dispatch(pollServerForData());
      });
  };
};
