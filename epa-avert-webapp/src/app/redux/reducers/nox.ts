// reducers
import { AppThunk } from 'app/redux/index';
import { DisplacementData, initialPollutantState } from 'app/redux/shared';
// action creators
import { incrementProgress } from 'app/redux/reducers/annualDisplacement';

type NoxAction =
  | {
      type: 'nox/REQUEST_NOX';
    }
  | {
      type: 'nox/RECEIVE_NOX';
      payload: {
        data: DisplacementData;
      };
    }
  | {
      type: 'nox/RECEIVE_ERROR';
    };

type NoxState = {
  isFetching: boolean;
  data: DisplacementData;
  error: boolean;
};

// reducer
const initialState: NoxState = initialPollutantState;

export default function reducer(
  state: NoxState = initialState,
  action: NoxAction,
): NoxState {
  switch (action.type) {
    case 'nox/REQUEST_NOX':
      return {
        ...state,
        isFetching: true,
        data: initialState.data,
        error: initialState.error,
      };

    case 'nox/RECEIVE_NOX':
      return {
        ...state,
        isFetching: false,
        data: action.payload.data,
      };

    case 'nox/RECEIVE_ERROR':
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
export function fetchNox(): AppThunk {
  return (dispatch, getState) => {
    const { region, api, eere } = getState();

    dispatch({ type: 'nox/REQUEST_NOX' });

    // post nox data for region and receive calculated displacement data
    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        region: region.id,
        eere: eere.hourlyEere,
      }),
    };

    return fetch(`${api.baseUrl}/api/v1/nox`, options)
      .then((response) => response.json())
      .then((json) => {
        dispatch(incrementProgress());
        dispatch({
          type: 'nox/RECEIVE_NOX',
          payload: {
            data: json,
          },
        });
      })
      .catch((error) => {
        dispatch({ type: 'nox/RECEIVE_ERROR' });
      });
  };
}
