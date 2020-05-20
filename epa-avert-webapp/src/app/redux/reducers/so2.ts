// reducers
import { AppThunk } from 'app/redux/index';
import { DisplacementData, initialPollutantState } from 'app/redux/shared';
// engines
import { avert } from 'app/engines';
// action creators
import { incrementProgress } from 'app/redux/reducers/annualDisplacement';

type So2Action =
  | {
      type: 'so2/REQUEST_SO2';
    }
  | {
      type: 'so2/RECEIVE_SO2';
      payload: DisplacementData;
    }
  | {
      type: 'so2/RECEIVE_ERROR';
    };

type So2State = {
  isFetching: boolean;
  data: DisplacementData;
  error: boolean;
};

// reducer
const initialState: So2State = initialPollutantState;

export default function reducer(
  state: So2State = initialState,
  action: So2Action,
): So2State {
  switch (action.type) {
    case 'so2/REQUEST_SO2':
      return {
        ...state,
        isFetching: true,
        data: initialState.data,
        error: initialState.error,
      };

    case 'so2/RECEIVE_SO2':
      return {
        ...state,
        isFetching: false,
        data: action.payload,
      };

    case 'so2/RECEIVE_ERROR':
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
export function fetchSo2(): AppThunk {
  return (dispatch, getState) => {
    const { region, api } = getState();

    dispatch({ type: 'so2/REQUEST_SO2' });

    // post so2 data for region and receive calculated displacement data
    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        region: region.slug,
        eere: avert.eereLoad.hourlyEere,
      }),
    };

    return fetch(`${api.baseUrl}/api/v1/so2`, options)
      .then((response) => response.json())
      .then((json) => {
        dispatch(incrementProgress());
        dispatch({
          type: 'so2/RECEIVE_SO2',
          payload: json,
        });
      })
      .catch((error) => {
        dispatch({ type: 'so2/RECEIVE_ERROR' });
      });
  };
}
