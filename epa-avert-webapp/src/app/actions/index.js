// reducers
import * as fromGeneration from 'app/redux/generation';
import * as fromSo2 from 'app/redux/so2';
import * as fromNox from 'app/redux/nox';
import * as fromCo2 from 'app/redux/co2';
import * as fromPm25 from 'app/redux/pm25';

// engines
import Avert from 'app/engines/Avert';
import EereProfile from 'app/engines/EereProfile';
export const avert = new Avert();
export const eereProfile = new EereProfile();


// actions and action creators
export const RENDER_MONTHLY_EMISSIONS_CHARTS = 'avert/core/RENDER_MONTHLY_EMISSIONS_CHARTS';
export const renderMonthlyEmissionsCharts = () => ({ type: RENDER_MONTHLY_EMISSIONS_CHARTS });

export const COMPLETE_STATE_EMISSIONS = 'avert/core/COMPLETE_STATE_EMISSIONS';
const completeStateEmissions = (data) => ({
  type: COMPLETE_STATE_EMISSIONS,
  data: data,
});

export const COMPLETE_MONTHLY_EMISSIONS = 'avert/core/COMPLETE_MONTHLY_EMISSIONS';
export const SET_DOWNLOAD_DATA = 'avert/core/SET_DOWNLOAD_DATA';
export const completeMonthlyEmissions = (data) => {
  return function (dispatch) {
    dispatch({
      type: COMPLETE_MONTHLY_EMISSIONS,
      data: data,
    });
    dispatch({
      type: SET_DOWNLOAD_DATA,
      data: data,
    });
    dispatch(renderMonthlyEmissionsCharts());
  }
};

export const SELECT_MONTHLY_AGGREGATION = 'avert/core/SELECT_MONTHLY_AGGREGATION';
export const selectMonthlyAggregation = (aggregation) => {
  return function (dispatch) {
    dispatch({
      type: SELECT_MONTHLY_AGGREGATION,
      aggregation: aggregation,
    });
    dispatch(renderMonthlyEmissionsCharts());
  }
};

export const SELECT_MONTHLY_UNIT = 'avert/core/SELECT_MONTHLY_UNIT';
export const selectMonthlyUnit = (unit) => {
  return function (dispatch) {
    dispatch({
      type: SELECT_MONTHLY_UNIT,
      unit: unit,
    });
    dispatch(renderMonthlyEmissionsCharts());
  }
};

export const SELECT_MONTHLY_STATE = 'avert/core/SELECT_MONTHLY_STATE';
export const selectMonthlyState = (state) => {
  return function (dispatch, getState) {
    const { monthlyEmissions } = getState();

    dispatch({
      type: SELECT_MONTHLY_STATE,
      state: state,
      visibleCounties: monthlyEmissions.counties[state],
    });
    dispatch(renderMonthlyEmissionsCharts());
  }
};

export const SELECT_MONTHLY_COUNTY = 'avert/core/SELECT_MONTHLY_COUNTY';
export const selectMonthlyCounty = (county) => {
  return function (dispatch) {
    dispatch({
      type: SELECT_MONTHLY_COUNTY,
      county: county,
    });
    dispatch(renderMonthlyEmissionsCharts());
  }
};

export const RESET_MONTHLY_EMISSIONS = 'avert/core/RESET_MONTHLY_EMISSIONS';
export const resetMonthlyEmissions = () => ({
  type: RESET_MONTHLY_EMISSIONS,
});

export const INCREMENT_PROGRESS = 'avert/core/INCREMENT_PROGRESS';
export const incrementProgress = () => ({ type: INCREMENT_PROGRESS });

export const RECEIVE_DISPLACEMENT = 'avert/core/RECEIVE_DISPLACEMENT';
const receiveDisplacement = () => {
  return (dispatch, getState) => {
    const { generation, so2, nox, co2, pm25 } = getState();

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

    dispatch(completeStateEmissions({ states: states, data: stateEmissionsData }));

    // build two-dimmensional states and counties array
    let statesAndCounties = {};
    states.forEach((state) => {
      statesAndCounties[state] = Object.keys(generation.data.monthlyChanges.emissions.county[state]).sort();
    });

    // calculate monthly emissions and dispatch action
    const monthlyEmissionsData = {
      statesAndCounties: statesAndCounties,
      emissions: {
        generation: {
          regional: Object.values(generation.data.monthlyChanges.emissions.region),
          state: generation.data.monthlyChanges.emissions.state,
          county: generation.data.monthlyChanges.emissions.county,
        },
        so2: {
          regional: Object.values(so2.data.monthlyChanges.emissions.region),
          state: so2.data.monthlyChanges.emissions.state,
          county: so2.data.monthlyChanges.emissions.county,
        },
        nox: {
          regional: Object.values(nox.data.monthlyChanges.emissions.region),
          state: nox.data.monthlyChanges.emissions.state,
          county: nox.data.monthlyChanges.emissions.county,
        },
        co2: {
          regional: Object.values(co2.data.monthlyChanges.emissions.region),
          state: co2.data.monthlyChanges.emissions.state,
          county: co2.data.monthlyChanges.emissions.county,
        },
        pm25: {
          regional: Object.values(pm25.data.monthlyChanges.emissions.region),
          state: pm25.data.monthlyChanges.emissions.state,
          county: pm25.data.monthlyChanges.emissions.county,
        },
      },
      percentages: {
        generation: {
          regional: Object.values(generation.data.monthlyChanges.percentages.region),
          state: generation.data.monthlyChanges.percentages.state,
          county: generation.data.monthlyChanges.percentages.county,
        },
        so2: {
          regional: Object.values(so2.data.monthlyChanges.percentages.region),
          state: so2.data.monthlyChanges.percentages.state,
          county: so2.data.monthlyChanges.percentages.county,
        },
        nox: {
          regional: Object.values(nox.data.monthlyChanges.percentages.region),
          state: nox.data.monthlyChanges.percentages.state,
          county: nox.data.monthlyChanges.percentages.county,
        },
        co2: {
          regional: Object.values(co2.data.monthlyChanges.percentages.region),
          state: co2.data.monthlyChanges.percentages.state,
          county: co2.data.monthlyChanges.percentages.county,
        },
        pm25: {
          regional: Object.values(pm25.data.monthlyChanges.percentages.region),
          state: pm25.data.monthlyChanges.percentages.state,
          county: pm25.data.monthlyChanges.percentages.county,
        },
      },
    };

    return dispatch(completeMonthlyEmissions(monthlyEmissionsData));
  };
};

export const START_DISPLACEMENT = 'avert/core/START_DISPLACEMENT';
export function calculateDisplacement() {
  return (dispatch) => {
    dispatch({ type: START_DISPLACEMENT });
    dispatch(incrementProgress());

    // fetch generation, so2, nox, co2, and pm25
    dispatch(fromGeneration.fetchGeneration());
    dispatch(fromSo2.fetchSo2());
    dispatch(fromNox.fetchNox());
    dispatch(fromCo2.fetchCo2());
    dispatch(fromPm25.fetchPm25());

    dispatch(receiveDisplacement());
  }
}
