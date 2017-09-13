// deps
import fetch from 'isomorphic-fetch';
import Blob from 'blob';
import json2csv from 'json2csv';
import FileSaver from 'file-saver';
import _ from 'lodash';

// avert
import {avert, eereProfile} from '../avert';
import StateEmissionsEngine from '../avert/engines/StateEmissionsEngine';
import MonthlyEmissionsEngine from '../avert/engines/MonthlyEmissionsEngine';

// store
import store from '../store';
import * as fromGeneration from '../redux/modules/generation';
import * as fromSo2 from '../redux/modules/so2';
import * as fromNox from '../redux/modules/nox';
import * as fromCo2 from '../redux/modules/co2';

// action types
export const CHANGE_ACTIVE_STEP = 'avert/core/CHANGE_ACTIVE_STEP';

export const TOGGLE_MODAL_OVERLAY = 'avert/core/TOGGLE_MODAL_OVERLAY';
export const STORE_ACTIVE_MODAL = 'avert/core/STORE_ACTIVE_MODAL';
export const RESET_ACTIVE_MODAL = 'avert/core/RESET_ACTIVE_MODAL';
export const INCREMENT_PROGRESS = 'avert/core/INCREMENT_PROGRESS';

export const SELECT_REGION = 'avert/core/SELECT_REGION';
export const SET_LIMITS = 'avert/core/SET_LIMITS';
export const UPDATE_YEAR = 'avert/core/UPDATE_YEAR';
export const UPDATE_EERE_TOP_HOURS = 'avert/core/UPDATE_EERE_TOP_HOURS';
export const UPDATE_EERE_REDUCTION = 'avert/core/UPDATE_EERE_REDUCTION';
export const UPDATE_EERE_BROAD_BASE_PROGRAM = 'avert/core/UPDATE_EERE_BROAD_BASE_PROGRAM';
export const UPDATE_EERE_ANNUAL_GWH = 'avert/core/UPDATE_EERE_ANNUAL_GWH';
export const UPDATE_EERE_CONSTANT_MW = 'avert/core/UPDATE_EERE_CONSTANT_MW';
export const UPDATE_EERE_WIND_CAPACITY = 'avert/core/UPDATE_EERE_WIND_CAPACITY';
export const UPDATE_EERE_UTILITY_SOLAR = 'avert/core/UPDATE_EERE_UTILITY_SOLAR';
export const UPDATE_EERE_ROOFTOP_SOLAR = 'avert/core/UPDATE_EERE_ROOFTOP_SOLAR';
export const VALIDATE_EERE = "avert/core/VALIDATE_EERE";
export const UPDATE_EXCEEDANCES = "avert/core/UPDATE_EXCEEDANCES";
export const RESET_EERE_INPUTS = 'avert/core/RESET_EERE_INPUTS';

export const SUBMIT_CALCULATION = 'avert/core/SUBMIT_CALCULATION';
export const COMPLETE_CALCULATION = "avert/core/COMPLETE_CALCULATION";
export const START_DISPLACEMENT = 'avert/core/START_DISPLACEMENT';
export const INVALIDATE_DISPLACEMENT = 'avert/core/INVALIDATE_DISPLACEMENT';
export const REQUEST_DISPLACEMENT = 'avert/core/REQUEST_DISPLACEMENT';
export const RECEIVE_DISPLACEMENT = 'avert/core/RECEIVE_DISPLACEMENT';
export const COMPLETE_ANNUAL = 'avert/core/COMPLETE_ANNUAL';
export const COMPLETE_ANNUAL_GENERATION = 'avert/core/COMPLETE_ANNUAL_GENERATION';
export const COMPLETE_ANNUAL_SO2 = 'avert/core/COMPLETE_ANNUAL_SO2';
export const COMPLETE_ANNUAL_NOX = 'avert/core/COMPLETE_ANNUAL_NOX';
export const COMPLETE_ANNUAL_CO2 = 'avert/core/COMPLETE_ANNUAL_CO2';
export const COMPLETE_ANNUAL_RATES = 'avert/core/COMPLETE_ANNUAL_RATES';
export const COMPLETE_MONTHLY = 'avert/core/COMPLETE_MONTHLY';
export const SELECT_AGGREGATION = 'avert/core/SELECT_AGGREGATION';
export const SELECT_STATE = 'avert/core/SELECT_STATE';
export const SELECT_COUNTY = 'avert/core/SELECT_COUNTY';
export const SELECT_UNIT = 'avert/core/SELECT_UNIT';
export const RENDER_MONTHLY_CHARTS = 'avert/core/RENDER_MONTHLY_CHARTS';
export const COMPLETE_STATE = 'avert/core/COMPLETE_STATE';
export const RESET_MONTHLY_EMISSIONS = 'avert/core/RESET_MONTHLY_EMISSIONS';

