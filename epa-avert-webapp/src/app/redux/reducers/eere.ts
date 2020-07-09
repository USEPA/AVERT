// reducers
import { AppThunk } from 'app/redux/index';
import { RegionState } from 'app/redux/reducers/geography';
// reducers
import { RegionalLoadData, StateState } from 'app/redux/reducers/geography';
// calculations
import { calculateEere } from 'app/calculations';
// config
import { RegionId, StateId } from 'app/config';

type EereAction =
  | {
      type: 'eere/VALIDATE_EERE';
      payload: { errors: EereInputFields[] };
    }
  | {
      type: 'eere/UPDATE_EERE_ANNUAL_GWH';
      payload: { text: string };
    }
  | {
      type: 'eere/UPDATE_EERE_CONSTANT_MW';
      payload: { text: string };
    }
  | {
      type: 'eere/UPDATE_EERE_BROAD_BASE_PROGRAM';
      payload: { text: string };
    }
  | {
      type: 'eere/UPDATE_EERE_REDUCTION';
      payload: { text: string };
    }
  | {
      type: 'eere/UPDATE_EERE_TOP_HOURS';
      payload: { text: string };
    }
  | {
      type: 'eere/UPDATE_EERE_ONSHORE_WIND';
      payload: { text: string };
    }
  | {
      type: 'eere/UPDATE_EERE_OFFSHORE_WIND';
      payload: { text: string };
    }
  | {
      type: 'eere/UPDATE_EERE_UTILITY_SOLAR';
      payload: { text: string };
    }
  | {
      type: 'eere/UPDATE_EERE_ROOFTOP_SOLAR';
      payload: { text: string };
    }
  | {
      type: 'eere/COMPLETE_EERE_CALCULATION';
      payload: { hourlyEere: number[] };
    }
  | {
      type: 'eere/UPDATE_EXCEEDANCES';
      payload: {
        softValid: boolean;
        softTopExceedanceValue: number;
        softTopExceedanceTimestamp: RegionalLoadData;
        hardValid: boolean;
        hardTopExceedanceValue: number;
        hardTopExceedanceTimestamp: RegionalLoadData;
      };
    }
  | { type: 'eere/SUBMIT_EERE_CALCULATION' }
  | { type: 'eere/RESET_EERE_INPUTS' };

export type EereInputFields =
  | 'annualGwh'
  | 'constantMwh'
  | 'broadProgram'
  | 'reduction'
  | 'topHours'
  | 'onshoreWind'
  | 'offshoreWind'
  | 'utilitySolar'
  | 'rooftopSolar';

export type EereInputs = { [field in EereInputFields]: string };

type EereState = {
  status: 'ready' | 'started' | 'complete';
  errors: EereInputFields[];
  inputs: EereInputs;
  softLimit: {
    valid: boolean;
    topExceedanceValue: number;
    topExceedanceTimestamp: RegionalLoadData;
  };
  hardLimit: {
    valid: boolean;
    topExceedanceValue: number;
    topExceedanceTimestamp: RegionalLoadData;
  };
  hourlyEere: number[];
};

const emptyEereInputs = {
  annualGwh: '',
  constantMwh: '',
  broadProgram: '',
  reduction: '',
  topHours: '',
  onshoreWind: '',
  offshoreWind: '',
  utilitySolar: '',
  rooftopSolar: '',
};

const emptyRegionalLoadHour = {
  hour_of_year: 0,
  year: 0,
  month: 0,
  day: 0,
  hour: 0,
  regional_load_mw: 0,
  hourly_limit: 0,
};

// reducer
const initialState: EereState = {
  status: 'ready',
  errors: [],
  inputs: emptyEereInputs,
  softLimit: {
    valid: true,
    topExceedanceValue: 0,
    topExceedanceTimestamp: emptyRegionalLoadHour,
  },
  hardLimit: {
    valid: true,
    topExceedanceValue: 0,
    topExceedanceTimestamp: emptyRegionalLoadHour,
  },
  hourlyEere: [],
};

