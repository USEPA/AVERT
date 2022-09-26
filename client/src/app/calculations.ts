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
  percentHybridEVMilesDrivenOnElectricity,
  vehicleMilesTraveledPerYear,
  evEfficiencyByModelYear,
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
 * build up yearly stats object by looping through every hour of the year,
 * (only creates objects and sets their keys in the first hour of each month)
 */
function createYearlyStats(regionalLoad: RegionalLoadData[]) {
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
 * build up total monthly vehicles miles traveled (VMT) by vehicle type, and
 * percentage/share of VMT by month
 */
function sumMonthlyVMT() {
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

  const totals = {
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
        totals.cars += data.VMT;
      }

      if (data.vehicleType === 'Passenger Truck') {
        result[month].trucks.total += data.VMT;
        totals.trucks += data.VMT;
      }

      if (data.vehicleType === 'Transit Bus' && data.fuelType === 'Diesel') {
        result[month].transitBusesDiesel.total += data.VMT;
        totals.transitBusesDiesel += data.VMT;
      }

      if (data.vehicleType === 'Transit Bus' && data.fuelType === 'CNG') {
        result[month].transitBusesCNG.total += data.VMT;
        totals.transitBusesCNG += data.VMT;
      }

      if (data.vehicleType === 'Transit Bus' && data.fuelType === 'Gasoline') {
        result[month].transitBusesGasoline.total += data.VMT;
        totals.transitBusesGasoline += data.VMT;
      }

      if (data.vehicleType === 'School Bus') {
        result[month].schoolBuses.total += data.VMT;
        totals.schoolBuses += data.VMT;
      }
    }
  });

  // prettier-ignore
  Object.values(result).forEach((data) => {
    data.cars.percent = data.cars.total / totals.cars;
    data.trucks.percent = data.trucks.total / totals.trucks;
    data.transitBusesDiesel.percent = data.transitBusesDiesel.total / totals.transitBusesDiesel;
    data.transitBusesCNG.percent = data.transitBusesCNG.total / totals.transitBusesCNG;
    data.transitBusesGasoline.percent = data.transitBusesGasoline.total / totals.transitBusesGasoline;
    data.schoolBuses.percent = data.schoolBuses.total / totals.schoolBuses;
  });

  return result;
      }

/**
 * calculate monthly adjusted VMT via vehicle miles traveled per year and
 * percentage of miles traveled each month
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

  const totalVMTByMonth = sumMonthlyVMT();

  // prettier-ignore
  Object.entries(totalVMTByMonth).forEach(([month, data]) => {
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

const monthlyAdjustedVMT = calculateMonthlyAdjustedVMT();

/**
 * TODO
 */
function calculateSalesChanges(options: {
  batteryEVs: number;
  hybridEVs: number;
  transitBuses: number;
  schoolBuses: number;
  evModelYear: string;
}) {
  const { batteryEVs, hybridEVs, transitBuses, schoolBuses, evModelYear } =
    options;

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

  const evEfficiency = evEfficiencyByModelYear[evModelYear as EVModelYear];

  return [...Array(12)].map((_item, index) => {
    const month = index + 1;
    return {
      batteryEVCars:
        vehiclesDisplaced.batteryEVCars *
        monthlyAdjustedVMT[month].cars *
        evEfficiency.batteryEVCars *
        0.00001,
      hybridEVCars:
        vehiclesDisplaced.hybridEVCars *
        monthlyAdjustedVMT[month].cars *
        evEfficiency.hybridEVCars *
        0.00001 *
        (percentHybridEVMilesDrivenOnElectricity / 100),
      batteryEVTrucks:
        vehiclesDisplaced.batteryEVTrucks *
        monthlyAdjustedVMT[month].trucks *
        evEfficiency.batteryEVTrucks *
        0.00001,
      hybridEVTrucks:
        vehiclesDisplaced.hybridEVTrucks *
        monthlyAdjustedVMT[month].trucks *
        evEfficiency.batteryEVTrucks *
        0.00001 *
        (percentHybridEVMilesDrivenOnElectricity / 100),
      transitBusesDiesel:
        vehiclesDisplaced.transitBusesDiesel *
        monthlyAdjustedVMT[month].transitBusesDiesel *
        evEfficiency.transitBuses *
        0.00001,
      transitBusesCNG:
        vehiclesDisplaced.transitBusesCNG *
        monthlyAdjustedVMT[month].transitBusesCNG *
        evEfficiency.transitBuses *
        0.00001,
      transitBusesGasoline:
        vehiclesDisplaced.transitBusesGasoline *
        monthlyAdjustedVMT[month].transitBusesGasoline *
        evEfficiency.transitBuses *
        0.00001,
      schoolBuses:
        vehiclesDisplaced.schoolBuses *
        monthlyAdjustedVMT[month].schoolBuses *
        evEfficiency.schoolBuses *
        0.00001,
    };
  });
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

  const salesChanges = calculateSalesChanges({
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

  // build up yearly stats object by looping through every hour of the year
  const yearlyStats = createYearlyStats(regionalLoad);

  regionalLoad.forEach((data, index) => {
    const isWeekend = yearlyStats[data.month][data.day].isWeekend;
    const daysInMonth = Object.keys(yearlyStats[data.month]).length;
    const weekendDaysInMonth = Object.values(yearlyStats[data.month]).reduce(
      (total, day) => (day.isWeekend ? ++total : total),
      0,
    );
    const weekdayDaysInMonth = daysInMonth - weekendDaysInMonth;

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
