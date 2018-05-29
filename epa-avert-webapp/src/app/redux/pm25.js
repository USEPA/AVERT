// engines
import { avert } from 'app/engines';
// action creators
import { incrementProgress } from 'app/redux/annualDisplacement';

// action types
export const REQUEST_PM25 = 'pm25/REQUEST_PM25';
export const RECEIVE_PM25 = 'pm25/RECEIVE_PM25';
export const RECEIVE_ERROR = 'pm25/RECEIVE_ERROR';

// reducer
const initialState = {
  isFetching: false,
  jobId: 0,
  data: {},
  error: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_PM25:
      return {
        ...state,
        isFetching: true,
        data: initialState.data,
        error: initialState.error,
      };

    case RECEIVE_PM25:
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

    default:
      return state;
  }
}

// action creators
export const fetchPm25 = () => {
  return (dispatch, getState) => {
    const { api } = getState();

    dispatch({ type: REQUEST_PM25 });

    // post pm25 data for region and receive calculated displacement data
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
        dispatch(incrementProgress());
        dispatch({
          type: RECEIVE_PM25,
          json: json,
        });
      })
      .catch((error) => {
        dispatch({ type: RECEIVE_ERROR });
      });
  };
};
