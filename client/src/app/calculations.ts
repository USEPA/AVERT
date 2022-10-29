import stats from 'stats-lite';
// reducers
import {
  RegionalLoadData,
  EereDefaultData,
} from 'app/redux/reducers/geography';
import {
  EereTextInputFieldName,
  EereSelectInputFieldName,
} from 'app/redux/reducers/eere';
// config
import {
  EvProfileName,
  EVModelYear,
  percentVehiclesDisplacedByEVs,
  averageVMTPerYear,
  evEfficiencyByModelYear,
  percentHybridEVMilesDrivenOnElectricity,
  percentWeekendToWeekdayEVConsumption,
} from 'app/config';
// calculations
import type { DailyStats, MonthlyStats } from 'app/calculations/transportation';
/**
 * Excel: "Table B1. View charging profiles or set a manual charging profile for
 * Weekdays" table in the "EV_Detail" sheet (C25:H49), which comes from "Table
 * 8: Default EV load profiles" table in the "Library" sheet).
 */
import evChargingProfiles from 'app/data/ev-charging-profiles-hourly-data.json';
/**
 * Excel: "MOVESEmissionRates" sheet.
 */
import movesEmissionsRates from 'app/data/moves-emissions-rates.json';

const pollutants = ['CO2', 'NOX', 'SO2', 'PM25', 'VOCs', 'NH3'] as const;

type Pollutant = typeof pollutants[number];

type EVTypes =
  | 'batteryEVCars'
  | 'hybridEVCars'
  | 'batteryEVTrucks'
  | 'hybridEVTrucks'
  | 'transitBusesDiesel'
  | 'transitBusesCNG'
  | 'transitBusesGasoline'
  | 'schoolBuses';

type VehicleType =
  | 'cars'
  | 'trucks'
  | 'transitBusesDiesel'
  | 'transitBusesCNG'
  | 'transitBusesGasoline'
  | 'schoolBuses';

/**
 * Vehicle miles traveled (VMT) totals for each month from MOVES data, and the
 * percentage/share of the yearly totals each month has, for each vehicle type.
 *
 * Excel: "Table 5: EV weather adjustments and monthly VMT adjustments" table
 * in the "Library" sheet (totals: E220:P225, percentages: E227:P232).
 */
function setMonthlyVMTTotalsAndPercentagesByVehicleType() {
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

  movesEmissionsRates.forEach((data) => {
    const { vehicleType, fuelType } = data;
    const month = Number(data.month);

    if (data.year === '2020') {
      // initialize and then increment monthly vmts by vehicle type
      result[month] ??= {
        cars: { total: 0, percent: 0 },
        trucks: { total: 0, percent: 0 },
        transitBusesDiesel: { total: 0, percent: 0 },
        transitBusesCNG: { total: 0, percent: 0 },
        transitBusesGasoline: { total: 0, percent: 0 },
        schoolBuses: { total: 0, percent: 0 },
      };

      const vehicle =
        vehicleType === 'Passenger Car'
          ? 'cars'
          : vehicleType === 'Passenger Truck'
          ? 'trucks'
          : vehicleType === 'Transit Bus' && fuelType === 'Diesel'
          ? 'transitBusesDiesel'
          : vehicleType === 'Transit Bus' && fuelType === 'CNG'
          ? 'transitBusesCNG'
          : vehicleType === 'Transit Bus' && fuelType === 'Gasoline'
          ? 'transitBusesGasoline'
          : vehicleType === 'School Bus'
          ? 'schoolBuses'
          : null; // NOTE: fallback (vehicle should never be null)

      if (vehicle) {
        result[month][vehicle].total += data.VMT;
        yearlyTotals[vehicle] += data.VMT;
      }
    }
  });

  // prettier-ignore
  Object.values(result).forEach((month) => {
    month.cars.percent = month.cars.total / yearlyTotals.cars;
    month.trucks.percent = month.trucks.total / yearlyTotals.trucks;
    month.transitBusesDiesel.percent = month.transitBusesDiesel.total / yearlyTotals.transitBusesDiesel;
    month.transitBusesCNG.percent = month.transitBusesCNG.total / yearlyTotals.transitBusesCNG;
    month.transitBusesGasoline.percent = month.transitBusesGasoline.total / yearlyTotals.transitBusesGasoline;
    month.schoolBuses.percent = month.schoolBuses.total / yearlyTotals.schoolBuses;
  });

  return result;
}

