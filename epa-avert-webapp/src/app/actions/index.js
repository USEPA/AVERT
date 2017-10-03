import math from 'mathjs';

// engine
import { avert, eereProfile } from 'app/avert';
import StateEmissionsEngine from 'app/avert/engines/StateEmissionsEngine';
import MonthlyEmissionsEngine from 'app/avert/engines/MonthlyEmissionsEngine';

// reducers
import * as fromGeneration from 'app/redux/generation';
import * as fromSo2 from 'app/redux/so2';
import * as fromNox from 'app/redux/nox';
import * as fromCo2 from 'app/redux/co2';


// actions and action creators
export const INCREMENT_PROGRESS = 'avert/core/INCREMENT_PROGRESS';
export const incrementProgress = () => ({ type: INCREMENT_PROGRESS });


export const SELECT_REGION = 'avert/core/SELECT_REGION';
export function selectRegion(regionId) {
  return (dispatch) => {
    const selectedRegionId = parseInt(regionId, 10);
    // set region in avert engine and dispatch 'select region' event
    avert.region = selectedRegionId;
    dispatch({
      type: SELECT_REGION,
      region: selectedRegionId,
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
    // get regionData from avert engine
    const region = avert.regionData;
    // dispatch 'request region rdf' action
    dispatch({
      type: REQUEST_REGION_RDF,
      region: region.slug,
    });
    // fetch rdf data for region
    return fetch(`${api.baseUrl}/api/v1/rdf/${region.slug}`)
      .then(response => response.json())
      .then(json => {
        // set rdf in avert engine
        avert.setRdf(json.rdf);
        // set eere profile's limits
        eereProfile.limits = {
          constantReductions: avert.firstLimits ? avert.firstLimits.max_ee_yearly_gwh : false,
          renewables: avert.firstLimits ? avert.firstLimits.max_solar_wind_mwh : false,
        };
        // dispatch 'set eere limits' action
        dispatch({
          type: SET_EERE_LIMITS,
          payload: {
            limits: eereProfile.limits
          }
        });
        // dispatch 'reveive region rdf' action
        dispatch({
          type: RECEIVE_REGION_RDF,
          payload: {
            rdf: json
          },
        });
        // dispatch 'request region defaults' action
        dispatch({
          type: REQUEST_REGION_DEFAULTS,
          region: region.slug,
        });
        // fetch eere data for region
        fetch(`${api.baseUrl}/api/v1/eere/${region.slug}`)
          .then(response => response.json())
          .then(json => {
            // set defaults in avert engine
            avert.setDefaults(json.eereDefaults);
            // dispatch 'receive region defaults' action
            dispatch({
              type: RECEIVE_REGION_DEFAULTS,
              payload: {
                defaults: json.eereDefaults
              }
            });
          });
      });
  };
};


export const VALIDATE_EERE = "avert/core/VALIDATE_EERE";
export const validateEere = () => {
  // set eere profile in avert engine and return validation action
  avert.setEereProfile(eereProfile);
  return {
    type: VALIDATE_EERE,
    valid: eereProfile.isValid,
    errors: eereProfile.errors,
  };
};

export const UPDATE_EERE_ANNUAL_GWH = 'avert/core/UPDATE_EERE_ANNUAL_GWH';
export const updateEereAnnualGwh = (text) => {
  return function (dispatch) {
    // set eere profile's annualGwh
    eereProfile.annualGwh = text;
    // dispatch validation and update actions
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
    // set eere profile's constantMw
    eereProfile.constantMw = text;
    // dispatch validation and update actions
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
    // set eere profile's topHours and reduction
    eereProfile.topHours = 100;
    eereProfile.reduction = text;
    // dispatch validation and update actions
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
    // set eere profile's reduction
    eereProfile.reduction = text;
    // dispatch validation and update actions
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
    // set eere profile's topHours
    eereProfile.topHours = text;
    // dispatch validation and update actions
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
    // set eere profile's windCapacity
    eereProfile.windCapacity = text;
    // dispatch validation and update actions
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
    // set eere profile's utilitySolar
    eereProfile.utilitySolar = text;
    // dispatch validation and update actions
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
    // set eere profile's rooftopSolar
    eereProfile.rooftopSolar = text;
    dispatch(validateEere());
    dispatch({
      type: UPDATE_EERE_ROOFTOP_SOLAR,
      text: text,
    });
  };
};

export const SUBMIT_EERE_CALCULATION = 'avert/core/SUBMIT_EERE_CALCULATION';
export const calculateEereProfile = () => {
  // after delay, calculate eere load in avert engine and return action
  setTimeout(() => avert.calculateEereLoad(), 50);
  return {
    type: SUBMIT_EERE_CALCULATION,
  };
};

export const COMPLETE_EERE_CALCULATION = "avert/core/COMPLETE_EERE_CALCULATION";
export const completeEereCalculation = (hourlyEere) => ({
  type: COMPLETE_EERE_CALCULATION,
  hourlyEere: hourlyEere,
});

export const UPDATE_EXCEEDANCES = "avert/core/UPDATE_EXCEEDANCES";
export const updateExceedances = (exceedances, soft, hard) => {
  return function (dispatch, getState) {
    const { rdfs } = getState();
    //TODO: Pull these calculations out into a util, run them in the action, then pass them to the reducers
    const valid = exceedances.reduce((a, b) => a + b) === 0;
    const maxVal = (!valid) ? Math.max(...exceedances) : 0;
    const maxIndex = (!valid) ? exceedances.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0) : 0;

    const softValid = soft.reduce((a, b) => a + b) === 0;
    const softMaxVal = (!valid) ? Math.max(...soft) : 0;
    const softMaxIndex = (!valid) ? soft.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0) : 0;
    const softTimestamp = (softMaxIndex !== 0) ? rdfs.rdf.regional_load[softMaxIndex] : {};

    const hardValid = hard.reduce((a, b) => a + b) === 0;
    const hardMaxVal = (!valid) ? Math.max(...hard) : 0;
    const hardMaxIndex = (!valid) ? hard.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0) : 0;
    const hardTimestamp = (hardMaxIndex !== 0) ? rdfs.rdf.regional_load[hardMaxIndex] : {};

    return dispatch({
      type: UPDATE_EXCEEDANCES,
      payload: {
        exceedances: exceedances,
        soft_exceedances: soft,
        hard_exceedances: hard,

        valid: valid,
        maxVal: maxVal,
        maxIndex: maxIndex,

        softValid: softValid,
        softMaxVal: softMaxVal,
        softMaxIndex: softMaxIndex,
        softTimestamp: softTimestamp,

        hardValid: hardValid,
        hardMaxVal: hardMaxVal,
        hardMaxIndex: hardMaxIndex,
        hardTimestamp: hardTimestamp,
      }
    });
  };
};

