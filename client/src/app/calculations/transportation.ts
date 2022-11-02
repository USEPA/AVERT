// reducers
import { RegionalLoadData } from 'app/redux/reducers/geography';
import type { EEREDefaultData } from 'app/redux/reducers/geography';
// config
import type { EVProfileName, EVModelYear } from 'app/config';
import {
  percentVehiclesDisplacedByEVs,
  averageVMTPerYear,
  evEfficiencyByModelYear,
  percentHybridEVMilesDrivenOnElectricity,
  percentWeekendToWeekdayEVConsumption,
} from 'app/config';
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
/**
 * Excel: "CountyFIPS" sheet.
 */
import countyFips from 'app/data/county-fips.json';
/**
 * Excel: "Table 10: LDV Sales and Stock" and "Table 11: Transit and School Bus
 * Sales and Stock" tables in the "Library" sheet (B468:D519 and B529:F580).
 */
import stateSalesAndStock from 'app/data/state-sales-and-stock.json';
/**
 * Excel: "Table 12: Historical renewable and energy efficiency addition data"
 * table in the "Library" sheet (B589:E603).
 */
import regionEereAverages from 'app/data/region-eere-averages.json';
/**
 * Excel: "Table 12: Historical renewable and energy efficiency addition data"
 * table in the "Library" sheet (B609:E658).
 */
import stateEereAverages from 'app/data/state-eere-averages.json';

type SalesAndStockStateId = keyof typeof stateSalesAndStock;
type RegionEereAveragesRegionId = keyof typeof regionEereAverages;
type RegionEereAveragesStateId = keyof typeof stateEereAverages;

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

// const abridgedVehicleTypes = [
//   'cars',
//   'trucks',
//   'transitBuses',
//   'schoolBuses',
// ] as const;

const generalVehicleTypes = [
  'cars',
  'trucks',
  'transitBusesDiesel',
  'transitBusesCNG',
  'transitBusesGasoline',
  'schoolBuses',
] as const;

const expandedVehicleTypes = [
  'batteryEVCars',
  'hybridEVCars',
  'batteryEVTrucks',
  'hybridEVTrucks',
  'transitBusesDiesel',
  'transitBusesCNG',
  'transitBusesGasoline',
  'schoolBuses',
] as const;

const pollutants = ['CO2', 'NOX', 'SO2', 'PM25', 'VOCs', 'NH3'] as const;

// type AbridgedVehicleType = typeof abridgedVehicleTypes[number];
type GeneralVehicleType = typeof generalVehicleTypes[number];
type ExpandedVehicleType = typeof expandedVehicleTypes[number];
type Pollutant = typeof pollutants[number];

export type MonthlyVMTTotalsAndPercentages = ReturnType<
  typeof calculateMonthlyVMTTotalsAndPercentages
>;
export type MonthlyVMTPerVehicle = ReturnType<
  typeof calculateMonthlyVMTPerVehicle
>;
export type DailyStats = ReturnType<typeof calculateDailyStats>;
export type MonthlyStats = ReturnType<typeof calculateMonthlyStats>;
export type HourlyEVChargingPercentages = ReturnType<
  typeof calculateHourlyEVChargingPercentages
>;
export type VehiclesDisplaced = ReturnType<typeof calculateVehiclesDisplaced>;
export type MonthlyEVEnergyUsageGW = ReturnType<
  typeof calculateMonthlyEVEnergyUsageGW
>;
export type MonthlyEVEnergyUsageMW = ReturnType<
  typeof calculateMonthlyEVEnergyUsageMW
>;
export type MonthlyDailyEVEnergyUsage = ReturnType<
  typeof calculateMonthlyDailyEVEnergyUsage
>;
export type MonthlyEmissionRates = ReturnType<
  typeof calculateMonthlyEmissionRates
>;
export type MonthlyEmissionChanges = ReturnType<
  typeof calculateMonthlyEmissionChanges
>;
export type TotalMonthlyEmissionChanges = ReturnType<
  typeof calculateTotalMonthlyEmissionChanges
