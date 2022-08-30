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
import { RegionId, StateId, regions } from 'app/config';

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
  | { type: 'eere/RESET_EERE_INPUTS' }
  | {
      type: 'eere/VALIDATE_EERE';
      payload: { errors: EereInputFieldName[] };
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
    };

export type EereInputFieldName =
  | 'annualGwh'
  | 'constantMwh'
  | 'broadProgram'
  | 'reduction'
  | 'topHours'
  | 'onshoreWind'
  | 'offshoreWind'
  | 'utilitySolar'
  | 'rooftopSolar';

export type EereInputs = { [field in EereInputFieldName]: string };

type EereState = {
  status: 'ready' | 'started' | 'complete';
  errors: EereInputFieldName[];
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
    case 'eere/RESET_EERE_INPUTS': {
      // initial state
      return {
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
    }

    case 'eere/VALIDATE_EERE': {
      const { errors } = action.payload;

      return {
        ...state,
        errors,
      };
    }

    case 'eere/UPDATE_EERE_ANNUAL_GWH': {
      const { text } = action.payload;

      return {
        ...state,
        inputs: {
          ...state.inputs,
          annualGwh: text,
        },
      };
    }

    case 'eere/UPDATE_EERE_CONSTANT_MW': {
      const { text } = action.payload;

      return {
        ...state,
        inputs: {
          ...state.inputs,
          constantMwh: text,
        },
      };
    }

    case 'eere/UPDATE_EERE_BROAD_BASE_PROGRAM': {
      const { text } = action.payload;

      return {
        ...state,
        inputs: {
          ...state.inputs,
          broadProgram: text,
        },
      };
    }

    case 'eere/UPDATE_EERE_REDUCTION': {
      const { text } = action.payload;

      return {
        ...state,
        inputs: {
          ...state.inputs,
          reduction: text,
        },
      };
    }

    case 'eere/UPDATE_EERE_TOP_HOURS': {
      const { text } = action.payload;

      return {
        ...state,
        inputs: {
          ...state.inputs,
          topHours: text,
        },
      };
    }

    case 'eere/UPDATE_EERE_ONSHORE_WIND': {
      const { text } = action.payload;

      return {
        ...state,
        inputs: {
          ...state.inputs,
          onshoreWind: text,
        },
      };
    }

    case 'eere/UPDATE_EERE_OFFSHORE_WIND': {
      const { text } = action.payload;

      return {
        ...state,
        inputs: {
          ...state.inputs,
          offshoreWind: text,
        },
      };
    }

    case 'eere/UPDATE_EERE_UTILITY_SOLAR': {
      const { text } = action.payload;

      return {
        ...state,
        inputs: {
          ...state.inputs,
          utilitySolar: text,
        },
      };
    }

    case 'eere/UPDATE_EERE_ROOFTOP_SOLAR': {
      const { text } = action.payload;

      return {
        ...state,
        inputs: {
          ...state.inputs,
          rooftopSolar: text,
        },
      };
    }

    case 'eere/START_EERE_CALCULATIONS': {
      return {
        ...state,
        status: 'started',
        regionalProfiles: {},
      };
    }

    case 'eere/CALCULATE_REGIONAL_EERE_PROFILE': {
      const {
        regionId,
        hourlyEere,
        softValid,
        softTopExceedanceValue,
        softTopExceedanceIndex,
        hardValid,
        hardTopExceedanceValue,
        hardTopExceedanceIndex,
      } = action.payload;

      return {
        ...state,
        regionalProfiles: {
          ...state.regionalProfiles,
          [regionId]: {
            hourlyEere,
            softValid,
            softTopExceedanceValue,
            softTopExceedanceIndex,
            hardValid,
            hardTopExceedanceValue,
            hardTopExceedanceIndex,
          },
        },
      };
    }

    case 'eere/COMPLETE_EERE_CALCULATIONS': {
      return {
        ...state,
        status: 'complete',
        combinedProfile: action.payload,
      };
    }

    default: {
      return state;
    }
  }
}

