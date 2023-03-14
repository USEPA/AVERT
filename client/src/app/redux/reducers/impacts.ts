import { AppThunk } from 'app/redux/index';
import {
  RegionalLoadData,
  RegionState,
  StateState,
} from 'app/redux/reducers/geography';
import {
  setEVEfficiency,
  setVehiclesDisplaced,
  setMonthlyEVEnergyUsage,
  setMonthlyEmissionRates,
  setVehicleSalesAndStock,
  setEVDeploymentLocationHistoricalEERE,
} from 'app/redux/reducers/transportation';
import type {
  HourlyRenewableEnergyProfile,
  HourlyEVLoad,
  TopPercentGeneration,
  HourlyTopPercentReduction,
  HourlyImpacts,
  HourlyChangesValidation,
} from 'app/calculations/impacts';
import {
  calculateHourlyRenewableEnergyProfile,
  calculateHourlyEVLoad,
  calculateTopPercentGeneration,
  calculateHourlyTopPercentReduction,
  calculateHourlyImpacts,
  calculateHourlyChangesValidation,
} from 'app/calculations/impacts';
import type { RegionId, StateId } from 'app/config';
import { evModelYearOptions, iceReplacementVehicleOptions } from 'app/config';

type SelectOption = { id: string; name: string };

type Action =
  | { type: 'impacts/RESET_IMPACTS_INPUTS' }
  | {
      type: 'impacts/SET_EV_DEPLOYMENT_LOCATION_OPTIONS';
      payload: { evDeploymentLocationOptions: SelectOption[] };
    }
  | {
      type: 'impacts/VALIDATE_IMPACTS_INPUTS';
      payload: {
        errors: (
          | EnergyEfficiencyFieldName
          | RenewableEnergyFieldName
          | ElectricVehiclesFieldName
        )[];
      };
    }
  | {
      type: 'impacts/UPDATE_EE_ANNUAL_GWH';
      payload: { text: string };
    }
  | {
      type: 'impacts/UPDATE_EE_CONSTANT_MW';
      payload: { text: string };
    }
  | {
      type: 'impacts/UPDATE_EE_BROAD_BASE_PROGRAM';
      payload: { text: string };
    }
  | {
      type: 'impacts/UPDATE_EE_REDUCTION';
      payload: { text: string };
    }
  | {
      type: 'impacts/UPDATE_EE_TOP_HOURS';
      payload: { text: string };
    }
  | {
      type: 'impacts/UPDATE_RE_ONSHORE_WIND';
      payload: { text: string };
    }
  | {
      type: 'impacts/UPDATE_RE_OFFSHORE_WIND';
      payload: { text: string };
    }
  | {
      type: 'impacts/UPDATE_RE_UTILITY_SOLAR';
      payload: { text: string };
    }
  | {
      type: 'impacts/UPDATE_RE_ROOFTOP_SOLAR';
      payload: { text: string };
    }
  | {
      type: 'impacts/UPDATE_EV_BATTERY_EVS';
      payload: { text: string };
    }
  | {
      type: 'impacts/UPDATE_EV_BATTERY_EVS_CALCULATIONS_INPUT';
      payload: { text: string };
    }
  | {
      type: 'impacts/UPDATE_EV_HYBRID_EVS';
      payload: { text: string };
    }
  | {
      type: 'impacts/UPDATE_EV_HYBRID_EVS_CALCULATIONS_INPUT';
      payload: { text: string };
    }
  | {
      type: 'impacts/UPDATE_EV_TRANSIT_BUSES';
      payload: { text: string };
    }
  | {
      type: 'impacts/UPDATE_EV_TRANSIT_BUSES_CALCULATIONS_INPUT';
      payload: { text: string };
    }
  | {
      type: 'impacts/UPDATE_EV_SCHOOL_BUSES';
      payload: { text: string };
    }
  | {
      type: 'impacts/UPDATE_EV_SCHOOL_BUSES_CALCULATIONS_INPUT';
      payload: { text: string };
    }
  | {
      type: 'impacts/UPDATE_EV_DEPLOYMENT_LOCATION';
      payload: { option: string };
    }
  | {
      type: 'impacts/UPDATE_EV_MODEL_YEAR';
      payload: { option: string };
    }
  | {
      type: 'impacts/UPDATE_EV_ICE_REPLACEMENT_VEHICLE';
      payload: { option: string };
    }
  | {
      type: 'impacts/START_HOURLY_ENERGY_PROFILE_CALCULATIONS';
      payload: { inputs: ImpactsInputs };
    }
  | {
      type: 'impacts/SET_HOURLY_ENERGY_PROFILE_REGIONAL_DATA';
      payload: {
        regionId: RegionId;
        hourlyRenewableEnergyProfile: HourlyRenewableEnergyProfile;
        hourlyEVLoad: HourlyEVLoad;
        topPercentGeneration: TopPercentGeneration;
        hourlyTopPercentReduction: HourlyTopPercentReduction;
        hourlyImpacts: HourlyImpacts;
      };
    }
  | {
      type: 'impacts/SET_HOURLY_ENERGY_PROFILE_TOTAL_HOURLY_CHANGES';
      payload: {
        totalHourlyChanges: { [hour: number]: number };
      };
    }
  | {
      type: 'impacts/SET_HOURLY_ENERGY_PROFILE_VALIDATION';
      payload: {
        hourlyChangesValidation: HourlyChangesValidation;
      };
    }
  | { type: 'impacts/COMPLETE_HOURLY_ENERGY_PROFILE_CALCULATIONS' };

