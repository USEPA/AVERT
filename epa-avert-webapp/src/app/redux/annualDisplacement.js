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
export const RECEIVE_DISPLACEMENT = 'annualDisplacement/RECEIVE_DISPLACEMENT';
export const START_DISPLACEMENT = 'annualDisplacement/START_DISPLACEMENT';

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
      };

    case START_DISPLACEMENT:
      return {
        ...state,
        status: 'started',
      };

    case RECEIVE_DISPLACEMENT:
      return {
        ...state,
        status: 'complete',
        results: action.data,
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
    const { generation, so2, nox, co2, pm25 } = getState();

    // prettier-ignore
    // recursively call function if data is still fetching
    if (generation.isFetching || so2.isFetching || nox.isFetching || co2.isFetching || pm25.isFetching) {
      return setTimeout(() => dispatch(receiveDisplacement()), 1000);
    }

    const displacementData = {
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
      type: RECEIVE_DISPLACEMENT,
      data: displacementData,
    });

    // build up states array
    const states = Object.keys(generation.data.stateChanges).sort();

    // calculate state emissions and dispatch action
    const stateEmissionsData = states.map((state) => ({
      state: state,
      so2: so2.data.stateChanges[state],
      nox: nox.data.stateChanges[state],
      co2: co2.data.stateChanges[state],
      pm25: pm25.data.stateChanges[state],
    }));

    dispatch(
      completeStateEmissions({ states: states, data: stateEmissionsData }),
    );

    // build two-dimmensional states and counties array
    let statesAndCounties = {};
    // prettier-ignore
    states.forEach((state) => {
      statesAndCounties[state] = Object.keys(generation.data.monthlyChanges.emissions.county[state]).sort();
    });

    // prettier-ignore
    // calculate monthly emissions and dispatch action
    const monthlyEmissionsData = {
      statesAndCounties: statesAndCounties,
      emissions: {
        generation: {
          regional: generation.data.monthlyChanges.emissions.region,
          state: generation.data.monthlyChanges.emissions.state,
          county: generation.data.monthlyChanges.emissions.county,
        },
        so2: {
          regional: so2.data.monthlyChanges.emissions.region,
          state: so2.data.monthlyChanges.emissions.state,
          county: so2.data.monthlyChanges.emissions.county,
        },
        nox: {
          regional: nox.data.monthlyChanges.emissions.region,
          state: nox.data.monthlyChanges.emissions.state,
          county: nox.data.monthlyChanges.emissions.county,
        },
        co2: {
          regional: co2.data.monthlyChanges.emissions.region,
          state: co2.data.monthlyChanges.emissions.state,
          county: co2.data.monthlyChanges.emissions.county,
        },
        pm25: {
          regional: pm25.data.monthlyChanges.emissions.region,
          state: pm25.data.monthlyChanges.emissions.state,
          county: pm25.data.monthlyChanges.emissions.county,
        },
      },
      percentages: {
        generation: {
          regional: generation.data.monthlyChanges.percentages.region,
          state: generation.data.monthlyChanges.percentages.state,
          county: generation.data.monthlyChanges.percentages.county,
        },
        so2: {
          regional: so2.data.monthlyChanges.percentages.region,
          state: so2.data.monthlyChanges.percentages.state,
          county: so2.data.monthlyChanges.percentages.county,
        },
        nox: {
          regional: nox.data.monthlyChanges.percentages.region,
          state: nox.data.monthlyChanges.percentages.state,
          county: nox.data.monthlyChanges.percentages.county,
        },
        co2: {
          regional: co2.data.monthlyChanges.percentages.region,
          state: co2.data.monthlyChanges.percentages.state,
          county: co2.data.monthlyChanges.percentages.county,
        },
        pm25: {
          regional: pm25.data.monthlyChanges.percentages.region,
          state: pm25.data.monthlyChanges.percentages.state,
          county: pm25.data.monthlyChanges.percentages.county,
        },
      },
    };

    return dispatch(completeMonthlyEmissions(monthlyEmissionsData));
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
