// reducers
import { AppThunk } from 'app/redux/index';
// action creators
import { completeStateEmissions } from 'app/redux/reducers/stateEmissions';
import { completeMonthlyEmissions } from 'app/redux/reducers/monthlyEmissions';
import { fetchGeneration } from 'app/redux/reducers/generation';
import { fetchSo2 } from 'app/redux/reducers/so2';
import { fetchNox } from 'app/redux/reducers/nox';
import { fetchCo2 } from 'app/redux/reducers/co2';
import { fetchPm25 } from 'app/redux/reducers/pm25';

export type StatesAndCounties = {
  [stateId: string]: string[];
};

type AnnualDisplacementAction =
  | {
      type: 'region/SELECT_REGION';
    }
  | {
      type: 'annualDisplacement/INCREMENT_PROGRESS';
    }
  | {
      type: 'annualDisplacement/START_DISPLACEMENT';
    }
  | {
      type: 'annualDisplacement/RECEIVE_DISPLACEMENT';
      payload: {
        statesAndCounties: StatesAndCounties;
      };
    }
  | {
      type: 'annualDisplacement/RECEIVE_ERROR';
    }
  | {
      type: 'annualDisplacement/RESET_DISPLACEMENT';
    };

type AnnualDisplacementState = {
  status: 'ready' | 'started' | 'complete' | 'error';
  statesAndCounties: StatesAndCounties;
};

// reducer
const initialState: AnnualDisplacementState = {
  status: 'ready',
  statesAndCounties: {},
};

export default function reducer(
  state: AnnualDisplacementState = initialState,
  action: AnnualDisplacementAction,
): AnnualDisplacementState {
  switch (action.type) {
    case 'region/SELECT_REGION':
    case 'annualDisplacement/RESET_DISPLACEMENT':
      return initialState;

    case 'annualDisplacement/START_DISPLACEMENT':
      return {
        ...state,
        status: 'started',
        statesAndCounties: {},
      };

    case 'annualDisplacement/RECEIVE_DISPLACEMENT':
      return {
        ...state,
        status: 'complete',
        statesAndCounties: action.payload.statesAndCounties,
      };

    case 'annualDisplacement/RECEIVE_ERROR':
      return {
        ...state,
        status: 'error',
      };

    default:
      return state;
  }
}

// action creators
export function incrementProgress(): AnnualDisplacementAction {
  return {
    type: 'annualDisplacement/INCREMENT_PROGRESS',
  };
}

export function receiveDisplacement(): AppThunk {
  return (dispatch, getState) => {
    const { generation, so2, nox, co2, pm25 } = getState();

    // bail if a data source returns an error
    if (generation.error || so2.error || nox.error || co2.error || pm25.error) {
      dispatch({ type: 'annualDisplacement/RECEIVE_ERROR' });
      return;
    }

    // recursively call function if data is still fetching
    if (
      generation.isFetching ||
      so2.isFetching ||
      nox.isFetching ||
      co2.isFetching ||
      pm25.isFetching
    ) {
      return setTimeout(() => dispatch(receiveDisplacement()), 1000);
    }

    // build up statesAndCounties from monthlyChanges data
    const so2countyEmissions = so2.data.monthlyChanges.emissions.county;
    const statesAndCounties: StatesAndCounties = {};
    for (const stateId in so2countyEmissions) {
      const stateCountyNames = Object.keys(so2countyEmissions[stateId]).sort();
      statesAndCounties[stateId] = stateCountyNames;
    }

    dispatch(incrementProgress());
    dispatch({
      type: 'annualDisplacement/RECEIVE_DISPLACEMENT',
      payload: {
        statesAndCounties,
      },
    });
    dispatch(completeStateEmissions());
    dispatch(completeMonthlyEmissions());
  };
}

export function calculateDisplacement(): AppThunk {
  return (dispatch) => {
    dispatch({ type: 'annualDisplacement/START_DISPLACEMENT' });
    dispatch(incrementProgress());

    // fetch generation, so2, nox, co2, and pm25
    dispatch(fetchGeneration());
    dispatch(fetchSo2());
    dispatch(fetchNox());
    dispatch(fetchCo2());
    dispatch(fetchPm25());

    dispatch(receiveDisplacement());
  };
}

export function resetAnnualDisplacement(): AnnualDisplacementAction {
  return {
    type: 'annualDisplacement/RESET_DISPLACEMENT',
  };
}