export const RESET_EERE_INPUTS = 'avert/core/RESET_EERE_INPUTS';
export const resetEereInputs = () => {
  // call reset on eere profile and return reset eere action
  eereProfile.reset();
  return {
    type: RESET_EERE_INPUTS,
  }
};





const COMPLETE_ANNUAL_GENERATION = 'avert/core/COMPLETE_ANNUAL_GENERATION';
export const completeAnnualGeneration = (data) => {
  return function (dispatch, getState) {
    dispatch({
      type: COMPLETE_ANNUAL_GENERATION,
      payload: {
        data: data,
      }
    });

    setTimeout(() => {
      avert.getSo2();
      return Promise.resolve();
    }, 100);

  }
};

const COMPLETE_ANNUAL_SO2 = 'avert/core/COMPLETE_ANNUAL_SO2';
export const completeAnnualSo2 = (data) => {
  return function (dispatch, getState) {
    dispatch({
      type: COMPLETE_ANNUAL_SO2,
      payload: {
        data: data,
      },
    });

    setTimeout(() => {
      avert.getNox();
      return Promise.resolve();
    }, 100);
  };
};

const COMPLETE_ANNUAL_NOX = 'avert/core/COMPLETE_ANNUAL_NOX';
export const completeAnnualNox = (data) => {
  return function (dispatch, getState) {
    dispatch({
      type: COMPLETE_ANNUAL_NOX,
      payload: {
        data: data,
      },
    });

    setTimeout(() => {
      avert.getCo2();
      return Promise.resolve();
    }, 100);
  };
};