>;
export type TotalYearlyEmissionChanges = ReturnType<
  typeof calculateTotalYearlyEmissionChanges
>;
export type TotalYearlyEVEnergyUsage = ReturnType<
  typeof calculateTotalYearlyEVEnergyUsage
>;
export type HourlyEVLoad = ReturnType<typeof calculateHourlyEVLoad>;
export type VehicleSalesAndStock = ReturnType<
  typeof calculateVehicleSalesAndStock
>;
export type RegionREDefaultsAverages = ReturnType<
  typeof calculateRegionREDefaultsAverages
>;
export type EVDeploymentLocationHistoricalEERE = ReturnType<
  typeof calculateEVDeploymentLocationHistoricalEERE
>;

/**
 * Vehicle miles traveled (VMT) totals for each month from MOVES data, and the
 * percentage/share of the yearly totals each month has, for each vehicle type.
 *
 * Excel: "Table 5: EV weather adjustments and monthly VMT adjustments" table
 * in the "Library" sheet (totals: E220:P225, percentages: E227:P232).
 */
export function calculateMonthlyVMTTotalsAndPercentages() {
  const result: {
    [month: number]: {
      [vehicleType in GeneralVehicleType]: {
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

      const vehicleType: GeneralVehicleType | null =
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
    generalVehicleTypes.forEach((vehicleType) => {
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
export function calculateMonthlyVMTPerVehicle(
  monthlyVMTTotalsAndPercentages: MonthlyVMTTotalsAndPercentages,
) {
  const result: {
    [month: number]: {
      [vehicleType in GeneralVehicleType]: number;
    };
  } = {};

  if (Object.keys(monthlyVMTTotalsAndPercentages).length === 0) {
    return result;
  }

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

    generalVehicleTypes.forEach((vehicleType) => {
      // NOTE: averageVMTPerYear's vehicle types are abridged
      // (don't include transit buses broken out by fuel type)
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
export function calculateDailyStats(regionalLoad: RegionalLoadData[]) {
  const result: {
    [month: number]: {
      [day: number]: { _done: boolean; dayOfWeek: number; isWeekend: boolean };
    };
  } = {};

  if (regionalLoad.length === 0) {
    return result;
  }

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
export function calculateMonthlyStats(dailyStats: DailyStats) {
  const result: {
    [month: number]: {
      totalDays: number;
      weekdayDays: number;
      weekendDays: number;
    };
  } = {};

  if (Object.keys(dailyStats).length === 0) {
    return result;
  }

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
export function calculateHourlyEVChargingPercentages(options: {
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

  if (
    batteryEVsProfile === '' ||
    hybridEVsProfile === '' ||
    transitBusesProfile === '' ||
    schoolBusesProfile === ''
  ) {
    return result;
  }

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

/**
 * Monthly EV energy use in GW for all the EV types we have data for.
 *
 * Excel: "Sales Changes" data from "Table 7: Calculated changes for the
 * transportation sector" table in the "Library" sheet (G298:R306).
 */
export function calculateMonthlyEVEnergyUsageGW(options: {
  monthlyVMTPerVehicle: MonthlyVMTPerVehicle;
  vehiclesDisplaced: VehiclesDisplaced;
  evModelYear: string;
}) {
  const { monthlyVMTPerVehicle, vehiclesDisplaced, evModelYear } = options;

  const result: {
    [month: number]: {
      [vehicleType in ExpandedVehicleType]: number;
    };
  } = {};

  if (Object.keys(monthlyVMTPerVehicle).length === 0 || evModelYear === '') {
    return result;
  }

  /**
   * Efficiency factor for each vehicle type for the selected model year.
   *
   * Excel: "Table 5: EV weather adjustments and monthly VMT adjustments" table
   * in the "Library" sheet (E212:E217). NOTE: the Excel version duplicates
   * these values in the columns to the right for each month, but they're the
   * same value for all months.
   */
  const evEfficiency = evEfficiencyByModelYear[evModelYear as EVModelYear];

  const kWtoGW = 0.000001;

  [...Array(12)].forEach((_item, index) => {
    const month = index + 1;

    result[month] = {
      batteryEVCars:
        vehiclesDisplaced.batteryEVCars *
        monthlyVMTPerVehicle[month].cars *
        evEfficiency.batteryEVCars *
        kWtoGW,
      hybridEVCars:
        vehiclesDisplaced.hybridEVCars *
        monthlyVMTPerVehicle[month].cars *
        evEfficiency.hybridEVCars *
        kWtoGW *
        (percentHybridEVMilesDrivenOnElectricity / 100),
      batteryEVTrucks:
        vehiclesDisplaced.batteryEVTrucks *
        monthlyVMTPerVehicle[month].trucks *
        evEfficiency.batteryEVTrucks *
        kWtoGW,
      hybridEVTrucks:
        vehiclesDisplaced.hybridEVTrucks *
        monthlyVMTPerVehicle[month].trucks *
        evEfficiency.batteryEVTrucks *
        kWtoGW *
        (percentHybridEVMilesDrivenOnElectricity / 100),
      transitBusesDiesel:
        vehiclesDisplaced.transitBusesDiesel *
        monthlyVMTPerVehicle[month].transitBusesDiesel *
        evEfficiency.transitBuses *
        kWtoGW,
      transitBusesCNG:
        vehiclesDisplaced.transitBusesCNG *
        monthlyVMTPerVehicle[month].transitBusesCNG *
        evEfficiency.transitBuses *
        kWtoGW,
      transitBusesGasoline:
        vehiclesDisplaced.transitBusesGasoline *
        monthlyVMTPerVehicle[month].transitBusesGasoline *
        evEfficiency.transitBuses *
        kWtoGW,
      schoolBuses:
        vehiclesDisplaced.schoolBuses *
        monthlyVMTPerVehicle[month].schoolBuses *
        evEfficiency.schoolBuses *
        kWtoGW,
    };
  });

  return result;
}

/**
 * Monthly EV energy usage (total for each month) in MW, combined into the four
 * AVERT EV input types.
 *
 * Excel: Data in the third EV table (to the right of the "Calculate Changes"
 * table) in the "CalculateEERE" sheet (T49:W61).
 */
export function calculateMonthlyEVEnergyUsageMW(
  monthlyEVEnergyUsageGW: MonthlyEVEnergyUsageGW,
) {
  const result: {
    [month: number]: {
      batteryEVs: number;
      hybridEVs: number;
      transitBuses: number;
      schoolBuses: number;
    };
  } = {};

  if (Object.keys(monthlyEVEnergyUsageGW).length === 0) {
    return result;
  }

  const GWtoMW = 1000;

  Object.entries(monthlyEVEnergyUsageGW).forEach(([key, data]) => {
    const month = Number(key);

    result[month] = {
      batteryEVs: (data.batteryEVCars + data.batteryEVTrucks) * GWtoMW,
      hybridEVs: (data.hybridEVCars + data.hybridEVTrucks) * GWtoMW,
      transitBuses:
        (data.transitBusesDiesel +
          data.transitBusesCNG +
          data.transitBusesGasoline) *
        GWtoMW,
      schoolBuses: data.schoolBuses * GWtoMW,
    };
  });

  return result;
}

/**
 * Totals the energy usage from each EV type for all months in the year to a
 * single total EV energy usage value for the year.
 */
export function calculateTotalYearlyEVEnergyUsage(
  monthlyEVEnergyUsageGW: MonthlyEVEnergyUsageGW,
) {
  if (Object.keys(monthlyEVEnergyUsageGW).length === 0) {
    return 0;
  }

  const result = Object.values(monthlyEVEnergyUsageGW).reduce(
    (total, month) => total + Object.values(month).reduce((a, b) => a + b, 0),
    0,
  );

  return result;
}

/**
 * Monthly EV energy usage (MWh) for a typical weekday day or weekend day.
 *
 * Excel: Data in the second EV table (to the right of the "Calculate Changes"
 * table) in the "CalculateEERE" sheet (P35:X47).
 */
export function calculateMonthlyDailyEVEnergyUsage(options: {
  monthlyEVEnergyUsageMW: MonthlyEVEnergyUsageMW;
  monthlyStats: MonthlyStats;
}) {
  const { monthlyEVEnergyUsageMW, monthlyStats } = options;

  const result: {
    [month: number]: {
      batteryEVs: { weekday: number; weekend: number };
      hybridEVs: { weekday: number; weekend: number };
      transitBuses: { weekday: number; weekend: number };
      schoolBuses: { weekday: number; weekend: number };
    };
  } = {};

  if (
    Object.keys(monthlyEVEnergyUsageMW).length === 0 ||
    Object.keys(monthlyStats).length === 0
  ) {
    return result;
  }

  [...Array(12)].forEach((_item, index) => {
    const month = index + 1;

    const weekdayDays = monthlyStats[month].weekdayDays;
    const weekendDays = monthlyStats[month].weekendDays;
    const weekenedToWeekdayRatio = percentWeekendToWeekdayEVConsumption / 100;
    const scaledWeekdayDays =
      weekdayDays + weekenedToWeekdayRatio * weekendDays;

    const batteryEVsWeekday =
      monthlyEVEnergyUsageMW[month].batteryEVs / scaledWeekdayDays;

    const hybridEVsWeekday =
      monthlyEVEnergyUsageMW[month].hybridEVs / scaledWeekdayDays;

    const transitBusesWeekday =
      monthlyEVEnergyUsageMW[month].transitBuses / scaledWeekdayDays;

    const schoolBusesWeekday =
      monthlyEVEnergyUsageMW[month].schoolBuses / scaledWeekdayDays;

    result[month] = {
      batteryEVs: {
        weekday: batteryEVsWeekday,
        weekend: batteryEVsWeekday * weekenedToWeekdayRatio,
      },
      hybridEVs: {
        weekday: hybridEVsWeekday,
        weekend: hybridEVsWeekday * weekenedToWeekdayRatio,
      },
      transitBuses: {
        weekday: transitBusesWeekday,
        weekend: transitBusesWeekday * weekenedToWeekdayRatio,
      },
      schoolBuses: {
        weekday: schoolBusesWeekday,
        weekend: schoolBusesWeekday * weekenedToWeekdayRatio,
      },
    };
  });

  return result;
}

/**
 * Monthly emission rates by vehicle type.
 *
 * Excel: "Table 6: Emission rates of various vehicle types" table in the
 * "Library" sheet (G255:R290).
 */
export function calculateMonthlyEmissionRates(options: {
  evDeploymentLocation: string;
  evModelYear: string;
  iceReplacementVehicle: string;
}) {
  const { evDeploymentLocation, evModelYear, iceReplacementVehicle } = options;

  const result: {
    [month: number]: {
      [vehicleType in GeneralVehicleType]: {
        [pollutant in Pollutant]: number;
      };
    };
  } = {};

  if (
    evDeploymentLocation === '' ||
    evModelYear === '' ||
    iceReplacementVehicle === ''
  ) {
    return result;
  }

  const locationIsRegion = evDeploymentLocation.startsWith('region-');
  const locationIsState = evDeploymentLocation.startsWith('state-');

  // NOTE: explicitly declaring the type with a type assertion because
  // TypeScript isn't able to infer types from large JSON files
  // (https://github.com/microsoft/TypeScript/issues/42761)
  (movesEmissionsRates as MovesData[]).forEach((data) => {
    const month = Number(data.month);

    result[month] ??= {
      cars: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 },
      trucks: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 },
      transitBusesDiesel: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 },
      transitBusesCNG: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 },
      transitBusesGasoline: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 }, // prettier-ignore
      schoolBuses: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 },
    };

    const vehicleType: GeneralVehicleType | null =
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
      const modelYearMatch =
        iceReplacementVehicle === 'new'
          ? data.modelYear === evModelYear
          : data.modelYear === 'Fleet Average';

      const conditionalYearMatch =
        iceReplacementVehicle === 'new'
          ? true //
          : data.year === evModelYear;

      const conditionalStateMatch = locationIsState
        ? data.state === evDeploymentLocation.replace('state-', '')
        : true;

      const locationFactor = locationIsRegion
        ? data.regionalWeight //
        : 1;

      if (modelYearMatch && conditionalYearMatch && conditionalStateMatch) {
        result[month][vehicleType].CO2 += data.CO2 * locationFactor;
        result[month][vehicleType].NOX += data.NOX * locationFactor;
        result[month][vehicleType].SO2 += data.SO2 * locationFactor;
        result[month][vehicleType].PM25 += data.PM25 * locationFactor;
        result[month][vehicleType].VOCs += data.VOCs * locationFactor;
        result[month][vehicleType].NH3 += data.NH3 * locationFactor;
      }
    }
  });

  return result;
}

/**
 * Monthly emission changes by EV type.
 *
 * Excel: Top half of the "Emission Changes" data from "Table 7: Calculated
 * changes for the transportation sector" table in the "Library" sheet
 * (G316:R336).
 */
export function calculateMonthlyEmissionChanges(options: {
  monthlyVMTPerVehicle: MonthlyVMTPerVehicle;
  vehiclesDisplaced: VehiclesDisplaced;
  monthlyEmissionRates: MonthlyEmissionRates;
}) {
  const { monthlyVMTPerVehicle, vehiclesDisplaced, monthlyEmissionRates } =
    options;

  const result: {
    [month: number]: {
      [vehicleType in ExpandedVehicleType]: {
        [pollutant in Pollutant]: number;
      };
    };
  } = {};

  if (
    Object.values(monthlyVMTPerVehicle).length === 0 ||
    Object.values(monthlyEmissionRates).length === 0
  ) {
    return result;
  }

  Object.entries(monthlyEmissionRates).forEach(([key, data]) => {
    const month = Number(key);

    result[month] ??= {
      batteryEVCars: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 },
      hybridEVCars: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 },
      batteryEVTrucks: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 },
      hybridEVTrucks: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 },
      transitBusesDiesel: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 },
      transitBusesCNG: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 },
      transitBusesGasoline: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 }, // prettier-ignore
      schoolBuses: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 },
    };

    pollutants.forEach((pollutant) => {
      result[month].batteryEVCars[pollutant] =
        data.cars[pollutant] *
        monthlyVMTPerVehicle[month].cars *
        vehiclesDisplaced.batteryEVCars;

      result[month].hybridEVCars[pollutant] =
        data.cars[pollutant] *
        monthlyVMTPerVehicle[month].cars *
        vehiclesDisplaced.hybridEVCars *
        (percentHybridEVMilesDrivenOnElectricity / 100);

      result[month].batteryEVTrucks[pollutant] =
        data.trucks[pollutant] *
        monthlyVMTPerVehicle[month].trucks *
        vehiclesDisplaced.batteryEVTrucks;

      result[month].hybridEVTrucks[pollutant] =
        data.trucks[pollutant] *
        monthlyVMTPerVehicle[month].trucks *
        vehiclesDisplaced.hybridEVTrucks *
        (percentHybridEVMilesDrivenOnElectricity / 100);

      result[month].transitBusesDiesel[pollutant] =
        data.transitBusesDiesel[pollutant] *
        monthlyVMTPerVehicle[month].transitBusesDiesel *
        vehiclesDisplaced.transitBusesDiesel;

      result[month].transitBusesCNG[pollutant] =
        data.transitBusesCNG[pollutant] *
        monthlyVMTPerVehicle[month].transitBusesCNG *
        vehiclesDisplaced.transitBusesCNG;

      result[month].transitBusesGasoline[pollutant] =
        data.transitBusesGasoline[pollutant] *
        monthlyVMTPerVehicle[month].transitBusesGasoline *
        vehiclesDisplaced.transitBusesGasoline;

      result[month].schoolBuses[pollutant] =
        data.schoolBuses[pollutant] *
        monthlyVMTPerVehicle[month].schoolBuses *
        vehiclesDisplaced.schoolBuses;
    });
  });

  return result;
}