export default function reducer(
  state: EereState = initialState,
  action: EereAction,
): EereState {
  switch (action.type) {
    case 'eere/VALIDATE_EERE':
      return {
        ...state,
        errors: action.payload.errors,
      };

    case 'eere/UPDATE_EERE_ANNUAL_GWH':
      return {
        ...state,
        inputs: {
          ...state.inputs,
          annualGwh: action.payload.text,
        },
      };

    case 'eere/UPDATE_EERE_CONSTANT_MW':
      return {
        ...state,
        inputs: {
          ...state.inputs,
          constantMwh: action.payload.text,
        },
      };

    case 'eere/UPDATE_EERE_BROAD_BASE_PROGRAM':
      return {
        ...state,
        inputs: {
          ...state.inputs,
          broadProgram: action.payload.text,
        },
      };

    case 'eere/UPDATE_EERE_REDUCTION':
      return {
        ...state,
        inputs: {
          ...state.inputs,
          reduction: action.payload.text,
        },
      };

    case 'eere/UPDATE_EERE_TOP_HOURS':
      return {
        ...state,
        inputs: {
          ...state.inputs,
          topHours: action.payload.text,
        },
      };

    case 'eere/UPDATE_EERE_ONSHORE_WIND':
      return {
        ...state,
        inputs: {
          ...state.inputs,
          onshoreWind: action.payload.text,
        },
      };

    case 'eere/UPDATE_EERE_OFFSHORE_WIND':
      return {
        ...state,
        inputs: {
          ...state.inputs,
          offshoreWind: action.payload.text,
        },
      };

    case 'eere/UPDATE_EERE_UTILITY_SOLAR':
      return {
        ...state,
        inputs: {
          ...state.inputs,
          utilitySolar: action.payload.text,
        },
      };

    case 'eere/UPDATE_EERE_ROOFTOP_SOLAR':
      return {
        ...state,
        inputs: {
          ...state.inputs,
          rooftopSolar: action.payload.text,
        },
      };

    case 'eere/SUBMIT_EERE_CALCULATION':
      return {
        ...state,
        status: 'started',
        hourlyEere: [],
      };

    case 'eere/COMPLETE_EERE_CALCULATION':
      return {
        ...state,
        status: 'complete',
        hourlyEere: action.payload.hourlyEere,
      };

    case 'eere/UPDATE_EXCEEDANCES':
      return {
        ...state,
        softLimit: {
          valid: action.payload.softValid,
          topExceedanceValue: action.payload.softTopExceedanceValue,
          topExceedanceTimestamp: action.payload.softTopExceedanceTimestamp,
        },
        hardLimit: {
          valid: action.payload.hardValid,
          topExceedanceValue: action.payload.hardTopExceedanceValue,
          topExceedanceTimestamp: action.payload.hardTopExceedanceTimestamp,
        },
      };

    case 'eere/RESET_EERE_INPUTS':
      return {
        ...state,
        status: 'ready',
        inputs: emptyEereInputs,
        softLimit: {
          valid: true,
          topExceedanceValue: 0,
          topExceedanceTimestamp: emptyRegionalLoadHour,
        },
        hardLimit: {
          valid: true,
          topExceedanceValue: 0,
          topExceedanceTimestamp: emptyRegionalLoadHour,
        },
        hourlyEere: [],
      };

    default:
      return state;
  }
}

// action creators
function validateInput(
  inputField: EereInputFields,
  inputValue: string,
  upperLimit: number,
): AppThunk {
  return (dispatch, getState) => {
    const { eere } = getState();

    const value = Number(inputValue);
    const invalidInput = isNaN(value) || value < 0 || value > upperLimit;

    // remove input field being validated from existing fields with errors
    const errors = eere.errors.filter((field) => field !== inputField);

    return dispatch({
      type: 'eere/VALIDATE_EERE',
      payload: {
        errors: invalidInput ? [...errors, inputField] : errors,
      },
    });
  };
}

export function updateEereAnnualGwh(input: string, limit: number): AppThunk {
  return (dispatch) => {
    dispatch({
      type: 'eere/UPDATE_EERE_ANNUAL_GWH',
      payload: { text: input },
    });

    dispatch(validateInput('annualGwh', input, limit));
  };
}

export function updateEereConstantMw(input: string, limit: number): AppThunk {
  return (dispatch) => {
    dispatch({
      type: 'eere/UPDATE_EERE_CONSTANT_MW',
      payload: { text: input },
    });

    dispatch(validateInput('constantMwh', input, limit));
  };
}

export function updateEereBroadBasedProgram(
  input: string,
  limit: number,
): AppThunk {
  return (dispatch) => {
    dispatch({
      type: 'eere/UPDATE_EERE_BROAD_BASE_PROGRAM',
      payload: { text: input },
    });

    dispatch(validateInput('reduction', input, limit));
  };
}

export function updateEereReduction(input: string, limit: number): AppThunk {
  return (dispatch) => {
    dispatch({
      type: 'eere/UPDATE_EERE_REDUCTION',
      payload: { text: input },
    });

    dispatch(validateInput('reduction', input, limit));
  };
}