const COMPLETE_ANNUAL_CO2 = 'avert/core/COMPLETE_ANNUAL_CO2';
export const completeAnnualCo2 = (data) => {
  return function (dispatch, getState) {
    dispatch({
      type: COMPLETE_ANNUAL_CO2,
      payload: {
        data: data,
      },
    });

    setTimeout(() => {
      avert.getEmissionRates();
      return Promise.resolve();
    }, 100);
  };
};

const COMPLETE_ANNUAL_RATES = 'avert/core/COMPLETE_ANNUAL_RATES';
export const completeAnnualRates = (data) => {
  return function (dispatch, getState) {
    dispatch({
      type: COMPLETE_ANNUAL_RATES,
      payload: {
        data: data,
      },
    });

    setTimeout(() => {
      avert.getAnnual();
      return Promise.resolve();
    }, 100);
  }
};

export const COMPLETE_ANNUAL = 'avert/core/COMPLETE_ANNUAL';
export const completeAnnual = (data) => {
  return function (dispatch, getState) {
    dispatch({
      type: COMPLETE_ANNUAL,
      data,
    });

    setTimeout(() => {
      avert.getStateEmissions();
      return Promise.resolve();
    }, 100);
  }
};

export const COMPLETE_STATE_EMISSIONS = 'avert/core/COMPLETE_STATE_EMISSIONS';
export const completeStateEmissions = (data) => ({
  type: COMPLETE_STATE_EMISSIONS,
  data: data,
});





export const RENDER_MONTHLY_EMISSIONS_CHARTS = 'avert/core/RENDER_MONTHLY_EMISSIONS_CHARTS';
export const renderMonthlyEmissionsCharts = () => ({
  type: RENDER_MONTHLY_EMISSIONS_CHARTS,
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
      visibleCounties: monthlyEmissions.newCounties[state],
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
    const { generation, so2, nox, co2 } = getState();
    const { round, divide } = math;

    // recursively call function if data is still fetching
    if (generation.isFetching || so2.isFetching || nox.isFetching || co2.isFetching) {
      return setTimeout(() => dispatch(receiveDisplacement()), 1000);
    }

    const data = {
      generation: generation.data,
      totalEmissions: {
        so2: so2.data,
        nox: nox.data,
        co2: co2.data,
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
      },
    };

    // dispatch 'increment progress' and 'receive displacement' actions
    dispatch(incrementProgress());
    dispatch({
      type: RECEIVE_DISPLACEMENT,
      data: data,
    });

    // create state engine and dispatch action
    const stateEngine = new StateEmissionsEngine();
    const stateData = stateEngine.extract(data);
    dispatch(completeStateEmissions(stateData));

    // create monthly engine and dispatch action
    const monthlyEngine = new MonthlyEmissionsEngine();
    const monthlyData = monthlyEngine.extract(data);
    return dispatch(completeMonthlyEmissions(monthlyData));
  };
};

export const START_DISPLACEMENT = 'avert/core/START_DISPLACEMENT';
export function calculateDisplacement() {
  return (dispatch) => {
    // dispatch 'start displacement' and 'increment progress' actions
    dispatch({ type: START_DISPLACEMENT });
    dispatch(incrementProgress());

    // fetch generation, so2, nox, and co2
    dispatch(fromGeneration.fetchGeneration());
    dispatch(fromSo2.fetchSo2());
    dispatch(fromNox.fetchNox());
    dispatch(fromCo2.fetchCo2());

    // receive displacement
    dispatch(receiveDisplacement());
  }
}
