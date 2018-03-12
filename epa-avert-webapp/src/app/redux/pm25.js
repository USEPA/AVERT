// engines
import { avert } from 'app/engines';
// action creators
import { incrementProgress } from 'app/redux/annualDisplacement';

// action types
export const REQUEST_PM25 = 'pm25/REQUEST_PM25';
export const RECEIVE_PM25 = 'pm25/RECEIVE_PM25';
export const RECEIVE_JOB_ID = 'pm25/RECEIVE_JOB_ID';
export const POLL_SERVER_FOR_DATA = 'pm25/POLL_SERVER_FOR_DATA';

// reducer
const initialState = {
  isFetching: false,
  jobId: 0,
  data: {},
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_PM25:
      return {
        ...state,
        isFetching: true,
      };

    case RECEIVE_PM25:
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
    const { api, pm25 } = getState();

    dispatch({
      type: POLL_SERVER_FOR_DATA,
      jobId: pm25.jobId,
    });

    // fetch pm25 data via job id
    return fetch(`${api.baseUrl}/api/v1/jobs/${pm25.jobId}`, {
      cache: 'reload',
    })
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
          type: RECEIVE_PM25,
          json: json,
        });
      });
  };
};

export const fetchPm25 = () => {
  return (dispatch, getState) => {
    const { api } = getState();

    dispatch({ type: REQUEST_PM25 });

    // post pm25 data for region and receive a job id
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
    return fetch(`${api.baseUrl}/api/v1/pm25`, options)
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
