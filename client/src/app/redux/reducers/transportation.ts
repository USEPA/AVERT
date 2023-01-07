import { AppThunk } from 'app/redux/index';
import type {
  VMTAllocationTotalsAndPercentages,
  VMTAllocationPerVehicle,
  MonthlyVMTTotalsAndPercentages,
  HourlyEVChargingPercentages,
  SelectedGeographyStatesVMTPercentages,
  SelectedGeographyVMTPercentagesPerVehicleType,
  SelectedGeographyAverageVMTPerYear,
  MonthlyVMTPerVehicleType,
  EVEfficiencyPerVehicleType,
  DailyStats,
  MonthlyStats,
  VehiclesDisplaced,
  MonthlyEVEnergyUsageGW,
  MonthlyEVEnergyUsageMW,
  TotalYearlyEVEnergyUsage,
  MonthlyDailyEVEnergyUsage,
  MonthlyEmissionRates,
  MonthlyEmissionChanges,
  TotalMonthlyEmissionChanges,
  TotalYearlyEmissionChanges,
  VehicleSalesAndStock,
  RegionREDefaultsAverages,
  EVDeploymentLocationHistoricalEERE,
} from 'app/calculations/transportation';
import {
  calculateVMTAllocationTotalsAndPercentages,
  calculateVMTAllocationPerVehicle,
  calculateMonthlyVMTTotalsAndPercentages,
  calculateHourlyEVChargingPercentages,
  calculateSelectedGeographyStatesVMTPercentages,
  calculateSelectedGeographyVMTPercentagesPerVehicleType,
  calculateSelectedGeographyAverageVMTPerYear,
  calculateMonthlyVMTPerVehicleType,
  calculateEVEfficiencyPerVehicleType,
  calculateDailyStats,
  calculateMonthlyStats,
  calculateVehiclesDisplaced,
  calculateMonthlyEVEnergyUsageGW,
  calculateMonthlyEVEnergyUsageMW,
  calculateTotalYearlyEVEnergyUsage,
  calculateMonthlyDailyEVEnergyUsage,
  calculateMonthlyEmissionRates,
  calculateMonthlyEmissionChanges,
  calculateTotalMonthlyEmissionChanges,
  calculateTotalYearlyEmissionChanges,
  calculateVehicleSalesAndStock,
  calculateRegionREDefaultsAverages,
  calculateEVDeploymentLocationHistoricalEERE,
} from 'app/calculations/transportation';

