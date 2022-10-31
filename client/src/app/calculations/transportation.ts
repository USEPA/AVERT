// reducers
import { RegionalLoadData } from 'app/redux/reducers/geography';
// config
import type { EVProfileName } from 'app/config';
import { percentVehiclesDisplacedByEVs, averageVMTPerYear } from 'app/config';
/**
 * Excel: "MOVESEmissionRates" sheet.
 */
import movesEmissionsRates from 'app/data/moves-emissions-rates.json';
/**
 * Excel: "Table B1. View charging profiles or set a manual charging profile for
 * Weekdays" table in the "EV_Detail" sheet (C25:H49), which comes from "Table
 * 8: Default EV load profiles" table in the "Library" sheet).
 */
import evChargingProfiles from 'app/data/ev-charging-profiles-hourly-data.json';

type MovesData = {
  year: string;
  month: string;
  modelYear: string;
  state: string;
  vehicleType: string;
  fuelType: string;
  VMT: number;
  CO2: number;
  NOX: number;
  SO2: number;
  PM25: number;
  VOCs: number;
  NH3: number;
  regionalWeight: number;
};

const vehicleTypes = [
  'cars',
  'trucks',
  'transitBusesDiesel',
  'transitBusesCNG',
  'transitBusesGasoline',
  'schoolBuses',
] as const;

type VehicleType = typeof vehicleTypes[number];

export type MonthlyVMTTotalsAndPercentages = ReturnType<
  typeof setMonthlyVMTTotalsAndPercentages
>;
export type MonthlyVMTByVehicleType = ReturnType<
  typeof calculateMonthlyVMTByVehicleType
>;
export type DailyStats = ReturnType<typeof createDailyStats>;
export type MonthlyStats = ReturnType<typeof createMonthlyStats>;
export type HourlyEVChargingPercentages = ReturnType<
  typeof createHourlyEVChargingPercentages
>;
export type VehiclesDisplaced = ReturnType<typeof calculateVehiclesDisplaced>;

/**
 * Vehicle miles traveled (VMT) totals for each month from MOVES data, and the
 * percentage/share of the yearly totals each month has, for each vehicle type.
 *
 * Excel: "Table 5: EV weather adjustments and monthly VMT adjustments" table
 * in the "Library" sheet (totals: E220:P225, percentages: E227:P232).
 */
export function setMonthlyVMTTotalsAndPercentages() {
  const result: {
    [month: number]: {
      [vehicleType in VehicleType]: {
        total: number;
        percent: number;
      };
    };
  } = {};

  /**
   * Yearly total vehicle miles traveled (VMT) for each vehicle type.
   *
   * Excel: Total column of Table 5 in the "Library" sheet (Q220:Q225).
   */
  const yearlyTotals = {
    cars: 0,
    trucks: 0,
    transitBusesDiesel: 0,
    transitBusesCNG: 0,
    transitBusesGasoline: 0,
    schoolBuses: 0,
  };

  // NOTE: explicitly declaring the type with a type assertion because
  // TypeScript isn't able to infer types from large JSON files
  // (https://github.com/microsoft/TypeScript/issues/42761)
  (movesEmissionsRates as MovesData[]).forEach((data) => {
    const month = Number(data.month);

    if (data.year === '2020') {
      result[month] ??= {
        cars: { total: 0, percent: 0 },
        trucks: { total: 0, percent: 0 },
        transitBusesDiesel: { total: 0, percent: 0 },
        transitBusesCNG: { total: 0, percent: 0 },
        transitBusesGasoline: { total: 0, percent: 0 },
        schoolBuses: { total: 0, percent: 0 },
      };

      const vehicleType: VehicleType | null =
        data.vehicleType === 'Passenger Car'
          ? 'cars'
          : data.vehicleType === 'Passenger Truck'
          ? 'trucks'
          : data.vehicleType === 'Transit Bus' && data.fuelType === 'Diesel'
          ? 'transitBusesDiesel'
          : data.vehicleType === 'Transit Bus' && data.fuelType === 'CNG'
          ? 'transitBusesCNG'
          : data.vehicleType === 'Transit Bus' && data.fuelType === 'Gasoline'
          ? 'transitBusesGasoline'
          : data.vehicleType === 'School Bus'
          ? 'schoolBuses'
          : null; // NOTE: fallback (vehicleType should never actually be null)

      if (vehicleType) {
        result[month][vehicleType].total += data.VMT;
        yearlyTotals[vehicleType] += data.VMT;
      }
    }
  });

  Object.values(result).forEach((month) => {
    vehicleTypes.forEach((vehicleType) => {
      month[vehicleType].percent =
        month[vehicleType].total / yearlyTotals[vehicleType];
    });
  });

  return result;
}

/**
 * Monthly vehicle miles traveled (VMT) for each vehicle type.
 *
 * Excel: "Table 5: EV weather adjustments and monthly VMT adjustments" table
 * in the "Library" sheet (E234:P239).
 */
