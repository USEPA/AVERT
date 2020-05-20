// reducers
import { AppThunk } from 'app/redux/index';
import { DisplacementData, initialPollutantState } from 'app/redux/shared';
// engines
import { avert } from 'app/engines';
// action creators
import { incrementProgress } from 'app/redux/reducers/annualDisplacement';

type Co2Action =
  | {
      type: 'co2/REQUEST_CO2';
    }
  | {
      type: 'co2/RECEIVE_CO2';
      payload: DisplacementData;
    }
  | {
      type: 'co2/RECEIVE_ERROR';
    };

type Co2State = {
  isFetching: boolean;
  data: DisplacementData;
  error: boolean;
};

// reducer
const initialState: Co2State = initialPollutantState;

export default function reducer(
  state: Co2State = initialState,
  action: Co2Action,
): Co2State {
  switch (action.type) {
    case 'co2/REQUEST_CO2':
      return {
        ...state,
        isFetching: true,
        data: initialState.data,
        error: initialState.error,
      };

    case 'co2/RECEIVE_CO2':
      return {
        ...state,
        isFetching: false,
        data: action.payload,
      };

    case 'co2/RECEIVE_ERROR':
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
export function fetchCo2(): AppThunk {
  return (dispatch, getState) => {
    const { region, api } = getState();

    dispatch({ type: 'co2/REQUEST_CO2' });

    // post co2 data for region and receive calculated displacement data
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

    return fetch(`${api.baseUrl}/api/v1/co2`, options)
      .then((response) => response.json())
      .then((json) => {
        dispatch(incrementProgress());
        dispatch({
          type: 'co2/RECEIVE_CO2',
          payload: json,
        });
      })
      .catch((error) => {
        dispatch({ type: 'co2/RECEIVE_ERROR' });
      });
  };
}