/**
 * Monthly vehicle miles traveled (VMT) for each vehicle type.
 *
 * Excel: "Table 5: EV weather adjustments and monthly VMT adjustments" table
 * in the "Library" sheet (E234:P239).
 */
export function calculateMonthlyVMTByVehicleType() {
  const result: {
    [month: number]: {
      [vehicleType in VehicleType]: number;
    };
  } = {};

  // NOTE: we really only need percentages for each vehicle type
  // (totals were stored to calculate the percentages)
  const monthlyVMTTotalsAndPercentagesByVehicleType =
    setMonthlyVMTTotalsAndPercentagesByVehicleType();

  Object.entries(monthlyVMTTotalsAndPercentagesByVehicleType).forEach(
    ([key, data]) => {
      const month = Number(key);

      /* prettier-ignore */
      result[month] = {
        cars: averageVMTPerYear.cars * data.cars.percent,
        trucks: averageVMTPerYear.trucks * data.trucks.percent,
        transitBusesDiesel: averageVMTPerYear.transitBuses * data.transitBusesDiesel.percent,
        transitBusesCNG: averageVMTPerYear.transitBuses * data.transitBusesCNG.percent,
        transitBusesGasoline: averageVMTPerYear.transitBuses * data.transitBusesGasoline.percent,
        schoolBuses: averageVMTPerYear.schoolBuses * data.schoolBuses.percent,
      };
    },
  );

  return result;
}

const monthlyVMTByVehicleType = calculateMonthlyVMTByVehicleType();

/**
 * Excel: Data in the first EV table (to the right of the "Calculate Changes"
 * table) in the "CalculateEERE" sheet (P8:X32).
 */
function createHourlyEVChargingPercentages(options: {
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
        weekday: data[batteryEVsProfile as EvProfileName].weekday,
        weekend: data[batteryEVsProfile as EvProfileName].weekend,
      },
      hybridEVs: {
        weekday: data[hybridEVsProfile as EvProfileName].weekday,
        weekend: data[hybridEVsProfile as EvProfileName].weekend,
      },
      transitBuses: {
        weekday: data[transitBusesProfile as EvProfileName].weekday,
        weekend: data[transitBusesProfile as EvProfileName].weekend,
      },
      schoolBuses: {
        weekday: data[schoolBusesProfile as EvProfileName].weekday,
        weekend: data[schoolBusesProfile as EvProfileName].weekend,
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
export function calculateMonthlyEVEnergyUsageByType(options: {
  monthlyVMTByVehicleType: {
    [month: number]: {
      [vehicleType in VehicleType]: number;
    };
  };
  vehiclesDisplaced: {
    [evType in EVTypes]: number;
  };
  evModelYear: string;
}) {
  const { monthlyVMTByVehicleType, vehiclesDisplaced, evModelYear } = options;

  const result: {
    [month: number]: {
      [evType in EVTypes]: number;
    };
  } = {};

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
        monthlyVMTByVehicleType[month].cars *
        evEfficiency.batteryEVCars *
        kWtoGW,
      hybridEVCars:
        vehiclesDisplaced.hybridEVCars *
        monthlyVMTByVehicleType[month].cars *
        evEfficiency.hybridEVCars *
        kWtoGW *
        (percentHybridEVMilesDrivenOnElectricity / 100),
      batteryEVTrucks:
        vehiclesDisplaced.batteryEVTrucks *
        monthlyVMTByVehicleType[month].trucks *
        evEfficiency.batteryEVTrucks *
        kWtoGW,
      hybridEVTrucks:
        vehiclesDisplaced.hybridEVTrucks *
        monthlyVMTByVehicleType[month].trucks *
        evEfficiency.batteryEVTrucks *
        kWtoGW *
        (percentHybridEVMilesDrivenOnElectricity / 100),
      transitBusesDiesel:
        vehiclesDisplaced.transitBusesDiesel *
        monthlyVMTByVehicleType[month].transitBusesDiesel *
        evEfficiency.transitBuses *
        kWtoGW,
      transitBusesCNG:
        vehiclesDisplaced.transitBusesCNG *
        monthlyVMTByVehicleType[month].transitBusesCNG *
        evEfficiency.transitBuses *
        kWtoGW,
      transitBusesGasoline:
        vehiclesDisplaced.transitBusesGasoline *
        monthlyVMTByVehicleType[month].transitBusesGasoline *
        evEfficiency.transitBuses *
        kWtoGW,
      schoolBuses:
        vehiclesDisplaced.schoolBuses *
        monthlyVMTByVehicleType[month].schoolBuses *
        evEfficiency.schoolBuses *
        kWtoGW,
    };
  });

  return result;
}

