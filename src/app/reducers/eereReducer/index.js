// action types
import {
  SELECT_REGION,
  UPDATE_EERE_TOP_HOURS,
  UPDATE_EERE_REDUCTION,
  UPDATE_EERE_ANNUAL_GWH,
  UPDATE_EERE_CONSTANT_MW,
  UPDATE_EERE_WIND_CAPACITY,
  UPDATE_EERE_UTILITY_SOLAR,
  UPDATE_EERE_ROOFTOP_SOLAR,
  VALIDATE_EERE,
  UPDATE_EXCEEDANCES,
  SUBMIT_PARAMS,
  SUBMIT_CALCULATION,
  COMPLETE_CALCULATION,
} from '../../actions';

const defaultState = {
  status: 'select_region',

  constantMw: '',
  annualGwh: '',
  //___?___,
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
  hard_valid: true,
  hard_exceedances: [],
  hard_top_exceedance_value: 0,
  hard_top_exceedance_hour: 0,
  submitted: false,
  hourlyEere: [],
};

const eereReducer = (state = defaultState, action) => {
  switch (action.type) {
    case SELECT_REGION:
      return {
        ...state,
        status: "ready",
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

    // case UPDATE___?___:
    //   return {
    //     ...state,
    //     ___?___: action.text,
    //   };

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

    case VALIDATE_EERE:
      return {
        ...state,
        valid: action.valid,
        errors: action.errors,
      };

    case UPDATE_EXCEEDANCES:
      //TODO: Pull these calculations out into a util, run them in the action, then pass them to the reducers
      const valid = action.exceedances.reduce((a, b) => a + b) === 0;
      const maxVal = (!valid) ? Math.max(...action.exceedances) : 0;
      const maxIndex = (!valid) ? action.exceedances.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0) : 0;

      const softValid = action.soft_exceedances.reduce((a, b) => a + b) === 0;
      const softMaxVal = (!valid) ? Math.max(...action.soft_exceedances) : 0;
      const softMaxIndex = (!valid) ? action.soft_exceedances.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0) : 0;

      const hardValid = action.hard_exceedances.reduce((a, b) => a + b) === 0;
      const hardMaxVal = (!valid) ? Math.max(...action.hard_exceedances) : 0;
      const hardMaxIndex = (!valid) ? action.hard_exceedances.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0) : 0;

      return {
        // TODO: Consider splitting up "validity for exceed" from "validity for fields"
        ...state,
        exceedances: action.exceedances,
        top_exceedance_value: maxVal,
        top_exceedance_hour: maxIndex,

        soft_valid: softValid,
        soft_exceedances: action.soft_exceedances,
        soft_top_exceedance_value: softMaxVal,
        soft_top_exceedance_hour: softMaxIndex,

        hard_valid: hardValid,
        hard_exceedances: action.hard_exceedances,
        hard_top_exceedance_value: hardMaxVal,
        Hard_top_exceedance_hour: hardMaxIndex,
      };

    case SUBMIT_PARAMS:
      return {
        ...state,
        submitted: true,
      };

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
