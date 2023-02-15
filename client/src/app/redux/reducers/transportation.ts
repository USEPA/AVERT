import { AppThunk } from 'app/redux/index';
import type {
  VMTPerVehicleTypeByGeography,
  VMTAllocationTotalsAndPercentages,
  VMTAllocationPerVehicle,
  MonthlyVMTTotalsAndPercentages,
  HourlyEVChargingPercentages,
  SelectedRegionsStatesVMTPercentages,
  SelectedRegionsVMTPercentagesPerVehicleType,
  SelectedRegionsAverageVMTPerYear,
  SelectedRegionsMonthlyVMTPerVehicleType,
  EVEfficiencyPerVehicleType,
  DailyStats,
  MonthlyStats,
  VehiclesDisplaced,
  SelectedRegionsMonthlyEVEnergyUsageGW,
  SelectedRegionsMonthlyEVEnergyUsageMW,
  SelectedRegionsTotalYearlyEVEnergyUsage,
  SelectedRegionsMonthlyDailyEVEnergyUsage,
  SelectedRegionsMonthlyEmissionRates,
  SelectedRegionsMonthlyEmissionChanges,
  SelectedRegionsTotalMonthlyEmissionChanges,
  SelectedRegionsTotalYearlyEmissionChanges,
  VehicleEmissionChangesByGeography,
  VehicleSalesAndStock,
  SelectedRegionsEEREDefaultsAverages,
  EVDeploymentLocationHistoricalEERE,
} from 'app/calculations/transportation';
import { getSelectedGeographyRegions } from 'app/calculations/geography';
import {
  calculateVMTPerVehicleTypeByGeography,
  calculateVMTAllocationTotalsAndPercentages,
  calculateVMTAllocationPerVehicle,
  calculateMonthlyVMTTotalsAndPercentages,
  calculateHourlyEVChargingPercentages,
  calculateSelectedRegionsStatesVMTPercentages,
  calculateSelectedRegionsVMTPercentagesPerVehicleType,
  calculateSelectedRegionsAverageVMTPerYear,
  calculateSelectedRegionsMonthlyVMTPerVehicleType,
  calculateEVEfficiencyPerVehicleType,
  calculateDailyStats,
  calculateMonthlyStats,
  calculateVehiclesDisplaced,
  calculateSelectedRegionsMonthlyEVEnergyUsageGW,
  calculateSelectedRegionsMonthlyEVEnergyUsageMW,
  calculateSelectedRegionsTotalYearlyEVEnergyUsage,
  calculateSelectedRegionsMonthlyDailyEVEnergyUsage,
  calculateSelectedRegionsMonthlyEmissionRates,
  calculateSelectedRegionsMonthlyEmissionChanges,
  calculateSelectedRegionsTotalMonthlyEmissionChanges,
  calculateSelectedRegionsTotalYearlyEmissionChanges,
  calculateVehicleEmissionChangesByGeography,
  calculateVehicleSalesAndStock,
  calculateSelectedRegionsEEREDefaultsAverages,
  calculateEVDeploymentLocationHistoricalEERE,
} from 'app/calculations/transportation';
import type { RegionId } from 'app/config';