/**
 * Totals the energy usage from each EV type for all months in the year to a
 * single total EV energy usage value for the year.
 */
export function calculateTotalYearlyEVEnergyUsage(monthlyEVEnergyUsageByType: {
  [month: number]: {
    [evType in EVTypes]: number;
  };
}) {
  const result = Object.values(monthlyEVEnergyUsageByType).reduce(
    (total, month) => total + Object.values(month).reduce((a, b) => a + b, 0),
    0,
  );

  return result;
}

/**
 * Monthly emission rates by vehicle type.
 *
 * Excel: "Table 6: Emission rates of various vehicle types" table in the
 * "Library" sheet (G255:R290).
 */
export function calculateMonthlyEmissionRatesByType(options: {
  evDeploymentLocation: string;
  evModelYear: string;
  iceReplacementVehicle: string;
}) {
  const { evDeploymentLocation, evModelYear, iceReplacementVehicle } = options;

  const result: {
    [month: number]: {
      [vehicleType in VehicleType]: {
        [pollutant in Pollutant]: number;
      };
    };
  } = {};

  const locationIsRegion = evDeploymentLocation.startsWith('region-');
  const locationIsState = evDeploymentLocation.startsWith('state-');

  movesEmissionsRates.forEach((data) => {
    const { vehicleType, fuelType } = data;
    const month = Number(data.month);

    result[month] ??= {
      cars: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 },
      trucks: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 },
      transitBusesDiesel: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 },
      transitBusesCNG: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 },
      transitBusesGasoline: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 }, // prettier-ignore
      schoolBuses: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 },
    };

    const vehicle =
      vehicleType === 'Passenger Car'
        ? 'cars'
        : vehicleType === 'Passenger Truck'
        ? 'trucks'
        : vehicleType === 'Transit Bus' && fuelType === 'Diesel'
        ? 'transitBusesDiesel'
        : vehicleType === 'Transit Bus' && fuelType === 'CNG'
        ? 'transitBusesCNG'
        : vehicleType === 'Transit Bus' && fuelType === 'Gasoline'
        ? 'transitBusesGasoline'
        : vehicleType === 'School Bus'
        ? 'schoolBuses'
        : null; // NOTE: fallback (vehicle should never be null)

    if (vehicle) {
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
        result[month][vehicle].CO2 += data.CO2 * locationFactor;
        result[month][vehicle].NOX += data.NOX * locationFactor;
        result[month][vehicle].SO2 += data.SO2 * locationFactor;
        result[month][vehicle].PM25 += data.PM25 * locationFactor;
        result[month][vehicle].VOCs += data.VOCs * locationFactor;
        result[month][vehicle].NH3 += data.NH3 * locationFactor;
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
function calculateMonthlyEmissionChangesByEVType(options: {
  monthlyVMTByVehicleType: {
    [month: number]: {
      [vehicleType in VehicleType]: number;
    };
  };
  vehiclesDisplaced: {
    [evType in EVTypes]: number;
  };
  monthlyEmissionRates: {
    [month: number]: {
      [vehicleType in VehicleType]: {
        [pollutant in Pollutant]: number;
      };
    };
  };
}) {
  const { monthlyVMTByVehicleType, vehiclesDisplaced, monthlyEmissionRates } =
    options;

  const result: {
    [month: number]: {
      [evType in EVTypes]: {
        [pollutant in Pollutant]: number;
      };
    };
  } = {};

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
        monthlyVMTByVehicleType[month].cars *
        vehiclesDisplaced.batteryEVCars;

      result[month].hybridEVCars[pollutant] =
        data.cars[pollutant] *
        monthlyVMTByVehicleType[month].cars *
        vehiclesDisplaced.hybridEVCars *
        (percentHybridEVMilesDrivenOnElectricity / 100);

      result[month].batteryEVTrucks[pollutant] =
        data.trucks[pollutant] *
        monthlyVMTByVehicleType[month].trucks *
        vehiclesDisplaced.batteryEVTrucks;

      result[month].hybridEVTrucks[pollutant] =
        data.trucks[pollutant] *
        monthlyVMTByVehicleType[month].trucks *
        vehiclesDisplaced.hybridEVTrucks *
        (percentHybridEVMilesDrivenOnElectricity / 100);

      result[month].transitBusesDiesel[pollutant] =
        data.transitBusesDiesel[pollutant] *
        monthlyVMTByVehicleType[month].transitBusesDiesel *
        vehiclesDisplaced.transitBusesDiesel;

      result[month].transitBusesCNG[pollutant] =
        data.transitBusesCNG[pollutant] *
        monthlyVMTByVehicleType[month].transitBusesCNG *
        vehiclesDisplaced.transitBusesCNG;

      result[month].transitBusesGasoline[pollutant] =
        data.transitBusesGasoline[pollutant] *
        monthlyVMTByVehicleType[month].transitBusesGasoline *
        vehiclesDisplaced.transitBusesGasoline;

      result[month].schoolBuses[pollutant] =
        data.schoolBuses[pollutant] *
        monthlyVMTByVehicleType[month].schoolBuses *
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
function calculateTotalMonthlyEmissionChanges(monthlyEmissionChangesByEVType: {
  [month: number]: {
    [evType in EVTypes]: {
      [pollutant in Pollutant]: number;
    };
  };
}) {
  const result = Object.entries(monthlyEmissionChangesByEVType).reduce(
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
function calculateTotalYearlyEmissionChanges(totalMonthlyEmissionChanges: {
  [month: number]: {
    [key in 'cars' | 'trucks' | 'transitBuses' | 'schoolBuses' | 'total']: {
      [pollutant in Pollutant]: number;
    };
  };
}) {
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
 * Monthly EV energy usage (total for each month) in MW, combined into the four
 * AVERT EV input types.
 *
 * Excel: Data in the third EV table (to the right of the "Calculate Changes"
 * table) in the "CalculateEERE" sheet (T49:W61).
 */
function combineMonthlyEVEnergyUsage(monthlyEVEnergyUsageByType: {
  [month: number]: {
    [evType in EVTypes]: number;
  };
}) {
  const result: {
    [month: number]: {
      batteryEVs: number;
      hybridEVs: number;
      transitBuses: number;
      schoolBuses: number;
    };
  } = {};

  const GWtoMW = 1000;

  Object.entries(monthlyEVEnergyUsageByType).forEach(([key, data]) => {
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
 * Monthly EV energy usage (MWh) for a typical weekday day or weekend day.
 *
 * Excel: Data in the second EV table (to the right of the "Calculate Changes"
 * table) in the "CalculateEERE" sheet (P35:X47).
 */
function calculateMonthlyDailyEVEnergyUsage(options: {
  monthlyEVEnergyUsage: {
    [month: number]: {
      batteryEVs: number;
      hybridEVs: number;
      transitBuses: number;
      schoolBuses: number;
    };
  };
  monthlyStats: MonthlyStats;
}) {
  const { monthlyEVEnergyUsage, monthlyStats } = options;

  const result: {
    [month: number]: {
      batteryEVs: { weekday: number; weekend: number };
      hybridEVs: { weekday: number; weekend: number };
      transitBuses: { weekday: number; weekend: number };
      schoolBuses: { weekday: number; weekend: number };
    };
  } = {};

  [...Array(12)].forEach((_item, index) => {
    const month = index + 1;

    const weekdayDays = monthlyStats[month].weekdayDays;
    const weekendDays = monthlyStats[month].weekendDays;
    const weekenedToWeekdayRatio = percentWeekendToWeekdayEVConsumption / 100;
    const scaledWeekdayDays =
      weekdayDays + weekenedToWeekdayRatio * weekendDays;

    const batteryEVsWeekday =
      monthlyEVEnergyUsage[month].batteryEVs / scaledWeekdayDays;

    const hybridEVsWeekday =
      monthlyEVEnergyUsage[month].hybridEVs / scaledWeekdayDays;

    const transitBusesWeekday =
      monthlyEVEnergyUsage[month].transitBuses / scaledWeekdayDays;

    const schoolBusesWeekday =
      monthlyEVEnergyUsage[month].schoolBuses / scaledWeekdayDays;

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
 * Hourly EV load.
 *
 * Excel: Data in column Y of the "CalculateEERE" sheet.
 */
function calculateHourlyEVLoad(options: {
  regionalLoadData: RegionalLoadData;
  dailyStats: DailyStats;
  hourlyEVChargingPercentages: {
    [hour: number]: {
      batteryEVs: { weekday: number; weekend: number };
      hybridEVs: { weekday: number; weekend: number };
      transitBuses: { weekday: number; weekend: number };
      schoolBuses: { weekday: number; weekend: number };
    };
  };
  monthlyDailyEVEnergyUsage: {
    [month: number]: {
      batteryEVs: { weekday: number; weekend: number };
      hybridEVs: { weekday: number; weekend: number };
      transitBuses: { weekday: number; weekend: number };
      schoolBuses: { weekday: number; weekend: number };
    };
  };
}) {
  const {
    regionalLoadData,
    dailyStats,
    hourlyEVChargingPercentages,
    monthlyDailyEVEnergyUsage,
  } = options;

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
 * TODO...
 */
function calculateHourlyExceedance(
  calculatedLoad: number,
  softOrHardLimit: number,
  amount: 15 | 30,
) {
  const load = Math.abs(calculatedLoad);
  const limit = Math.abs(softOrHardLimit);
  if (load > limit) {
    const exceedance = load / limit - 1;
    return exceedance * amount + amount;
  }
  return 0;
}

export function calculateEere({
  regionMaxEEPercent, // region.rdf.limits.max_ee_percent (15 for all RDFs)
  regionLineLoss, // region.lineLoss
  regionalLoad, // region.rdf.regional_load
  eereDefaults, // region.eereDefaults.data
  dailyStats, // transportation.dailyStats
  monthlyStats, // transportation.monthlyStats
  eereTextInputs, // eere.inputs (scaled for each region)
  eereSelectInputs, // eere.inputs
}: {
  regionMaxEEPercent: number;
  regionLineLoss: number;
  regionalLoad: RegionalLoadData[];
  eereDefaults: EereDefaultData[];
  dailyStats: DailyStats;
  monthlyStats: MonthlyStats;
  eereTextInputs: { [field in EereTextInputFieldName]: number };
  eereSelectInputs: { [field in EereSelectInputFieldName]: string };
}) {
  const {
    // A: Reductions spread evenly throughout the year
    annualGwh,
    constantMwh,
    // B: Percentage reductions in some or all hours
    broadProgram,
    reduction,
    topHours,
    // C: Wind
    onshoreWind,
    offshoreWind,
    // D: Solar photovoltaic
    utilitySolar,
    rooftopSolar,
    // E: Electric Vehicles
    batteryEVs,
    hybridEVs,
    transitBuses,
    schoolBuses,
  } = eereTextInputs;

  const {
    // E: Electric Vehicles
    batteryEVsProfile,
    hybridEVsProfile,
    transitBusesProfile,
    schoolBusesProfile,
    evModelYear,
    evDeploymentLocation,
    iceReplacementVehicle,
  } = eereSelectInputs;

  const lineLoss = 1 / (1 - regionLineLoss);

  const hourlyMwReduction =
    ((annualGwh * 1000) / regionalLoad.length) * lineLoss;

  const percentReduction =
    ((-1 * (broadProgram || reduction)) / 100) * lineLoss;

  const hourlyLoads = regionalLoad.map((data) => data.regional_load_mw);

  const percentHours = broadProgram ? 100 : topHours;
  const topPercentile = stats.percentile(hourlyLoads, 1 - percentHours / 100);

  const hourlyEVChargingPercentages = createHourlyEVChargingPercentages({
    batteryEVsProfile,
    hybridEVsProfile,
    transitBusesProfile,
    schoolBusesProfile,
  });

  const vehiclesDisplaced = calculateVehiclesDisplaced({
    batteryEVs,
    hybridEVs,
    transitBuses,
    schoolBuses,
  });

  const monthlyEVEnergyUsageByType = calculateMonthlyEVEnergyUsageByType({
    monthlyVMTByVehicleType,
    vehiclesDisplaced,
    evModelYear,
  });

  const monthlyEVEnergyUsage = combineMonthlyEVEnergyUsage(
    monthlyEVEnergyUsageByType,
  );

  const monthlyDailyEVEnergyUsage = calculateMonthlyDailyEVEnergyUsage({
    monthlyEVEnergyUsage,
    monthlyStats,
  });

  // TODO: recalculate EERE profile whenever any of the inputs change
  const monthlyEmissionRates = calculateMonthlyEmissionRatesByType({
    evDeploymentLocation,
    evModelYear,
    iceReplacementVehicle,
  });

  const monthlyEmissionChangesByEVType =
    calculateMonthlyEmissionChangesByEVType({
      monthlyVMTByVehicleType,
      vehiclesDisplaced,
      monthlyEmissionRates,
    });

  const totalMonthlyEmissionChanges = calculateTotalMonthlyEmissionChanges(
    monthlyEmissionChangesByEVType,
  );

  const totalYearlyEmissionChanges = calculateTotalYearlyEmissionChanges(
    totalMonthlyEmissionChanges,
  );

  // build up exceedances (soft and hard) and hourly eere for each hour of the year
  const softLimitHourlyExceedances: number[] = [];
  const hardLimitHourlyExceedances: number[] = [];
  const hourlyEere: number[] = [];

  regionalLoad.forEach((data, index) => {
    const hourlyLoad = data.regional_load_mw;

    const initialLoad =
      hourlyLoad >= topPercentile ? hourlyLoad * percentReduction : 0;

    const hourlyDefault = eereDefaults[index];

    const renewableProfile =
      onshoreWind * hourlyDefault.onshore_wind +
      offshoreWind * (hourlyDefault.offshore_wind || 0) +
      utilitySolar * hourlyDefault.utility_pv +
      rooftopSolar * hourlyDefault.rooftop_pv * lineLoss;

    const evLoad = calculateHourlyEVLoad({
      regionalLoadData: data,
      dailyStats,
      hourlyEVChargingPercentages,
      monthlyDailyEVEnergyUsage,
    });

    const calculatedLoad =
      initialLoad -
      constantMwh * lineLoss -
      hourlyMwReduction -
      renewableProfile +
      evLoad;

    const softLimitHourlyExceedance = calculateHourlyExceedance(
      calculatedLoad,
      (hourlyLoad * -1 * regionMaxEEPercent) / 100,
      15,
    );

    const hardLimitHourlyExceedance = calculateHourlyExceedance(
      calculatedLoad,
      hourlyLoad * -0.3,
      30,
    );

    softLimitHourlyExceedances[index] = softLimitHourlyExceedance;
    hardLimitHourlyExceedances[index] = hardLimitHourlyExceedance;
    hourlyEere[index] = calculatedLoad;
  });

  // calculate soft and hard exceedances to determine the hour that exceeded
  // the soft and hard limits
  const softValid = softLimitHourlyExceedances.reduce((a, b) => a + b) === 0;
  const softTopExceedanceValue = Math.max(...softLimitHourlyExceedances);
  const softTopExceedanceIndex = !softValid
    ? softLimitHourlyExceedances.indexOf(softTopExceedanceValue)
    : -1;

  const hardValid = hardLimitHourlyExceedances.reduce((a, b) => a + b) === 0;
  const hardTopExceedanceValue = Math.max(...hardLimitHourlyExceedances);
  const hardTopExceedanceIndex = !hardValid
    ? hardLimitHourlyExceedances.indexOf(hardTopExceedanceValue)
    : -1;

  return {
    hourlyEere,
    softValid,
    softTopExceedanceValue,
    softTopExceedanceIndex,
    hardValid,
    hardTopExceedanceValue,
    hardTopExceedanceIndex,
  };
}