export type EnergyEfficiencyFieldName =
  | 'annualGwh'
  | 'constantMwh'
  | 'broadProgram'
  | 'reduction'
  | 'topHours';

export type RenewableEnergyFieldName =
  | 'onshoreWind'
  | 'offshoreWind'
  | 'utilitySolar'
  | 'rooftopSolar';

export type ElectricVehiclesFieldName =
  | 'batteryEVs'
  | 'hybridEVs'
  | 'transitBuses'
  | 'schoolBuses';

type SelectOptionsFieldName =
  | 'evDeploymentLocationOptions'
  | 'evModelYearOptions'
  | 'iceReplacementVehicleOptions';

export type ImpactsInputs = {
  [field in
    | EnergyEfficiencyFieldName
    | RenewableEnergyFieldName
    | ElectricVehiclesFieldName
    | 'evDeploymentLocation'
    | 'evModelYear'
    | 'iceReplacementVehicle']: string;
};

type State = {
  errors: (
    | EnergyEfficiencyFieldName
    | RenewableEnergyFieldName
    | ElectricVehiclesFieldName
  )[];
  inputs: ImpactsInputs;
  selectOptions: { [field in SelectOptionsFieldName]: SelectOption[] };
  evCalculationsInputs: { [field in ElectricVehiclesFieldName]: string };
  hourlyEnergyProfile: {
    status: 'idle' | 'pending' | 'success';
    inputs: ImpactsInputs;
    data: {
      regions: Partial<{
        [key in RegionId]: {
          hourlyRenewableEnergyProfile: HourlyRenewableEnergyProfile;
          hourlyEVLoad: HourlyEVLoad;
          topPercentGeneration: TopPercentGeneration;
          hourlyTopPercentReduction: HourlyTopPercentReduction;
          hourlyImpacts: HourlyImpacts;
        };
      }>;
      total: { hourlyChanges: { [hour: number]: number } };
    };
    validation: HourlyChangesValidation;
  };
};

/** NOTE: Excel version defaults EV model year to 2021 */
const initialEVModelYear = evModelYearOptions[1].id;

const initialICEReplacementVehicle = iceReplacementVehicleOptions[0].id;

const initialImpactsInputs = {
  annualGwh: '',
  constantMwh: '',
  broadProgram: '',
  reduction: '',
  topHours: '',
  onshoreWind: '',
  offshoreWind: '',
  utilitySolar: '',
  rooftopSolar: '',
  batteryEVs: '',
  hybridEVs: '',
  transitBuses: '',
  schoolBuses: '',
  evDeploymentLocation: '',
  evModelYear: initialEVModelYear,
  iceReplacementVehicle: initialICEReplacementVehicle,
};