export function calculateMonthlyVMTByVehicleType(
  monthlyVMTTotalsAndPercentages: MonthlyVMTTotalsAndPercentages,
) {
  const result: {
    [month: number]: {
      [vehicleType in VehicleType]: number;
    };
  } = {};

  Object.entries(monthlyVMTTotalsAndPercentages).forEach(([key, data]) => {
    const month = Number(key);

    result[month] ??= {
      cars: 0,
      trucks: 0,
      transitBusesDiesel: 0,
      transitBusesCNG: 0,
      transitBusesGasoline: 0,
      schoolBuses: 0,
    };

    vehicleTypes.forEach((vehicleType) => {
      const averageVMTPerYearVehicleType =
        vehicleType === 'transitBusesDiesel' ||
        vehicleType === 'transitBusesCNG' ||
        vehicleType === 'transitBusesGasoline'
          ? 'transitBuses'
          : vehicleType;

      result[month][vehicleType] =
        averageVMTPerYear[averageVMTPerYearVehicleType] *
        data[vehicleType].percent;
    });
  });

  return result;
}

/**
 * Build up daily stats object by looping through every hour of the year,
 * (only creates objects and sets their keys in the first hour of each month)
 */
export function createDailyStats(regionalLoad: RegionalLoadData[]) {
  const result: {
    [month: number]: {
      [day: number]: { _done: boolean; dayOfWeek: number; isWeekend: boolean };
    };
  } = {};

  regionalLoad.forEach((data) => {
    result[data.month] ??= {};
    // NOTE: initial values to keep same object shape – will be mutated next
    result[data.month][data.day] ??= {
      _done: false,
      dayOfWeek: -1,
      isWeekend: false,
    };

    if (result[data.month][data.day]._done === false) {
      const datetime = new Date(data.year, data.month - 1, data.day, data.hour);
      const dayOfWeek = datetime.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      result[data.month][data.day] = { _done: true, dayOfWeek, isWeekend };
    }
  });

  return result;
}

/**
 * Build up monthly stats object from daily stats object.
 */
export function createMonthlyStats(dailyStats: DailyStats) {
  const result: {
    [month: number]: {
      totalDays: number;
      weekdayDays: number;
      weekendDays: number;
    };
  } = {};

  [...Array(12)].forEach((_item, index) => {
    const month = index + 1;

    const totalDays = Object.keys(dailyStats[month]).length;
    const weekendDays = Object.values(dailyStats[month]).reduce(
      (total, day) => (day.isWeekend ? ++total : total),
      0,
    );
    const weekdayDays = totalDays - weekendDays;

    result[month] = {
      totalDays,
      weekdayDays,
      weekendDays,
    };
  });

  return result;
}

/**
 * Excel: Data in the first EV table (to the right of the "Calculate Changes"
 * table) in the "CalculateEERE" sheet (P8:X32).
 */
export function createHourlyEVChargingPercentages(options: {
  batteryEVsProfile: string;
  hybridEVsProfile: string;
  transitBusesProfile: string;
  schoolBusesProfile: string;
}) {
  const {
    batteryEVsProfile,
    hybridEVsProfile,
    transitBusesProfile,
    schoolBusesProfile,
  } = options;

  const result: {
    [hour: number]: {
      batteryEVs: { weekday: number; weekend: number };
      hybridEVs: { weekday: number; weekend: number };
      transitBuses: { weekday: number; weekend: number };
      schoolBuses: { weekday: number; weekend: number };
    };
  } = {};

  evChargingProfiles.forEach((data) => {
    result[data.hour] = {
      batteryEVs: {
        weekday: data[batteryEVsProfile as EVProfileName].weekday,
        weekend: data[batteryEVsProfile as EVProfileName].weekend,
      },
      hybridEVs: {
        weekday: data[hybridEVsProfile as EVProfileName].weekday,
        weekend: data[hybridEVsProfile as EVProfileName].weekend,
      },
      transitBuses: {
        weekday: data[transitBusesProfile as EVProfileName].weekday,
        weekend: data[transitBusesProfile as EVProfileName].weekend,
      },
      schoolBuses: {
        weekday: data[schoolBusesProfile as EVProfileName].weekday,
        weekend: data[schoolBusesProfile as EVProfileName].weekend,
      },
    };
  });

  return result;
}

/**
 * Number of vehicles displaced by new EVs.
 *
 * Excel: "Sales Changes" section of Table 7 in the "Library" sheet
 * (E299:E306), which uses "Part II. Vehicle Composition" table in the
 * "EV_Detail" sheet (L99:O104).
 */
export function calculateVehiclesDisplaced(options: {
  batteryEVs: number;
  hybridEVs: number;
  transitBuses: number;
  schoolBuses: number;
}) {
  const { batteryEVs, hybridEVs, transitBuses, schoolBuses } = options;

  const result = {
    batteryEVCars:
      batteryEVs * (percentVehiclesDisplacedByEVs.batteryEVCars / 100),
    hybridEVCars:
      hybridEVs * (percentVehiclesDisplacedByEVs.hybridEVCars / 100),
    batteryEVTrucks:
      batteryEVs * (percentVehiclesDisplacedByEVs.batteryEVTrucks / 100),
    hybridEVTrucks:
      hybridEVs * (percentVehiclesDisplacedByEVs.hybridEVTrucks / 100),
    transitBusesDiesel:
      transitBuses * (percentVehiclesDisplacedByEVs.transitBusesDiesel / 100),
    transitBusesCNG:
      transitBuses * (percentVehiclesDisplacedByEVs.transitBusesCNG / 100),
    transitBusesGasoline:
      transitBuses * (percentVehiclesDisplacedByEVs.transitBusesGasoline / 100),
    schoolBuses:
      schoolBuses * (percentVehiclesDisplacedByEVs.schoolBuses / 100),
  };

  return result;
}
