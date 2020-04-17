// engines
import { avert } from 'app/engines';
// action creators
import { incrementProgress } from 'app/redux/annualDisplacement';

// action types
export const REQUEST_SO2 = 'so2/REQUEST_SO2';
export const RECEIVE_SO2 = 'so2/RECEIVE_SO2';
export const RECEIVE_ERROR = 'so2/RECEIVE_ERROR';

// reducer
const initialState = {
  isFetching: false,
  jobId: 0,
  data: {},
  error: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_SO2:
      return {
        ...state,
        isFetching: true,
        data: initialState.data,
        error: initialState.error,
      };

    case RECEIVE_SO2:
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
export const fetchSo2 = () => {
  return (dispatch, getState) => {
    const { api } = getState();

    dispatch({ type: REQUEST_SO2 });

    // post so2 data for region and receive calculated displacement data
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

    return fetch(`${api.baseUrl}/api/v1/so2`, options)
      .then((response) => response.json())
      .then((json) => {
        dispatch(incrementProgress());
        dispatch({
          type: RECEIVE_SO2,
          payload: json,
        });
      })
      .catch((error) => {
        dispatch({ type: RECEIVE_ERROR });
      });
  };
};