/**
 * Totals monthly emission changes from each EV type.
 *
 * Excel: Bottom half of the "Emission Changes" data from "Table 7: Calculated
 * changes for the transportation sector" table in the "Library" sheet
 * (G336:R394).
 */
export function calculateTotalMonthlyEmissionChanges(
  monthlyEmissionChanges: MonthlyEmissionChanges,
) {
  if (Object.values(monthlyEmissionChanges).length === 0) {
    return {};
  }

  const result = Object.entries(monthlyEmissionChanges).reduce(
    (totals, [key, data]) => {
      const month = Number(key);

      totals[month] ??= {
        cars: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 },
        trucks: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 },
        transitBuses: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 },
        schoolBuses: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 },
        total: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 },
      };

      pollutants.forEach((pollutant) => {
        const monthlyCars =
          data.batteryEVCars[pollutant] + data.hybridEVCars[pollutant];
        const monthlyTrucks =
          data.batteryEVTrucks[pollutant] + data.hybridEVTrucks[pollutant];
        const monthlyTransitBuses =
          data.transitBusesDiesel[pollutant] +
          data.transitBusesCNG[pollutant] +
          data.transitBusesGasoline[pollutant];
        const monthlySchoolBuses = data.schoolBuses[pollutant];
        const monthlyTotal =
          monthlyCars +
          monthlyTrucks +
          monthlyTransitBuses +
          monthlySchoolBuses;

        totals[month].cars[pollutant] += monthlyCars;
        totals[month].trucks[pollutant] += monthlyTrucks;
        totals[month].transitBuses[pollutant] += monthlyTransitBuses;
        totals[month].schoolBuses[pollutant] += monthlySchoolBuses;
        totals[month].total[pollutant] += monthlyTotal;
      });

      return totals;
    },
    {} as {
      [month: number]: {
        [key in 'cars' | 'trucks' | 'transitBuses' | 'schoolBuses' | 'total']: {
          [pollutant in Pollutant]: number;
        };
      };
    },
  );

  return result;
}