type Action =
  | {
      type: 'transportation/SET_VMT_PER_VEHICLE_TYPE_BY_GEOGRAPHY';
      payload: { vmtPerVehicleTypeByGeography: VMTPerVehicleTypeByGeography };
    }
  | {
      type: 'transportation/SET_VMT_ALLOCATION_TOTALS_AND_PERCENTAGES';
      payload: {
        vmtAllocationTotalsAndPercentages: VMTAllocationTotalsAndPercentages;
      };
    }
  | {
      type: 'transportation/SET_VMT_ALLOCATION_PER_VEHICLE';
      payload: { vmtAllocationPerVehicle: VMTAllocationPerVehicle };
    }
  | {
      type: 'transportation/SET_MONTHLY_VMT_TOTALS_AND_PERCENTAGES';
      payload: {
        monthlyVMTTotalsAndPercentages: MonthlyVMTTotalsAndPercentages;
      };
    }
  | {
      type: 'transportation/SET_HOURLY_EV_CHARGING_PERCENTAGES';
      payload: { hourlyEVChargingPercentages: HourlyEVChargingPercentages };
    }
  | {
      type: 'transportation/SET_SELECTED_REGIONS_STATES_VMT_PERCENTAGES';
      payload: {
        selectedRegionsStatesVMTPercentages: SelectedRegionsStatesVMTPercentages;
      };
    }
  | {
      type: 'transportation/SET_SELECTED_REGIONS_VMT_PERCENTAGES_PER_VEHICLE_TYPE';
      payload: {
        selectedRegionsVMTPercentagesPerVehicleType: SelectedRegionsVMTPercentagesPerVehicleType;
      };
    }
  | {
      type: 'transportation/SET_SELECTED_REGIONS_AVERAGE_VMT_PER_YEAR';
      payload: {
        selectedRegionsAverageVMTPerYear: SelectedRegionsAverageVMTPerYear;
      };
    }
  | {
      type: 'transportation/SET_SELECTED_REGIONS_MONTHLY_VMT_PER_VEHICLE_TYPE';
      payload: {
        selectedRegionsMonthlyVMTPerVehicleType: SelectedRegionsMonthlyVMTPerVehicleType;
      };
    }
  | {
      type: 'transportation/SET_EV_EFFICIENCY_PER_VEHICLE_TYPE';
      payload: { evEfficiencyPerVehicleType: EVEfficiencyPerVehicleType };
    }
  | {
      type: 'transportation/SET_DAILY_STATS';
      payload: { dailyStats: DailyStats };
    }
  | {
      type: 'transportation/SET_MONTHLY_STATS';
      payload: { monthlyStats: MonthlyStats };
    }
  | {
      type: 'transportation/SET_VEHICLES_DISPLACED';
      payload: { vehiclesDisplaced: VehiclesDisplaced };
    }
  | {
      type: 'transportation/SET_SELECTED_REGIONS_MONTHLY_EV_ENERGY_USAGE_GW';
      payload: {
        selectedRegionsMonthlyEVEnergyUsageGW: SelectedRegionsMonthlyEVEnergyUsageGW;
      };
    }
  | {
      type: 'transportation/SET_SELECTED_REGIONS_MONTHLY_EV_ENERGY_USAGE_MW';
      payload: {
        selectedRegionsMonthlyEVEnergyUsageMW: SelectedRegionsMonthlyEVEnergyUsageMW;
      };
    }
  | {
      type: 'transportation/SET_SELECTED_REGIONS_TOTAL_YEARLY_EV_ENERGY_USAGE';
      payload: {
        selectedRegionsTotalYearlyEVEnergyUsage: SelectedRegionsTotalYearlyEVEnergyUsage;
      };
    }
  | {
      type: 'transportation/SET_SELECTED_REGIONS_MONTHLY_DAILY_EV_ENERGY_USAGE';
      payload: {
        selectedRegionsMonthlyDailyEVEnergyUsage: SelectedRegionsMonthlyDailyEVEnergyUsage;
      };
    }
  | {
      type: 'transportation/SET_SELECTED_REGIONS_MONTHLY_EMISSION_RATES';
      payload: {
        selectedRegionsMonthlyEmissionRates: SelectedRegionsMonthlyEmissionRates;
      };
    }
  | {
      type: 'transportation/SET_SELECTED_REGIONS_MONTHLY_EMISSION_CHANGES';
      payload: {
        selectedRegionsMonthlyEmissionChanges: SelectedRegionsMonthlyEmissionChanges;
      };
    }
  | {
      type: 'transportation/SET_SELECTED_REGIONS_TOTAL_MONTHLY_EMISSION_CHANGES';
      payload: {
        selectedRegionsTotalMonthlyEmissionChanges: SelectedRegionsTotalMonthlyEmissionChanges;
      };
    }
  | {
      type: 'transportation/SET_SELECTED_REGIONS_TOTAL_YEARLY_EMISSION_CHANGES';
      payload: {
        selectedRegionsTotalYearlyEmissionChanges: SelectedRegionsTotalYearlyEmissionChanges;
      };
    }
  | {
      type: 'transportation/SET_VEHICLE_EMISSION_CHANGES_BY_GEOGRAPHY';
      payload: {
        vehicleEmissionChangesByGeography: VehicleEmissionChangesByGeography;
      };
    }
  | {
      type: 'transportation/SET_VEHICLE_SALES_AND_STOCK';
      payload: { vehicleSalesAndStock: VehicleSalesAndStock };
    }
  | {
      type: 'transportation/SET_SELECTED_REGIONS_EERE_DEFAULTS_AVERAGES';
      payload: {
        selectedRegionsEEREDefaultsAverages: SelectedRegionsEEREDefaultsAverages;
      };
    }
  | {
      type: 'transportation/SET_EV_DEPLOYMENT_LOCATION_HISTORICAL_EERE';
      payload: {
        evDeploymentLocationHistoricalEERE: EVDeploymentLocationHistoricalEERE;
      };
    };

