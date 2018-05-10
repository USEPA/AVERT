// action creators
import { completeStateEmissions } from 'app/redux/stateEmissions';
import { completeMonthlyEmissions } from 'app/redux/monthlyEmissions';
import { fetchGeneration } from 'app/redux/generation';
import { fetchSo2 } from 'app/redux/so2';
import { fetchNox } from 'app/redux/nox';
import { fetchCo2 } from 'app/redux/co2';
import { fetchPm25 } from 'app/redux/pm25';

// actions types
import { SELECT_REGION } from 'app/redux/region';
export const INCREMENT_PROGRESS = 'annualDisplacement/INCREMENT_PROGRESS';
export const START_DISPLACEMENT = 'annualDisplacement/START_DISPLACEMENT';
export const RECEIVE_DISPLACEMENT = 'annualDisplacement/RECEIVE_DISPLACEMENT';
export const RECEIVE_ERROR = 'annualDisplacement/RECEIVE_ERROR';

// reducer
const origPostImpact = {
  original: '',
  post: '',
  impact: '',
};

const origPost = {
  original: '',
  post: '',
};

const initialState = {
  status: 'select_region',
  statesAndCounties: {},
  results: {
    generation: origPostImpact,
    totalEmissions: {
      so2: origPostImpact,
      nox: origPostImpact,
      co2: origPostImpact,
      pm25: origPostImpact,
    },
    emissionRates: {
      so2: origPost,
      nox: origPost,
      co2: origPost,
      pm25: origPost,
    },
  },
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SELECT_REGION:
      return {
        ...state,
        status: 'ready',
        statesAndCounties: initialState.statesAndCounties,
        results: initialState.results,
      };

    case START_DISPLACEMENT:
      return {
        ...state,
        status: 'started',
        statesAndCounties: initialState.statesAndCounties,
        results: initialState.results,
      };

    case RECEIVE_DISPLACEMENT:
      return {
        ...state,
        status: 'complete',
        statesAndCounties: action.statesAndCounties,
        results: action.data,
      };

  case RECEIVE_ERROR:
    return {
      ...state,
      status: 'error',
    };

    default:
      return state;
  }
}

// action creators
export const incrementProgress = () => ({
  type: INCREMENT_PROGRESS,
});

export const receiveDisplacement = () => {
  return (dispatch, getState) => {
    // get reducer data from store to use in dispatched action
    const { generation, so2, nox, co2, pm25 } = getState();

    // bail if a data source returns an error
    if (generation.error || so2.error || nox.error || co2.error || pm25.error) {
      dispatch({ type: RECEIVE_ERROR });
      return;
    }

    // prettier-ignore
    // recursively call function if data is still fetching
    if (generation.isFetching || so2.isFetching || nox.isFetching || co2.isFetching || pm25.isFetching) {
      return setTimeout(() => dispatch(receiveDisplacement()), 1000);
    }

    const data = {
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

    // build up statesAndCounties from monthlyChanges data
    const so2countyEmissions = so2.data.monthlyChanges.emissions.county;
    const statesAndCounties = {};
    for (const state in so2countyEmissions) {
      statesAndCounties[state] = Object.keys(so2countyEmissions[state]).sort();
    }

    dispatch(incrementProgress());
    dispatch({
      type: RECEIVE_DISPLACEMENT,
      data: data,
      statesAndCounties: statesAndCounties,
    });
    dispatch(completeStateEmissions());
    dispatch(completeMonthlyEmissions());
  };
};

export const calculateDisplacement = () => {
  return (dispatch) => {
    dispatch({ type: START_DISPLACEMENT });
    dispatch(incrementProgress());

    // fetch generation, so2, nox, co2, and pm25
    dispatch(fetchGeneration());
    dispatch(fetchSo2());
    dispatch(fetchNox());
    dispatch(fetchCo2());
    dispatch(fetchPm25());

    dispatch(receiveDisplacement());
  };
};
