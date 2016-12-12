import fetch from 'isomorphic-fetch';
// avert
import { avert, eereProfile } from '../avert';
import * as northeast_rdf from '../../assets/data/rdf_northeast_2015.json';
import * as northeast_defaults from '../../assets/data/eere-defaults-northeast.json';
// store
import store from '../store';

// action types
export const CHANGE_ACTIVE_STEP = 'CHANGE_ACTIVE_STEP';

export const SELECT_REGION = 'SELECT_REGION';
export const SET_LIMITS = 'SET_LIMITS';
export const UPDATE_YEAR = 'UPDATE_YEAR';

export const UPDATE_EERE_TOP_HOURS = 'UPDATE_EERE_TOP_HOURS';
export const UPDATE_EERE_REDUCTION = 'UPDATE_EERE_REDUCTION';
export const UPDATE_EERE_BROAD_BASE_PROGRAM = 'UPDATE_EERE_BROAD_BASE_PROGRAM';
export const UPDATE_EERE_ANNUAL_GWH = 'UPDATE_EERE_ANNUAL_GWH';
export const UPDATE_EERE_CONSTANT_MW = 'UPDATE_EERE_CONSTANT_MW';
export const UPDATE_EERE_WIND_CAPACITY = 'UPDATE_EERE_WIND_CAPACITY';
export const UPDATE_EERE_UTILITY_SOLAR = 'UPDATE_EERE_UTILITY_SOLAR';
export const UPDATE_EERE_ROOFTOP_SOLAR = 'UPDATE_EERE_ROOFTOP_SOLAR';

export const VALIDATE_EERE = "VALIDATE_EERE";
export const UPDATE_EXCEEDANCES = "UPDATE_EXCEEDANCES";

export const RESET_EERE_INPUTS = 'RESET_EERE_INPUTS';
export const RESET_EERE_HOURLY = 'RESET_EERE_HOURLY';

export const SUBMIT_PARAMS = 'SUBMIT_PARAMS';
export const SUBMIT_CALCULATION = 'SUBMIT_CALCULATION';
export const COMPLETE_CALCULATION = "COMPLETE_CALCULATION";

export const START_DISPLACEMENT = 'START_DISPLACEMENT';
export const COMPLETE_ANNUAL = 'COMPLETE_ANNUAL';
export const COMPLETE_ANNUAL_GENERATION = 'COMPLETE_ANNUAL_GENERATION';
export const COMPLETE_ANNUAL_SO2 = 'COMPLETE_ANNUAL_SO2';
export const COMPLETE_ANNUAL_NOX = 'COMPLETE_ANNUAL_NOX';
export const COMPLETE_ANNUAL_CO2 = 'COMPLETE_ANNUAL_CO2';
export const COMPLETE_ANNUAL_RATES = 'COMPLETE_ANNUAL_RATES';
export const COMPLETE_MONTHLY = 'COMPLETE_MONTHLY';

export const SELECT_AGGREGATION = 'SELECT_AGGREGATION';
export const SELECT_STATE = 'SELECT_STATE';
export const SELECT_COUNTY = 'SELECT_COUNTY';
export const SELECT_UNIT = 'SELECT_UNIT';

export const COMPLETE_STATE = 'COMPLETE_STATE';
export const FOO_COMPLETE_STATE = 'FOO_COMPLETE_STATE';

export const INVALIDATE_REGION = 'INVALIDATE_REGION';
export const REQUEST_REGION = 'REQUEST_REGION';
export const RECEIVE_REGION = 'RECEIVE_REGION';
export const OVERRIDE_REGION = 'OVERRIDE_REGION';
export const INVALIDATE_DEFAULTS = 'INVALIDATE_DEFAULTS';
export const REQUEST_DEFAULTS = 'REQUEST_DEFAULTS';
export const RECEIVE_DEFAULTS = 'RECEIVE_DEFAULTS';

export const ADD_RDF = 'ADD_RDF';

// action creators
export const setActiveStep = (number) => ({
  type: CHANGE_ACTIVE_STEP,
  payload: {
    stepNumber: number
  },
});

export const invalidateDefaults = (region) => ({
  type: INVALIDATE_DEFAULTS,
  region,
});

const requestDefaults = (region) => ({
  type: REQUEST_DEFAULTS,
  region,
});

const receiveDefaults = (region, defaults) => {
  avert.setDefaults(defaults);

  return {
    type: RECEIVE_DEFAULTS,
    payload: {
      defaults: defaults
    },
  }
};

export const fetchDefaults = () => {
  return function(dispatch) {
    const region = avert.regionData;
    dispatch(requestDefaults(region.slug));

    return fetch(`http://appdev6.erg.com/avert/data/${region.defaults}.json`)
      .then(response => response.json())
      .then(json => dispatch(receiveDefaults(region.slug, json)))
  };
};

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

const emitReceiveRegion = (rdf) => {
  return {
    type: RECEIVE_REGION,
    payload: {
      rdf: rdf
    },
  }
};

const receiveRegion = (region, json) => {
  return function(dispatch) {
    avert.setRdf(json);
    dispatch(setLimits());
    return dispatch(emitReceiveRegion(json));
  };
};

let nextRdfId = 0;
export const addRdf = (rdf) => ({
  type: ADD_RDF,
  id: nextRdfId++,
  rdf,
});