type State = {
  vmtPerVehicleTypeByGeography: VMTPerVehicleTypeByGeography | {};
  vmtAllocationTotalsAndPercentages: VMTAllocationTotalsAndPercentages | {};
  vmtAllocationPerVehicle: VMTAllocationPerVehicle | {};
  monthlyVMTTotalsAndPercentages: MonthlyVMTTotalsAndPercentages;
  hourlyEVChargingPercentages: HourlyEVChargingPercentages;
  selectedRegionsStatesVMTPercentages: SelectedRegionsStatesVMTPercentages | {};
  selectedRegionsVMTPercentagesPerVehicleType: SelectedRegionsVMTPercentagesPerVehicleType | {}; // prettier-ignore
  selectedRegionsAverageVMTPerYear: SelectedRegionsAverageVMTPerYear | {};
  selectedRegionsMonthlyVMTPerVehicleType: SelectedRegionsMonthlyVMTPerVehicleType | {}; // prettier-ignore
  evEfficiencyPerVehicleType: EVEfficiencyPerVehicleType;
  dailyStats: DailyStats;
  monthlyStats: MonthlyStats;
  vehiclesDisplaced: VehiclesDisplaced;
  selectedRegionsMonthlyEVEnergyUsageGW: SelectedRegionsMonthlyEVEnergyUsageGW | {}; // prettier-ignore
  selectedRegionsMonthlyEVEnergyUsageMW: SelectedRegionsMonthlyEVEnergyUsageMW | {}; // prettier-ignore
  selectedRegionsTotalYearlyEVEnergyUsage: SelectedRegionsTotalYearlyEVEnergyUsage | {}; // prettier-ignore
  selectedRegionsMonthlyDailyEVEnergyUsage: SelectedRegionsMonthlyDailyEVEnergyUsage | {}; // prettier-ignore
  selectedRegionsMonthlyEmissionRates: SelectedRegionsMonthlyEmissionRates | {};
  selectedRegionsMonthlyEmissionChanges: SelectedRegionsMonthlyEmissionChanges | {}; // prettier-ignore
  selectedRegionsTotalMonthlyEmissionChanges: SelectedRegionsTotalMonthlyEmissionChanges | {}; // prettier-ignore
  selectedRegionsTotalYearlyEmissionChanges: SelectedRegionsTotalYearlyEmissionChanges | {}; // prettier-ignore
  vehicleEmissionChangesByGeography: VehicleEmissionChangesByGeography | {};
  vehicleSalesAndStock: VehicleSalesAndStock;
  selectedRegionsEEREDefaultsAverages: SelectedRegionsEEREDefaultsAverages;
  evDeploymentLocationHistoricalEERE: EVDeploymentLocationHistoricalEERE;
};

const initialState: State = {
  vmtPerVehicleTypeByGeography: {},
  vmtAllocationTotalsAndPercentages: {},
  vmtAllocationPerVehicle: {},
  monthlyVMTTotalsAndPercentages: {},
  hourlyEVChargingPercentages: {},
  selectedRegionsStatesVMTPercentages: {},
  selectedRegionsVMTPercentagesPerVehicleType: {},
  selectedRegionsAverageVMTPerYear: {},
  selectedRegionsMonthlyVMTPerVehicleType: {},
  evEfficiencyPerVehicleType: {
    batteryEVCars: 0,
    hybridEVCars: 0,
    batteryEVTrucks: 0,
    hybridEVTrucks: 0,
    transitBuses: 0,
    schoolBuses: 0,
  },
  dailyStats: {},
  monthlyStats: {},
  vehiclesDisplaced: {
    batteryEVCars: 0,
    hybridEVCars: 0,
    batteryEVTrucks: 0,
    hybridEVTrucks: 0,
    transitBusesDiesel: 0,
    transitBusesCNG: 0,
    transitBusesGasoline: 0,
    schoolBuses: 0,
  },
  selectedRegionsMonthlyEVEnergyUsageGW: {},
  selectedRegionsMonthlyEVEnergyUsageMW: {},
  selectedRegionsTotalYearlyEVEnergyUsage: {},
  selectedRegionsMonthlyDailyEVEnergyUsage: {},
  selectedRegionsMonthlyEmissionRates: {},
  selectedRegionsMonthlyEmissionChanges: {},
  selectedRegionsTotalMonthlyEmissionChanges: {},
  selectedRegionsTotalYearlyEmissionChanges: {},
  vehicleEmissionChangesByGeography: {},
  vehicleSalesAndStock: {},
  selectedRegionsEEREDefaultsAverages: {},
  evDeploymentLocationHistoricalEERE: {
    eeRetail: { mw: 0, gwh: 0 },
    onshoreWind: { mw: 0, gwh: 0 },
    utilitySolar: { mw: 0, gwh: 0 },
  },
};

