// reducers
import { AppThunk } from 'app/redux/index';

type StateEmissionsAction =
  | {
      type: 'region/SELECT_REGION';
    }
  | {
      type: 'annualDisplacement/START_DISPLACEMENT';
    }
  | {
      type: 'stateEmissions/COMPLETE_STATE_EMISSIONS';
      states: string[];
      data: {
        state: string;
        so2: number;
        nox: number;
        co2: number;
        pm25: number;
      }[];
    };

type StateEmissionsState = {
  status: 'select_region' | 'ready' | 'started' | 'complete';
  states: string[];
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
  status: 'select_region',
  states: [],
  data: [],
};

export default function reducer(
  state: StateEmissionsState = initialState,
  action: StateEmissionsAction,
): StateEmissionsState {
  switch (action.type) {
    case 'region/SELECT_REGION':
      return {
        ...state,
        status: 'ready',
      };

    case 'annualDisplacement/START_DISPLACEMENT':
      return {
        ...state,
        status: 'started',
      };

    case 'stateEmissions/COMPLETE_STATE_EMISSIONS':
      return {
        ...state,
        status: 'complete',
        states: action.states,
        data: action.data,
      };

    default:
      return state;
  }
}

export function completeStateEmissions(): AppThunk {
  return (dispatch, getState) => {
    const { annualDisplacement, so2, nox, co2, pm25 } = getState();

    const stateIds = Object.keys(annualDisplacement.statesAndCounties).sort();

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
      states: stateIds,
      data,
    });
  };
}