// action creators
function validateInput(
  inputField: EereInputFieldName,
  inputValue: string,
): AppThunk {
  return (dispatch, getState) => {
    const { eere } = getState();

    const value = Number(inputValue);
    const invalidInput = isNaN(value) || value < 0;

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

export function updateEereAnnualGwh(input: string): AppThunk {
  return (dispatch) => {
    dispatch({
      type: 'eere/UPDATE_EERE_ANNUAL_GWH',
      payload: { text: input },
    });

    dispatch(validateInput('annualGwh', input));
  };
}

export function updateEereConstantMw(input: string): AppThunk {
  return (dispatch) => {
    dispatch({
      type: 'eere/UPDATE_EERE_CONSTANT_MW',
      payload: { text: input },
    });

    dispatch(validateInput('constantMwh', input));
  };
}

export function updateEereBroadBasedProgram(input: string): AppThunk {
  return (dispatch) => {
    dispatch({
      type: 'eere/UPDATE_EERE_BROAD_BASE_PROGRAM',
      payload: { text: input },
    });

    dispatch(validateInput('reduction', input));
  };
}

export function updateEereReduction(input: string): AppThunk {
  return (dispatch) => {
    dispatch({
      type: 'eere/UPDATE_EERE_REDUCTION',
      payload: { text: input },
    });

    dispatch(validateInput('reduction', input));
  };
}

export function updateEereTopHours(input: string): AppThunk {
  return (dispatch) => {
    dispatch({
      type: 'eere/UPDATE_EERE_TOP_HOURS',
      payload: { text: input },
    });

    dispatch(validateInput('topHours', input));
  };
}

export function updateEereOnshoreWind(input: string): AppThunk {
  return (dispatch) => {
    dispatch({
      type: 'eere/UPDATE_EERE_ONSHORE_WIND',
      payload: { text: input },
    });

    dispatch(validateInput('onshoreWind', input));
  };
}

export function updateEereOffshoreWind(input: string): AppThunk {
  return (dispatch) => {
    dispatch({
      type: 'eere/UPDATE_EERE_OFFSHORE_WIND',
      payload: { text: input },
    });

    dispatch(validateInput('offshoreWind', input));
  };
}

export function updateEereUtilitySolar(input: string): AppThunk {
  return (dispatch) => {
    dispatch({
      type: 'eere/UPDATE_EERE_UTILITY_SOLAR',
      payload: { text: input },
    });

    dispatch(validateInput('utilitySolar', input));
  };
}

export function updateEereRooftopSolar(input: string): AppThunk {
  return (dispatch) => {
    dispatch({
      type: 'eere/UPDATE_EERE_ROOFTOP_SOLAR',
      payload: { text: input },
    });

    dispatch(validateInput('rooftopSolar', input));
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
          Object.keys(state.percentageByRegion).forEach((regionId) => {
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

    // build up total percentage of selected state in all selected regions that
    // support offshore wind
    const totalOffshoreWindPercent = selectedRegions.reduce((total, region) => {
      const regionalPercent = selectedState?.percentageByRegion[region.id] || 0;
      return region.offshoreWind ? (total += regionalPercent) : total;
    }, 0);

    selectedRegions.forEach((region) => {
      const regionalPercent = selectedState?.percentageByRegion[region.id] || 0;

      // the regional scaling factor is a number between 0 and 1, representing
      // the proportion the selected geography exists within a given region.
      // - if a region is selected, the regional scaling factor will always be 1
      // - if a state is selected, the regional scaling factor comes from the
      //   selected state's percentage by region value for the given region, as
      //   defined in the config file (`app/config.ts`). for example, if the
      //   state falls exactly equally between the two regions, the regional
      //   scaling factor would be 0.5 for each of those two regions.
      const regionalScalingFactor = !selectedState ? 1 : regionalPercent / 100;

      // the percent reduction factor also is a number between 0 and 1, and
      // is used to scale the user's input for broad-based program reduction
      // (percent reduction across all hours) or targed program reduction
      // (percent reduction across a specified peak percentage of hours) to
      // each region, since a selected state represents only a percentage of
      // a region's emissions sales
      // - if a region is selected, the percent reduction factor will always be 1
      // - if a state is selected, the percent reduction factor comes from the
      //   given region's percentage by state value for the selected state, as
      //   defined in the config file (`app/config.ts`)
      const percentReductionFactor = !selectedState
        ? 1
        : (regions[region.id].percentageByState[selectedState?.id] || 0) / 100;

      // the offshore wind factor is also a number between 0 and 1, representing
      // the proportion the selected geography's offshore wind value should be
      // allocated to each region. regions either support offshore wind or they
      // don't, and some states are within at least one region that supports it,
      // and at least one region that doesn't.
      // - if a region is selected, the offshore wind factor will always be 1
      //   (if the region doesn't support offshore wind, the input will be
      //   disabled and 0 will be used in the calculations for offshore wind –
      //   see `app/calculations.ts`)
      // - if a is state is selected and it's within a region that supports
      //   offshore wind, the offshore wind factor will be set to an integer
      //   equal to the proportion the state exists within the region divided
      //   by the proprtion the state exists within all regions that support
      //   offshore wind
      // - if a state is selected and it's within a region that doesn't support
      //   offshore wind, the offshore wind factor will always be 0
      //
      // for example:
      // Kentucky is selected...it's within the Tennessee, Mid-Atlantic, and
      // Midwest regions, but only the Mid-Atlantic region supports offshore
      // wind. so the Tennessee and Midwest regions' `offshoreWindFactor` would
      // be 0, and the Mid-Atlantic region's `offshoreWindFactor` would be 1
      const offshoreWindFactor = !selectedState
        ? 1
        : region.offshoreWind
        ? regionalPercent / totalOffshoreWindPercent
        : 0;

      const scaledEereInputs = {
        annualGwh: Number(eere.inputs.annualGwh) * regionalScalingFactor,
        constantMwh: Number(eere.inputs.constantMwh) * regionalScalingFactor,
        broadProgram: Number(eere.inputs.broadProgram) * percentReductionFactor,
        reduction: Number(eere.inputs.reduction) * percentReductionFactor,
        topHours: Number(eere.inputs.topHours),
        onshoreWind: Number(eere.inputs.onshoreWind) * regionalScalingFactor,
        offshoreWind: Number(eere.inputs.offshoreWind) * offshoreWindFactor,
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
        eereLoads: region.rdf.regional_load.map((hr) => hr.regional_load_mw),
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
    // else, a region is valid...
    //   so use the first index value
    const softTopExceedanceIdx = !softValid
      ? Math.min(...profiles.softTopExceedanceIdxs.filter((d) => d !== -1))
      : profiles.softTopExceedanceIdxs[0];
    const hardTopExceedanceIdx = !hardValid
      ? Math.min(...profiles.hardTopExceedanceIdxs.filter((d) => d !== -1))
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