export default function reducer(
  state: State = initialState,
  action: Action,
): State {
  switch (action.type) {
    case 'transportation/SET_VMT_PER_VEHICLE_TYPE_BY_GEOGRAPHY': {
      const { vmtPerVehicleTypeByGeography } = action.payload;

      return {
        ...state,
        vmtPerVehicleTypeByGeography,
      };
    }

    case 'transportation/SET_VMT_ALLOCATION_TOTALS_AND_PERCENTAGES': {
      const { vmtAllocationTotalsAndPercentages } = action.payload;

      return {
        ...state,
        vmtAllocationTotalsAndPercentages,
      };
    }

    case 'transportation/SET_VMT_ALLOCATION_PER_VEHICLE': {
      const { vmtAllocationPerVehicle } = action.payload;

      return {
        ...state,
        vmtAllocationPerVehicle,
      };
    }

    case 'transportation/SET_MONTHLY_VMT_TOTALS_AND_PERCENTAGES': {
      const { monthlyVMTTotalsAndPercentages } = action.payload;

      return {
        ...state,
        monthlyVMTTotalsAndPercentages,
      };
    }

    case 'transportation/SET_HOURLY_EV_CHARGING_PERCENTAGES': {
      const { hourlyEVChargingPercentages } = action.payload;

      return {
        ...state,
        hourlyEVChargingPercentages,
      };
    }

    case 'transportation/SET_SELECTED_REGIONS_STATES_VMT_PERCENTAGES': {
      const { selectedRegionsStatesVMTPercentages } = action.payload;

      return {
        ...state,
        selectedRegionsStatesVMTPercentages,
      };
    }

    case 'transportation/SET_SELECTED_REGIONS_VMT_PERCENTAGES_PER_VEHICLE_TYPE': {
      const { selectedRegionsVMTPercentagesPerVehicleType } = action.payload;

      return {
        ...state,
        selectedRegionsVMTPercentagesPerVehicleType,
      };
    }

    case 'transportation/SET_SELECTED_REGIONS_AVERAGE_VMT_PER_YEAR': {
      const { selectedRegionsAverageVMTPerYear } = action.payload;

      return {
        ...state,
        selectedRegionsAverageVMTPerYear,
      };
    }

    case 'transportation/SET_SELECTED_REGIONS_MONTHLY_VMT_PER_VEHICLE_TYPE': {
      const { selectedRegionsMonthlyVMTPerVehicleType } = action.payload;

      return {
        ...state,
        selectedRegionsMonthlyVMTPerVehicleType,
      };
    }

    case 'transportation/SET_EV_EFFICIENCY_PER_VEHICLE_TYPE': {
      const { evEfficiencyPerVehicleType } = action.payload;

      return {
        ...state,
        evEfficiencyPerVehicleType,
      };
    }

    case 'transportation/SET_DAILY_STATS': {
      const { dailyStats } = action.payload;

      return {
        ...state,
        dailyStats,
      };
    }

    case 'transportation/SET_MONTHLY_STATS': {
      const { monthlyStats } = action.payload;

      return {
        ...state,
        monthlyStats,
      };
    }

    case 'transportation/SET_VEHICLES_DISPLACED': {
      const { vehiclesDisplaced } = action.payload;

      return {
        ...state,
        vehiclesDisplaced,
      };
    }

    case 'transportation/SET_SELECTED_REGIONS_MONTHLY_EV_ENERGY_USAGE_GW': {
      const { selectedRegionsMonthlyEVEnergyUsageGW } = action.payload;

      return {
        ...state,
        selectedRegionsMonthlyEVEnergyUsageGW,
      };
    }

    case 'transportation/SET_SELECTED_REGIONS_MONTHLY_EV_ENERGY_USAGE_MW': {
      const { selectedRegionsMonthlyEVEnergyUsageMW } = action.payload;

      return {
        ...state,
        selectedRegionsMonthlyEVEnergyUsageMW,
      };
    }

    case 'transportation/SET_SELECTED_REGIONS_MONTHLY_DAILY_EV_ENERGY_USAGE': {
      const { selectedRegionsMonthlyDailyEVEnergyUsage } = action.payload;

      return {
        ...state,
        selectedRegionsMonthlyDailyEVEnergyUsage,
      };
    }

    case 'transportation/SET_SELECTED_REGIONS_MONTHLY_EMISSION_RATES': {
      const { selectedRegionsMonthlyEmissionRates } = action.payload;

      return {
        ...state,
        selectedRegionsMonthlyEmissionRates,
      };
    }

    case 'transportation/SET_SELECTED_REGIONS_MONTHLY_EMISSION_CHANGES': {
      const { selectedRegionsMonthlyEmissionChanges } = action.payload;

      return {
        ...state,
        selectedRegionsMonthlyEmissionChanges,
      };
    }

    case 'transportation/SET_SELECTED_REGIONS_TOTAL_MONTHLY_EMISSION_CHANGES': {
      const { selectedRegionsTotalMonthlyEmissionChanges } = action.payload;

      return {
        ...state,
        selectedRegionsTotalMonthlyEmissionChanges,
      };
    }

    case 'transportation/SET_SELECTED_REGIONS_TOTAL_YEARLY_EMISSION_CHANGES': {
      const { selectedRegionsTotalYearlyEmissionChanges } = action.payload;

      return {
        ...state,
        selectedRegionsTotalYearlyEmissionChanges,
      };
    }

    case 'transportation/SET_VEHICLE_EMISSION_CHANGES_BY_GEOGRAPHY': {
      const { vehicleEmissionChangesByGeography } = action.payload;

      return {
        ...state,
        vehicleEmissionChangesByGeography,
      };
    }

    case 'transportation/SET_SELECTED_REGIONS_TOTAL_YEARLY_EV_ENERGY_USAGE': {
      const { selectedRegionsTotalYearlyEVEnergyUsage } = action.payload;

      return {
        ...state,
        selectedRegionsTotalYearlyEVEnergyUsage,
      };
    }

    case 'transportation/SET_VEHICLE_SALES_AND_STOCK': {
      const { vehicleSalesAndStock } = action.payload;

      return {
        ...state,
        vehicleSalesAndStock,
      };
    }

    case 'transportation/SET_SELECTED_REGIONS_EERE_DEFAULTS_AVERAGES': {
      const { selectedRegionsEEREDefaultsAverages } = action.payload;

      return {
        ...state,
        selectedRegionsEEREDefaultsAverages,
      };
    }

    case 'transportation/SET_EV_DEPLOYMENT_LOCATION_HISTORICAL_EERE': {
      const { evDeploymentLocationHistoricalEERE } = action.payload;

      return {
        ...state,
        evDeploymentLocationHistoricalEERE,
      };
    }

    default: {
      return state;
    }
  }
}

