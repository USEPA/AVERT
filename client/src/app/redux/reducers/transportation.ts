// reducers
import { AppThunk } from 'app/redux/index';
import { RegionalLoadData } from 'app/redux/reducers/geography';
// calculations
import type {
  MonthlyVMTTotalsAndPercentages,
  MonthlyVMTPerVehicle,
  DailyStats,
  MonthlyStats,
  HourlyEVChargingPercentages,
  VehiclesDisplaced,
  MonthlyEVEnergyUsageGW,
  MonthlyEVEnergyUsageMW,
  MonthlyDailyEVEnergyUsage,
} from 'app/calculations/transportation';
import {
  calculateMonthlyVMTTotalsAndPercentages,
  calculateMonthlyVMTPerVehicle,
  calculateDailyStats,
  calculateMonthlyStats,
  calculateHourlyEVChargingPercentages,
  calculateVehiclesDisplaced,
  calculateMonthlyEVEnergyUsageGW,
  calculateMonthlyEVEnergyUsageMW,
  calculateMonthlyDailyEVEnergyUsage,
} from 'app/calculations/transportation';

type TransportationAction =
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
      type: 'transportation/SET_MONTHLY_DAILY_EV_ENERGY_USAGE';
      payload: { monthlyDailyEVEnergyUsage: MonthlyDailyEVEnergyUsage };
    };

type TransportationState = {
  monthlyVMTTotalsAndPercentages: MonthlyVMTTotalsAndPercentages;
  monthlyVMTPerVehicle: MonthlyVMTPerVehicle;
  dailyStats: DailyStats;
  monthlyStats: MonthlyStats;
  hourlyEVChargingPercentages: HourlyEVChargingPercentages;
  vehiclesDisplaced: VehiclesDisplaced;
  monthlyEVEnergyUsageGW: MonthlyEVEnergyUsageGW;
  monthlyEVEnergyUsageMW: MonthlyEVEnergyUsageMW;
  monthlyDailyEVEnergyUsage: MonthlyDailyEVEnergyUsage;
};

// reducer
const initialState: TransportationState = {
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
  monthlyDailyEVEnergyUsage: {},
};

export default function reducer(
  state: TransportationState = initialState,
  action: TransportationAction,
): TransportationState {
  switch (action.type) {
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

    default: {
      return state;
    }
  }
}

// action creators
export function setMonthlyVMTData(): AppThunk {
  // NOTE: set when the app starts (only once, and never re-set)
  return (dispatch) => {
    const monthlyVMTTotalsAndPercentages =
      calculateMonthlyVMTTotalsAndPercentages();

    const monthlyVMTPerVehicle = calculateMonthlyVMTPerVehicle(
      monthlyVMTTotalsAndPercentages,
    );

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
  // NOTE: set every time the selected geography changes (region or state)
  return (dispatch) => {
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
  // NOTE: set whenever an EV profile changes
  return (dispatch, getState) => {
    const { eere } = getState();
    const {
      batteryEVsProfile,
      hybridEVsProfile,
      transitBusesProfile,
      schoolBusesProfile,
    } = eere.inputs;

    const hourlyEVChargingPercentages = calculateHourlyEVChargingPercentages({
      batteryEVsProfile,
      hybridEVsProfile,
      transitBusesProfile,
      schoolBusesProfile,
    });

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

    dispatch({
      type: 'transportation/SET_MONTHLY_EV_ENERGY_USAGE_GW',
      payload: { monthlyEVEnergyUsageGW },
    });

    dispatch({
      type: 'transportation/SET_MONTHLY_EV_ENERGY_USAGE_MW',
      payload: { monthlyEVEnergyUsageMW },
    });

    dispatch(setMonthlyDailyEVEnergyUsage());
  };
}

export function setMonthlyDailyEVEnergyUsage(): AppThunk {
  // NOTE: set whenever an EV number, EV model year, or the selected geography changes
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
