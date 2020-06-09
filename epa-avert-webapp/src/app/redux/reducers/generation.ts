// reducers
import { AppThunk } from 'app/redux/index';
import { DisplacementData, initialPollutantState } from 'app/redux/shared';
// action creators
import { incrementProgress } from 'app/redux/reducers/annualDisplacement';

type GenerationAction =
  | {
      type: 'generation/REQUEST_GENERATION';
    }
  | {
      type: 'generation/RECEIVE_GENERATION';
      payload: {
        data: DisplacementData;
      };
    }
  | {
      type: 'generation/RECEIVE_ERROR';
    };

type GenerationState = {
  isFetching: boolean;
  data: DisplacementData;
  error: boolean;
};

// reducer
const initialState: GenerationState = initialPollutantState;

export default function reducer(
  state: GenerationState = initialState,
  action: GenerationAction,
): GenerationState {
  switch (action.type) {
    case 'generation/REQUEST_GENERATION':
      return {
        ...state,
        isFetching: true,
        data: initialState.data,
        error: initialState.error,
      };

    case 'generation/RECEIVE_GENERATION':
      return {
        ...state,
        isFetching: false,
        data: action.payload.data,
      };

    case 'generation/RECEIVE_ERROR':
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
export function fetchGeneration(): AppThunk {
  return (dispatch, getState) => {
    const { region, api, eere } = getState();

    dispatch({ type: 'generation/REQUEST_GENERATION' });

    // post generation data for region and receive calculated displacement data
    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        region: region.id,
        hourlyLoad: eere.hourlyEere.map((hour) => hour.final_mw),
      }),
    };

    return fetch(`${api.baseUrl}/api/v1/generation`, options)
      .then((response) => response.json())
      .then((json) => {
        dispatch(incrementProgress());
        dispatch({
          type: 'generation/RECEIVE_GENERATION',
          payload: {
            data: json,
          },
        });
      })
      .catch((error) => {
        dispatch({ type: 'generation/RECEIVE_ERROR' });
      });
  };
}
