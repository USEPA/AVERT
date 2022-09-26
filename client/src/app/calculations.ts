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
  vehicleMilesTraveledPerYear,
  evEfficiencyByModelYear,
  percentHybridEVMilesDrivenOnElectricity,
} from 'app/config';
// data
import evChargingProfiles from 'app/data/ev-charging-profiles-hourly-data.json';
import movesEmissionsRates from 'app/data/moves-emissions-rates.json';

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

/**
 * build up daily stats object by looping through every hour of the year,
 * (only creates objects and sets their keys in the first hour of each month)
 */
function createDailyStats(regionalLoad: RegionalLoadData[]) {
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

function createMonthlyStats(dailyStats: {
  [month: number]: {
    [day: number]: { _done: boolean; dayOfWeek: number; isWeekend: boolean };
  };
}) {
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
 * Vehicle miles traveled (VMT) totals for each month from MOVES data, and the
 * percentage/share of the yearly totals each month has, for each vehicle type.
 *
 * Excel: "Table 5: EV weather adjustments and monthly VMT adjustments" table
 * in the "Library" sheet (totals: E220:P225, percentages: E227:P232).
 */
function setMonthlyVMTTotalsAndPercentages() {
  const result: {
    [month: number]: {
      cars: { total: number; percent: number };
      trucks: { total: number; percent: number };
      transitBusesDiesel: { total: number; percent: number };
      transitBusesCNG: { total: number; percent: number };
      transitBusesGasoline: { total: number; percent: number };
      schoolBuses: { total: number; percent: number };
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
    if (data.year === '2020') {
      const month = Number(data.month);

      // initialize and then increment monthly vmts by vehicle type
      result[month] ??= {
        cars: { total: 0, percent: 0 },
        trucks: { total: 0, percent: 0 },
        transitBusesDiesel: { total: 0, percent: 0 },
        transitBusesCNG: { total: 0, percent: 0 },
        transitBusesGasoline: { total: 0, percent: 0 },
        schoolBuses: { total: 0, percent: 0 },
      };

      if (data.vehicleType === 'Passenger Car') {
        result[month].cars.total += data.VMT;
        yearlyTotals.cars += data.VMT;
      }

      if (data.vehicleType === 'Passenger Truck') {
        result[month].trucks.total += data.VMT;
        yearlyTotals.trucks += data.VMT;
      }

      if (data.vehicleType === 'Transit Bus' && data.fuelType === 'Diesel') {
        result[month].transitBusesDiesel.total += data.VMT;
        yearlyTotals.transitBusesDiesel += data.VMT;
      }

      if (data.vehicleType === 'Transit Bus' && data.fuelType === 'CNG') {
        result[month].transitBusesCNG.total += data.VMT;
        yearlyTotals.transitBusesCNG += data.VMT;
      }

      if (data.vehicleType === 'Transit Bus' && data.fuelType === 'Gasoline') {
        result[month].transitBusesGasoline.total += data.VMT;
        yearlyTotals.transitBusesGasoline += data.VMT;
      }

      if (data.vehicleType === 'School Bus') {
        result[month].schoolBuses.total += data.VMT;
        yearlyTotals.schoolBuses += data.VMT;
      }
    }
  });

  // prettier-ignore
  Object.values(result).forEach((data) => {
    data.cars.percent = data.cars.total / yearlyTotals.cars;
    data.trucks.percent = data.trucks.total / yearlyTotals.trucks;
    data.transitBusesDiesel.percent = data.transitBusesDiesel.total / yearlyTotals.transitBusesDiesel;
    data.transitBusesCNG.percent = data.transitBusesCNG.total / yearlyTotals.transitBusesCNG;
    data.transitBusesGasoline.percent = data.transitBusesGasoline.total / yearlyTotals.transitBusesGasoline;
    data.schoolBuses.percent = data.schoolBuses.total / yearlyTotals.schoolBuses;
  });

  return result;
      }

/**
 * Monthly vehicle miles traveled (VMT) for each vehicle type.
 *
 * Excel: "Table 5: EV weather adjustments and monthly VMT adjustments" table
 * in the "Library" sheet (E234:P239).
 */
function calculateMonthlyAdjustedVMT() {
  const result: {
    [month: number]: {
      cars: number;
      trucks: number;
      transitBusesDiesel: number;
      transitBusesCNG: number;
      transitBusesGasoline: number;
      schoolBuses: number;
    };
  } = {};

  // NOTE: we really only need percentages for each vehicle type
  // (totals were stored to calculate the percentages)
  const monthlyVMTTotalsAndPercentages = setMonthlyVMTTotalsAndPercentages();

  // prettier-ignore
  Object.entries(monthlyVMTTotalsAndPercentages).forEach(([month, data]) => {
    result[Number(month)] = {
      cars: vehicleMilesTraveledPerYear.cars * data.cars.percent,
      trucks: vehicleMilesTraveledPerYear.trucks * data.trucks.percent,
      transitBusesDiesel: vehicleMilesTraveledPerYear.transitBuses * data.transitBusesDiesel.percent,
      transitBusesCNG: vehicleMilesTraveledPerYear.transitBuses * data.transitBusesCNG.percent,
      transitBusesGasoline: vehicleMilesTraveledPerYear.transitBuses * data.transitBusesGasoline.percent,
      schoolBuses: vehicleMilesTraveledPerYear.schoolBuses * data.schoolBuses.percent,
    };
  });

  return result;
}

// TODO: is there a better name for this?
const monthlyAdjustedVMT = calculateMonthlyAdjustedVMT();

/**
 * Monthly sales changes in GWh.
 *
 * Excel: "Sales Changes" data from "Table 7: Calculated changes for the
 * transportation sector" table in the "Library" sheet (G298:R306).
 */
function calculateMonthlySalesChanges(options: {
  batteryEVs: number;
  hybridEVs: number;
  transitBuses: number;
  schoolBuses: number;
  evModelYear: string;
}) {
  const { batteryEVs, hybridEVs, transitBuses, schoolBuses, evModelYear } =
    options;

  const result: {
    [month: number]: {
      batteryEVCars: number;
      hybridEVCars: number;
      batteryEVTrucks: number;
      hybridEVTrucks: number;
      transitBusesDiesel: number;
      transitBusesCNG: number;
      transitBusesGasoline: number;
      schoolBuses: number;
    };
  } = {};

  /**
   * Number of vehicles displaced by new EVs.
   *
   * Excel: "Sales Changes" section of Table 7 in the "Library" sheet
   * (E299:E306), which uses "Part II. Vehicle Composition" table in the
   * "EV_Detail" sheet (L99:O104).
   */
  const vehiclesDisplaced = {
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

  /**
   * Efficiency factor for each vehicle type for the selected model year.
   *
   * Excel: "Table 5: EV weather adjustments and monthly VMT adjustments" table
   * in the "Library" sheet (E212:E217). NOTE: the Excel version duplicates
   * these values in the columns to the right for each month, but they're the
   * same value for all months.
   */
  const evEfficiency = evEfficiencyByModelYear[evModelYear as EVModelYear];

  // TODO: find out what this number represents (converting between units)?
  const unitConversionFactor = 0.000001;

  [...Array(12)].forEach((_item, index) => {
    const month = index + 1;

    result[month] = {
      batteryEVCars:
        vehiclesDisplaced.batteryEVCars *
        monthlyAdjustedVMT[month].cars *
        evEfficiency.batteryEVCars *
        unitConversionFactor,
      hybridEVCars:
        vehiclesDisplaced.hybridEVCars *
        monthlyAdjustedVMT[month].cars *
        evEfficiency.hybridEVCars *
        unitConversionFactor *
        (percentHybridEVMilesDrivenOnElectricity / 100),
      batteryEVTrucks:
        vehiclesDisplaced.batteryEVTrucks *
        monthlyAdjustedVMT[month].trucks *
        evEfficiency.batteryEVTrucks *
        unitConversionFactor,
      hybridEVTrucks:
        vehiclesDisplaced.hybridEVTrucks *
        monthlyAdjustedVMT[month].trucks *
        evEfficiency.batteryEVTrucks *
        unitConversionFactor *
        (percentHybridEVMilesDrivenOnElectricity / 100),
      transitBusesDiesel:
        vehiclesDisplaced.transitBusesDiesel *
        monthlyAdjustedVMT[month].transitBusesDiesel *
        evEfficiency.transitBuses *
        unitConversionFactor,
      transitBusesCNG:
        vehiclesDisplaced.transitBusesCNG *
        monthlyAdjustedVMT[month].transitBusesCNG *
        evEfficiency.transitBuses *
        unitConversionFactor,
      transitBusesGasoline:
        vehiclesDisplaced.transitBusesGasoline *
        monthlyAdjustedVMT[month].transitBusesGasoline *
        evEfficiency.transitBuses *
        unitConversionFactor,
      schoolBuses:
        vehiclesDisplaced.schoolBuses *
        monthlyAdjustedVMT[month].schoolBuses *
        evEfficiency.schoolBuses *
        unitConversionFactor,
    };
  });

  return result;
}

export function calculateEere({
  regionMaxEEPercent, // region.rdf.limits.max_ee_percent (15 for all RDFs)
  regionLineLoss, // region.lineLoss
  regionalLoad, // region.rdf.regional_load
  eereDefaults, // region.eereDefaults.data
  eereTextInputs, // eere.inputs (scaled for each region)
  eereSelectInputs, // eere.inputs
}: {
  regionMaxEEPercent: number;
  regionLineLoss: number;
  regionalLoad: RegionalLoadData[];
  eereDefaults: EereDefaultData[];
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
    // evDeploymentLocation,
    evModelYear,
    // iceReplacementVehicle,
  } = eereSelectInputs;

  const lineLoss = 1 / (1 - regionLineLoss);

  const hourlyMwReduction =
    ((annualGwh * 1000) / regionalLoad.length) * lineLoss;

  const percentReduction =
    ((-1 * (broadProgram || reduction)) / 100) * lineLoss;

  const hourlyLoads = regionalLoad.map((data) => data.regional_load_mw);

  const percentHours = broadProgram ? 100 : topHours;
  const topPercentile = stats.percentile(hourlyLoads, 1 - percentHours / 100);

  const hourlyEVChargingPercentagesByEVType = evChargingProfiles.map((data) => {
    return {
      hour: data.hour,
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

  const monthlySalesChanges = calculateMonthlySalesChanges({
    batteryEVs,
    hybridEVs,
    transitBuses,
    schoolBuses,
    evModelYear,
  });

  // build up exceedances (soft and hard) and hourly eere for each hour of the year
  const softLimitHourlyExceedances: number[] = [];
  const hardLimitHourlyExceedances: number[] = [];
  const hourlyEere: number[] = [];

  // build up daily stats object by looping through every hour of the year
  const dailyStats = createDailyStats(regionalLoad);
  const monthlyStats = createMonthlyStats(dailyStats);

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

    const evChargingPercentage = hourlyEVChargingPercentagesByEVType[data.hour];

    const isWeekend = dailyStats[data.month][data.day].isWeekend;

    const evLoad =
      evChargingPercentage.batteryEVs[isWeekend ? 'weekend' : 'weekday'] *
        0 /* TODO */ +
      evChargingPercentage.hybridEVs[isWeekend ? 'weekend' : 'weekday'] *
        0 /* TODO */ +
      evChargingPercentage.transitBuses[isWeekend ? 'weekend' : 'weekday'] *
        0 /* TODO */ +
      evChargingPercentage.schoolBuses[isWeekend ? 'weekend' : 'weekday'] *
        0; /* TODO */

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
