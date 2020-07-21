// reducers
import { AppThunk } from 'app/redux/index';
import {
  RegionalLoadData,
  RegionState,
  StateState,
} from 'app/redux/reducers/geography';
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

type CombinedProfile = {
  hourlyEere: number[];
  softValid: boolean;
  softTopExceedanceValue: number;
  softTopExceedanceTimestamp: RegionalLoadData;
  hardValid: boolean;
  hardTopExceedanceValue: number;
  hardTopExceedanceTimestamp: RegionalLoadData;
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
      payload: CombinedProfile;
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
  regionalProfiles: Partial<{ [key in RegionId]: RegionalProfile }>;
  combinedProfile: CombinedProfile;
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
  regionalProfiles: {},
  combinedProfile: {
    hourlyEere: [],
    softValid: true,
    softTopExceedanceValue: 0,
    softTopExceedanceTimestamp: emptyRegionalLoadHour,
    hardValid: true,
    hardTopExceedanceValue: 0,
    hardTopExceedanceTimestamp: emptyRegionalLoadHour,
  },
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
        combinedProfile: action.payload,
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

    // selected regional profiles are stored individually to pass to the
    // displacements calculation, and also combined for all selected regions to
    // create the eere profile chart and show validation warning/error message
    const selectedRegionalProfiles: RegionalProfile[] = [];

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

      const regionalProfile = {
        regionId: region.id,
        hourlyEere,
        softValid,
        softTopExceedanceValue,
        softTopExceedanceIndex,
        hardValid,
        hardTopExceedanceValue,
        hardTopExceedanceIndex,
      };

      selectedRegionalProfiles.push(regionalProfile);

      dispatch({
        type: 'eere/CALCULATE_REGIONAL_EERE_PROFILE',
        payload: regionalProfile,
      });
    });

    // construct an object of properties from selectedRegionalProfiles, so we
    // don't need to map over it multiple times to work with each property
    const profiles = {
      regionIds: [] as RegionId[],
      hourlyEeres: [] as number[][],
      softValids: [] as boolean[],
      softTopExceedanceVals: [] as number[],
      softTopExceedanceIdxs: [] as number[],
      hardValids: [] as boolean[],
      hardTopExceedanceVals: [] as number[],
      hardTopExceedanceIdxs: [] as number[],
    };

    selectedRegionalProfiles.forEach((p) => {
      profiles.regionIds.push(p.regionId);
      profiles.hourlyEeres.push(p.hourlyEere);
      profiles.softValids.push(p.softValid);
      profiles.softTopExceedanceVals.push(p.softTopExceedanceValue);
      profiles.softTopExceedanceIdxs.push(p.softTopExceedanceIndex);
      profiles.hardValids.push(p.hardValid);
      profiles.hardTopExceedanceVals.push(p.hardTopExceedanceValue);
      profiles.hardTopExceedanceIdxs.push(p.hardTopExceedanceIndex);
    });

    // add up hourly eeres from each selected region into one hourlyEere array
    const combinedHourlyEeres = profiles.hourlyEeres.reduce(
      (combinedHourlyEere, regionalHourlyEere) => {
        return combinedHourlyEere.map((hourlyLoad, index) => {
          return hourlyLoad + regionalHourlyEere[index];
        });
      },
    );

    // if one region's not valid, the combined profile is not valid
    const softValid = profiles.softValids.every((isValid) => isValid);
    const hardValid = profiles.hardValids.every((isValid) => isValid);

    // if a region is invalid...
    //   get the first hour of exceedance across all of the selected regions
    //   NOTE: `[].filter(Boolean)` used to filter out zeros, as a lack of
    //   exceedance for that particular region is denoted as a 0
    // else, a region is valid...
    //   so just use the first index value (all will be 0)
    const softTopExceedanceIdx = !softValid
      ? Math.min(...profiles.softTopExceedanceIdxs.filter(Boolean))
      : profiles.softTopExceedanceIdxs[0];
    const hardTopExceedanceIdx = !hardValid
      ? Math.min(...profiles.hardTopExceedanceIdxs.filter(Boolean))
      : profiles.hardTopExceedanceIdxs[0];

    // get the index of that first hour of exceedance in the profiles object in
    // order to get the corresponding top value and corresponding region id
    const sIdx = profiles.softTopExceedanceIdxs.indexOf(softTopExceedanceIdx);
    const hIdx = profiles.hardTopExceedanceIdxs.indexOf(hardTopExceedanceIdx);

    // get the corresponding value from that first hour of exceedance
    const softTopExceedanceValue = profiles.softTopExceedanceVals[sIdx];
    const hardTopExceedanceValue = profiles.hardTopExceedanceVals[hIdx];

    // get the corresponding region id from the first hour of exceedance
    const softRegionId = profiles.regionIds[sIdx];
    const hardRegionId = profiles.regionIds[hIdx];

    // get the timestamp of the first hour of exceedance
    const softTopExceedanceTimestamp = !softValid
      ? geography.regions[softRegionId].rdf.regional_load[softTopExceedanceIdx]
      : emptyRegionalLoadHour;

    const hardTopExceedanceTimestamp = !hardValid
      ? geography.regions[hardRegionId].rdf.regional_load[hardTopExceedanceIdx]
      : emptyRegionalLoadHour;

    dispatch({
      type: 'eere/COMPLETE_EERE_CALCULATIONS',
      payload: {
        hourlyEere: combinedHourlyEeres,
        softValid,
        softTopExceedanceValue,
        softTopExceedanceTimestamp,
        hardValid,
        hardTopExceedanceValue,
        hardTopExceedanceTimestamp,
      },
    });
  };
}

export function resetEereInputs() {
  return { type: 'eere/RESET_EERE_INPUTS' };
}