export const INVALIDATE_REGION = 'avert/core/INVALIDATE_REGION';
export const REQUEST_REGION = 'avert/core/REQUEST_REGION';
export const RECEIVE_REGION = 'avert/core/RECEIVE_REGION';
export const OVERRIDE_REGION = 'avert/core/OVERRIDE_REGION';
export const INVALIDATE_DEFAULTS = 'avert/core/INVALIDATE_DEFAULTS';
export const REQUEST_DEFAULTS = 'avert/core/REQUEST_DEFAULTS';
export const RECEIVE_DEFAULTS = 'avert/core/RECEIVE_DEFAULTS';
export const ADD_RDF = 'avert/core/ADD_RDF';
export const START_DATA_DOWNLOAD = 'avert/core/START_DATA_DOWNLOAD';
export const SET_DOWNLOAD_DATA = 'avert/core/SET_DOWNLOAD_DATA';

// action creators
export const setActiveStep = (number) => ({
  type: CHANGE_ACTIVE_STEP,
  payload: {
    stepNumber: number
  },
});

export const toggleModalOverlay = () => ({
  type: TOGGLE_MODAL_OVERLAY,
});

export const storeActiveModal = (activeModalId) => ({
  type: STORE_ACTIVE_MODAL,
  activeModalId,
});

export const resetActiveModal = (activeModalId) => ({
  type: RESET_ACTIVE_MODAL,
  activeModalId,
});

export const incrementProgress = () => ({
  type: INCREMENT_PROGRESS
});

//Use this when downloading another region
export const invalidateDefaults = (region) => ({
  type: INVALIDATE_DEFAULTS,
  region,
});

const requestDefaults = (region) => ({
  type: REQUEST_DEFAULTS,
  region,
});

const receiveDefaults = (region, defaults) => {
  avert.setDefaults(defaults.eereDefaults);

  return {
    type: RECEIVE_DEFAULTS,
    payload: {
      defaults: defaults.eereDefaults
    },
  }
};

export const fetchDefaults = () => {
  return function (dispatch, getState) {
    const {api} = getState();

    const region = avert.regionData;
    dispatch(requestDefaults(region.slug));

    return fetch(`${api.baseUrl}/api/v1/eere/${region.slug}`)
    // return fetch(`./data/${region.defaults}.json`, {credentials: 'same-origin'})
      .then(response => response.json())
      .then(json => dispatch(receiveDefaults(region.slug, json)))
  };
};

//Use this when downloading another region
export const invalidateRegion = (region) => ({
  type: INVALIDATE_REGION,
  region,
});

const requestRegion = (region) => ({
  type: REQUEST_REGION,
  region,
});

const setLimits = () => {
  eereProfile.limits = {
    constantReductions: avert.firstLimits ? avert.firstLimits.max_ee_yearly_gwh : false,
    renewables: avert.firstLimits ? avert.firstLimits.max_solar_wind_mwh : false,
  };

  return {
    type: SET_LIMITS,
    payload: {
      limits: eereProfile.limits
    }
  }
};

const emitReceiveRegion = (rdf) => ({
  type: RECEIVE_REGION,
  payload: {
    rdf: rdf
  },
});

const receiveRegion = (region, json) => {
  return function (dispatch) {
    avert.setRdf(json.rdf);
    dispatch(setLimits());
    return dispatch(emitReceiveRegion(json));
  };
};

//Deprecate?
let nextRdfId = 0;
export const addRdf = (rdf) => ({
  type: ADD_RDF,
  id: nextRdfId++,
  rdf,
});

export const fetchRegion = () => {
  return function (dispatch, getState) {
    const {api,rdfs} = getState();

    if (rdfs.debug) return Promise.resolve();

    const region = avert.regionData;
    dispatch(requestRegion(region.slug));

    return fetch(`${api.baseUrl}/api/v1/rdf/${region.slug}`)
    // return fetch(`./data/${region.rdf}.json`, {credentials: 'same-origin'})
      .then(response => response.json())
      .then(json => dispatch(receiveRegion(region.slug, json)))
      .then(action => dispatch(fetchDefaults()));
  };
};

const changeRegion = (region) => ({
  type: SELECT_REGION,
  region: region,
});

export const selectRegion = (region) => {
  return function (dispatch) {
    const formattedRegion = parseInt(region, 10);
    avert.region = formattedRegion;
    dispatch(changeRegion(formattedRegion));
  };
};

