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

type StatesAndCounties = {
  [stateId: string]: string[];
};

type DisplacementsResults = {
  generation: { original: number; post: number; impact: number };
  totalEmissions: {
    so2: { original: number; post: number; impact: number };
    nox: { original: number; post: number; impact: number };
    co2: { original: number; post: number; impact: number };
    pm25: { original: number; post: number; impact: number };
  };
  emissionRates: {
    so2: { original: string; post: string };
    nox: { original: string; post: string };
    co2: { original: string; post: string };
    pm25: { original: string; post: string };
  };
};

type AnnualDisplacementsAction =
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
      statesAndCounties: StatesAndCounties;
      results: DisplacementsResults;
    }
  | {
      type: 'annualDisplacement/RECEIVE_ERROR';
    };

type AnnualDisplacementState = {
  status: 'select_region' | 'ready' | 'started' | 'complete' | 'error';
  statesAndCounties: StatesAndCounties;
  results: DisplacementsResults;
};

// reducer
const initialState: AnnualDisplacementState = {
  status: 'select_region',
  statesAndCounties: {},
  results: {
    generation: { original: 0, post: 0, impact: 0 },
    totalEmissions: {
      so2: { original: 0, post: 0, impact: 0 },
      nox: { original: 0, post: 0, impact: 0 },
      co2: { original: 0, post: 0, impact: 0 },
      pm25: { original: 0, post: 0, impact: 0 },
    },
    emissionRates: {
      so2: { original: '', post: '' },
      nox: { original: '', post: '' },
      co2: { original: '', post: '' },
      pm25: { original: '', post: '' },
    },
  },
};

export default function reducer(
  state: AnnualDisplacementState = initialState,
  action: AnnualDisplacementsAction,
): AnnualDisplacementState {
  switch (action.type) {
    case 'region/SELECT_REGION':
      return {
        ...state,
        status: 'ready',
        statesAndCounties: initialState.statesAndCounties,
        results: initialState.results,
      };

    case 'annualDisplacement/START_DISPLACEMENT':
      return {
        ...state,
        status: 'started',
        statesAndCounties: initialState.statesAndCounties,
        results: initialState.results,
      };

    case 'annualDisplacement/RECEIVE_DISPLACEMENT':
      return {
        ...state,
        status: 'complete',
        statesAndCounties: action.statesAndCounties,
        results: action.results,
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
export function incrementProgress(): AnnualDisplacementsAction {
  return {
    type: 'annualDisplacement/INCREMENT_PROGRESS',
  };
}

export function receiveDisplacement(): AppThunk {
  return (dispatch, getState) => {
    // get reducer data from store to use in dispatched action
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

    const results = {
      generation: {
        original: generation.data.original,
        post: generation.data.post,
        impact: generation.data.impact,
      },
      totalEmissions: {
        so2: {
          original: so2.data.original,
          post: so2.data.post,
          impact: so2.data.impact,
        },
        nox: {
          original: nox.data.original,
          post: nox.data.post,
          impact: nox.data.impact,
        },
        co2: {
          original: co2.data.original,
          post: co2.data.post,
          impact: co2.data.impact,
        },
        pm25: {
          original: pm25.data.original,
          post: pm25.data.post,
          impact: pm25.data.impact,
        },
      },
      emissionRates: {
        so2: {
          original: (so2.data.original / generation.data.original).toFixed(2),
          post: (so2.data.post / generation.data.post).toFixed(2),
        },
        nox: {
          original: (nox.data.original / generation.data.original).toFixed(2),
          post: (nox.data.post / generation.data.post).toFixed(2),
        },
        co2: {
          original: (co2.data.original / generation.data.original).toFixed(2),
          post: (co2.data.post / generation.data.post).toFixed(2),
        },
        pm25: {
          original: (pm25.data.original / generation.data.original).toFixed(2),
          post: (pm25.data.post / generation.data.post).toFixed(2),
        },
      },
    };

    dispatch(incrementProgress());
    dispatch({
      type: 'annualDisplacement/RECEIVE_DISPLACEMENT',
      statesAndCounties,
      results,
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
