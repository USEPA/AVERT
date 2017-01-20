// action types
import {
  SET_LIMITS,
  UPDATE_EERE_TOP_HOURS,
  UPDATE_EERE_REDUCTION,
  UPDATE_EERE_BROAD_BASE_PROGRAM,
  UPDATE_EERE_ANNUAL_GWH,
  UPDATE_EERE_CONSTANT_MW,
  UPDATE_EERE_WIND_CAPACITY,
  UPDATE_EERE_UTILITY_SOLAR,
  UPDATE_EERE_ROOFTOP_SOLAR,
  VALIDATE_EERE,
  UPDATE_EXCEEDANCES,
  RESET_EERE_INPUTS,
  SUBMIT_CALCULATION,
  COMPLETE_CALCULATION,
} from '../../actions';

const defaultState = {
  status: 'ready',

  limits: { annualGwh: false, constantMwh: false, renewables: false },
  constantMw: '',
  annualGwh: '',
  broadProgram: '',
  reduction: '',
  topHours: '',
  windCapacity: '',
  utilitySolar: '',
  rooftopSolar: '',

  errors: [],
  valid: true,
  exceedances: [],
  top_exceedance_value: 0,
  top_exceedance_hour: 0,
  soft_valid: true,
  soft_exceedances: [],
  soft_top_exceedance_value: 0,
  soft_top_exceedance_hour: 0,
  soft_top_exceedance_timestamp: {},
  hard_valid: true,
  hard_exceedances: [],
  hard_top_exceedance_value: 0,
  hard_top_exceedance_hour: 0,
  hard_top_exceedance_timestamp: {},
  submitted: false,
  hourlyEere: [],
};

const eereReducer = (state = defaultState, action) => {
  switch (action.type) {
    case SET_LIMITS:
      return {
        ...state,
        limits: action.payload.limits
      };
    case UPDATE_EERE_CONSTANT_MW:
      return {
        ...state,
        constantMw: action.text,
      };

    case UPDATE_EERE_ANNUAL_GWH:
      return {
        ...state,
        annualGwh: action.text,
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

    case UPDATE_EERE_BROAD_BASE_PROGRAM:
      return {
        ...state,
        broadProgram: action.text,
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

    case VALIDATE_EERE:
      return {
        ...state,
        valid: action.valid,
        errors: action.errors,
      };

    case UPDATE_EXCEEDANCES:

      return {
        // TODO: Consider splitting up "validity for exceed" from "validity for fields"
        ...state,
        exceedances: action.payload.exceedances,
        top_exceedance_value: action.payload.maxVal,
        top_exceedance_hour: action.payload.maxIndex,

        soft_valid: action.payload.softValid,
        soft_exceedances: action.payload.soft_exceedances,
        soft_top_exceedance_value: action.payload.softMaxVal,
        soft_top_exceedance_hour: action.payload.softMaxIndex,
        soft_top_exceedance_timestamp: action.payload.softTimestamp,

        hard_valid: action.payload.hardValid,
        hard_exceedances: action.payload.hard_exceedances,
        hard_top_exceedance_value: action.payload.hardMaxVal,
        hard_top_exceedance_hour: action.payload.hardMaxIndex,
        hard_top_exceedance_timestamp: action.payload.hardTimestamp,
      };

    case RESET_EERE_INPUTS:
      return defaultState;

    case SUBMIT_CALCULATION:
      return {
        ...state,
        status: 'started',
        hourlyEere: [],
      };

    case COMPLETE_CALCULATION:
      return {
        ...state,
        status: 'complete',
        hourlyEere: action.hourlyEere,
      };

    default:
      return state;
  }
};

export default eereReducer;
