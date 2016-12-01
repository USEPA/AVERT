import fetch from 'isomorphic-fetch';
// avert
import { avert, eereProfile } from '../avert';
// store
import store from '../store';

// action types
export const CHANGE_ACTIVE_STEP = 'CHANGE_ACTIVE_STEP';

export const SELECT_REGION = 'SELECT_REGION';
export const SET_LIMITS = 'SET_LIMITS';
export const UPDATE_YEAR = 'UPDATE_YEAR';

export const UPDATE_EERE_TOP_HOURS = 'UPDATE_EERE_TOP_HOURS';
export const UPDATE_EERE_REDUCTION = 'UPDATE_EERE_REDUCTION';
export const UPDATE_EERE_ANNUAL_GWH = 'UPDATE_EERE_ANNUAL_GWH';
export const UPDATE_EERE_CONSTANT_MW = 'UPDATE_EERE_CONSTANT_MW';
export const UPDATE_EERE_WIND_CAPACITY = 'UPDATE_EERE_WIND_CAPACITY';
export const UPDATE_EERE_UTILITY_SOLAR = 'UPDATE_EERE_UTILITY_SOLAR';
export const UPDATE_EERE_ROOFTOP_SOLAR = 'UPDATE_EERE_ROOFTOP_SOLAR';

export const VALIDATE_EERE = "VALIDATE_EERE";
export const UPDATE_EXCEEDANCES = "UPDATE_EXCEEDANCES";

export const SUBMIT_PARAMS = 'SUBMIT_PARAMS';
export const SUBMIT_CALCULATION = 'SUBMIT_CALCULATION';
export const COMPLETE_CALCULATION = "COMPLETE_CALCULATION";

export const START_DISPLACEMENT = 'START_DISPLACEMENT';
export const COMPLETE_ANNUAL = 'COMPLETE_ANNUAL';
export const COMPLETE_MONTHLY = 'COMPLETE_MONTHLY';
export const FOO_COMPLETE_MONTHLY = 'FOO_COMPLETE_MONTHLY';

export const SELECT_AGGREGATION = 'SELECT_AGGREGATION';
export const SELECT_STATE = 'SELECT_STATE';
export const SELECT_COUNTY = 'SELECT_COUNTY';
export const SELECT_UNIT = 'SELECT_UNIT';

export const COMPLETE_STATE = 'COMPLETE_STATE';
export const FOO_COMPLETE_STATE = 'FOO_COMPLETE_STATE';

export const INVALIDATE_REGION = 'INVALIDATE_REGION';
export const REQUEST_REGION = 'REQUEST_REGION';
export const RECEIVE_REGION = 'RECEIVE_REGION';

export const ADD_RDF = 'ADD_RDF';

// action creators
export const setActiveStep = (number) => ({
  type: CHANGE_ACTIVE_STEP,
  payload: {
    stepNumber: number
  },
});

export const selectRegion = (region) => {
  avert.setRegion(region);
  
  eereProfile.limits = {
    reductions: avert.limits.max_ee_yearly_gwh,
    renewables: avert.limits.max_solar_wind_mwh,
  };

  return [{
    type: SELECT_REGION,
    region,
  }, {
    type: SET_LIMITS,
    payload: {
      limits: eereProfile.limits,
    }
  }];
};

export const updateYear = (year) => {
  avert.setYear(year);

  return {
    type: UPDATE_YEAR,
    year,
  };
};

export const submitParams = () => {
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

export const completeMonthlyEmissions = (data) => ({
  type: COMPLETE_MONTHLY,
  data,
});

export const foo_completeMonthlyEmissions = (data) => ({
  type: FOO_COMPLETE_MONTHLY,
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

export const invalidateRegion = (region) => ({
  type: INVALIDATE_REGION,
  region,
});

export const requestRegion = (region) => ({
  type: REQUEST_REGION,
  region,
});

export const receiveRegion = (region, json) => ({
  type: RECEIVE_REGION,
  region,
  posts: json.data.children.map(child => child.data),
  receivedAt: Date.now(),
});

let nextRdfId = 0;
export const addRdf = (rdf) => ({
  type: ADD_RDF,
  id: nextRdfId++,
  rdf,
});

export const fetchRegion = (region) => {
  return function(dispatch) {
    dispatch(requestRegion(region));

    return fetch(`http://www.reddit.com/r/${region}.json`)
      .then(response => response.json())
      .then(json =>
        dispatch(receiveRegion(region, json))
      );
  };
};