/**
 * Totals the monthly emission changes from each vehicle type for all months in
 * the year to a single total emission changes value for the year for each
 * pollutant.
 *
 * Excel: Yearly pollutant totals from the "Table 7: Calculated changes for the
 * transportation sector" table in the "Library" sheet (S389:S394).
 */
export function calculateTotalYearlyEmissionChanges(
  totalMonthlyEmissionChanges: TotalMonthlyEmissionChanges,
) {
  if (Object.keys(totalMonthlyEmissionChanges).length === 0) {
    return { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 };
  }

  const result = Object.values(totalMonthlyEmissionChanges).reduce(
    (totals, month) => {
      pollutants.forEach((pollutant) => {
        totals[pollutant] += month.total[pollutant];
      });

      return totals;
    },
    { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 },
  );

  return result;
}

/**
 * Hourly EV load.
 *
 * Excel: Data in column Y of the "CalculateEERE" sheet.
 */
export function calculateHourlyEVLoad(options: {
  regionalLoadData: RegionalLoadData;
  dailyStats: DailyStats;
  hourlyEVChargingPercentages: HourlyEVChargingPercentages;
  monthlyDailyEVEnergyUsage: MonthlyDailyEVEnergyUsage;
}) {
  const {
    regionalLoadData,
    dailyStats,
    hourlyEVChargingPercentages,
    monthlyDailyEVEnergyUsage,
  } = options;
  if (
    !regionalLoadData.hour ||
    !regionalLoadData.day ||
    !regionalLoadData.month ||
    Object.keys(dailyStats).length === 0 ||
    Object.keys(hourlyEVChargingPercentages).length === 0 ||
    Object.keys(monthlyDailyEVEnergyUsage).length === 0
  ) {
    return 0;
  }

  // NOTE: `rdf.regional_load` data's hour value is zero indexed, so to match
  // it with the hours stored as keys in our `hourlyEVChargingPercentages`
  // object, we need to add 1 to the `rdf.regional_load` data's hour value
  const hour = regionalLoadData.hour + 1;
  const day = regionalLoadData.day;
  const month = regionalLoadData.month;

  const evChargingPercentage = hourlyEVChargingPercentages[hour];
  const dayTypeField = dailyStats[month][day].isWeekend ? 'weekend' : 'weekday';

  const evLoad =
    evChargingPercentage.batteryEVs[dayTypeField] *
      monthlyDailyEVEnergyUsage[month].batteryEVs[dayTypeField] +
    evChargingPercentage.hybridEVs[dayTypeField] *
      monthlyDailyEVEnergyUsage[month].hybridEVs[dayTypeField] +
    evChargingPercentage.transitBuses[dayTypeField] *
      monthlyDailyEVEnergyUsage[month].transitBuses[dayTypeField] +
    evChargingPercentage.schoolBuses[dayTypeField] *
      monthlyDailyEVEnergyUsage[month].schoolBuses[dayTypeField];

  return evLoad;
}

