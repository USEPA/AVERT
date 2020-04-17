// engines
import { avert } from 'app/engines';
// action creators
import { incrementProgress } from 'app/redux/annualDisplacement';

// action types
export const REQUEST_NOX = 'nox/REQUEST_NOX';
export const RECEIVE_NOX = 'nox/RECEIVE_NOX';
export const RECEIVE_ERROR = 'nox/RECEIVE_ERROR';

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
        data: action.payload,
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
export const fetchNox = () => {
  return (dispatch, getState) => {
    const { api } = getState();

    dispatch({ type: REQUEST_NOX });

    // post nox data for region and receive calculated displacement data
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
        dispatch(incrementProgress());
        dispatch({
          type: RECEIVE_NOX,
          payload: json,
        });
      })
      .catch((error) => {
        dispatch({ type: RECEIVE_ERROR });
      });
  };
};
