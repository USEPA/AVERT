// deps
import fetch from 'isomorphic-fetch';
import Blob from 'blob';
import json2csv from 'json2csv';
import FileSaver from 'file-saver';
import _ from 'lodash';

// avert
import {avert, eereProfile} from '../avert';
import * as northeast_rdf from '../../assets/data/rdf_northeast_2015.json';
import * as northeast_defaults from '../../assets/data/eere-defaults-northeast.json';
// import { MonthlyUnitEnum } from '../utils/MonthlyUnitEnum';
// import { AggregationEnum } from '../utils/AggregationEnum';
// import { extractDownloadStructure } from '../utils/DataDownloadHelper';
// store
import store from '../store';

// action types
export const CHANGE_ACTIVE_STEP = 'CHANGE_ACTIVE_STEP';

export const TOGGLE_MODAL_OVERLAY = 'TOGGLE_MODAL_OVERLAY';

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
// export const RESELECT_REGION = 'RESELECT_REGION';
export const SELECT_STATE = 'SELECT_STATE';
export const SELECT_COUNTY = 'SELECT_COUNTY';
export const SELECT_UNIT = 'SELECT_UNIT';
export const RENDER_MONTHLY_CHARTS = 'RENDER_MONTHLY_CHARTS';
export const COMPLETE_STATE = 'COMPLETE_STATE';
export const INVALIDATE_REGION = 'INVALIDATE_REGION';
export const REQUEST_REGION = 'REQUEST_REGION';
export const RECEIVE_REGION = 'RECEIVE_REGION';
export const OVERRIDE_REGION = 'OVERRIDE_REGION';
export const INVALIDATE_DEFAULTS = 'INVALIDATE_DEFAULTS';
export const REQUEST_DEFAULTS = 'REQUEST_DEFAULTS';
export const RECEIVE_DEFAULTS = 'RECEIVE_DEFAULTS';
export const ADD_RDF = 'ADD_RDF';
export const START_DATA_DOWNLOAD = 'START_DATA_DOWNLOAD';
export const SET_DOWNLOAD_DATA = 'SET_DOWNLOAD_DATA';

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
  avert.setDefaults(defaults);

  return {
    type: RECEIVE_DEFAULTS,
    payload: {
      defaults: defaults
    },
  }
};

export const fetchDefaults = () => {
  return function (dispatch) {
    const region = avert.regionData;
    dispatch(requestDefaults(region.slug));

    return fetch(`./data/${region.defaults}.json`, { credentials: 'same-origin' })
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

const emitReceiveRegion = (rdf) => {
  return {
    type: RECEIVE_REGION,
    payload: {
      rdf: rdf
    },
  }
};

const receiveRegion = (region, json) => {
  return function (dispatch) {
    avert.setRdf(json);
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

    if (getState().rdfs.debug) return Promise.resolve();

    const region = avert.regionData;
    dispatch(requestRegion(region.slug));

    return fetch(`./data/${region.rdf}.json`, { credentials: 'same-origin' })
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
  return function (dispatch) {
    const formattedRegion = parseInt(region, 10);
    avert.region = formattedRegion;
    dispatch(changeRegion(formattedRegion));
  };
};

export const overrideRegion = () => {
  return function (dispatch) {
    dispatch(changeRegion(3));
    dispatch(receiveRegion('NE', northeast_rdf));
    dispatch(receiveDefaults('NE', northeast_defaults));

    return dispatch({
      type: OVERRIDE_REGION
    });
  }
};

export const validateEere = () => {
  // avert.eereProfile = eereProfile;
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

export const updateExceedances = (exceedances, soft, hard) => ({
  type: UPDATE_EXCEEDANCES,
  exceedances,
  soft_exceedances: soft,
  hard_exceedances: hard,
});

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

export const completeStateEmissions = (data) => {
  return function (dispatch, getState) {

    dispatch({
      type: COMPLETE_STATE,
      data,
    });

    setTimeout(() => {
      avert.getMonthlyEmissions();
      return Promise.resolve();
    }, 100)
  }
};

export const renderMonthlyEmissionsCharts = () => {

  return {
    type: RENDER_MONTHLY_CHARTS,
  };
};

export const prepareDownloadData = (data) => {

  return {
    type: SET_DOWNLOAD_DATA,
    data,
  }
};

export const completeMonthlyEmissions = (data) => {
  return function (dispatch, getState) {
    const { monthlyEmissions } = getState();

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
    const { monthlyEmissions } = getState();


    const foo = dispatch({
      type: SELECT_AGGREGATION,
      aggregation,
    });

    console.log('Select Aggregation',aggregation,foo);

    return dispatch(renderMonthlyEmissionsCharts(monthlyEmissions));
  }
};


export const updateMonthlyUnit = (unit) => {
  return function (dispatch, getState) {
    const { monthlyEmissions } = getState();

    dispatch({
      type: SELECT_UNIT,
      unit,
    });

    return dispatch(renderMonthlyEmissionsCharts(monthlyEmissions));
  }
};

// export const reselectRegion = () => {
//   return function (dispatch, getState) {
//
//     const { monthlyEmissions } = getState();
//
//     dispatch({
//       type: RESELECT_REGION
//     });
//
//     return dispatch(renderMonthlyEmissionsCharts(monthlyEmissions));
//   }
// };

export const selectState = (state) => {
  return function (dispatch, getState) {
    const { monthlyEmissions } = getState();
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
    const { monthlyEmissions } = getState();

    dispatch({
      type: SELECT_COUNTY,
      county,
    });

    return dispatch(renderMonthlyEmissionsCharts(monthlyEmissions));
  }
};

const startDisplacement = () => ({
  type: START_DISPLACEMENT,
});

export const calculateDisplacement = () => {
  store.dispatch(startDisplacement());

  setTimeout(() => {
    avert.calculateDisplacement();
  }, 50);
};

export const startDataDownload = () => {
  return function (dispatch, getState) {
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
