// reducers
import { AppThunk } from 'app/redux/index';
import { RegionalLoadData } from 'app/redux/reducers/geography';
// calculations
import type {
  MonthlyVMTTotalsAndPercentages,
  MonthlyVMTByVehicleType,
  DailyStats,
  MonthlyStats,
  HourlyEVChargingPercentages,
  VehiclesDisplaced,
} from 'app/calculations/transportation';
import {
  setMonthlyVMTTotalsAndPercentages,
  calculateMonthlyVMTByVehicleType,
  createDailyStats,
  createMonthlyStats,
  createHourlyEVChargingPercentages,
  calculateVehiclesDisplaced,
} from 'app/calculations/transportation';

type TransportationAction =
  | {
      type: 'transportation/SET_MONTHLY_VMT_TOTALS_AND_PERCENTAGES';
      payload: {
        monthlyVMTTotalsAndPercentages: MonthlyVMTTotalsAndPercentages;
      };
    }
  | {
      type: 'transportation/SET_MONTHLY_VMT_BY_VEHICLE_TYPE';
      payload: {
        monthlyVMTByVehicleType: MonthlyVMTByVehicleType;
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
    };

type TransportationState = {
  monthlyVMTTotalsAndPercentages: MonthlyVMTTotalsAndPercentages;
  monthlyVMTByVehicleType: MonthlyVMTByVehicleType;
  dailyStats: DailyStats;
  monthlyStats: MonthlyStats;
  hourlyEVChargingPercentages: HourlyEVChargingPercentages;
  vehiclesDisplaced: VehiclesDisplaced;
};

// reducer
const initialState: TransportationState = {
  monthlyVMTTotalsAndPercentages: {},
  monthlyVMTByVehicleType: {},
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

    case 'transportation/SET_MONTHLY_VMT_BY_VEHICLE_TYPE': {
      const { monthlyVMTByVehicleType } = action.payload;

      return {
        ...state,
        monthlyVMTByVehicleType,
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

    default: {
      return state;
    }
  }
}

// action creators
export function setTransportationDataOnStartup(): AppThunk {
  return (dispatch) => {
    const monthlyVMTTotalsAndPercentages = setMonthlyVMTTotalsAndPercentages();
    const monthlyVMTByVehicleType = calculateMonthlyVMTByVehicleType(
      monthlyVMTTotalsAndPercentages,
    );

    dispatch({
      type: 'transportation/SET_MONTHLY_VMT_TOTALS_AND_PERCENTAGES',
      payload: { monthlyVMTTotalsAndPercentages },
    });

    dispatch({
      type: 'transportation/SET_MONTHLY_VMT_BY_VEHICLE_TYPE',
      payload: { monthlyVMTByVehicleType },
    });
  };
}

export function updateTransportationDataFromSelectedGeography(
  regionalLoad: RegionalLoadData[],
): AppThunk {
  return (dispatch) => {
    const dailyStats = createDailyStats(regionalLoad);
    const monthlyStats = createMonthlyStats(dailyStats);

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

export function updateTransportationDataFromEVChargingProfiles(): AppThunk {
  return (dispatch, getState) => {
    const { eere } = getState();

    const {
      batteryEVsProfile,
      hybridEVsProfile,
      transitBusesProfile,
      schoolBusesProfile,
    } = eere.inputs;

    const hourlyEVChargingPercentages = createHourlyEVChargingPercentages({
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

export function updateTransportationDataFromEVNumbers(): AppThunk {
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
  };
}
