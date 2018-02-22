// engines
import { avert } from 'app/engines';
// action creators
import { incrementProgress } from 'app/redux/annualDisplacement';

// action types
export const REQUEST_NOX = 'nox/REQUEST_NOX';
export const RECEIVE_NOX = 'nox/RECEIVE_NOX';
export const RECEIVE_JOB_ID = 'nox/RECEIVE_JOB_ID';
export const POLL_SERVER_FOR_DATA = 'nox/POLL_SERVER_FOR_DATA';

// reducer
const initialState = {
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
export const pollServerForData = () => {
  return (dispatch, getState) => {
    const { api, nox } = getState();

    dispatch({
      type: POLL_SERVER_FOR_DATA,
      jobId: nox.jobId,
    });

    // fetch nox data via job id
    return fetch(`${api.baseUrl}/api/v1/jobs/${nox.jobId}`)
      .then((response) => response.json())
      .then((json) => {
        // recursively call function if response from server is 'in progress'
        if (json.response === 'in progress') {
          return setTimeout(
            () => dispatch(pollServerForData()),
            api.pollingFrequency,
          );
        }
        dispatch(incrementProgress());
        dispatch({
          type: RECEIVE_NOX,
          json: json,
        });
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
          json: json,
        });
        dispatch(pollServerForData());
      });
  };
};
