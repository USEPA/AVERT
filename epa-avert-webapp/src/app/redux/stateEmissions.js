// action types
import { SELECT_REGION } from 'app/redux/region';
import { START_DISPLACEMENT } from 'app/redux/annualDisplacement';
export const COMPLETE_STATE_EMISSIONS = 'stateEmissions/COMPLETE_STATE_EMISSIONS'; // prettier-ignore

// reducer
const initialState = {
  status: 'select_region',
  states: [],
  data: [],
};

export default function reducer(state = initialState, action) {
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

export const completeStateEmissions = () => {
  return function(dispatch, getState) {
    // get reducer data from store to use in dispatched action
    const { annualDisplacement, so2, nox, co2, pm25 } = getState();

    const states = Object.keys(annualDisplacement.statesAndCounties).sort();

    // calculate state emissions and dispatch action
    const data = states.map((state) => ({
      state: state,
      so2: so2.data.stateChanges[state],
      nox: nox.data.stateChanges[state],
      co2: co2.data.stateChanges[state],
      pm25: pm25.data.stateChanges[state],
    }));

    dispatch({
      type: COMPLETE_STATE_EMISSIONS,
      states: states,
      data: data,
    });
  };
};