/**
 * Vehicle sales and stock for each state in the selected region, and the region
 * as a whole (sum of each state's sales and stock), for each vehicle type.
 *
 * Excel: "Table 9: List of states in region for purposes of calculating
 * vehicle sales and stock" table in the "Library" sheet (C440:I457).
 */
export function calculateVehicleSalesAndStock(options: {
  selectedRegionName: string;
  evDeploymentLocations: string[];
}) {
  const { selectedRegionName, evDeploymentLocations } = options;

  const result: {
    [locationId: string]: {
      lightDutyVehicles: { sales: number; stock: number };
      transitBuses: { sales: number; stock: number };
      schoolBuses: { sales: number; stock: number };
    };
  } = {};

  if (!selectedRegionName || evDeploymentLocations[0] === '') return result;

  // conditionally remove 'region-' option, as it will be added later as the sum
  // of each state's data
  const stateIds = evDeploymentLocations.reduce((ids, id) => {
    return id.startsWith('region-') ? ids : ids.concat(id);
  }, [] as string[]);

  countyFips.forEach((data) => {
    const id = data['Postal State Code'];
    const stateId = `state-${id}`;

    if (
      data['AVERT Region'] === selectedRegionName &&
      stateIds.includes(stateId)
    ) {
      const lightDutyVehiclesVMTShare = data['Share of State VMT - Passenger Cars']; // prettier-ignore
      const transitBusesVMTShare = data['Share of State VMT - Transit Buses'];
      const schoolBusesVMTShare = data['Share of State VMT - School Buses'];
      const salesAndStock = stateSalesAndStock[id as SalesAndStockStateId];

      // initialize and then increment state data by vehicle type
      result[stateId] ??= {
        lightDutyVehicles: { sales: 0, stock: 0 },
        transitBuses: { sales: 0, stock: 0 },
        schoolBuses: { sales: 0, stock: 0 },
      };

      result[stateId].lightDutyVehicles.sales +=
        lightDutyVehiclesVMTShare * salesAndStock.lightDutyVehicles.sales;
      result[stateId].lightDutyVehicles.stock +=
        lightDutyVehiclesVMTShare * salesAndStock.lightDutyVehicles.stock;
      result[stateId].transitBuses.sales +=
        transitBusesVMTShare * salesAndStock.transitBuses.sales;
      result[stateId].transitBuses.stock +=
        transitBusesVMTShare * salesAndStock.transitBuses.stock;
      result[stateId].schoolBuses.sales +=
        schoolBusesVMTShare * salesAndStock.schoolBuses.sales;
      result[stateId].schoolBuses.stock +=
        schoolBusesVMTShare * salesAndStock.schoolBuses.stock;
    }
  });

  // conditionally add 'region-' to result as the sum of each state's data
  const resultStateIds = Object.keys(result);
  const regionId = evDeploymentLocations.find((id) => id.startsWith('region-'));

  if (regionId) {
    result[regionId] = {
      lightDutyVehicles: { sales: 0, stock: 0 },
      transitBuses: { sales: 0, stock: 0 },
      schoolBuses: { sales: 0, stock: 0 },
    };

    resultStateIds.forEach((id) => {
      result[regionId].lightDutyVehicles.sales += result[id].lightDutyVehicles.sales; // prettier-ignore
      result[regionId].lightDutyVehicles.stock += result[id].lightDutyVehicles.stock; // prettier-ignore
      result[regionId].transitBuses.sales += result[id].transitBuses.sales;
      result[regionId].transitBuses.stock += result[id].transitBuses.stock;
      result[regionId].schoolBuses.sales += result[id].schoolBuses.sales;
      result[regionId].schoolBuses.stock += result[id].schoolBuses.stock;
    });
  }

  return result;
}