const initialState: State = {
  errors: [],
  inputs: initialImpactsInputs,
  selectOptions: {
    evDeploymentLocationOptions: [{ id: '', name: '' }],
    evModelYearOptions,
    iceReplacementVehicleOptions,
  },
  evCalculationsInputs: {
    batteryEVs: '',
    hybridEVs: '',
    transitBuses: '',
    schoolBuses: '',
  },
  hourlyEnergyProfile: {
    status: 'idle',
    inputs: initialImpactsInputs,
    data: {
      regions: {},
      total: {
        hourlyChanges: {},
      },
    },
    validation: {
      upperError: null,
      lowerWarning: null,
      lowerError: null,
    },
  },
};

export default function reducer(
  state: State = initialState,
  action: Action,
): State {
  switch (action.type) {
    case 'impacts/RESET_IMPACTS_INPUTS': {
      // initial state, excluding for selectOptions
      return {
        ...state,
        errors: [],
        inputs: initialImpactsInputs,
        // NOTE: selectOptions should not be reset
        evCalculationsInputs: {
          batteryEVs: '',
          hybridEVs: '',
          transitBuses: '',
          schoolBuses: '',
        },
        hourlyEnergyProfile: {
          status: 'idle',
          inputs: initialImpactsInputs,
          data: {
            regions: {},
            total: {
              hourlyChanges: {},
            },
          },
          validation: {
            upperError: null,
            lowerWarning: null,
            lowerError: null,
          },
        },
      };
    }

    case 'impacts/SET_EV_DEPLOYMENT_LOCATION_OPTIONS': {
      const { evDeploymentLocationOptions } = action.payload;
      return {
        ...state,
        selectOptions: {
          ...state.selectOptions,
          evDeploymentLocationOptions,
        },
      };
    }

    case 'impacts/VALIDATE_IMPACTS_INPUTS': {
      const { errors } = action.payload;
      return {
        ...state,
        errors,
      };
    }

    case 'impacts/UPDATE_EE_ANNUAL_GWH': {
      const { text } = action.payload;
      return {
        ...state,
        inputs: {
          ...state.inputs,
          annualGwh: text,
        },
      };
    }

    case 'impacts/UPDATE_EE_CONSTANT_MW': {
      const { text } = action.payload;
      return {
        ...state,
        inputs: {
          ...state.inputs,
          constantMwh: text,
        },
      };
    }

    case 'impacts/UPDATE_EE_BROAD_BASE_PROGRAM': {
      const { text } = action.payload;
      return {
        ...state,
        inputs: {
          ...state.inputs,
          broadProgram: text,
        },
      };
    }

    case 'impacts/UPDATE_EE_REDUCTION': {
      const { text } = action.payload;
      return {
        ...state,
        inputs: {
          ...state.inputs,
          reduction: text,
        },
      };
    }

    case 'impacts/UPDATE_EE_TOP_HOURS': {
      const { text } = action.payload;
      return {
        ...state,
        inputs: {
          ...state.inputs,
          topHours: text,
        },
      };
    }

    case 'impacts/UPDATE_RE_ONSHORE_WIND': {
      const { text } = action.payload;
      return {
        ...state,
        inputs: {
          ...state.inputs,
          onshoreWind: text,
        },
      };
    }

    case 'impacts/UPDATE_RE_OFFSHORE_WIND': {
      const { text } = action.payload;
      return {
        ...state,
        inputs: {
          ...state.inputs,
          offshoreWind: text,
        },
      };
    }

    case 'impacts/UPDATE_RE_UTILITY_SOLAR': {
      const { text } = action.payload;
      return {
        ...state,
        inputs: {
          ...state.inputs,
          utilitySolar: text,
        },
      };
    }

    case 'impacts/UPDATE_RE_ROOFTOP_SOLAR': {
      const { text } = action.payload;
      return {
        ...state,
        inputs: {
          ...state.inputs,
          rooftopSolar: text,
        },
      };
    }

    case 'impacts/UPDATE_EV_BATTERY_EVS': {
      const { text } = action.payload;
      return {
        ...state,
        inputs: {
          ...state.inputs,
          batteryEVs: text,
        },
      };
    }

    case 'impacts/UPDATE_EV_BATTERY_EVS_CALCULATIONS_INPUT': {
      const { text } = action.payload;
      return {
        ...state,
        evCalculationsInputs: {
          ...state.evCalculationsInputs,
          batteryEVs: text,
        },
      };
    }

    case 'impacts/UPDATE_EV_HYBRID_EVS': {
      const { text } = action.payload;
      return {
        ...state,
        inputs: {
          ...state.inputs,
          hybridEVs: text,
        },
      };
    }

    case 'impacts/UPDATE_EV_HYBRID_EVS_CALCULATIONS_INPUT': {
      const { text } = action.payload;
      return {
        ...state,
        evCalculationsInputs: {
          ...state.evCalculationsInputs,
          hybridEVs: text,
        },
      };
    }

    case 'impacts/UPDATE_EV_TRANSIT_BUSES': {
      const { text } = action.payload;
      return {
        ...state,
        inputs: {
          ...state.inputs,
          transitBuses: text,
        },
      };
    }

    case 'impacts/UPDATE_EV_TRANSIT_BUSES_CALCULATIONS_INPUT': {
      const { text } = action.payload;
      return {
        ...state,
        evCalculationsInputs: {
          ...state.evCalculationsInputs,
          transitBuses: text,
        },
      };
    }

    case 'impacts/UPDATE_EV_SCHOOL_BUSES': {
      const { text } = action.payload;
      return {
        ...state,
        inputs: {
          ...state.inputs,
          schoolBuses: text,
        },
      };
    }

    case 'impacts/UPDATE_EV_SCHOOL_BUSES_CALCULATIONS_INPUT': {
      const { text } = action.payload;
      return {
        ...state,
        evCalculationsInputs: {
          ...state.evCalculationsInputs,
          schoolBuses: text,
        },
      };
    }

    case 'impacts/UPDATE_EV_DEPLOYMENT_LOCATION': {
      const { option } = action.payload;
      return {
        ...state,
        inputs: {
          ...state.inputs,
          evDeploymentLocation: option,
        },
      };
    }

    case 'impacts/UPDATE_EV_MODEL_YEAR': {
      const { option } = action.payload;
      return {
        ...state,
        inputs: {
          ...state.inputs,
          evModelYear: option,
        },
      };
    }

    case 'impacts/UPDATE_EV_ICE_REPLACEMENT_VEHICLE': {
      const { option } = action.payload;
      return {
        ...state,
        inputs: {
          ...state.inputs,
          iceReplacementVehicle: option,
        },
      };
    }

    case 'impacts/START_HOURLY_ENERGY_PROFILE_CALCULATIONS': {
      const { inputs } = action.payload;
      return {
        ...state,
        hourlyEnergyProfile: {
          status: 'pending',
          inputs,
          data: {
            regions: {},
            total: {
              hourlyChanges: {},
            },
          },
          validation: {
            upperError: null,
            lowerWarning: null,
            lowerError: null,
          },
        },
      };
    }

    case 'impacts/SET_HOURLY_ENERGY_PROFILE_REGIONAL_DATA': {
      const {
        regionId,
        hourlyRenewableEnergyProfile,
        hourlyEVLoad,
        topPercentGeneration,
        hourlyTopPercentReduction,
        hourlyImpacts,
      } = action.payload;

      return {
        ...state,
        hourlyEnergyProfile: {
          ...state.hourlyEnergyProfile,
          data: {
            ...state.hourlyEnergyProfile.data,
            regions: {
              ...state.hourlyEnergyProfile.data.regions,
              [regionId]: {
                hourlyRenewableEnergyProfile,
                hourlyEVLoad,
                topPercentGeneration,
                hourlyTopPercentReduction,
                hourlyImpacts,
              },
            },
          },
        },
      };
    }

    case 'impacts/SET_HOURLY_ENERGY_PROFILE_TOTAL_HOURLY_CHANGES': {
      const { totalHourlyChanges } = action.payload;

      return {
        ...state,
        hourlyEnergyProfile: {
          ...state.hourlyEnergyProfile,
          data: {
            ...state.hourlyEnergyProfile.data,
            total: {
              hourlyChanges: totalHourlyChanges,
            },
          },
        },
      };
    }

    case 'impacts/SET_HOURLY_ENERGY_PROFILE_VALIDATION': {
      const { hourlyChangesValidation } = action.payload;

      return {
        ...state,
        hourlyEnergyProfile: {
          ...state.hourlyEnergyProfile,
          validation: hourlyChangesValidation,
        },
      };
    }

    case 'impacts/COMPLETE_HOURLY_ENERGY_PROFILE_CALCULATIONS': {
      return {
        ...state,
        hourlyEnergyProfile: {
          ...state.hourlyEnergyProfile,
          status: 'success',
        },
      };
    }

    default: {
      return state;
    }
  }
}

