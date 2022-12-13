// reducers
import { AppThunk } from 'app/redux/index';
import { RegionalLoadData } from 'app/redux/reducers/geography';
// calculations
import type {
  VMTAllocationTotalsAndPercentages,
  VMTAllocationPerVehicle,
  MonthlyVMTTotalsAndPercentages,
  MonthlyVMTPerVehicle,
  DailyStats,
  MonthlyStats,
  HourlyEVChargingPercentages,
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
  calculateMonthlyVMTPerVehicle,
  calculateDailyStats,
  calculateMonthlyStats,
  calculateHourlyEVChargingPercentages,
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
      type: 'transportation/SET_MONTHLY_VMT_PER_VEHICLE';
      payload: {
        monthlyVMTPerVehicle: MonthlyVMTPerVehicle;
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
      type: 'transportation/SET_HOURLY_EV_CHARGING_PERCENTAGES';
      payload: { hourlyEVChargingPercentages: HourlyEVChargingPercentages };
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
  monthlyVMTPerVehicle: MonthlyVMTPerVehicle;
  dailyStats: DailyStats;
  monthlyStats: MonthlyStats;
  hourlyEVChargingPercentages: HourlyEVChargingPercentages;
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

// reducer
const initialState: TransportationState = {
  vmtAllocationTotalsAndPercentages: {},
  vmtAllocationPerVehicle: {},
  monthlyVMTTotalsAndPercentages: {},
  monthlyVMTPerVehicle: {},
  dailyStats: {},
  monthlyStats: {},
  hourlyEVChargingPercentages: {},
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

    case 'transportation/SET_MONTHLY_VMT_PER_VEHICLE': {
      const { monthlyVMTPerVehicle } = action.payload;

      return {
        ...state,
        monthlyVMTPerVehicle,
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

    case 'transportation/SET_HOURLY_EV_CHARGING_PERCENTAGES': {
      const { hourlyEVChargingPercentages } = action.payload;

      return {
        ...state,
        hourlyEVChargingPercentages,
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

// action creators
export function setVMTData(): AppThunk {
  // NOTE: set when the app starts
  return (dispatch) => {
    const vmtAllocationTotalsAndPercentages =
      calculateVMTAllocationTotalsAndPercentages();

    const vmtAllocationPerVehicle = calculateVMTAllocationPerVehicle();

    const monthlyVMTTotalsAndPercentages =
      calculateMonthlyVMTTotalsAndPercentages();

    const monthlyVMTPerVehicle = calculateMonthlyVMTPerVehicle(
      monthlyVMTTotalsAndPercentages,
    );

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

    dispatch({
      type: 'transportation/SET_MONTHLY_VMT_PER_VEHICLE',
      payload: { monthlyVMTPerVehicle },
    });
  };
}

export function setDailyAndMonthlyStats(
  regionalLoad: RegionalLoadData[],
): AppThunk {
  // NOTE: set the first time RDFs are fetched
  return (dispatch, getState) => {
    const { transportation } = getState();

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

    dispatch(setMonthlyDailyEVEnergyUsage());
  };
}

export function setHourlyEVChargingPercentages(): AppThunk {
  // NOTE: set when the app starts
  return (dispatch) => {
    const hourlyEVChargingPercentages = calculateHourlyEVChargingPercentages();

    dispatch({
      type: 'transportation/SET_HOURLY_EV_CHARGING_PERCENTAGES',
      payload: { hourlyEVChargingPercentages },
    });
  };
}

export function setVehiclesDisplaced(): AppThunk {
  // NOTE: set whenever an EV number changes
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

    dispatch(setMonthlyEVEnergyUsage());
    dispatch(setMonthlyEmissionChanges());
  };
}

export function setMonthlyEVEnergyUsage(): AppThunk {
  // NOTE: set whenever an EV number or EV model year changes
  return (dispatch, getState) => {
    const { transportation, eere } = getState();
    const { monthlyVMTPerVehicle, vehiclesDisplaced } = transportation;
    const { evModelYear } = eere.inputs;

    const monthlyEVEnergyUsageGW = calculateMonthlyEVEnergyUsageGW({
      monthlyVMTPerVehicle,
      vehiclesDisplaced,
      evModelYear,
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

export function setMonthlyDailyEVEnergyUsage(): AppThunk {
  // NOTE: set whenever an EV number, EV model year, or the selected geography
  // (region or state) changes
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
    const { eere } = getState();
    const { evDeploymentLocation, evModelYear, iceReplacementVehicle } =
      eere.inputs;

    const monthlyEmissionRates = calculateMonthlyEmissionRates({
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
    const { monthlyVMTPerVehicle, vehiclesDisplaced, monthlyEmissionRates } =
      transportation;

    const monthlyEmissionChanges = calculateMonthlyEmissionChanges({
      monthlyVMTPerVehicle,
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
    const { geography, eere } = getState();
    const { focus, regions } = geography;
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
