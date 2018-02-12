// engines
import { avert, eereProfile  } from 'app/engines';

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
  status: 'ready',
  valid: true,
  errors: [],
  inputs: {
    annualGwh: '',
    constantMwh: '',
    broadProgram: '',
    reduction: '',
    topHours: '',
    windCapacity: '',
    utilitySolar: '',
    rooftopSolar: '',
  },
  limits: {
    annualGwh: false,
    constantMwh: false,
    renewables: false,
  },
  softLimit: {
    valid: true,
    topExceedanceValue: 0,
    topExceedanceTimestamp: {},
  },
  hardLimit: {
    valid: true,
    topExceedanceValue: 0,
    topExceedanceTimestamp: {},
  },

  // softValid: true,
  // softTopExceedanceValue: 0,
  // softTopExceedanceTimestamp: {},
  // hardValid: true,
  // hardTopExceedanceValue: 0,
  // hardTopExceedanceTimestamp: {},

  hourlyEere: [],
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
        inputs: {
          ...state.inputs,
          annualGwh: action.text,
        },
      };

    case UPDATE_EERE_CONSTANT_MW:
      return {
        ...state,
        inputs: {
          ...state.inputs,
          constantMwh: action.text,
        },
      };

    case UPDATE_EERE_BROAD_BASE_PROGRAM:
      return {
        ...state,
        inputs: {
          ...state.inputs,
          broadProgram: action.text,
        },
      };

    case UPDATE_EERE_REDUCTION:
      return {
        ...state,
        inputs: {
          ...state.inputs,
          reduction: action.text,
        },
      };

    case UPDATE_EERE_TOP_HOURS:
      return {
        ...state,
        inputs: {
          ...state.inputs,
          topHours: action.text,
        },
      };

    case UPDATE_EERE_WIND_CAPACITY:
      return {
        ...state,
        inputs: {
          ...state.inputs,
          windCapacity: action.text,
        },
      };

    case UPDATE_EERE_UTILITY_SOLAR:
      return {
        ...state,
        inputs: {
          ...state.inputs,
          utilitySolar: action.text,
        },
      };

    case UPDATE_EERE_ROOFTOP_SOLAR:
      return {
        ...state,
        inputs: {
          ...state.inputs,
          rooftopSolar: action.text,
        },
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
        softLimit: {
          valid: action.payload.softValid,
          topExceedanceValue: action.payload.softMaxVal,
          topExceedanceTimestamp: action.payload.softTimestamp,
        },
        hardLimit: {
          valid: action.payload.hardValid,
          topExceedanceValue: action.payload.hardMaxVal,
          topExceedanceTimestamp: action.payload.hardTimestamp,
        },
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