/**
 * Called every time the `geography` reducer's `selectGeography()`,
 * `selectRegion()`, or `selectState()` function is called.
 *
 * _(e.g. anytime the selected geography changes)_
 */
export function setEVDeploymentLocationOptions(): AppThunk {
  return (dispatch, getState) => {
    const { geography } = getState();
    const { focus, regions, states } = geography;

    const selectedRegion = Object.values(regions).find((r) => r.selected);
    const selectedState = Object.values(states).find((s) => s.selected);

    const evDeploymentLocationOptions =
      focus === 'regions' && selectedRegion
        ? [
            {
              id: `region-${selectedRegion.id}`,
              name: `${selectedRegion.name} Region`,
            },
            ...Object.keys(selectedRegion.percentageByState).map((id) => ({
              id: `state-${id}`,
              name: states[id as StateId].name || id,
            })),
          ]
        : focus === 'states' && selectedState
        ? [
            {
              id: `state-${selectedState.id}`,
              name: `${selectedState.name}`,
            },
          ]
        : [{ id: '', name: '' }];

    dispatch({
      type: 'impacts/SET_EV_DEPLOYMENT_LOCATION_OPTIONS',
      payload: { evDeploymentLocationOptions },
    });

    // NOTE: `vehicleSalesAndStock` uses `evDeploymentLocationOptions`
    dispatch(setVehicleSalesAndStock());
  };
}

