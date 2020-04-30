import { useSelector, TypedUseSelectorHook } from 'react-redux';
// reducers
import { AppThunk } from 'app/redux/index';
// action types
import { SELECT_REGION } from 'app/redux/region';
import { START_DISPLACEMENT } from 'app/redux/annualDisplacement';
export const COMPLETE_STATE_EMISSIONS = 'stateEmissions/COMPLETE_STATE_EMISSIONS'; // prettier-ignore

type StateEmissionsAction =
  | {
      type: typeof SELECT_REGION;
    }
  | {
      type: typeof START_DISPLACEMENT;
    }
  | {
      type: typeof COMPLETE_STATE_EMISSIONS;
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

export const useStateEmissionsState: TypedUseSelectorHook<StateEmissionsState> = useSelector;

// reducer
const initialState: StateEmissionsState = {
  status: 'select_region',
  states: [],
  data: [],
};

export default function reducer(
  state = initialState,
  action: StateEmissionsAction,
): StateEmissionsState {
  switch (action.type) {
    case SELECT_REGION:
      return {
        ...state,
        status: 'ready',
      };

    case START_DISPLACEMENT:
      return {
        ...state,
        status: 'started',
      };

    case COMPLETE_STATE_EMISSIONS:
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

export const completeStateEmissions = (): AppThunk => {
  return function (dispatch, getState) {
    // get reducer data from store to use in dispatched action
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
      type: COMPLETE_STATE_EMISSIONS,
      states: stateIds,
      data: data,
    });
  };
};