/**
 * Calculates averages of a selected region's hourly EERE Defaults for both
 * onshore wind and utility solar. These average RE values are used in setting
 * the historical RE data for Onshore Wind and Unitity Solar's GWh values in the
 * `EEREEVComparisonTable` component.
 *
 * Excel: Used in calculating values for cells F664 and G664 of the "Table 12:
 * Historical renewable and energy efficiency addition data" table in the
 * "Library" sheet.
 */
export function calculateRegionREDefaultsAverages(
  selectedRegionEEREDefaults: EEREDefaultData[],
) {
  const result = {
    onshore_wind: 0,
    utility_pv: 0,
  };

  if (selectedRegionEEREDefaults.length === 0) {
    return result;
  }

  const reDefaultsTotals = selectedRegionEEREDefaults.reduce(
    (total, hourlyEereDefault) => {
      total.onshore_wind += hourlyEereDefault.onshore_wind;
      total.utility_pv += hourlyEereDefault.utility_pv;
      return total;
    },
    { onshore_wind: 0, utility_pv: 0 },
  );

  const totalHours = selectedRegionEEREDefaults.length;

  result.onshore_wind = reDefaultsTotals.onshore_wind / totalHours;
  result.utility_pv = reDefaultsTotals.utility_pv / totalHours;

  return result;
}

