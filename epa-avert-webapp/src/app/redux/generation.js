// engine
import { avert } from 'app/actions';
// action creators
import { incrementProgress } from 'app/actions';

// action types
const REQUEST_GENERATION = 'generation/REQUEST_GENERATION';
const RECEIVE_GENERATION = 'generation/RECEIVE_GENERATION';
const RECEIVE_JOB_ID = 'generation/RECEIVE_JOB_ID';
const POLL_SERVER_FOR_DATA = 'generation/POLL_SERVER_FOR_DATA';

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
function pollServerForData() {
  return (dispatch, getState) => {
    const { api, generation } = getState();
    // dispatch 'poll server for data' action
    dispatch({
      type: POLL_SERVER_FOR_DATA,
      jobId: generation.jobId,
    });
    // fetch generation data via job id
    return fetch(`${api.baseUrl}/api/v1/jobs/${generation.jobId}`)
      .then(response => response.json())
      .then(json => {
        // recursively call function if response from server is 'in progress'
        if (json.response === 'in progress') {
          return setTimeout(() => dispatch(pollServerForData()), api.pollingFrequency)
        }
        // dispatch 'incrementProgress' and 'receive generation' actions
        dispatch(incrementProgress());
        dispatch({
          type: RECEIVE_GENERATION,
          json: json,
        });
      });
  };
}

export function fetchGeneration() {
  return (dispatch, getState) => {
    const { api } = getState();
    // dispatch 'request generation' action
    dispatch({ type: REQUEST_GENERATION });
    // post generation data for region and receive a job id
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
    return fetch(`${api.baseUrl}/api/v1/generation`, options)
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
