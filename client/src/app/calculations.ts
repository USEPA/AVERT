import stats from 'stats-lite';
// reducers
import {
  RegionalLoadData,
  EereDefaultData,
} from 'app/redux/reducers/geography';
import { EereTextInputFieldName } from 'app/redux/reducers/eere';
// calculations
import type {
  DailyStats,
  HourlyEVChargingPercentages,
  MonthlyEVEnergyUsageGW,
  MonthlyDailyEVEnergyUsage,
  MonthlyEmissionChanges,
} from 'app/calculations/transportation';

const pollutants = ['CO2', 'NOX', 'SO2', 'PM25', 'VOCs', 'NH3'] as const;

type Pollutant = typeof pollutants[number];

/**
 * Totals the energy usage from each EV type for all months in the year to a
 * single total EV energy usage value for the year.
 */
export function calculateTotalYearlyEVEnergyUsage(
  monthlyEVEnergyUsageGW: MonthlyEVEnergyUsageGW,
) {
  const result = Object.values(monthlyEVEnergyUsageGW).reduce(
    (total, month) => total + Object.values(month).reduce((a, b) => a + b, 0),
    0,
  );

  return result;
}

/**
 * Totals monthly emission changes from each EV type.
 *
 * Excel: Bottom half of the "Emission Changes" data from "Table 7: Calculated
 * changes for the transportation sector" table in the "Library" sheet
 * (G336:R394).
 */
function calculateTotalMonthlyEmissionChanges(
  monthlyEmissionChanges: MonthlyEmissionChanges,
) {
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
 * Hourly EV load.
 *
 * Excel: Data in column Y of the "CalculateEERE" sheet.
 */
function calculateHourlyEVLoad(options: {
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
  hourlyEVChargingPercentages, // transportation.hourlyEVChargingPercentages
  monthlyDailyEVEnergyUsage, // transportation.monthlyDailyEVEnergyUsage
  monthlyEmissionChanges, // transportation.monthlyEmissionChanges
  eereTextInputs, // eere.inputs (scaled for each region)
}: {
  regionMaxEEPercent: number;
  regionLineLoss: number;
  regionalLoad: RegionalLoadData[];
  eereDefaults: EereDefaultData[];
  dailyStats: DailyStats;
  hourlyEVChargingPercentages: HourlyEVChargingPercentages;
  monthlyDailyEVEnergyUsage: MonthlyDailyEVEnergyUsage;
  monthlyEmissionChanges: MonthlyEmissionChanges;
  eereTextInputs: { [field in EereTextInputFieldName]: number };
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
  } = eereTextInputs;

  const lineLoss = 1 / (1 - regionLineLoss);

  const hourlyMwReduction =
    ((annualGwh * 1000) / regionalLoad.length) * lineLoss;

  const percentReduction =
    ((-1 * (broadProgram || reduction)) / 100) * lineLoss;

  const hourlyLoads = regionalLoad.map((data) => data.regional_load_mw);

  const percentHours = broadProgram ? 100 : topHours;
  const topPercentile = stats.percentile(hourlyLoads, 1 - percentHours / 100);

  const totalMonthlyEmissionChanges = calculateTotalMonthlyEmissionChanges(
    monthlyEmissionChanges,
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