/**
 * Historical EERE data for the EV deployment location (entire region or state).
 *
 * Excel: "Table 12: Historical renewable and energy efficiency addition data"
 * table in the "Library" sheet (C664:H664).
 */
export function calculateEVDeploymentLocationHistoricalEERE(options: {
  regionREDefaultsAverages: RegionREDefaultsAverages;
  evDeploymentLocation: string;
}) {
  const { regionREDefaultsAverages, evDeploymentLocation } = options;

  const result = {
    eeRetail: { mw: 0, gwh: 0 },
    onshoreWind: { mw: 0, gwh: 0 },
    utilitySolar: { mw: 0, gwh: 0 },
  };

  if (!evDeploymentLocation) {
    return result;
  }

  const locationIsRegion = evDeploymentLocation.startsWith('region-');
  const locationIsState = evDeploymentLocation.startsWith('state-');

  const fallbackAverage = {
    capacity_added_mw: { onshore_wind: 0, utility_pv: 0 },
    retail_impacts_ghw: { ee_retail: 0 },
  };

  const regionId = evDeploymentLocation.replace('region-', '') as RegionEereAveragesRegionId; // prettier-ignore
  const stateId = evDeploymentLocation.replace('state-', '') as RegionEereAveragesStateId; // prettier-ignore

  // averages for selected EV deployment location (region or state)
  const locationAverage = locationIsRegion
    ? regionEereAverages[regionId]
    : locationIsState
    ? stateEereAverages[stateId]
    : fallbackAverage;

  const hoursInYear = 8760;
  const GWtoMW = 1000;

  result.eeRetail.mw = (locationAverage.retail_impacts_ghw.ee_retail * GWtoMW) / hoursInYear; // prettier-ignore
  result.onshoreWind.mw = locationAverage.capacity_added_mw.onshore_wind;
  result.utilitySolar.mw = locationAverage.capacity_added_mw.utility_pv;
  result.eeRetail.gwh = locationAverage.retail_impacts_ghw.ee_retail;
  result.onshoreWind.gwh = regionREDefaultsAverages.onshore_wind * hoursInYear * result.onshoreWind.mw / GWtoMW // prettier-ignore
  result.utilitySolar.gwh = regionREDefaultsAverages.utility_pv * hoursInYear * result.utilitySolar.mw / GWtoMW; // prettier-ignore

  return result;
}
