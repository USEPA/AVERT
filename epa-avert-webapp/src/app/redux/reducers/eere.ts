// reducers
import { AppThunk } from 'app/redux/index';
// reducers
import { RegionalLoadData } from 'app/redux/reducers/rdfs';
// calculations
import { calculateEere } from 'app/calculations';
// config
import { RegionKeys, regions } from 'app/config';

type EereAction =
  | {
      type: 'rdfs/SET_EERE_LIMITS';
      payload: {
        limits: {
          annualGwh: number;
          constantMwh: number;
          renewables: number;
          percent: number;
        };
      };
    }
  | {
      type: 'eere/VALIDATE_EERE';
      errors: EereInputFields[];
    }
  | {
      type: 'eere/UPDATE_EERE_ANNUAL_GWH';
      text: string;
    }
  | {
      type: 'eere/UPDATE_EERE_CONSTANT_MW';
      text: string;
    }
  | {
      type: 'eere/UPDATE_EERE_BROAD_BASE_PROGRAM';
      text: string;
    }
  | {
      type: 'eere/UPDATE_EERE_REDUCTION';
      text: string;
    }
  | {
      type: 'eere/UPDATE_EERE_TOP_HOURS';
      text: string;
    }
  | {
      type: 'eere/UPDATE_EERE_WIND_CAPACITY';
      text: string;
    }
  | {
      type: 'eere/UPDATE_EERE_UTILITY_SOLAR';
      text: string;
    }
  | {
      type: 'eere/UPDATE_EERE_ROOFTOP_SOLAR';
      text: string;
    }
  | {
      type: 'eere/COMPLETE_EERE_CALCULATION';
      hourlyEere: HourlyEere[];
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
  | {
      type: 'eere/SUBMIT_EERE_CALCULATION';
    }
  | {
      type: 'eere/RESET_EERE_INPUTS';
    };

export type EereInputFields =
  | 'annualGwh'
  | 'constantMwh'
  | 'broadProgram'
  | 'reduction'
  | 'topHours'
  | 'windCapacity'
  | 'utilitySolar'
  | 'rooftopSolar';

export type EereInputs = { [field in EereInputFields]: string };

export type HourlyEere = {
  index: number;
  constant: number;
  current_load_mw: number;
  percent: number;
  final_mw: number;
  renewable_energy_profile: number;
  soft_limit: number;
  hard_limit: number;
  soft_exceedance: number;
  hard_exceedance: number;
};

type EereState = {
  status: 'ready' | 'started' | 'complete';
  errors: EereInputFields[];
  inputs: EereInputs;
  limits: {
    annualGwh: number;
    constantMwh: number;
    renewables: number;
    percent: number;
  };
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
  hourlyEere: HourlyEere[];
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
    annualGwh: 0,
    constantMwh: 0,
    renewables: 0,
    percent: 0,
  },
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
    case 'rdfs/SET_EERE_LIMITS':
      return {
        ...state,
        limits: action.payload.limits,
      };

    case 'eere/VALIDATE_EERE':
      return {
        ...state,
        errors: action.errors,
      };

    case 'eere/UPDATE_EERE_ANNUAL_GWH':
      return {
        ...state,
        inputs: {
          ...state.inputs,
          annualGwh: action.text,
        },
      };

    case 'eere/UPDATE_EERE_CONSTANT_MW':
      return {
        ...state,
        inputs: {
          ...state.inputs,
          constantMwh: action.text,
        },
      };

    case 'eere/UPDATE_EERE_BROAD_BASE_PROGRAM':
      return {
        ...state,
        inputs: {
          ...state.inputs,
          broadProgram: action.text,
        },
      };

    case 'eere/UPDATE_EERE_REDUCTION':
      return {
        ...state,
        inputs: {
          ...state.inputs,
          reduction: action.text,
        },
      };

    case 'eere/UPDATE_EERE_TOP_HOURS':
      return {
        ...state,
        inputs: {
          ...state.inputs,
          topHours: action.text,
        },
      };

    case 'eere/UPDATE_EERE_WIND_CAPACITY':
      return {
        ...state,
        inputs: {
          ...state.inputs,
          windCapacity: action.text,
        },
      };

    case 'eere/UPDATE_EERE_UTILITY_SOLAR':
      return {
        ...state,
        inputs: {
          ...state.inputs,
          utilitySolar: action.text,
        },
      };

    case 'eere/UPDATE_EERE_ROOFTOP_SOLAR':
      return {
        ...state,
        inputs: {
          ...state.inputs,
          rooftopSolar: action.text,
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
        hourlyEere: action.hourlyEere,
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
      return initialState;

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
      errors: invalidInput ? [...errors, inputField] : errors,
    });
  };
}