export const validateEere = () => {
  avert.setEereProfile(eereProfile);

  const valid = eereProfile.isValid;
  const errors = eereProfile.errors;

  return {
    type: VALIDATE_EERE,
    valid,
    errors,
  };
};

export const updateEereTopHours = (text) => {
  eereProfile.topHours = text;
  store.dispatch(validateEere());

  return {
    type: UPDATE_EERE_TOP_HOURS,
    text,
  };
};

export const updateEereReduction = (text) => {
  eereProfile.reduction = text;
  store.dispatch(validateEere());

  return {
    type: UPDATE_EERE_REDUCTION,
    text,
  };
};

export const updateEereBroadBasedProgram = (text) => {
  eereProfile.topHours = 100;
  eereProfile.reduction = text;
  store.dispatch(validateEere());

  return {
    type: UPDATE_EERE_BROAD_BASE_PROGRAM,
    text,
  };
};

export const updateEereAnnualGwh = (text) => {
  eereProfile.annualGwh = text;
  store.dispatch(validateEere());

  return {
    type: UPDATE_EERE_ANNUAL_GWH,
    text,
  };
};

export const updateEereConstantMw = (text) => {
  eereProfile.constantMw = text;
  store.dispatch(validateEere());

  return {
    type: UPDATE_EERE_CONSTANT_MW,
    text,
  };
};

export const updateEereWindCapacity = (text) => {
  eereProfile.windCapacity = text;
  store.dispatch(validateEere());

  return {
    type: UPDATE_EERE_WIND_CAPACITY,
    text,
  };
};

export const updateEereUtilitySolar = (text) => {
  eereProfile.utilitySolar = text;
  store.dispatch(validateEere());

  return {
    type: UPDATE_EERE_UTILITY_SOLAR,
    text,
  };
};

export const updateEereRooftopSolar = (text) => {
  eereProfile.rooftopSolar = text;
  store.dispatch(validateEere());

  return {
    type: UPDATE_EERE_ROOFTOP_SOLAR,
    text,
  };
};

export const updateExceedances = (exceedances, soft, hard) => {
  return function (dispatch, getState) {
    const {rdfs} = getState();
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
        exceedances,
        soft_exceedances: soft,
        hard_exceedances: hard,
        valid,
        maxVal,
        maxIndex,
        softValid,
        softMaxVal,
        softMaxIndex,
        softTimestamp,
        hardValid,
        hardMaxVal,
        hardMaxIndex,
        hardTimestamp,
      }
    });
  }
};

export const resetEereInputs = () => {
  eereProfile.reset();

  return {
    type: RESET_EERE_INPUTS,
  }
};

export const completeCalculation = (hourlyEere) => ({
  type: COMPLETE_CALCULATION,
  hourlyEere,
});

const submitCalculation = () => ({
  type: SUBMIT_CALCULATION,
});

export const calculateEereProfile = () => {
  store.dispatch(submitCalculation());

  setTimeout(() => {
    avert.calculateEereLoad();
  }, 50);
};

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

export const completeStateEmissions = (data) => ({
  type: COMPLETE_STATE,
  data,
});

export const resetMonthlyEmissions = () => ({
  type: RESET_MONTHLY_EMISSIONS,
})

export const renderMonthlyEmissionsCharts = () => ({
  type: RENDER_MONTHLY_CHARTS,
});

export const prepareDownloadData = (data) => ({
  type: SET_DOWNLOAD_DATA,
  data,
});

export const completeMonthlyEmissions = (data) => {
  return function (dispatch, getState) {
    const {monthlyEmissions} = getState();

    dispatch({
      type: COMPLETE_MONTHLY,
      data,
    });

    dispatch(prepareDownloadData(data));
    dispatch(renderMonthlyEmissionsCharts(monthlyEmissions));
  }
};

export const updateMonthlyAggregation = (aggregation) => {
  return function (dispatch, getState) {
    const {monthlyEmissions} = getState();

    dispatch({
      type: SELECT_AGGREGATION,
      aggregation,
    });

    return dispatch(renderMonthlyEmissionsCharts(monthlyEmissions));
  }
};


export const updateMonthlyUnit = (unit) => {
  return function (dispatch, getState) {
    const {monthlyEmissions} = getState();

    dispatch({
      type: SELECT_UNIT,
      unit,
    });

    return dispatch(renderMonthlyEmissionsCharts(monthlyEmissions));
  }
};

export const selectState = (state) => {
  return function (dispatch, getState) {
    const {monthlyEmissions} = getState();
    const visibleCounties = monthlyEmissions.newCounties[state];

    dispatch({
      type: SELECT_STATE,
      state,
      visibleCounties,
    });

    return dispatch(renderMonthlyEmissionsCharts(monthlyEmissions));
  }
};