/**
 * Called when the app starts.
 */
export function setVMTData(): AppThunk {
  return (dispatch) => {
    const vmtPerVehicleTypeByGeography =
      calculateVMTPerVehicleTypeByGeography();

    const vmtAllocationTotalsAndPercentages =
      calculateVMTAllocationTotalsAndPercentages();

    const vmtAllocationPerVehicle = calculateVMTAllocationPerVehicle();

    const monthlyVMTTotalsAndPercentages =
      calculateMonthlyVMTTotalsAndPercentages();

    dispatch({
      type: 'transportation/SET_VMT_PER_VEHICLE_TYPE_BY_GEOGRAPHY',
      payload: { vmtPerVehicleTypeByGeography },
    });

    dispatch({
      type: 'transportation/SET_VMT_ALLOCATION_TOTALS_AND_PERCENTAGES',
      payload: { vmtAllocationTotalsAndPercentages },
    });

    dispatch({
      type: 'transportation/SET_VMT_ALLOCATION_PER_VEHICLE',
      payload: { vmtAllocationPerVehicle },
    });

    dispatch({
      type: 'transportation/SET_MONTHLY_VMT_TOTALS_AND_PERCENTAGES',
      payload: { monthlyVMTTotalsAndPercentages },
    });

    // NOTE: `vehicleSalesAndStock` uses `vmtAllocationPerVehicle`
    dispatch(setVehicleSalesAndStock());
  };
}

/**
 * Called when the app starts.
 */
export function setHourlyEVChargingPercentages(): AppThunk {
  return (dispatch) => {
    const hourlyEVChargingPercentages = calculateHourlyEVChargingPercentages();

    dispatch({
      type: 'transportation/SET_HOURLY_EV_CHARGING_PERCENTAGES',
      payload: { hourlyEVChargingPercentages },
    });
  };
}

/**
 * Called every time the `geography` reducer's `selectGeography()`,
 * `selectRegion()`, or `selectState()` functions are called.
 *
 * _(e.g. anytime the selected geography changes)_
 */
export function setSelectedGeographyVMTData(): AppThunk {
  return (dispatch, getState) => {
    const { geography, transportation } = getState();
    const {
      vmtAllocationTotalsAndPercentages,
      vmtAllocationPerVehicle,
      monthlyVMTTotalsAndPercentages,
    } = transportation;

    const geographicFocus = geography.focus;

    const selectedRegionId =
      Object.values(geography.regions).find((r) => r.selected)?.id || '';

    const selectedStateId =
      Object.values(geography.states).find((s) => s.selected)?.id || '';

    const selectedRegionsStatesVMTPercentages =
      calculateSelectedRegionsStatesVMTPercentages({
        geographicFocus,
        selectedRegionId,
        selectedStateId,
        vmtAllocationTotalsAndPercentages,
      });

    const selectedRegionsVMTPercentagesPerVehicleType =
      calculateSelectedRegionsVMTPercentagesPerVehicleType({
        selectedRegionsStatesVMTPercentages,
        vmtAllocationPerVehicle,
      });

    const selectedRegionsAverageVMTPerYear =
      calculateSelectedRegionsAverageVMTPerYear({
        selectedRegionsVMTPercentagesPerVehicleType,
      });

    const selectedRegionsMonthlyVMTPerVehicleType =
      calculateSelectedRegionsMonthlyVMTPerVehicleType({
        selectedRegionsAverageVMTPerYear,
        monthlyVMTTotalsAndPercentages,
      });

    dispatch({
      type: 'transportation/SET_SELECTED_REGIONS_STATES_VMT_PERCENTAGES',
      payload: { selectedRegionsStatesVMTPercentages },
    });

    dispatch({
      type: 'transportation/SET_SELECTED_REGIONS_VMT_PERCENTAGES_PER_VEHICLE_TYPE',
      payload: { selectedRegionsVMTPercentagesPerVehicleType },
    });

    dispatch({
      type: 'transportation/SET_SELECTED_REGIONS_AVERAGE_VMT_PER_YEAR',
      payload: { selectedRegionsAverageVMTPerYear },
    });

    dispatch({
      type: 'transportation/SET_SELECTED_REGIONS_MONTHLY_VMT_PER_VEHICLE_TYPE',
      payload: { selectedRegionsMonthlyVMTPerVehicleType },
    });

    // NOTE: `monthlyEVEnergyUsageGW` uses `selectedRegionsMonthlyVMTPerVehicleType`
    dispatch(setMonthlyEVEnergyUsage());

    // NOTE: `selectedRegionsMonthlyEmissionRates` uses `selectedRegionsStatesVMTPercentages`
    dispatch(setMonthlyEmissionRates());

    // NOTE: `selectedRegionsMonthlyEmissionChanges` uses `selectedRegionsMonthlyVMTPerVehicleType`
    dispatch(setEmissionChanges());
  };
}

