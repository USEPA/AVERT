// reducers
import { AppThunk } from 'app/redux/index';
import { RegionState } from 'app/redux/reducers/geography';
// reducers
import { RegionalLoadData, StateState } from 'app/redux/reducers/geography';
// calculations
import { calculateEere } from 'app/calculations';
// config
import { RegionId, StateId } from 'app/config';

type RegionalProfile = {
  regionId: RegionId;
  hourlyEere: number[];
  softValid: boolean;
  softTopExceedanceValue: number;
  softTopExceedanceIndex: number;
  hardValid: boolean;
  hardTopExceedanceValue: number;
  hardTopExceedanceIndex: number;
};

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
  | { type: 'eere/START_EERE_CALCULATIONS' }
  | {
      type: 'eere/CALCULATE_REGIONAL_EERE_PROFILE';
      payload: RegionalProfile;
    }
  | {
      type: 'eere/COMPLETE_EERE_CALCULATIONS';
      payload: {
        combinedRegionalProfiles: number[];
      };
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
  regionalProfiles: Partial<{ [key in RegionId]: RegionalProfile }>;
  combinedRegionalProfiles: number[];
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
  regionalProfiles: {},
  combinedRegionalProfiles: [],
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

    case 'eere/START_EERE_CALCULATIONS':
      return {
        ...state,
        status: 'started',
        regionalProfiles: {},
      };

    case 'eere/CALCULATE_REGIONAL_EERE_PROFILE': {
      return {
        ...state,
        regionalProfiles: {
          ...state.regionalProfiles,
          [action.payload.regionId]: {
            hourlyEere: action.payload.hourlyEere,
            softValid: action.payload.softValid,
            softTopExceedanceValue: action.payload.softTopExceedanceValue,
            softTopExceedanceIndex: action.payload.softTopExceedanceIndex,
            hardValid: action.payload.hardValid,
            hardTopExceedanceValue: action.payload.hardTopExceedanceValue,
            hardTopExceedanceIndex: action.payload.hardTopExceedanceIndex,
          },
        },
      };
    }

    case 'eere/COMPLETE_EERE_CALCULATIONS':
      return {
        ...state,
        status: 'complete',
        combinedRegionalProfiles: action.payload.combinedRegionalProfiles,
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

    dispatch({ type: 'eere/START_EERE_CALCULATIONS' });

    selectedRegions.forEach((region) => {
      // the regional scaling factor is a number between 0 and 1, representing
      // the proportion the selected geography exists within a given region.
      // - if a state is selected and it falls exactly equally between two
      //   regions, the regional scaling factor would be 0.5 for each of those
      //   two regions
      // - if a region is selected, the regional scaling factor will always be 1
      const regionalScalingFactor = selectedState
        ? (selectedState.regions[region.id] || 100) / 100
        : 1;

      const scaledEereInputs = {
        annualGwh: Number(eere.inputs.annualGwh) * regionalScalingFactor,
        constantMwh: Number(eere.inputs.constantMwh) * regionalScalingFactor,
        broadProgram: Number(eere.inputs.broadProgram) * regionalScalingFactor,
        reduction: Number(eere.inputs.reduction) * regionalScalingFactor,
        topHours: Number(eere.inputs.topHours) * regionalScalingFactor,
        onshoreWind: Number(eere.inputs.onshoreWind) * regionalScalingFactor,
        offshoreWind: Number(eere.inputs.offshoreWind) * regionalScalingFactor,
        utilitySolar: Number(eere.inputs.utilitySolar) * regionalScalingFactor,
        rooftopSolar: Number(eere.inputs.rooftopSolar) * regionalScalingFactor,
      };

      const {
        hourlyEere,
        softValid,
        softTopExceedanceValue,
        softTopExceedanceIndex,
        hardValid,
        hardTopExceedanceValue,
        hardTopExceedanceIndex,
      } = calculateEere({
        regionMaxEEPercent: region.rdf.limits.max_ee_percent,
        regionLineLoss: region.lineLoss,
        hourlyLoads: region.rdf.regional_load.map((hr) => hr.regional_load_mw),
        eereDefaults: region.eereDefaults.data,
        eereInputs: scaledEereInputs,
      });

      dispatch({
        type: 'eere/CALCULATE_REGIONAL_EERE_PROFILE',
        payload: {
          regionId: region.id,
          hourlyEere,
          softValid,
          softTopExceedanceValue,
          softTopExceedanceIndex,
          hardValid,
          hardTopExceedanceValue,
          hardTopExceedanceIndex,
        },
      });
    });

    // TODO: account for multiple regions being selected... everything below is temporary
    const region = selectedRegions[0];
    const {
      hourlyEere,
      softValid,
      softTopExceedanceValue,
      softTopExceedanceIndex,
      hardValid,
      hardTopExceedanceValue,
      hardTopExceedanceIndex,
    } = calculateEere({
      regionMaxEEPercent: region.rdf.limits.max_ee_percent,
      regionLineLoss: region.lineLoss,
      hourlyLoads: region.rdf.regional_load.map((hr) => hr.regional_load_mw),
      eereDefaults: region.eereDefaults.data,
      eereInputs: {
        annualGwh: Number(eere.inputs.annualGwh),
        constantMwh: Number(eere.inputs.constantMwh),
        broadProgram: Number(eere.inputs.broadProgram),
        reduction: Number(eere.inputs.reduction),
        topHours: Number(eere.inputs.topHours),
        onshoreWind: Number(eere.inputs.onshoreWind),
        offshoreWind: Number(eere.inputs.offshoreWind),
        utilitySolar: Number(eere.inputs.utilitySolar),
        rooftopSolar: Number(eere.inputs.rooftopSolar),
      },
    });

    dispatch({
      type: 'eere/COMPLETE_EERE_CALCULATIONS',
      payload: {
        combinedRegionalProfiles: hourlyEere, // TODO: pass combined eere profiles here...
      },
    });

    const regionalLoadHours = region.rdf.regional_load;

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