function validateInput(
  inputField:
    | EnergyEfficiencyFieldName
    | RenewableEnergyFieldName
    | ElectricVehiclesFieldName,
  inputValue: string,
  invalidCharacters: string[],
): AppThunk {
  return (dispatch, getState) => {
    const { impacts } = getState();

    const value = Number(inputValue.replaceAll(',', ''));
    const invalidInput =
      isNaN(value) ||
      value < 0 ||
      invalidCharacters.some((c) => inputValue.includes(c));

    // remove input field being validated from existing fields with errors
    const errors = impacts.errors.filter((field) => field !== inputField);

    return dispatch({
      type: 'impacts/VALIDATE_IMPACTS_INPUTS',
      payload: {
        errors: invalidInput ? [...errors, inputField] : errors,
      },
    });
  };
}

export function updateEEAnnualGwh(input: string): AppThunk {
  return (dispatch) => {
    dispatch({
      type: 'impacts/UPDATE_EE_ANNUAL_GWH',
      payload: { text: input },
    });

    dispatch(validateInput('annualGwh', input, []));
  };
}

export function updateEEConstantMw(input: string): AppThunk {
  return (dispatch) => {
    dispatch({
      type: 'impacts/UPDATE_EE_CONSTANT_MW',
      payload: { text: input },
    });

    dispatch(validateInput('constantMwh', input, []));
  };
}

export function updateEEBroadBasedProgram(input: string): AppThunk {
  return (dispatch) => {
    dispatch({
      type: 'impacts/UPDATE_EE_BROAD_BASE_PROGRAM',
      payload: { text: input },
    });

    dispatch(validateInput('broadProgram', input, []));
  };
}

export function updateEEReduction(input: string): AppThunk {
  return (dispatch) => {
    dispatch({
      type: 'impacts/UPDATE_EE_REDUCTION',
      payload: { text: input },
    });

    dispatch(validateInput('reduction', input, []));
  };
}

export function updateEETopHours(input: string): AppThunk {
  return (dispatch) => {
    dispatch({
      type: 'impacts/UPDATE_EE_TOP_HOURS',
      payload: { text: input },
    });

    dispatch(validateInput('topHours', input, []));
  };
}

export function updateREOnshoreWind(input: string): AppThunk {
  return (dispatch) => {
    dispatch({
      type: 'impacts/UPDATE_RE_ONSHORE_WIND',
      payload: { text: input },
    });

    dispatch(validateInput('onshoreWind', input, []));
  };
}