type TransportationAction =
  | {
      type: 'transportation/SET_VMT_ALLOCATION_TOTALS_AND_PERCENTAGES';
      payload: {
        vmtAllocationTotalsAndPercentages: VMTAllocationTotalsAndPercentages;
      };
    }
  | {
      type: 'transportation/SET_VMT_ALLOCATION_PER_VEHICLE';
      payload: {
        vmtAllocationPerVehicle: VMTAllocationPerVehicle;
      };
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
      type: 'transportation/SET_SELECTED_GEOGRAPHY_STATES_VMT_PERCENTAGES';
      payload: {
        selectedGeographyStatesVMTPercentages: SelectedGeographyStatesVMTPercentages;
      };
    }
  | {
      type: 'transportation/SET_SELECTED_GEOGRAPHY_VMT_PERCENTAGES_PER_VEHICLE_TYPE';
      payload: {
        selectedGeographyVMTPercentagesPerVehicleType: SelectedGeographyVMTPercentagesPerVehicleType;
      };
    }
  | {
      type: 'transportation/SET_SELECTED_GEOGRAPHY_AVERAGE_VMT_PER_YEAR';
      payload: {
        selectedGeographyAverageVMTPerYear: SelectedGeographyAverageVMTPerYear;
      };
    }
  | {
      type: 'transportation/SET_MONTHLY_VMT_PER_VEHICLE_TYPE';
      payload: {
        monthlyVMTPerVehicleType: MonthlyVMTPerVehicleType;
      };
    }
  | {
      type: 'transportation/SET_EV_EFFICIENCY_PER_VEHICLE_TYPE';
      payload: {
        evEfficiencyPerVehicleType: EVEfficiencyPerVehicleType;
      };
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
      type: 'transportation/SET_MONTHLY_EV_ENERGY_USAGE_GW';
      payload: { monthlyEVEnergyUsageGW: MonthlyEVEnergyUsageGW };
    }
  | {
      type: 'transportation/SET_MONTHLY_EV_ENERGY_USAGE_MW';
      payload: { monthlyEVEnergyUsageMW: MonthlyEVEnergyUsageMW };
    }
  | {
      type: 'transportation/SET_TOTAL_YEARLY_EV_ENERGY_USAGE';
      payload: { totalYearlyEVEnergyUsage: TotalYearlyEVEnergyUsage };
    }
  | {
      type: 'transportation/SET_MONTHLY_DAILY_EV_ENERGY_USAGE';
      payload: { monthlyDailyEVEnergyUsage: MonthlyDailyEVEnergyUsage };
    }
  | {
      type: 'transportation/SET_MONTHLY_EMISSION_RATES';
      payload: { monthlyEmissionRates: MonthlyEmissionRates };
    }
  | {
      type: 'transportation/SET_MONTHLY_EMISSION_CHANGES';
      payload: { monthlyEmissionChanges: MonthlyEmissionChanges };
    }
  | {
      type: 'transportation/SET_TOTAL_MONTHLY_EMISSION_CHANGES';
      payload: { totalMonthlyEmissionChanges: TotalMonthlyEmissionChanges };
    }
  | {
      type: 'transportation/SET_TOTAL_YEARLY_EMISSION_CHANGES';
      payload: { totalYearlyEmissionChanges: TotalYearlyEmissionChanges };
    }
  | {
      type: 'transportation/SET_VEHICLE_SALES_AND_STOCK';
      payload: { vehicleSalesAndStock: VehicleSalesAndStock };
    }
  | {
      type: 'transportation/SET_REGION_RE_DEFAULTS_AVERAGES';
      payload: { regionREDefaultsAverages: RegionREDefaultsAverages };
    }
  | {
      type: 'transportation/SET_EV_DEPLOYMENT_LOCATION_HISTORICAL_EERE';
      payload: {
        evDeploymentLocationHistoricalEERE: EVDeploymentLocationHistoricalEERE;
      };
    };

type TransportationState = {
  vmtAllocationTotalsAndPercentages: VMTAllocationTotalsAndPercentages | {};
  vmtAllocationPerVehicle: VMTAllocationPerVehicle | {};
  monthlyVMTTotalsAndPercentages: MonthlyVMTTotalsAndPercentages;
  hourlyEVChargingPercentages: HourlyEVChargingPercentages;
  selectedGeographyStatesVMTPercentages: SelectedGeographyStatesVMTPercentages | {}; // prettier-ignore
  selectedGeographyVMTPercentagesPerVehicleType: SelectedGeographyVMTPercentagesPerVehicleType;
  selectedGeographyAverageVMTPerYear: SelectedGeographyAverageVMTPerYear;
  monthlyVMTPerVehicleType: MonthlyVMTPerVehicleType;
  evEfficiencyPerVehicleType: EVEfficiencyPerVehicleType;
  dailyStats: DailyStats;
  monthlyStats: MonthlyStats;
  vehiclesDisplaced: VehiclesDisplaced;
  monthlyEVEnergyUsageGW: MonthlyEVEnergyUsageGW;
  monthlyEVEnergyUsageMW: MonthlyEVEnergyUsageMW;
  totalYearlyEVEnergyUsage: TotalYearlyEVEnergyUsage;
  monthlyDailyEVEnergyUsage: MonthlyDailyEVEnergyUsage;
  monthlyEmissionRates: MonthlyEmissionRates;
  monthlyEmissionChanges: MonthlyEmissionChanges;
  totalMonthlyEmissionChanges: TotalMonthlyEmissionChanges;
  totalYearlyEmissionChanges: TotalYearlyEmissionChanges;
  vehicleSalesAndStock: VehicleSalesAndStock;
  regionREDefaultsAverages: RegionREDefaultsAverages;
  evDeploymentLocationHistoricalEERE: EVDeploymentLocationHistoricalEERE;
};