export const selectCounty = (county) => {
  return function (dispatch, getState) {
    const {monthlyEmissions} = getState();

    dispatch({
      type: SELECT_COUNTY,
      county,
    });

    return dispatch(renderMonthlyEmissionsCharts(monthlyEmissions));
  }
};

export const invalidateDisplacement = () => ({
  type: 'INVALIDATE_DISPLACEMENT',
});

export const requestDisplacement = () => ({
  type: 'REQUEST_DISPLACEMENT',
});

export const receiveDisplacement = () => {
  return (dispatch,getState) => {

    dispatch({
      type: 'ATTEMPTING_TO_CALCULATE_DISPLACEMENT_VALUES'
    });

    const {generation,so2,nox,co2} = getState();
    if(generation.isFetching || so2.isFetching || nox.isFetching || co2.isFetching) {
      return setTimeout(() => dispatch(receiveDisplacement()),30000);
    }

    dispatch(incrementProgress());

    const data = {
      generation: fromGeneration.getGenerationData(getState()),
      totalEmissions: {
        so2: fromSo2.getSo2Data(getState()),
        nox: fromNox.getNoxData(getState()),
        co2: fromCo2.getCo2Data(getState()),
      },
      emissionRates: {
        so2: fromSo2.getSo2Rate(getState()),
        nox: fromNox.getNoxRate(getState()),
        co2: fromCo2.getCo2Rate(getState()),
      },
    };

    dispatch({
      type: RECEIVE_DISPLACEMENT,
      data
    });

    const stateEngine = new StateEmissionsEngine();
    const stateData = stateEngine.extract(data);
    dispatch(completeStateEmissions(stateData));

    const monthlyEngine = new MonthlyEmissionsEngine();
    const monthlyData = monthlyEngine.extract(data);

    return dispatch(completeMonthlyEmissions(monthlyData));
  };
};

const fetchDisplacement = (rdf, eere) => {
  return dispatch => {
    dispatch(requestDisplacement());

    const options = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      body: JSON.stringify({rdf: avert.rdfClass.toJsonString(), eere: avert.hourlyEere}),
    };

    return fetch('https://app7.erg.com/avert/api/v1/displacements', options)
    // return fetch('http://app7.erg.com/avert/api/v1/displacements')
    // return fetch(`http://localhost:3001/api/v1/displacements`, options)
    // return fetch('https://epa-avert-microservice.herokuapp.com/api/v1/displacements', options)
    // return fetch('http://sample-env.um6jxw6p3t.us-west-2.elasticbeanstalk.com/', options)
      .then(response => response.json())
      .then(json => dispatch(receiveDisplacement(json)));
  }
};

const shouldFetchDisplacement = (dispatch, getState) => {
  //check if data is redundant
  //If existing data but not relevant, invalidate data
  return true;
};

export const fetchDisplacementIfNeeded = () => {
  return (dispatch, getState) => {
    if (shouldFetchDisplacement(dispatch, getState)) {
      return dispatch(fetchDisplacement('rdf', 'eere'));
    }
  }
};

const startDisplacement = () => ({
  type: START_DISPLACEMENT,
});

export function calculateDisplacement() {
  return dispatch => {
    dispatch(startDisplacement());
    dispatch(incrementProgress());
    const generation = dispatch(fromGeneration.fetchGeneration());

    return Promise.resolve(generation)
    .then(() => {
      return Promise.all([
        dispatch(fromSo2.fetchSo2()),
        dispatch(fromNox.fetchNox()),
        dispatch(fromCo2.fetchCo2()),
      ])
      .then(() => dispatch(receiveDisplacement()))
    })
  }
}

export const startDataDownload = () => {
  return (dispatch, getState) => {
    const {monthlyEmissions} = getState();
    const allMonthlyEmissions = monthlyEmissions.newDownloadableData;
    const fields = [
      'type',
      'aggregation_level',
      'state',
      'county',
      'emission_unit',
      'january',
      'february',
      'march',
      'april',
      'may',
      'june',
      'july',
      'august',
      'september',
      'october',
      'november',
      'december',
    ];

    try {
      const csv = json2csv({fields: fields, data: allMonthlyEmissions});
      const blob = new Blob([csv], {type: 'text/plain:charset=utf-8'});
      FileSaver.saveAs(blob, 'AVERT Monthly Emissions.csv');
    } catch (e) {
      console.error(e);
    }

    return dispatch({
      type: START_DATA_DOWNLOAD
    });
  }
};

