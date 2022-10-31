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
  MonthlyEVEnergyUsage,
  CombinedMonthlyEVEnergyUsage,
} from 'app/calculations/transportation';
import {
  calculateMonthlyVMTTotalsAndPercentages,
  calculateMonthlyVMTPerVehicle,
  calculateDailyStats,
  calculateMonthlyStats,
  calculateHourlyEVChargingPercentages,
  calculateVehiclesDisplaced,
  calculateMonthlyEVEnergyUsage,
  calculateCombinedMonthlyEVEnergyUsage,
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
      type: 'transportation/SET_MONTHLY_EV_ENERGY_USAGE';
      payload: { monthlyEVEnergyUsage: MonthlyEVEnergyUsage };
    }
  | {
      type: 'transportation/SET_COMBINED_MONTHLY_EV_ENERGY_USAGE';
      payload: { combinedMonthlyEVEnergyUsage: CombinedMonthlyEVEnergyUsage };
    };

type TransportationState = {
  monthlyVMTTotalsAndPercentages: MonthlyVMTTotalsAndPercentages;
  monthlyVMTPerVehicle: MonthlyVMTPerVehicle;
  dailyStats: DailyStats;
  monthlyStats: MonthlyStats;
  hourlyEVChargingPercentages: HourlyEVChargingPercentages;
  vehiclesDisplaced: VehiclesDisplaced;
  monthlyEVEnergyUsage: MonthlyEVEnergyUsage;
  combinedMonthlyEVEnergyUsage: CombinedMonthlyEVEnergyUsage;
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
  monthlyEVEnergyUsage: {},
  combinedMonthlyEVEnergyUsage: {},
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

    case 'transportation/SET_MONTHLY_EV_ENERGY_USAGE': {
      const { monthlyEVEnergyUsage } = action.payload;

      return {
        ...state,
        monthlyEVEnergyUsage,
      };
    }

    case 'transportation/SET_COMBINED_MONTHLY_EV_ENERGY_USAGE': {
      const { combinedMonthlyEVEnergyUsage } = action.payload;

      return {
        ...state,
        combinedMonthlyEVEnergyUsage,
      };
    }

    default: {
      return state;
    }
  }
}

// action creators
export function setMonthlyVMTData(): AppThunk {
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
  };
}

export function setHourlyEVChargingPercentages(): AppThunk {
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
  return (dispatch, getState) => {
    const { transportation, eere } = getState();
    const { monthlyVMTPerVehicle, vehiclesDisplaced } = transportation;
    const { evModelYear } = eere.inputs;

    const monthlyEVEnergyUsage = calculateMonthlyEVEnergyUsage({
      monthlyVMTPerVehicle,
      vehiclesDisplaced,
      evModelYear,
    });

    const combinedMonthlyEVEnergyUsage =
      calculateCombinedMonthlyEVEnergyUsage(monthlyEVEnergyUsage);

    dispatch({
      type: 'transportation/SET_MONTHLY_EV_ENERGY_USAGE',
      payload: { monthlyEVEnergyUsage },
    });

    dispatch({
      type: 'transportation/SET_COMBINED_MONTHLY_EV_ENERGY_USAGE',
      payload: { combinedMonthlyEVEnergyUsage },
    });
  };
}