const initialState: TransportationState = {
  vmtAllocationTotalsAndPercentages: {},
  vmtAllocationPerVehicle: {},
  monthlyVMTTotalsAndPercentages: {},
  hourlyEVChargingPercentages: {},
  selectedGeographyStatesVMTPercentages: {},
  selectedGeographyVMTPercentagesPerVehicleType: {
    vmtPerLDVPercent: 0,
    vmtPerBusPercent: 0,
  },
  selectedGeographyAverageVMTPerYear: {
    cars: 0,
    trucks: 0,
    transitBuses: 0,
    schoolBuses: 0,
  },
  monthlyVMTPerVehicleType: {},
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
  monthlyEVEnergyUsageGW: {},
  monthlyEVEnergyUsageMW: {},
  totalYearlyEVEnergyUsage: 0,
  monthlyDailyEVEnergyUsage: {},
  monthlyEmissionRates: {},
  monthlyEmissionChanges: {},
  totalMonthlyEmissionChanges: {},
  totalYearlyEmissionChanges: {
    CO2: 0,
    NOX: 0,
    SO2: 0,
    PM25: 0,
    VOCs: 0,
    NH3: 0,
  },
  vehicleSalesAndStock: {},
  regionREDefaultsAverages: {
    onshore_wind: 0,
    utility_pv: 0,
  },
  evDeploymentLocationHistoricalEERE: {
    eeRetail: { mw: 0, gwh: 0 },
    onshoreWind: { mw: 0, gwh: 0 },
    utilitySolar: { mw: 0, gwh: 0 },
  },
};