export const fetchRegion = () => {
  return function(dispatch) {
    const region = avert.regionData;
    dispatch(requestRegion(region.slug));

    return fetch(`http://appdev6.erg.com/avert/data/${region.rdf}.json`)
      .then(response => response.json())
      .then(json =>
        dispatch(receiveRegion(region.slug, json))
      ).then(dispatch(fetchDefaults()));
  };
};

const changeRegion = (region) => ({
  type: SELECT_REGION,
  region: region,
});

export const selectRegion = (region) => {
  return function(dispatch) {
    const formattedRegion = parseInt(region, 10);
    avert.region = formattedRegion;
    dispatch(changeRegion(formattedRegion));
  };
};

export const overrideRegion = () => {
  return function(dispatch) {
    dispatch(changeRegion(3));
    dispatch(receiveRegion('NE', northeast_rdf));
    dispatch(receiveDefaults('NE', northeast_defaults));
  }
};

export const submitParams = () => {
  // avert.eereProfile = eereProfile;
  avert.setEereProfile(eereProfile);

  const valid = eereProfile.isValid;
  const errors = eereProfile.errors;

  return [{
    type: VALIDATE_EERE,
    valid,
    errors,
  }, {
    type: SUBMIT_PARAMS,
  }];
};

export const updateEereTopHours = (text) => {
  eereProfile.topHours = text;
  store.dispatch(submitParams());

  return {
    type: UPDATE_EERE_TOP_HOURS,
    text,
  };
};

export const updateEereReduction = (text) => {
  eereProfile.reduction = text;
  store.dispatch(submitParams());

  return {
    type: UPDATE_EERE_REDUCTION,
    text,
  };
};

export const updateEereBroadBasedProgram = (text) => {
  eereProfile.topHours = 100;
  eereProfile.reduction = text;
  store.dispatch(submitParams());

  return {
    type: UPDATE_EERE_BROAD_BASE_PROGRAM,
    text,
  };
};

export const updateEereAnnualGwh = (text) => {
  eereProfile.annualGwh = text;
  store.dispatch(submitParams());

  return {
    type: UPDATE_EERE_ANNUAL_GWH,
    text,
  };
};

export const updateEereConstantMw = (text) => {
  eereProfile.constantMw = text;
  store.dispatch(submitParams());

  return {
    type: UPDATE_EERE_CONSTANT_MW,
    text,
  };
};

export const updateEereWindCapacity = (text) => {
  eereProfile.windCapacity = text;
  store.dispatch(submitParams());

  return {
    type: UPDATE_EERE_WIND_CAPACITY,
    text,
  };
};

export const updateEereUtilitySolar = (text) => {
  eereProfile.utilitySolar = text;
  store.dispatch(submitParams());

  return {
    type: UPDATE_EERE_UTILITY_SOLAR,
    text,
  };
};

export const updateEereRooftopSolar = (text) => {
  eereProfile.rooftopSolar = text;
  store.dispatch(submitParams());

  return {
    type: UPDATE_EERE_ROOFTOP_SOLAR,
    text,
  };
};

export const updateExceedances = (exceedances, soft, hard) => ({
  type: UPDATE_EXCEEDANCES,
  exceedances,
  soft_exceedances: soft,
  hard_exceedances: hard,
});

export const resetEereInputs = () => ({
  type: RESET_EERE_INPUTS,
});

export const resetEereHourly = () => ({
  type: RESET_EERE_HOURLY,
});

export const completeCalculation = (hourlyEere) => ({
  type: COMPLETE_CALCULATION,
  hourlyEere,
});

const submitCalculation = () => ({
  type: SUBMIT_CALCULATION,
});

export const calculateEereProfile =  () => {
  store.dispatch(submitCalculation());

  setTimeout(() => {
    avert.calculateEereLoad();
  }, 50);
};

export const completeAnnual = (data) => ({
  type: COMPLETE_ANNUAL,
  data,
});

export const completeAnnualGeneration = (data) => ({
  type: COMPLETE_ANNUAL_GENERATION,
  payload: {
    data: data,
  },
});

export const completeAnnualSo2 = (data) => ({
  type: COMPLETE_ANNUAL_SO2,
  payload: {
    data: data,
  },
});

export const completeAnnualNox = (data) => ({
  type: COMPLETE_ANNUAL_NOX,
  payload: {
    data: data,
  },
});

export const completeAnnualCo2 = (data) => ({
  type: COMPLETE_ANNUAL_CO2,
  payload: {
    data: data,
  },
});

export const completeAnnualRates = (data) => ({
  type: COMPLETE_ANNUAL_RATES,
  payload: {
    data: data,
  },
});

export const completeMonthlyEmissions = (data) => ({
  type: COMPLETE_MONTHLY,
  so2: data.so2,
  nox: data.nox,
  co2: data.co2,
});

export const updateMonthlyAggregation = (aggregation) => ({
  type: SELECT_AGGREGATION,
  aggregation,
});

export const updateMonthlyUnit = (unit) => ({
  type: SELECT_UNIT,
  unit,
});

export const selectState = (state) => ({
  type: SELECT_STATE,
  state,
});

export const selectCounty = (county) => ({
  type: SELECT_COUNTY,
  county,
});

export const completeStateEmissions = (data) => ({
  type: COMPLETE_STATE,
  data,
});

export const foo_completeStateEmissions = (data) => ({
  type: FOO_COMPLETE_STATE,
  data,
});

const startDisplacement = () => ({
  type: START_DISPLACEMENT,
});

export const calculateDisplacement = () => {
  store.dispatch(startDisplacement());

  setTimeout(() => {
    avert.calculateDisplacement();
  }, 50);
};