/**
 * Called every time the `geography` reducer's `selectGeography()`,
 * `selectRegion()`, or `selectState()` functions, or the `eere` reducer's
 * `updateEereEVModelYear()` function is called.
 *
 * _(e.g. anytime the selected geography or EV model year changes)_
 */
export function setEVEfficiency(): AppThunk {
  return (dispatch, getState) => {
    const { geography, eere } = getState();
    const { regionalScalingFactors } = geography;
    const { evModelYear } = eere.inputs;

    const evEfficiencyPerVehicleType = calculateEVEfficiencyPerVehicleType({
      regionalScalingFactors,
      evModelYear,
    });

    dispatch({
      type: 'transportation/SET_EV_EFFICIENCY_PER_VEHICLE_TYPE',
      payload: { evEfficiencyPerVehicleType },
    });

    // NOTE: `monthlyEVEnergyUsageGW` uses `evEfficiencyPerVehicleType`
    dispatch(setMonthlyEVEnergyUsage());
  };
}

/**
 * Called every time the `geography` reducer's `fetchRegionsData()` function is
 * called.
 *
 * _(e.g. whenever the "Set EE/RE Impacts" button is clicked  on the "Select
 * Geography" page)_
 */
export function setDailyAndMonthlyStats(): AppThunk {
  return (dispatch, getState) => {
    const { geography, transportation } = getState();

    const regionalLoad = Object.values(geography.regions).find((region) => {
      return region.selected;
    })?.rdf.regional_load;

    // all RDFs for a given year have the same number of hours, so no need to
    // re-calculate daily and monthly stats again if it's already been set
    if (Object.keys(transportation.dailyStats).length !== 0) return;

    const dailyStats = calculateDailyStats(regionalLoad);
    const monthlyStats = calculateMonthlyStats(dailyStats);

    dispatch({
      type: 'transportation/SET_DAILY_STATS',
      payload: { dailyStats },
    });

    dispatch({
      type: 'transportation/SET_MONTHLY_STATS',
      payload: { monthlyStats },
    });

    // NOTE: `selectedRegionsMonthlyDailyEVEnergyUsage` uses `monthlyStats`
    dispatch(setMonthlyDailyEVEnergyUsage());
  };
}

/**
 * Called every time the `eere` reducer's `runEereBatteryEVsCalculations()`,
 * `runEereHybridEVsCalculations()`, `runEereTransitBusesCalculations()`, or
 * `runEereSchoolBusesCalculations()` function are called.
 *
 * _(e.g. onBlur / whenever an EV input loses focus, but only if the input's
 * value has changed since the last time it was used in this calculation)_
 */
export function setVehiclesDisplaced(): AppThunk {
  return (dispatch, getState) => {
    const { transportation, eere } = getState();
    const { monthlyVMTTotalsAndPercentages } = transportation;
    const { batteryEVs, hybridEVs, transitBuses, schoolBuses } = eere.inputs;

    const vehiclesDisplaced = calculateVehiclesDisplaced({
      batteryEVs: Number(batteryEVs),
      hybridEVs: Number(hybridEVs),
      transitBuses: Number(transitBuses),
      schoolBuses: Number(schoolBuses),
      monthlyVMTTotalsAndPercentages,
    });

    dispatch({
      type: 'transportation/SET_VEHICLES_DISPLACED',
      payload: { vehiclesDisplaced },
    });

    // NOTE: `monthlyEVEnergyUsageGW` uses `vehiclesDisplaced`
    dispatch(setMonthlyEVEnergyUsage());

    // NOTE: `selectedRegionsMonthlyEmissionChanges` uses `vehiclesDisplaced`
    dispatch(setEmissionChanges());
  };
}

/**
 * Called every time this `transportation` reducer's
 * `setSelectedGeographyVMTData()`, `setEVEfficiency()`, or
 * `setVehiclesDisplaced()` functions are called.
 *
 * _(e.g. anytime the selected geography, EV model year, or an EV input number
 * changes)_
 */
export function setMonthlyEVEnergyUsage(): AppThunk {
  return (dispatch, getState) => {
    const { transportation } = getState();
    const {
      selectedRegionsMonthlyVMTPerVehicleType,
      evEfficiencyPerVehicleType,
      vehiclesDisplaced,
    } = transportation;

    const selectedRegionsMonthlyEVEnergyUsageGW =
      calculateSelectedRegionsMonthlyEVEnergyUsageGW({
        selectedRegionsMonthlyVMTPerVehicleType,
        evEfficiencyPerVehicleType,
        vehiclesDisplaced,
      });

    const selectedRegionsMonthlyEVEnergyUsageMW =
      calculateSelectedRegionsMonthlyEVEnergyUsageMW({
        selectedRegionsMonthlyEVEnergyUsageGW,
      });

    const selectedRegionsTotalYearlyEVEnergyUsage =
      calculateSelectedRegionsTotalYearlyEVEnergyUsage({
        selectedRegionsMonthlyEVEnergyUsageGW,
      });

    dispatch({
      type: 'transportation/SET_SELECTED_REGIONS_MONTHLY_EV_ENERGY_USAGE_GW',
      payload: { selectedRegionsMonthlyEVEnergyUsageGW },
    });

    dispatch({
      type: 'transportation/SET_SELECTED_REGIONS_MONTHLY_EV_ENERGY_USAGE_MW',
      payload: { selectedRegionsMonthlyEVEnergyUsageMW },
    });

    dispatch({
      type: 'transportation/SET_SELECTED_REGIONS_TOTAL_YEARLY_EV_ENERGY_USAGE',
      payload: { selectedRegionsTotalYearlyEVEnergyUsage },
    });

    // NOTE: `selectedRegionsMonthlyDailyEVEnergyUsage` uses `selectedRegionsMonthlyEVEnergyUsageMW`
    dispatch(setMonthlyDailyEVEnergyUsage());
  };
}

