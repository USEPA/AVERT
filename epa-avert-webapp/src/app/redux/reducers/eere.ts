// reducers
import { AppThunk } from 'app/redux/index';
// engines
import { avert, eereProfile } from 'app/engines';

type EereAction =
  | {
      type: 'rdfs/SET_EERE_LIMITS';
      payload: {
        limits: any; // TODO
      };
    }
  | {
      type: 'eere/VALIDATE_EERE';
      valid: boolean;
      errors: any[]; // TODO
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
        softMaxVal: number;
        softTimestamp: any; // TODO
        hardValid: boolean;
        hardMaxVal: number;
        hardTimestamp: any; // TODO
      };
    }
  | {
      type: 'eere/SUBMIT_EERE_CALCULATION';
    }
  | {
      type: 'eere/RESET_EERE_INPUTS';
    };

export type InputFields =
  | 'annualGwh'
  | 'constantMwh'
  | 'broadProgram'
  | 'reduction'
  | 'topHours'
  | 'windCapacity'
  | 'utilitySolar'
  | 'rooftopSolar';

type HourlyEere = {
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
  valid: boolean;
  errors: InputFields[];
  inputs: {
    [field in InputFields]: string;
  };
  limits: {
    annualGwh: number;
    constantMwh: number;
    renewables: number;
    percent: number;
  };
  softLimit: {
    valid: boolean;
    topExceedanceValue: number;
    topExceedanceTimestamp: {
      hour_of_year: number;
      year: number;
      month: number;
      day: number;
      hour: number;
      regional_load_mw: number;
      hourly_limit: number;
    };
  };
  hardLimit: {
    valid: boolean;
    topExceedanceValue: number;
    topExceedanceTimestamp: {
      hour_of_year: number;
      year: number;
      month: number;
      day: number;
      hour: number;
      regional_load_mw: number;
      hourly_limit: number;
    };
  };
  hourlyEere: HourlyEere[];
};

// reducer
const initialState: EereState = {
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
    annualGwh: 0,
    constantMwh: 0,
    renewables: 0,
    percent: 0,
  },
  softLimit: {
    valid: true,
    topExceedanceValue: 0,
    topExceedanceTimestamp: {
      hour_of_year: 0,
      year: 0,
      month: 0,
      day: 0,
      hour: 0,
      regional_load_mw: 0,
      hourly_limit: 0,
    },
  },
  hardLimit: {
    valid: true,
    topExceedanceValue: 0,
    topExceedanceTimestamp: {
      hour_of_year: 0,
      year: 0,
      month: 0,
      day: 0,
      hour: 0,
      regional_load_mw: 0,
      hourly_limit: 0,
    },
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
        valid: action.valid,
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
          topExceedanceValue: action.payload.softMaxVal,
          topExceedanceTimestamp: action.payload.softTimestamp,
        },
        hardLimit: {
          valid: action.payload.hardValid,
          topExceedanceValue: action.payload.hardMaxVal,
          topExceedanceTimestamp: action.payload.hardTimestamp,
        },
      };

    case 'eere/RESET_EERE_INPUTS':
      return initialState;

    default:
      return state;
  }
}

// action creators
export function validateEere() {
  avert.eereProfile = eereProfile;

  return {
    type: 'eere/VALIDATE_EERE',
    valid: eereProfile.isValid,
    errors: eereProfile.errors,
  };
}

export function updateEereAnnualGwh(text: string): AppThunk {
  return (dispatch) => {
    eereProfile.annualGwh = text;

    dispatch(validateEere());
    dispatch({
      type: 'eere/UPDATE_EERE_ANNUAL_GWH',
      text: text,
    });
  };
}

export function updateEereConstantMw(text: string): AppThunk {
  return (dispatch) => {
    eereProfile.constantMwh = text;

    dispatch(validateEere());
    dispatch({
      type: 'eere/UPDATE_EERE_CONSTANT_MW',
      text: text,
    });
  };
}

export function updateEereBroadBasedProgram(text: string): AppThunk {
  return (dispatch) => {
    eereProfile.topHours = 100;
    eereProfile.reduction = text;

    dispatch(validateEere());
    dispatch({
      type: 'eere/UPDATE_EERE_BROAD_BASE_PROGRAM',
      text: text,
    });
  };
}

export function updateEereReduction(text: string): AppThunk {
  return (dispatch) => {
    eereProfile.reduction = text;

    dispatch(validateEere());
    dispatch({
      type: 'eere/UPDATE_EERE_REDUCTION',
      text: text,
    });
  };
}

export function updateEereTopHours(text: string): AppThunk {
  return (dispatch) => {
    eereProfile.topHours = text;

    dispatch(validateEere());
    dispatch({
      type: 'eere/UPDATE_EERE_TOP_HOURS',
      text: text,
    });
  };
}

export function updateEereWindCapacity(text: string): AppThunk {
  return (dispatch) => {
    eereProfile.windCapacity = text;

    dispatch(validateEere());
    dispatch({
      type: 'eere/UPDATE_EERE_WIND_CAPACITY',
      text: text,
    });
  };
}

export function updateEereUtilitySolar(text: string): AppThunk {
  return (dispatch) => {
    eereProfile.utilitySolar = text;

    dispatch(validateEere());
    dispatch({
      type: 'eere/UPDATE_EERE_UTILITY_SOLAR',
      text: text,
    });
  };
}

export function updateEereRooftopSolar(text: string): AppThunk {
  return (dispatch) => {
    eereProfile.rooftopSolar = text;

    dispatch(validateEere());
    dispatch({
      type: 'eere/UPDATE_EERE_ROOFTOP_SOLAR',
      text: text,
    });
  };
}

export function completeEereCalculation(hourlyEere: HourlyEere[]) {
  return {
    type: 'eere/COMPLETE_EERE_CALCULATION',
    hourlyEere: hourlyEere,
  };
}

export function updateExceedances(soft: number[], hard: number[]): AppThunk {
  return (dispatch, getState) => {
    const { rdfs } = getState();
    const regionalLoadHours = rdfs.rdf.regional_load;

    const softValid = soft.reduce((a, b) => a + b) === 0;
    const softMaxVal = !softValid ? Math.max(...soft) : 0;
    const softMaxIndex = !softValid ? soft.indexOf(softMaxVal) : 0;
    const softTimestamp = !softValid ? regionalLoadHours[softMaxIndex] : {};

    const hardValid = hard.reduce((a, b) => a + b) === 0;
    const hardMaxVal = !hardValid ? Math.max(...hard) : 0;
    const hardMaxIndex = !hardValid ? hard.indexOf(hardMaxVal) : 0;
    const hardTimestamp = !hardValid ? regionalLoadHours[hardMaxIndex] : {};

    return dispatch({
      type: 'eere/UPDATE_EXCEEDANCES',
      payload: {
        softValid,
        softMaxVal,
        softTimestamp,
        hardValid,
        hardMaxVal,
        hardTimestamp,
      },
    });
  };
}

export function calculateEereProfile(): AppThunk {
  return (dispatch, getState) => {
    const { region } = getState();

    dispatch({ type: 'eere/SUBMIT_EERE_CALCULATION' });

    avert.calculateEereLoad(region.number);

    dispatch(completeEereCalculation(avert.eereLoad.hourlyEere));
    dispatch(
      updateExceedances(
        avert.eereLoad.softExceedances,
        avert.eereLoad.hardExceedances,
      ),
    );
  };
}

export function resetEereInputs() {
  eereProfile.reset();

  return {
    type: 'eere/RESET_EERE_INPUTS',
  };
}
