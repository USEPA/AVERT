// reducers
import { AppThunk } from 'app/redux/index';
import { DisplacementData, initialPollutantState } from 'app/redux/shared';
// engines
import { avert } from 'app/engines';
// action creators
import { incrementProgress } from 'app/redux/reducers/annualDisplacement';

type Pm25Action =
  | {
      type: 'pm25/REQUEST_PM25';
    }
  | {
      type: 'pm25/RECEIVE_PM25';
      payload: DisplacementData;
    }
  | {
      type: 'pm25/RECEIVE_ERROR';
    };

type Pm25State = {
  isFetching: boolean;
  data: DisplacementData;
  error: boolean;
};

// reducer
const initialState: Pm25State = initialPollutantState;

export default function reducer(
  state: Pm25State = initialState,
  action: Pm25Action,
): Pm25State {
  switch (action.type) {
    case 'pm25/REQUEST_PM25':
      return {
        ...state,
        isFetching: true,
        data: initialState.data,
        error: initialState.error,
      };

    case 'pm25/RECEIVE_PM25':
      return {
        ...state,
        isFetching: false,
        data: action.payload,
      };

    case 'pm25/RECEIVE_ERROR':
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
export const fetchPm25 = (): AppThunk => {
  return (dispatch, getState) => {
    const { api } = getState();

    dispatch({ type: 'pm25/REQUEST_PM25' });

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
          type: 'pm25/RECEIVE_PM25',
          payload: json,
        });
      })
      .catch((error) => {
        dispatch({ type: 'pm25/RECEIVE_ERROR' });
      });
  };
};