/**
 * Called the first time this `transportation` reducer's
 * `setDailyAndMonthlyStats()` function is called (will only be called from
 * there once, due to the early return in that function, preventing it from
 * re-setting monthlyStats), or anytime this `transportation` reducer's
 * `setMonthlyEVEnergyUsage()` function is called.
 *
 * _(e.g. whenever the "Set EE/RE Impacts" button is clicked  on the "Select
 * Geography" page or anytime the selected geography, EV model year, or an EV
 * input number changes)_
 */
export function setMonthlyDailyEVEnergyUsage(): AppThunk {
  return (dispatch, getState) => {
    const { transportation } = getState();
    const { monthlyStats, selectedRegionsMonthlyEVEnergyUsageMW } =
      transportation;

    const selectedRegionsMonthlyDailyEVEnergyUsage =
      calculateSelectedRegionsMonthlyDailyEVEnergyUsage({
        selectedRegionsMonthlyEVEnergyUsageMW,
        monthlyStats,
      });

    console.log(selectedRegionsMonthlyDailyEVEnergyUsage);

    dispatch({
      type: 'transportation/SET_SELECTED_REGIONS_MONTHLY_DAILY_EV_ENERGY_USAGE',
      payload: { selectedRegionsMonthlyDailyEVEnergyUsage },
    });
  };
}

/**
 * Called every time this `transportation` reducer's
 * `setSelectedGeographyVMTData()` function is called, or anytime the `eere`
 * reducer's `updateEereEVDeploymentLocation()`, `updateEereEVModelYear()`, or
 * `updateEereICEReplacementVehicle` function is called.
 *
 * _(e.g. anytime the selected geography, EV deployment location, EV model year,
 * or ICE replacement vehicle changes)_
 */
export function setMonthlyEmissionRates(): AppThunk {
  return (dispatch, getState) => {
    const { transportation, eere } = getState();
    const { selectedRegionsStatesVMTPercentages } = transportation;
    const { evDeploymentLocation, evModelYear, iceReplacementVehicle } =
      eere.inputs;

    const selectedRegionsMonthlyEmissionRates =
      calculateSelectedRegionsMonthlyEmissionRates({
        selectedRegionsStatesVMTPercentages,
        evDeploymentLocation,
        evModelYear,
        iceReplacementVehicle,
      });

    dispatch({
      type: 'transportation/SET_SELECTED_REGIONS_MONTHLY_EMISSION_RATES',
      payload: { selectedRegionsMonthlyEmissionRates },
    });

    // NOTE: `selectedRegionsMonthlyEmissionChanges` uses `selectedRegionsMonthlyEmissionRates`
    dispatch(setEmissionChanges());
  };
}

/**
 * Called every time this `transportation` reducer's
 * `setSelectedGeographyVMTData()`, `setVehiclesDisplaced()`, or
 * `setMonthlyEmissionRates()` function is called.
 *
 * _(e.g. anytime the selected geography, an EV input number, the EV deployment
 * location, EV model year, or ICE replacement vehicle changes)_
 */
export function setEmissionChanges(): AppThunk {
  return (dispatch, getState) => {
    const { geography, transportation, eere } = getState();
    const { countiesByGeography, regionalScalingFactors } = geography;
    const {
      vmtPerVehicleTypeByGeography,
      selectedRegionsMonthlyVMTPerVehicleType,
      vehiclesDisplaced,
      selectedRegionsMonthlyEmissionRates,
    } = transportation;

    const { evDeploymentLocation } = eere.inputs;

    const selectedRegionsMonthlyEmissionChanges =
      calculateSelectedRegionsMonthlyEmissionChanges({
        selectedRegionsMonthlyVMTPerVehicleType,
        vehiclesDisplaced,
        selectedRegionsMonthlyEmissionRates,
      });

    const selectedRegionsTotalMonthlyEmissionChanges =
      calculateSelectedRegionsTotalMonthlyEmissionChanges({
        selectedRegionsMonthlyEmissionChanges,
      });

    const selectedRegionsTotalYearlyEmissionChanges =
      calculateSelectedRegionsTotalYearlyEmissionChanges({
        selectedRegionsTotalMonthlyEmissionChanges,
      });

    const geographicFocus = geography.focus;

    const selectedRegionId =
      Object.values(geography.regions).find((r) => r.selected)?.id || '';

    const selectedStateId =
      Object.values(geography.states).find((s) => s.selected)?.id || '';

    const selectedGeographyRegionIds = Object.keys(
      regionalScalingFactors,
    ) as RegionId[];

    const vehicleEmissionChangesByGeography =
      calculateVehicleEmissionChangesByGeography({
        geographicFocus,
        selectedRegionId,
        selectedStateId,
        countiesByGeography,
        selectedGeographyRegionIds,
        vmtPerVehicleTypeByGeography,
        selectedRegionsTotalYearlyEmissionChanges,
        evDeploymentLocation,
      });

    dispatch({
      type: 'transportation/SET_SELECTED_REGIONS_MONTHLY_EMISSION_CHANGES',
      payload: { selectedRegionsMonthlyEmissionChanges },
    });

    dispatch({
      type: 'transportation/SET_SELECTED_REGIONS_TOTAL_MONTHLY_EMISSION_CHANGES',
      payload: { selectedRegionsTotalMonthlyEmissionChanges },
    });

    dispatch({
      type: 'transportation/SET_SELECTED_REGIONS_TOTAL_YEARLY_EMISSION_CHANGES',
      payload: { selectedRegionsTotalYearlyEmissionChanges },
    });

    dispatch({
      type: 'transportation/SET_VEHICLE_EMISSION_CHANGES_BY_GEOGRAPHY',
      payload: { vehicleEmissionChangesByGeography },
    });
  };
}

