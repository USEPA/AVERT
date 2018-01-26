import math from 'mathjs';

import Engine from 'app/avert/Engine';
import EereProfile from 'app/avert/entities/EereProfile';

// engines
export const avert = new Engine(); // console.log(avert)
export const eereProfile = new EereProfile(); // console.log(eereProfile)

// reducers
import * as fromGeneration from 'app/redux/generation';
import * as fromSo2 from 'app/redux/so2';
import * as fromNox from 'app/redux/nox';
import * as fromCo2 from 'app/redux/co2';
import * as fromPm25 from 'app/redux/pm25';


// actions and action creators
export const INCREMENT_PROGRESS = 'avert/core/INCREMENT_PROGRESS';
export const incrementProgress = () => ({ type: INCREMENT_PROGRESS });


export const SELECT_REGION = 'avert/core/SELECT_REGION';
export function selectRegion(regionId) {
  return (dispatch) => {
    avert.region = regionId; // console.log(avert)

    dispatch({
      type: SELECT_REGION,
      region: regionId,
    });
  };
}

export const REQUEST_REGION_RDF = 'avert/core/REQUEST_REGION_RDF';
export const SET_EERE_LIMITS = 'avert/core/SET_EERE_LIMITS';
export const RECEIVE_REGION_RDF = 'avert/core/RECEIVE_REGION_RDF';
export const REQUEST_REGION_DEFAULTS = 'avert/core/REQUEST_REGION_DEFAULTS';
export const RECEIVE_REGION_DEFAULTS = 'avert/core/RECEIVE_REGION_DEFAULTS';
export const fetchRegion = () => {
  return function (dispatch, getState) {
    const { api } = getState();

    dispatch({ type: REQUEST_REGION_RDF });

    // fetch rdf data for region
    return fetch(`${api.baseUrl}/api/v1/rdf/${avert.regionSlug}`)
      .then(response => response.json())
      .then(json => { // console.log(json)
        avert.rdf = json.rdf; // console.log(avert)

        // set eere profile's first level validation limits (sets 'eereProfile._limits')
        eereProfile.limits = {
          hours: avert.rdf.months.length,
          annualGwh: avert.rdf.maxAnnualGwh,
          renewables: avert.rdf.maxRenewableMwh,
        }; // console.log(eereProfile)

        dispatch({
          type: SET_EERE_LIMITS,
          payload: { limits: eereProfile.limits },
        });

        dispatch({
          type: RECEIVE_REGION_RDF,
          payload: { rdf: json },
        });

        dispatch({
          type: REQUEST_REGION_DEFAULTS,
          region: avert.regionSlug,
        });

        // fetch eere data for region
        fetch(`${api.baseUrl}/api/v1/eere/${avert.regionSlug}`)
          .then(response => response.json())
          .then(json => { // console.log(json)
            avert.eereDefaults = json.eereDefaults; // console.log(avert)

            dispatch({
              type: RECEIVE_REGION_DEFAULTS,
              payload: { defaults: json.eereDefaults },
            });
          });
      });
  };
};


export const VALIDATE_EERE = "avert/core/VALIDATE_EERE";
const validateEere = () => {
  avert.eereProfile = eereProfile; // console.log(avert)

  return {
    type: VALIDATE_EERE,
    valid: eereProfile.isValid,
    errors: eereProfile.errors,
  };
};

export const UPDATE_EERE_ANNUAL_GWH = 'avert/core/UPDATE_EERE_ANNUAL_GWH';
export const updateEereAnnualGwh = (text) => {
  return function (dispatch) {
    eereProfile.annualGwh = text; // console.log(eereProfile)

    dispatch(validateEere());
    dispatch({
      type: UPDATE_EERE_ANNUAL_GWH,
      text: text,
    });
  };
};

export const UPDATE_EERE_CONSTANT_MW = 'avert/core/UPDATE_EERE_CONSTANT_MW';
export const updateEereConstantMw = (text) => {
  return function (dispatch) {
    eereProfile.constantMw = text; // console.log(eereProfile)

    dispatch(validateEere());
    dispatch({
      type: UPDATE_EERE_CONSTANT_MW,
      text: text,
    });
  };
};

export const UPDATE_EERE_BROAD_BASE_PROGRAM = 'avert/core/UPDATE_EERE_BROAD_BASE_PROGRAM';
export const updateEereBroadBasedProgram = (text) => {
  return function (dispatch) {
    eereProfile.topHours = 100;
    eereProfile.reduction = text; // console.log(eereProfile)

    dispatch(validateEere());
    dispatch({
      type: UPDATE_EERE_BROAD_BASE_PROGRAM,
      text:text,
    });
  };
};

export const UPDATE_EERE_REDUCTION = 'avert/core/UPDATE_EERE_REDUCTION';
export const updateEereReduction = (text) => {
  return function (dispatch) {
    eereProfile.reduction = text; // console.log(eereProfile)

    dispatch(validateEere());
    dispatch({
      type: UPDATE_EERE_REDUCTION,
      text: text,
    });
  };
};

export const UPDATE_EERE_TOP_HOURS = 'avert/core/UPDATE_EERE_TOP_HOURS';
export const updateEereTopHours = (text) => {
  return function (dispatch) {
    eereProfile.topHours = text; // console.log(eereProfile)

    dispatch(validateEere());
    dispatch({
      type: UPDATE_EERE_TOP_HOURS,
      text: text,
    });
  };
};