export function updateEereTopHours(input: string, limit: number): AppThunk {
  return (dispatch) => {
    dispatch({
      type: 'eere/UPDATE_EERE_TOP_HOURS',
      payload: { text: input },
    });

    dispatch(validateInput('topHours', input, limit));
  };
}

export function updateEereOnshoreWind(input: string, limit: number): AppThunk {
  return (dispatch) => {
    dispatch({
      type: 'eere/UPDATE_EERE_ONSHORE_WIND',
      payload: { text: input },
    });

    dispatch(validateInput('onshoreWind', input, limit));
  };
}

export function updateEereOffshoreWind(input: string, limit: number): AppThunk {
  return (dispatch) => {
    dispatch({
      type: 'eere/UPDATE_EERE_OFFSHORE_WIND',
      payload: { text: input },
    });

    dispatch(validateInput('offshoreWind', input, limit));
  };
}

export function updateEereUtilitySolar(input: string, limit: number): AppThunk {
  return (dispatch) => {
    dispatch({
      type: 'eere/UPDATE_EERE_UTILITY_SOLAR',
      payload: { text: input },
    });

    dispatch(validateInput('utilitySolar', input, limit));
  };
}

export function updateEereRooftopSolar(input: string, limit: number): AppThunk {
  return (dispatch) => {
    dispatch({
      type: 'eere/UPDATE_EERE_ROOFTOP_SOLAR',
      payload: { text: input },
    });

    dispatch(validateInput('rooftopSolar', input, limit));
  };
}

export function calculateEereProfile(): AppThunk {
  return (dispatch, getState) => {
    const { geography, eere } = getState();

    // select region(s), based on geographic focus:
    // single region if geographic focus is 'regions'
    // multiple regions if geographic focus is 'states'
    const selectedRegions: RegionState[] = [];

    let selectedState: StateState | undefined;

    if (geography.focus === 'regions') {
      for (const regionId in geography.regions) {
        const region = geography.regions[regionId as RegionId];
        if (region.selected) {
          selectedRegions.push(region);
        }
      }
    }

    if (geography.focus === 'states') {
      for (const stateId in geography.states) {
        const state = geography.states[stateId as StateId];
        if (state.selected) {
          selectedState = state;
          Object.keys(state.regions).forEach((regionId) => {
            const region = geography.regions[regionId as RegionId];
            selectedRegions.push(region);
          });
        }
      }
    }

    // TODO: account for multiple regions being selected
    const region = selectedRegions[0];

    dispatch({ type: 'eere/SUBMIT_EERE_CALCULATION' });

    const {
      softLimitHourlyExceedances,
      hardLimitHourlyExceedances,
      hourlyEere,
    } = calculateEere({
      regionMaxEEPercent: region.rdf.limits.max_ee_percent,
      regionLineLoss: region.lineLoss,
      hourlyLoads: region.rdf.regional_load.map((hr) => hr.regional_load_mw),
      eereDefaults: region.eereDefaults.data,
      eereInputs: eere.inputs,
    });

    dispatch({
      type: 'eere/COMPLETE_EERE_CALCULATION',
      payload: { hourlyEere },
    });

    const regionalLoadHours = region.rdf.regional_load;

    const softValid = softLimitHourlyExceedances.reduce((a, b) => a + b) === 0;
    const softTopExceedanceValue = Math.max(...softLimitHourlyExceedances);
    const softTopExceedanceIndex = !softValid
      ? softLimitHourlyExceedances.indexOf(softTopExceedanceValue)
      : 0;

    const hardValid = hardLimitHourlyExceedances.reduce((a, b) => a + b) === 0;
    const hardTopExceedanceValue = Math.max(...hardLimitHourlyExceedances);
    const hardTopExceedanceIndex = !hardValid
      ? hardLimitHourlyExceedances.indexOf(hardTopExceedanceValue)
      : 0;

    return dispatch({
      type: 'eere/UPDATE_EXCEEDANCES',
      payload: {
        softValid,
        softTopExceedanceValue,
        softTopExceedanceTimestamp: !softValid
          ? regionalLoadHours[softTopExceedanceIndex]
          : emptyRegionalLoadHour,
        hardValid,
        hardTopExceedanceValue,
        hardTopExceedanceTimestamp: !hardValid
          ? regionalLoadHours[hardTopExceedanceIndex]
          : emptyRegionalLoadHour,
      },
    });
  };
}

export function resetEereInputs() {
  return { type: 'eere/RESET_EERE_INPUTS' };
}
