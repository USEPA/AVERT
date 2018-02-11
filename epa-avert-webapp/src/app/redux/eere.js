// engine
import { avert, eereProfile } from 'app/actions';

// action types
import { SET_EERE_LIMITS } from 'app/redux/rdfs';
export const VALIDATE_EERE = 'eere/VALIDATE_EERE';
export const UPDATE_EERE_ANNUAL_GWH = 'eere/UPDATE_EERE_ANNUAL_GWH';
export const UPDATE_EERE_CONSTANT_MW = 'eere/UPDATE_EERE_CONSTANT_MW';
export const UPDATE_EERE_BROAD_BASE_PROGRAM = 'eere/UPDATE_EERE_BROAD_BASE_PROGRAM';
export const UPDATE_EERE_REDUCTION = 'eere/UPDATE_EERE_REDUCTION';
export const UPDATE_EERE_TOP_HOURS = 'eere/UPDATE_EERE_TOP_HOURS';
export const UPDATE_EERE_WIND_CAPACITY = 'eere/UPDATE_EERE_WIND_CAPACITY';
export const UPDATE_EERE_UTILITY_SOLAR = 'eere/UPDATE_EERE_UTILITY_SOLAR';
export const UPDATE_EERE_ROOFTOP_SOLAR = 'eere/UPDATE_EERE_ROOFTOP_SOLAR';
export const COMPLETE_EERE_CALCULATION = 'eere/COMPLETE_EERE_CALCULATION';
export const UPDATE_EXCEEDANCES = 'eere/UPDATE_EXCEEDANCES';
export const SUBMIT_EERE_CALCULATION = 'eere/SUBMIT_EERE_CALCULATION';
export const RESET_EERE_INPUTS = 'eere/RESET_EERE_INPUTS';

// reducer
const initialState = {
  limits: {
    annualGwh: false,
    constantMwh: false,
    renewables: false,
  },

  valid: true,
  errors: [],

  annualGwh: '',
  constantMwh: '',
  broadProgram: '',
  reduction: '',
  topHours: '',
  windCapacity: '',
  utilitySolar: '',
  rooftopSolar: '',

  status: 'ready',
  hourlyEere: [],

  soft_valid: true,
  soft_exceedances: [],
  soft_top_exceedance_value: 0,
  soft_top_exceedance_timestamp: {},

  hard_valid: true,
  hard_exceedances: [],
  hard_top_exceedance_value: 0,
  hard_top_exceedance_timestamp: {},
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_EERE_LIMITS:
      return {
        ...state,
        limits: action.payload.limits
      };

    case VALIDATE_EERE:
      return {
        ...state,
        valid: action.valid,
        errors: action.errors,
      };

    case UPDATE_EERE_ANNUAL_GWH:
      return {
        ...state,
        annualGwh: action.text,
      };

    case UPDATE_EERE_CONSTANT_MW:
      return {
        ...state,
        constantMwh: action.text,
      };

    case UPDATE_EERE_BROAD_BASE_PROGRAM:
      return {
        ...state,
        broadProgram: action.text,
      };

    case UPDATE_EERE_REDUCTION:
      return {
        ...state,
        reduction: action.text,
      };

    case UPDATE_EERE_TOP_HOURS:
      return {
        ...state,
        topHours: action.text,
      };

    case UPDATE_EERE_WIND_CAPACITY:
      return {
        ...state,
        windCapacity: action.text,
      };

    case UPDATE_EERE_UTILITY_SOLAR:
      return {
        ...state,
        utilitySolar: action.text,
      };

    case UPDATE_EERE_ROOFTOP_SOLAR:
      return {
        ...state,
        rooftopSolar: action.text,
      };

    case SUBMIT_EERE_CALCULATION:
      return {
        ...state,
        status: 'started',
        hourlyEere: [],
      };

    case COMPLETE_EERE_CALCULATION:
      return {
        ...state,
        status: 'complete',
        hourlyEere: action.hourlyEere,
      };

    case UPDATE_EXCEEDANCES:
      return {
        ...state,
        soft_valid: action.payload.softValid,
        soft_exceedances: action.payload.soft_exceedances,
        soft_top_exceedance_value: action.payload.softMaxVal,
        soft_top_exceedance_timestamp: action.payload.softTimestamp,

        hard_valid: action.payload.hardValid,
        hard_exceedances: action.payload.hard_exceedances,
        hard_top_exceedance_value: action.payload.hardMaxVal,
        hard_top_exceedance_timestamp: action.payload.hardTimestamp,
      };

    case RESET_EERE_INPUTS:
      return initialState;

    default:
      return state;
  }
};

// action creators
export const validateEere = () => {
  avert.eereProfile = eereProfile;

  return {
    type: VALIDATE_EERE,
    valid: eereProfile.isValid,
    errors: eereProfile.errors,
  };
};

export const updateEereAnnualGwh = (text) => {
  return function (dispatch) {
    eereProfile.annualGwh = text;

    dispatch(validateEere());
    dispatch({
      type: UPDATE_EERE_ANNUAL_GWH,
      text: text,
    });
  };
};

export const updateEereConstantMw = (text) => {
  return function (dispatch) {
    eereProfile.constantMwh = text;

    dispatch(validateEere());
    dispatch({
      type: UPDATE_EERE_CONSTANT_MW,
      text: text,
    });
  };
};

export const updateEereBroadBasedProgram = (text) => {
  return function (dispatch) {
    eereProfile.topHours = 100;
    eereProfile.reduction = text;

    dispatch(validateEere());
    dispatch({
      type: UPDATE_EERE_BROAD_BASE_PROGRAM,
      text:text,
    });
  };
};

export const updateEereReduction = (text) => {
  return function (dispatch) {
    eereProfile.reduction = text;

    dispatch(validateEere());
    dispatch({
      type: UPDATE_EERE_REDUCTION,
      text: text,
    });
  };
};

export const updateEereTopHours = (text) => {
  return function (dispatch) {
    eereProfile.topHours = text;

    dispatch(validateEere());
    dispatch({
      type: UPDATE_EERE_TOP_HOURS,
      text: text,
    });
  };
};

export const updateEereWindCapacity = (text) => {
  return function (dispatch) {
    eereProfile.windCapacity = text;

    dispatch(validateEere());
    dispatch({
      type: UPDATE_EERE_WIND_CAPACITY,
      text: text,
    });
  };
};

export const updateEereUtilitySolar = (text) => {
  return function (dispatch) {
    eereProfile.utilitySolar = text;

    dispatch(validateEere());
    dispatch({
      type: UPDATE_EERE_UTILITY_SOLAR,
      text: text,
    });
  };
};

export const updateEereRooftopSolar = (text) => {
  return function (dispatch) {
    eereProfile.rooftopSolar = text;

    dispatch(validateEere());
    dispatch({
      type: UPDATE_EERE_ROOFTOP_SOLAR,
      text: text,
    });
  };
};

export const completeEereCalculation = (hourlyEere) => ({
  type: COMPLETE_EERE_CALCULATION,
  hourlyEere: hourlyEere,
});

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

export const calculateEereProfile = () => {
  return function (dispatch) {
    dispatch({ type: SUBMIT_EERE_CALCULATION });

    avert.calculateEereLoad();

    dispatch(completeEereCalculation(avert.eereLoad.hourlyEere));
    dispatch(updateExceedances(avert.eereLoad.softExceedances, avert.eereLoad.hardExceedances));
  }
};

export const resetEereInputs = () => {
  eereProfile.reset();

  return { type: RESET_EERE_INPUTS }
};