export function updateREOffshoreWind(input: string): AppThunk {
  return (dispatch) => {
    dispatch({
      type: 'impacts/UPDATE_RE_OFFSHORE_WIND',
      payload: { text: input },
    });

    dispatch(validateInput('offshoreWind', input, []));
  };
}

export function updateREUtilitySolar(input: string): AppThunk {
  return (dispatch) => {
    dispatch({
      type: 'impacts/UPDATE_RE_UTILITY_SOLAR',
      payload: { text: input },
    });

    dispatch(validateInput('utilitySolar', input, []));
  };
}

export function updateRERooftopSolar(input: string): AppThunk {
  return (dispatch) => {
    dispatch({
      type: 'impacts/UPDATE_RE_ROOFTOP_SOLAR',
      payload: { text: input },
    });

    dispatch(validateInput('rooftopSolar', input, []));
  };
}

export function updateEVBatteryEVs(input: string): AppThunk {
  return (dispatch) => {
    dispatch({
      type: 'impacts/UPDATE_EV_BATTERY_EVS',
      payload: { text: input },
    });

    dispatch(validateInput('batteryEVs', input, ['.']));
  };
}

/**
 * Called every time the batteryEVs inputs loses focus (e.g. onBlur)
 */
export function runEVBatteryEVsCalculations(input: string): AppThunk {
  return (dispatch, getState) => {
    const { impacts } = getState();
    const { batteryEVs } = impacts.evCalculationsInputs;

    /** only run calculations if the input has changed since the last onBlur */
    if (input !== batteryEVs) {
      dispatch(setVehiclesDisplaced());
    }

    dispatch({
      type: 'impacts/UPDATE_EV_BATTERY_EVS_CALCULATIONS_INPUT',
      payload: { text: input },
    });
  };
}

export function updateEVHybridEVs(input: string): AppThunk {
  return (dispatch) => {
    dispatch({
      type: 'impacts/UPDATE_EV_HYBRID_EVS',
      payload: { text: input },
    });

    dispatch(validateInput('hybridEVs', input, ['.']));
  };
}

/**
 * Called every time the hybridEVs inputs loses focus (e.g. onBlur)
 */
export function runEVHybridEVsCalculations(input: string): AppThunk {
  return (dispatch, getState) => {
    const { impacts } = getState();
    const { hybridEVs } = impacts.evCalculationsInputs;

    /** only run calculations if the input has changed since the last onBlur */
    if (input !== hybridEVs) {
      dispatch(setVehiclesDisplaced());
    }

    dispatch({
      type: 'impacts/UPDATE_EV_HYBRID_EVS_CALCULATIONS_INPUT',
      payload: { text: input },
    });
  };
}

export function updateEVTransitBuses(input: string): AppThunk {
  return (dispatch) => {
    dispatch({
      type: 'impacts/UPDATE_EV_TRANSIT_BUSES',
      payload: { text: input },
    });

    dispatch(validateInput('transitBuses', input, ['.']));
  };
}

/**
 * Called every time the transitBuses inputs loses focus (e.g. onBlur)
 */
export function runEVTransitBusesCalculations(input: string): AppThunk {
  return (dispatch, getState) => {
    const { impacts } = getState();
    const { transitBuses } = impacts.evCalculationsInputs;

    /** only run calculations if the input has changed since the last onBlur */
    if (input !== transitBuses) {
      dispatch(setVehiclesDisplaced());
    }

    dispatch({
      type: 'impacts/UPDATE_EV_TRANSIT_BUSES_CALCULATIONS_INPUT',
      payload: { text: input },
    });
  };
}

export function updateEVSchoolBuses(input: string): AppThunk {
  return (dispatch) => {
    dispatch({
      type: 'impacts/UPDATE_EV_SCHOOL_BUSES',
      payload: { text: input },
    });

    dispatch(validateInput('schoolBuses', input, ['.']));
  };
}

/**
 * Called every time the schoolBuses inputs loses focus (e.g. onBlur)
 */