/**
 * Called when this `transportation` reducer's `setVMTData()` function is called
 * or every time the `eere` reducer's `setEVDeploymentLocationOptions()`
 * function is called.
 *
 * _(e.g. when the app starts or anytime the selected geography or the EV
 * deployment location changes)_
 */
export function setVehicleSalesAndStock(): AppThunk {
  return (dispatch, getState) => {
    const { geography, transportation, eere } = getState();
    const { regions } = geography;
    const { vmtAllocationPerVehicle } = transportation;
    const { evDeploymentLocationOptions } = eere.selectOptions;

    const geographicFocus = geography.focus;

    const selectedRegion = Object.values(regions).find((r) => r.selected);
    const evDeploymentLocations = evDeploymentLocationOptions.map((o) => o.id);

    const selectedRegionName =
      geographicFocus === 'regions' ? selectedRegion?.name || '' : '';

    const vehicleSalesAndStock = calculateVehicleSalesAndStock({
      geographicFocus,
      selectedRegionName,
      evDeploymentLocations,
      vmtAllocationPerVehicle,
    });

    dispatch({
      type: 'transportation/SET_VEHICLE_SALES_AND_STOCK',
      payload: { vehicleSalesAndStock },
    });
  };
}

/**
 * Called every time the `geography` reducer's `fetchRegionsData()` function is
 * called.
 *
 * _(e.g. whenever the "Set EE/RE Impacts" button is clicked  on the "Select
 * Geography" page)_
 */
export function setSelectedRegionsEEREDefaultsAverages(): AppThunk {
  return (dispatch, getState) => {
    const { geography } = getState();
    const { regions, regionalScalingFactors } = geography;

    const selectedGeographyRegionIds = Object.keys(
      regionalScalingFactors,
    ) as RegionId[];

    const selectedGeographyRegions = getSelectedGeographyRegions({
      regions,
      selectedGeographyRegionIds,
    });

    const selectedRegionsEEREDefaultsAverages =
      calculateSelectedRegionsEEREDefaultsAverages({
        regionalScalingFactors,
        selectedGeographyRegions,
      });

    dispatch({
      type: 'transportation/SET_SELECTED_REGIONS_EERE_DEFAULTS_AVERAGES',
      payload: { selectedRegionsEEREDefaultsAverages },
    });

    // NOTE: `evDeploymentLocationHistoricalEERE` uses `selectedRegionsEEREDefaultsAverages`
    dispatch(setEVDeploymentLocationHistoricalEERE());
  };
}

/**
 * Called every time this `transportation` reducer's
 * `setSelectedRegionsEEREDefaultsAverages()` function is called or anytime
 * the `eere` reducer's `updateEereEVDeploymentLocation()` function is called.
 *
 * _(e.g. whenever the "Set EE/RE Impacts" button is clicked  on the "Select
 * Geography" page or anytime the EV deployment location changes)_
 */
export function setEVDeploymentLocationHistoricalEERE(): AppThunk {
  return (dispatch, getState) => {
    const { geography, eere, transportation } = getState();
    const { regionalLineLoss } = geography;
    const { evDeploymentLocation } = eere.inputs;
    const { selectedRegionsEEREDefaultsAverages } = transportation;

    const selectedRegionId =
      Object.values(geography.regions).find((r) => r.selected)?.id || '';

    const evDeploymentLocationHistoricalEERE =
      calculateEVDeploymentLocationHistoricalEERE({
        selectedRegionsEEREDefaultsAverages,
        evDeploymentLocation,
        regionalLineLoss,
        selectedRegionId,
      });

    dispatch({
      type: 'transportation/SET_EV_DEPLOYMENT_LOCATION_HISTORICAL_EERE',
      payload: { evDeploymentLocationHistoricalEERE },
    });
  };
}