export function updateEereAnnualGwh(input: string): AppThunk {
  return (dispatch, getState) => {
    const { eere } = getState();

    dispatch({
      type: 'eere/UPDATE_EERE_ANNUAL_GWH',
      text: input,
    });

    dispatch(validateInput('annualGwh', input, eere.limits.annualGwh));
  };
}

export function updateEereConstantMw(input: string): AppThunk {
  return (dispatch, getState) => {
    const { eere } = getState();

    dispatch({
      type: 'eere/UPDATE_EERE_CONSTANT_MW',
      text: input,
    });

    dispatch(validateInput('constantMwh', input, eere.limits.constantMwh));
  };
}

export function updateEereBroadBasedProgram(input: string): AppThunk {
  return (dispatch, getState) => {
    const { eere } = getState();

    dispatch({
      type: 'eere/UPDATE_EERE_BROAD_BASE_PROGRAM',
      text: input,
    });

    dispatch(validateInput('reduction', input, eere.limits.percent));
  };
}

export function updateEereReduction(input: string): AppThunk {
  return (dispatch, getState) => {
    const { eere } = getState();

    dispatch({
      type: 'eere/UPDATE_EERE_REDUCTION',
      text: input,
    });

    dispatch(validateInput('reduction', input, eere.limits.percent));
  };
}

export function updateEereTopHours(input: string): AppThunk {
  return (dispatch) => {
    dispatch({
      type: 'eere/UPDATE_EERE_TOP_HOURS',
      text: input,
    });

    dispatch(validateInput('topHours', input, 100));
  };
}

export function updateEereWindCapacity(input: string): AppThunk {
  return (dispatch, getState) => {
    const { eere } = getState();

    dispatch({
      type: 'eere/UPDATE_EERE_WIND_CAPACITY',
      text: input,
    });

    dispatch(validateInput('windCapacity', input, eere.limits.renewables));
  };
}

export function updateEereUtilitySolar(input: string): AppThunk {
  return (dispatch, getState) => {
    const { eere } = getState();

    dispatch({
      type: 'eere/UPDATE_EERE_UTILITY_SOLAR',
      text: input,
    });

    dispatch(validateInput('utilitySolar', input, eere.limits.renewables));
  };
}

export function updateEereRooftopSolar(input: string): AppThunk {
  return (dispatch, getState) => {
    const { eere } = getState();

    dispatch({
      type: 'eere/UPDATE_EERE_ROOFTOP_SOLAR',
      text: input,
    });

    dispatch(validateInput('rooftopSolar', input, eere.limits.renewables));
  };
}

export function calculateEereProfile(): AppThunk {
  return (dispatch, getState) => {
    const { region, rdfs, eere } = getState();

    dispatch({
      type: 'eere/SUBMIT_EERE_CALCULATION',
    });

    const regionKey = (Object.keys(regions) as RegionKeys[]).find((key) => {
      return regions[key].number === region.number;
    });

    if (regionKey === undefined) throw new Error('Region number mismatch');

    const {
      softLimitHourlyExceedances,
      hardLimitHourlyExceedances,
      hourlyEere,
    } = calculateEere({
      regionMaxEELimit: rdfs.rdf.limits.max_ee_percent,
      regionLineLoss: regions[regionKey].lineLoss,
      regionalLoads: rdfs.rdf.regional_load,
      eereDefaults: rdfs.defaults.data,
      eereInputs: eere.inputs,
    });

    dispatch({
      type: 'eere/COMPLETE_EERE_CALCULATION',
      hourlyEere,
    });

    const regionalLoadHours = rdfs.rdf.regional_load;

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
  return {
    type: 'eere/RESET_EERE_INPUTS',
  };
}
