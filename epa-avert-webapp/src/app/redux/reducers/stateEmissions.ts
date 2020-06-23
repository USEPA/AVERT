// reducers
import { AppThunk } from 'app/redux/index';

type StateEmissionsAction =
  | { type: 'regions/SELECT_REGIONS' }
  | { type: 'displacement/START_DISPLACEMENT' }
  | {
      type: 'stateEmissions/COMPLETE_STATE_EMISSIONS';
      payload: {
        stateIds: string[];
        data: {
          state: string;
          so2: number;
          nox: number;
          co2: number;
          pm25: number;
        }[];
      };
    }
  | { type: 'stateEmissions/RESET_STATE_EMISSIONS' };

type StateEmissionsState = {
  status: 'ready' | 'started' | 'complete';
  stateIds: string[];
  data: {
    state: string;
    so2: number;
    nox: number;
    co2: number;
    pm25: number;
  }[];
};

// reducer
const initialState: StateEmissionsState = {
  status: 'ready',
  stateIds: [],
  data: [],
};

export default function reducer(
  state: StateEmissionsState = initialState,
  action: StateEmissionsAction,
): StateEmissionsState {
  switch (action.type) {
    case 'regions/SELECT_REGIONS':
    case 'stateEmissions/RESET_STATE_EMISSIONS':
      return initialState;

    case 'displacement/START_DISPLACEMENT':
      return {
        ...state,
        status: 'started',
      };

    case 'stateEmissions/COMPLETE_STATE_EMISSIONS':
      return {
        ...state,
        status: 'complete',
        stateIds: action.payload.stateIds,
        data: action.payload.data,
      };

    default:
      return state;
  }
}

export function completeStateEmissions(): AppThunk {
  return (dispatch, getState) => {
    const { displacement } = getState();
    const { statesAndCounties, so2, nox, co2, pm25 } = displacement;

    const stateIds = Object.keys(statesAndCounties).sort();

    // calculate state emissions and dispatch action
    const data = stateIds.map((stateId) => ({
      state: stateId,
      so2: so2.data.stateChanges[stateId],
      nox: nox.data.stateChanges[stateId],
      co2: co2.data.stateChanges[stateId],
      pm25: pm25.data.stateChanges[stateId],
    }));

    dispatch({
      type: 'stateEmissions/COMPLETE_STATE_EMISSIONS',
      payload: {
        stateIds,
        data,
      },
    });
  };
}

export function resetStateEmissions(): StateEmissionsAction {
  return { type: 'stateEmissions/RESET_STATE_EMISSIONS' };
}
