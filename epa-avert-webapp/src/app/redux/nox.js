// engine
import { avert } from 'app/actions';
// action creators
import { incrementProgress } from 'app/actions';

// actions
const REQUEST_NOX = 'nox/REQUEST_NOX';
const RECEIVE_NOX = 'nox/RECEIVE_NOX';
const RECEIVE_JOB_ID = 'nox/RECEIVE_JOB_ID';
const POLL_SERVER_FOR_DATA = 'nox/POLL_SERVER_FOR_DATA';

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
function pollServerForData() {
  return (dispatch, getState) => {
    const { api, nox } = getState();
    // dispatch 'poll server for data' action
    dispatch({
      type: POLL_SERVER_FOR_DATA,
      jobId: nox.jobId,
    });
    // fetch nox data via job id
    return fetch(`${api.baseUrl}/api/v1/jobs/${nox.jobId}`)
      .then(response => response.json())
      .then(json => {
        // recursively call function if response from server is 'in progress'
        if (json.response === 'in progress') {
          return setTimeout(() => dispatch(pollServerForData()), api.pollingFrequency)
        }
        // dispatch 'incrementProgress' and 'receive nox' actions
        dispatch(incrementProgress());
        dispatch({
          type: RECEIVE_NOX,
          json: json,
        });
      });
  };
}

export function fetchNox() {
  return (dispatch, getState) => {
    const { api } = getState();
    // dispatch 'request nox' action
    dispatch({ type: REQUEST_NOX });
    // post nox data for region and receive a job id
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
    return fetch(`${api.baseUrl}/api/v1/nox`, options)
      .then(response => response.json())
      .then(json => {
        // dispatch 'receive job id' and 'poll server for data' actions
        dispatch({
          type: RECEIVE_JOB_ID,
          json: json,
        });
        dispatch(pollServerForData());
      });
  };
}