export function runEVSchoolBusesCalculations(input: string): AppThunk {
  return (dispatch, getState) => {
    const { impacts } = getState();
    const { schoolBuses } = impacts.evCalculationsInputs;

    /** only run calculations if the input has changed since the last onBlur */
    if (input !== schoolBuses) {
      dispatch(setVehiclesDisplaced());
    }

    dispatch({
      type: 'impacts/UPDATE_EV_SCHOOL_BUSES_CALCULATIONS_INPUT',
      payload: { text: input },
    });
  };
}

export function updateEVDeploymentLocation(input: string): AppThunk {
  return (dispatch) => {
    dispatch({
      type: 'impacts/UPDATE_EV_DEPLOYMENT_LOCATION',
      payload: { option: input },
    });

    dispatch(setMonthlyEmissionRates());
    dispatch(setEVDeploymentLocationHistoricalEERE());
  };
}

export function updateEVModelYear(input: string): AppThunk {
  return (dispatch) => {
    dispatch({
      type: 'impacts/UPDATE_EV_MODEL_YEAR',
      payload: { option: input },
    });

    dispatch(setEVEfficiency());
    dispatch(setMonthlyEVEnergyUsage());
    dispatch(setMonthlyEmissionRates());
  };
}

export function updateEVICEReplacementVehicle(input: string): AppThunk {
  return (dispatch) => {
    dispatch({
      type: 'impacts/UPDATE_EV_ICE_REPLACEMENT_VEHICLE',
      payload: { option: input },
    });

    dispatch(setMonthlyEmissionRates());
  };
}