export const UPDATE_EERE_WIND_CAPACITY = 'avert/core/UPDATE_EERE_WIND_CAPACITY';
export const updateEereWindCapacity = (text) => {
  return function (dispatch) {
    eereProfile.windCapacity = text; // console.log(eereProfile)

    dispatch(validateEere());
    dispatch({
      type: UPDATE_EERE_WIND_CAPACITY,
      text: text,
    });
  };
};

export const UPDATE_EERE_UTILITY_SOLAR = 'avert/core/UPDATE_EERE_UTILITY_SOLAR';
export const updateEereUtilitySolar = (text) => {
  return function (dispatch) {
    eereProfile.utilitySolar = text; // console.log(eereProfile)

    dispatch(validateEere());
    dispatch({
      type: UPDATE_EERE_UTILITY_SOLAR,
      text: text,
    });
  };
};

export const UPDATE_EERE_ROOFTOP_SOLAR = 'avert/core/UPDATE_EERE_ROOFTOP_SOLAR';
export const updateEereRooftopSolar = (text) => {
  return function (dispatch) {
    eereProfile.rooftopSolar = text; // console.log(eereProfile)

    dispatch(validateEere());
    dispatch({
      type: UPDATE_EERE_ROOFTOP_SOLAR,
      text: text,
    });
  };
};

export const COMPLETE_EERE_CALCULATION = 'avert/core/COMPLETE_EERE_CALCULATION';
export const completeEereCalculation = (hourlyEere) => ({
  type: COMPLETE_EERE_CALCULATION,
  hourlyEere: hourlyEere,
});

export const UPDATE_EXCEEDANCES = 'avert/core/UPDATE_EXCEEDANCES';
export const updateExceedances = (soft, hard) => {
  return function (dispatch, getState) {
    const { rdfs } = getState();
    const regionalLoadHours = rdfs.rdf.rdf.regional_load;

    const softValid = soft.reduce((a, b) => a + b) === 0;
    const softMaxVal = (!softValid) ? Math.max(...soft) : 0;
    const softMaxIndex = (!softValid) ? soft.indexOf(softMaxVal) : 0;
    const softTimestamp = (!softValid) ? regionalLoadHours[softMaxIndex] : {};

    const hardValid = hard.reduce((a, b) => a + b) === 0;
    const hardMaxVal = (!hardValid) ? Math.max(...hard) : 0;
    const hardMaxIndex = (!hardValid) ? hard.indexOf(hardMaxVal) : 0;
    const hardTimestamp = (!hardValid) ? regionalLoadHours[hardMaxIndex] : {};

    return dispatch({
      type: UPDATE_EXCEEDANCES,
      payload: {
        soft_exceedances: soft,
        hard_exceedances: hard,

        softValid: softValid,
        softMaxVal: softMaxVal,
        softTimestamp: softTimestamp,

        hardValid: hardValid,
        hardMaxVal: hardMaxVal,
        hardTimestamp: hardTimestamp,
      }
    });
  };
};

export const SUBMIT_EERE_CALCULATION = 'avert/core/SUBMIT_EERE_CALCULATION';
export const calculateEereProfile = () => {
  return function (dispatch) {
    dispatch({ type: SUBMIT_EERE_CALCULATION });

    avert.calculateEereLoad();

    dispatch(completeEereCalculation(avert.eereLoad.hourlyEere));
    dispatch(updateExceedances(avert.eereLoad.softExceedances, avert.eereLoad.hardExceedances));
  }
};

export const RESET_EERE_INPUTS = 'avert/core/RESET_EERE_INPUTS';
export const resetEereInputs = () => {
  eereProfile.reset(); // console.log(eereProfile)

  return { type: RESET_EERE_INPUTS }
};


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


export const RECEIVE_DISPLACEMENT = 'avert/core/RECEIVE_DISPLACEMENT';
const receiveDisplacement = () => {
  return (dispatch, getState) => {
    const { generation, so2, nox, co2, pm25 } = getState();
    const { round, divide } = math;

    // recursively call function if data is still fetching
    if (generation.isFetching || so2.isFetching || nox.isFetching || co2.isFetching || pm25.isFetching) {
      return setTimeout(() => dispatch(receiveDisplacement()), 1000);
    }

    const displacementData = {
      generation: generation.data,
      totalEmissions: {
        so2: so2.data,
        nox: nox.data,
        co2: co2.data,
        pm25: pm25.data,
      },
      emissionRates: {
        so2: {
          original: round(divide(so2.data.original, generation.data.original), 2),
          post: round(divide(so2.data.post, generation.data.post), 2),
        },
        nox: {
          original: round(divide(nox.data.original, generation.data.original), 2),
          post: round(divide(nox.data.post, generation.data.post), 2),
        },
        co2: {
          original: round(divide(co2.data.original, generation.data.original), 2),
          post: round(divide(co2.data.post, generation.data.post), 2),
        },
        pm25: {
          original: round(divide(pm25.data.original, generation.data.original), 2),
          post: round(divide(pm25.data.post, generation.data.post), 2),
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