export default function reducer(
  state: TransportationState = initialState,
  action: TransportationAction,
): TransportationState {
  switch (action.type) {
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

    case 'transportation/SET_SELECTED_GEOGRAPHY_STATES_VMT_PERCENTAGES': {
      const { selectedGeographyStatesVMTPercentages } = action.payload;

      return {
        ...state,
        selectedGeographyStatesVMTPercentages,
      };
    }

    case 'transportation/SET_SELECTED_GEOGRAPHY_VMT_PERCENTAGES_PER_VEHICLE_TYPE': {
      const { selectedGeographyVMTPercentagesPerVehicleType } = action.payload;

      return {
        ...state,
        selectedGeographyVMTPercentagesPerVehicleType,
      };
    }

    case 'transportation/SET_SELECTED_GEOGRAPHY_AVERAGE_VMT_PER_YEAR': {
      const { selectedGeographyAverageVMTPerYear } = action.payload;

      return {
        ...state,
        selectedGeographyAverageVMTPerYear,
      };
    }

    case 'transportation/SET_MONTHLY_VMT_PER_VEHICLE_TYPE': {
      const { monthlyVMTPerVehicleType } = action.payload;

      return {
        ...state,
        monthlyVMTPerVehicleType,
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

    case 'transportation/SET_MONTHLY_EV_ENERGY_USAGE_GW': {
      const { monthlyEVEnergyUsageGW } = action.payload;

      return {
        ...state,
        monthlyEVEnergyUsageGW,
      };
    }

    case 'transportation/SET_MONTHLY_EV_ENERGY_USAGE_MW': {
      const { monthlyEVEnergyUsageMW } = action.payload;

      return {
        ...state,
        monthlyEVEnergyUsageMW,
      };
    }

    case 'transportation/SET_MONTHLY_DAILY_EV_ENERGY_USAGE': {
      const { monthlyDailyEVEnergyUsage } = action.payload;

      return {
        ...state,
        monthlyDailyEVEnergyUsage,
      };
    }

    case 'transportation/SET_MONTHLY_EMISSION_RATES': {
      const { monthlyEmissionRates } = action.payload;

      return {
        ...state,
        monthlyEmissionRates,
      };
    }

    case 'transportation/SET_MONTHLY_EMISSION_CHANGES': {
      const { monthlyEmissionChanges } = action.payload;

      return {
        ...state,
        monthlyEmissionChanges,
      };
    }

    case 'transportation/SET_TOTAL_MONTHLY_EMISSION_CHANGES': {
      const { totalMonthlyEmissionChanges } = action.payload;

      return {
        ...state,
        totalMonthlyEmissionChanges,
      };
    }

    case 'transportation/SET_TOTAL_YEARLY_EMISSION_CHANGES': {
      const { totalYearlyEmissionChanges } = action.payload;

      return {
        ...state,
        totalYearlyEmissionChanges,
      };
    }

    case 'transportation/SET_TOTAL_YEARLY_EV_ENERGY_USAGE': {
      const { totalYearlyEVEnergyUsage } = action.payload;

      return {
        ...state,
        totalYearlyEVEnergyUsage,
      };
    }

    case 'transportation/SET_VEHICLE_SALES_AND_STOCK': {
      const { vehicleSalesAndStock } = action.payload;

      return {
        ...state,
        vehicleSalesAndStock,
      };
    }

    case 'transportation/SET_REGION_RE_DEFAULTS_AVERAGES': {
      const { regionREDefaultsAverages } = action.payload;

      return {
        ...state,
        regionREDefaultsAverages,
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
    const vmtAllocationTotalsAndPercentages =
      calculateVMTAllocationTotalsAndPercentages();

    const vmtAllocationPerVehicle = calculateVMTAllocationPerVehicle();

    const monthlyVMTTotalsAndPercentages =
      calculateMonthlyVMTTotalsAndPercentages();

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

    const selectedRegionName =
      Object.values(geography.regions).find((r) => r.selected)?.name || '';

    const selectedStateId =
      Object.values(geography.states).find((s) => s.selected)?.id || '';

    const selectedGeographyStatesVMTPercentages =
      calculateSelectedGeographyStatesVMTPercentages({
        geographicFocus,
        selectedRegionName,
        selectedStateId,
        vmtAllocationTotalsAndPercentages,
      });

    const selectedGeographyVMTPercentagesPerVehicleType =
      calculateSelectedGeographyVMTPercentagesPerVehicleType({
        selectedGeographyStatesVMTPercentages,
        vmtAllocationPerVehicle,
      });

    const selectedGeographyAverageVMTPerYear =
      calculateSelectedGeographyAverageVMTPerYear(
        selectedGeographyVMTPercentagesPerVehicleType,
      );

    const monthlyVMTPerVehicleType = calculateMonthlyVMTPerVehicleType({
      selectedGeographyAverageVMTPerYear,
      monthlyVMTTotalsAndPercentages,
    });

    dispatch({
      type: 'transportation/SET_SELECTED_GEOGRAPHY_STATES_VMT_PERCENTAGES',
      payload: { selectedGeographyStatesVMTPercentages },
    });

    dispatch({
      type: 'transportation/SET_SELECTED_GEOGRAPHY_VMT_PERCENTAGES_PER_VEHICLE_TYPE',
      payload: { selectedGeographyVMTPercentagesPerVehicleType },
    });

    dispatch({
      type: 'transportation/SET_SELECTED_GEOGRAPHY_AVERAGE_VMT_PER_YEAR',
      payload: { selectedGeographyAverageVMTPerYear },
    });

    dispatch({
      type: 'transportation/SET_MONTHLY_VMT_PER_VEHICLE_TYPE',
      payload: { monthlyVMTPerVehicleType },
    });
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
    const { evModelYear } = eere.inputs;

    const geographicFocus = geography.focus;

    const selectedRegionId =
      Object.values(geography.regions).find((r) => r.selected)?.id || '';

    const selectedStateId =
      Object.values(geography.states).find((s) => s.selected)?.id || '';

    const evEfficiencyPerVehicleType = calculateEVEfficiencyPerVehicleType({
      geographicFocus,
      selectedRegionId,
      selectedStateId,
      evModelYear,
    });

    dispatch({
      type: 'transportation/SET_EV_EFFICIENCY_PER_VEHICLE_TYPE',
      payload: { evEfficiencyPerVehicleType },
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

    // TODO: determine if this should move elsewhere...
    dispatch(setMonthlyDailyEVEnergyUsage());
  };
}

/**
 * Called every time the `eere` reducer's `updateEereBatteryEVs()`,
 * `updateEereHybridEVs()`, `updateEereTransitBuses()`, or
 * `updateEereSchoolBuses()` function are called.
 *
 * (e.g. whenever an EV input number changes)
 */
export function setVehiclesDisplaced(): AppThunk {
  return (dispatch, getState) => {
    const { eere } = getState();
    const { batteryEVs, hybridEVs, transitBuses, schoolBuses } = eere.inputs;

    // TODO: do we need the `regionalScalingFactor` for these inputs?
    const vehiclesDisplaced = calculateVehiclesDisplaced({
      batteryEVs: Number(batteryEVs),
      hybridEVs: Number(hybridEVs),
      transitBuses: Number(transitBuses),
      schoolBuses: Number(schoolBuses),
    });

    dispatch({
      type: 'transportation/SET_VEHICLES_DISPLACED',
      payload: { vehiclesDisplaced },
    });

    // TODO: determine if these should move elsewhere...
    dispatch(setMonthlyEVEnergyUsage());
    dispatch(setMonthlyEmissionChanges());
  };
}

export function setMonthlyEVEnergyUsage(): AppThunk {
  // NOTE: set whenever an EV number or EV model year changes
  return (dispatch, getState) => {
    const { transportation } = getState();
    const {
      monthlyVMTPerVehicleType,
      evEfficiencyPerVehicleType,
      vehiclesDisplaced,
    } = transportation;

    const monthlyEVEnergyUsageGW = calculateMonthlyEVEnergyUsageGW({
      monthlyVMTPerVehicleType,
      evEfficiencyPerVehicleType,
      vehiclesDisplaced,
    });

    const monthlyEVEnergyUsageMW = calculateMonthlyEVEnergyUsageMW(
      monthlyEVEnergyUsageGW,
    );

    const totalYearlyEVEnergyUsage = calculateTotalYearlyEVEnergyUsage(
      monthlyEVEnergyUsageGW,
    );

    dispatch({
      type: 'transportation/SET_MONTHLY_EV_ENERGY_USAGE_GW',
      payload: { monthlyEVEnergyUsageGW },
    });

    dispatch({
      type: 'transportation/SET_MONTHLY_EV_ENERGY_USAGE_MW',
      payload: { monthlyEVEnergyUsageMW },
    });

    dispatch({
      type: 'transportation/SET_TOTAL_YEARLY_EV_ENERGY_USAGE',
      payload: { totalYearlyEVEnergyUsage },
    });

    dispatch(setMonthlyDailyEVEnergyUsage());
  };
}

/**
 * Called after monthlyStats is first set in `setDailyAndMonthlyStats()`
 * (will only be called from there once, due to the early return in that
 * function, preventing it from re-setting monthlyStats), or whenever an EV
 * number or EV model year changes.
 */
export function setMonthlyDailyEVEnergyUsage(): AppThunk {
  return (dispatch, getState) => {
    const { transportation } = getState();
    const { monthlyStats, monthlyEVEnergyUsageMW } = transportation;

    const monthlyDailyEVEnergyUsage = calculateMonthlyDailyEVEnergyUsage({
      monthlyEVEnergyUsageMW,
      monthlyStats,
    });

    dispatch({
      type: 'transportation/SET_MONTHLY_DAILY_EV_ENERGY_USAGE',
      payload: { monthlyDailyEVEnergyUsage },
    });
  };
}

export function setMonthlyEmissionRates(): AppThunk {
  // NOTE: set whenever EV deployment location, EV model year, or ICE
  // replacement vehicle changes
  return (dispatch, getState) => {
    const { transportation, eere } = getState();
    const { selectedGeographyStatesVMTPercentages } = transportation;
    const { evDeploymentLocation, evModelYear, iceReplacementVehicle } =
      eere.inputs;

    const monthlyEmissionRates = calculateMonthlyEmissionRates({
      selectedGeographyStatesVMTPercentages,
      evDeploymentLocation,
      evModelYear,
      iceReplacementVehicle,
    });

    dispatch({
      type: 'transportation/SET_MONTHLY_EMISSION_RATES',
      payload: { monthlyEmissionRates },
    });

    dispatch(setMonthlyEmissionChanges());
  };
}

export function setMonthlyEmissionChanges(): AppThunk {
  // NOTE: set whenever an EV number, EV deployment location, EV model year, or
  // ICE replacement vehicle changes changes
  return (dispatch, getState) => {
    const { transportation } = getState();
    const {
      monthlyVMTPerVehicleType,
      vehiclesDisplaced,
      monthlyEmissionRates,
    } = transportation;

    const monthlyEmissionChanges = calculateMonthlyEmissionChanges({
      monthlyVMTPerVehicleType,
      vehiclesDisplaced,
      monthlyEmissionRates,
    });

    const totalMonthlyEmissionChanges = calculateTotalMonthlyEmissionChanges(
      monthlyEmissionChanges,
    );

    const totalYearlyEmissionChanges = calculateTotalYearlyEmissionChanges(
      totalMonthlyEmissionChanges,
    );

    dispatch({
      type: 'transportation/SET_MONTHLY_EMISSION_CHANGES',
      payload: { monthlyEmissionChanges },
    });

    dispatch({
      type: 'transportation/SET_TOTAL_MONTHLY_EMISSION_CHANGES',
      payload: { totalMonthlyEmissionChanges },
    });

    dispatch({
      type: 'transportation/SET_TOTAL_YEARLY_EMISSION_CHANGES',
      payload: { totalYearlyEmissionChanges },
    });
  };
}

export function setVehicleSalesAndStock(): AppThunk {
  // NOTE: set every time a region or state is selected
  return (dispatch, getState) => {
    const { geography, transportation, eere } = getState();
    const { focus, regions } = geography;
    const { vmtAllocationPerVehicle } = transportation;
    const { evDeploymentLocationOptions } = eere.selectOptions;

    const selectedRegion = Object.values(regions).find((r) => r.selected);
    const evDeploymentLocations = evDeploymentLocationOptions.map((o) => o.id);

    const selectedRegionName =
      focus === 'regions'
        ? selectedRegion?.name || ''
        : ''; /* NOTE: selected states can be in more than one region */

    // TODO: update if we need to support selected states
    const vehicleSalesAndStock = calculateVehicleSalesAndStock({
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

export function setRegionREDefaultsAverages(): AppThunk {
  // NOTE: set every time RDFs are fetched
  return (dispatch, getState) => {
    const { geography } = getState();
    const { focus, regions } = geography;

    const selectedRegion = Object.values(regions).find((r) => r.selected);

    const selectedRegionEEREDefaults =
      focus === 'regions'
        ? selectedRegion?.eereDefaults.data || []
        : []; /* NOTE: selected states can be in more than one region */

    // TODO: update if we need to support selected states
    const regionREDefaultsAverages = calculateRegionREDefaultsAverages(
      selectedRegionEEREDefaults,
    );

    dispatch({
      type: 'transportation/SET_REGION_RE_DEFAULTS_AVERAGES',
      payload: { regionREDefaultsAverages },
    });

    dispatch(setEVDeploymentLocationHistoricalEERE());
  };
}

export function setEVDeploymentLocationHistoricalEERE(): AppThunk {
  // NOTE: set whenever RDFs are fetched or EV deployment location changes
  return (dispatch, getState) => {
    const { eere, transportation } = getState();
    const { evDeploymentLocation } = eere.inputs;
    const { regionREDefaultsAverages } = transportation;

    const evDeploymentLocationHistoricalEERE =
      calculateEVDeploymentLocationHistoricalEERE({
        regionREDefaultsAverages,
        evDeploymentLocation,
      });

    dispatch({
      type: 'transportation/SET_EV_DEPLOYMENT_LOCATION_HISTORICAL_EERE',
      payload: { evDeploymentLocationHistoricalEERE },
    });
  };
}