export function calculateHourlyEnergyProfile(): AppThunk {
  return (dispatch, getState) => {
    const { geography, transportation, impacts } = getState();
    const { regions, states, regionalScalingFactors } = geography;
    const {
      dailyStats,
      hourlyEVChargingPercentages,
      selectedRegionsMonthlyDailyEVEnergyUsage,
    } = transportation;
    const { inputs } = impacts;

    const geographicFocus = geography.focus;

    // select region(s), based on geographic focus:
    // single region if geographic focus is 'regions'
    // multiple regions if geographic focus is 'states'
    const selectedRegions: RegionState[] = [];

    let selectedState: StateState | undefined;

    if (geographicFocus === 'regions') {
      for (const regionId in regions) {
        const region = regions[regionId as RegionId];
        if (region.selected) {
          selectedRegions.push(region);
        }
      }
    }

    if (geographicFocus === 'states') {
      for (const stateId in states) {
        const state = states[stateId as StateId];
        if (state.selected) {
          selectedState = state;
          Object.keys(state.percentageByRegion).forEach((regionId) => {
            const region = regions[regionId as RegionId];
            selectedRegions.push(region);
          });
        }
      }
    }

    dispatch({
      type: 'impacts/START_HOURLY_ENERGY_PROFILE_CALCULATIONS',
      payload: { inputs },
    });

    /**
     * NOTE: selected regional hourly impacts are stored individually to pass to
     * the displacements calculation, and also combined for all selected regions
     * to create the hourly impacts chart and show validation warning/error
     * messages
     */
    const regionalHourlyImpacts = {} as Partial<{
      [key in RegionId]: {
        regionalLoad: RegionalLoadData[];
        hourlyImpacts: HourlyImpacts;
      };
    }>;

    // build up total percentage of selected state in all selected regions that
    // support offshore wind
    const totalOffshoreWindPercent = selectedRegions.reduce((total, region) => {
      const regionalPercent = selectedState?.percentageByRegion[region.id] || 0;
      return region.offshoreWind ? (total += regionalPercent) : total;
    }, 0);

    selectedRegions.forEach((region) => {
      const regionalLoad = region.rdf.regional_load;
      const lineLoss = region.lineLoss;
      const eereDefaults = region.eereDefaults.data;

      const regionalPercent = selectedState?.percentageByRegion[region.id] || 0;

      // the regional scaling factor is a number between 0 and 1, representing
      // the proportion the selected geography exists within a given region.
      // - if a region is selected, the regional scaling factor will always be 1
      // - if a state is selected, the regional scaling factor comes from the
      //   selected state's percentage by region value for the given region, as
      //   defined in the config file (`app/config.ts`). for example, if the
      //   state falls exactly equally between the two regions, the regional
      //   scaling factor would be 0.5 for each of those two regions.
      const regionalScalingFactor = regionalScalingFactors[region.id] || 0;

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

      const annualGwh = Number(inputs.annualGwh) * regionalScalingFactor;
      const constantMwh = Number(inputs.constantMwh) * regionalScalingFactor;
      const broadProgram = Number(inputs.broadProgram) * percentReductionFactor;
      const reduction = Number(inputs.reduction) * percentReductionFactor;
      const topHours = Number(inputs.topHours);
      const onshoreWind = Number(inputs.onshoreWind) * regionalScalingFactor;
      const offshoreWind = Number(inputs.offshoreWind) * offshoreWindFactor;
      const utilitySolar = Number(inputs.utilitySolar) * regionalScalingFactor;
      const rooftopSolar = Number(inputs.rooftopSolar) * regionalScalingFactor;

      const hourlyRenewableEnergyProfile =
        calculateHourlyRenewableEnergyProfile({
          eereDefaults,
          lineLoss,
          onshoreWind,
          offshoreWind,
          utilitySolar,
          rooftopSolar,
        });

      const hourlyEVLoad = calculateHourlyEVLoad({
        regionId: region.id,
        regionalScalingFactor,
        regionalLoad,
        dailyStats,
        hourlyEVChargingPercentages,
        selectedRegionsMonthlyDailyEVEnergyUsage,
      });

      const topPercentGeneration = calculateTopPercentGeneration({
        regionalLoad,
        broadProgram,
        topHours,
      });

      const hourlyTopPercentReduction = calculateHourlyTopPercentReduction({
        regionalLoad,
        topPercentGeneration,
        broadProgram,
        reduction,
      });

      const hourlyImpacts = calculateHourlyImpacts({
        lineLoss,
        regionalLoad,
        hourlyRenewableEnergyProfile,
        hourlyEVLoad,
        hourlyTopPercentReduction,
        annualGwh,
        constantMwh,
      });

      regionalHourlyImpacts[region.id] = { regionalLoad, hourlyImpacts };

      dispatch({
        type: 'impacts/SET_HOURLY_ENERGY_PROFILE_REGIONAL_DATA',
        payload: {
          regionId: region.id,
          hourlyRenewableEnergyProfile,
          hourlyEVLoad,
          topPercentGeneration,
          hourlyTopPercentReduction,
          hourlyImpacts,
        },
      });
    });

    const totalHourlyChanges = Object.values(regionalHourlyImpacts).reduce(
      (object, regionalData) => {
        Object.entries(regionalData.hourlyImpacts).forEach(([key, value]) => {
          const hour = Number(key);
          object[hour] ??= 0;
          object[hour] += value.impactsLoad;
        });

        return object;
      },
      {} as { [hour: number]: number },
    );

    dispatch({
      type: 'impacts/SET_HOURLY_ENERGY_PROFILE_TOTAL_HOURLY_CHANGES',
      payload: { totalHourlyChanges },
    });

    const hourlyChangesValidation = calculateHourlyChangesValidation({
      regions,
      regionalHourlyImpacts,
    });

    dispatch({
      type: 'impacts/SET_HOURLY_ENERGY_PROFILE_VALIDATION',
      payload: { hourlyChangesValidation },
    });

    dispatch({ type: 'impacts/COMPLETE_HOURLY_ENERGY_PROFILE_CALCULATIONS' });
  };
}

export function resetImpactsInputs(): AppThunk {
  return (dispatch, getState) => {
    const { impacts } = getState();
    const { evDeploymentLocationOptions } = impacts.selectOptions;

    const evDeploymentLocation = evDeploymentLocationOptions[0].id;
    const evModelYear = initialEVModelYear;
    const iceReplacementVehicle = initialICEReplacementVehicle;

    dispatch({ type: 'impacts/RESET_IMPACTS_INPUTS' });

    // re-run dependant transportation calculations after resetting EV inputs
    dispatch(setVehiclesDisplaced());

    dispatch(updateEVDeploymentLocation(evDeploymentLocation));
    dispatch(updateEVModelYear(evModelYear));
    dispatch(updateEVICEReplacementVehicle(iceReplacementVehicle));
  };
}
