import { percentile } from 'stats-lite';
// ---
import type {
  RegionalLoadData,
  EEREDefaultData,
} from 'app/redux/reducers/geography';
import type {
  DailyStats,
  HourlyEVChargingPercentages,
  MonthlyDailyEVEnergyUsage,
} from 'app/calculations/transportation';

export type HourlyRenewableEnergyProfile = ReturnType<
  typeof calculateHourlyRenewableEnergyProfile
>;
export type HourlyEVLoad = ReturnType<typeof calculateHourlyEVLoad>;
export type TopPercentGeneration = ReturnType<
  typeof calculateTopPercentGeneration
>;

/**
 * Excel: Data in column H of the "CalculateEERE" sheet (H5:H8788).
 */
export function calculateHourlyRenewableEnergyProfile(options: {
  eereDefaults: EEREDefaultData[];
  lineLoss: number;
  onshoreWind: number;
  offshoreWind: number;
  utilitySolar: number;
  rooftopSolar: number;
}) {
  const {
    eereDefaults,
    lineLoss,
    onshoreWind: onshoreWindInput,
    offshoreWind: offshoreWindInput,
    utilitySolar: utilitySolarInput,
    rooftopSolar: rooftopSolarInput,
  } = options;

  if (eereDefaults.length === 0) return [];

  const result = eereDefaults.map((data) => {
    const onshoreWind = onshoreWindInput * data.onshore_wind;
    const offshoreWind = offshoreWindInput * (data.offshore_wind || 0);
    const utilitySolar = utilitySolarInput * data.utility_pv;
    const rooftopSolar = (rooftopSolarInput * data.rooftop_pv) / (1 - lineLoss);

    return -1 * (onshoreWind + offshoreWind + utilitySolar + rooftopSolar);
  });

  return result;
}

/**
 * Excel: Data in column Y of the "CalculateEERE" sheet (Y5:Y8788).
 */
export function calculateHourlyEVLoad(options: {
  regionalLoad: RegionalLoadData[];
  dailyStats: DailyStats;
  hourlyEVChargingPercentages: HourlyEVChargingPercentages;
  monthlyDailyEVEnergyUsage: MonthlyDailyEVEnergyUsage;
}) {
  const {
    regionalLoad,
    dailyStats,
    hourlyEVChargingPercentages,
    monthlyDailyEVEnergyUsage,
  } = options;

  if (
    regionalLoad.length === 0 ||
    Object.keys(dailyStats).length === 0 ||
    Object.keys(hourlyEVChargingPercentages).length === 0 ||
    Object.keys(monthlyDailyEVEnergyUsage).length === 0
  ) {
    return [];
  }

  const result = regionalLoad.map((data) => {
    if (
      !data.hasOwnProperty('hour') &&
      !data.hasOwnProperty('day') &&
      !data.hasOwnProperty('month')
    ) {
      return 0;
    }

    // NOTE: `regionalLoad` data's hour value is zero indexed, so to match it
    // with the hours stored as keys in `hourlyEVChargingPercentages`, we need
    // to add 1 to `regionalLoad` data's hour value
    const hour = data.hour + 1;
    const day = data.day;
    const month = data.month;

    const evChargingPercentage = hourlyEVChargingPercentages[hour];
    const dayTypeField = dailyStats[month][day].isWeekend
      ? 'weekend'
      : 'weekday';

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
  });

  return result;
}

/**
 * Excel: "CalculateEERE" sheet (N9).
 */
export function calculateTopPercentGeneration(options: {
  regionalLoad: RegionalLoadData[];
  broadProgram: number;
  topHours: number;
}) {
  const { regionalLoad, broadProgram, topHours } = options;

  if (regionalLoad.length === 0) return 0;

  const hourlyLoads = regionalLoad.map((data) => data.regional_load_mw);
  const percentHours = broadProgram ? 100 : topHours;

  return percentile(hourlyLoads, 1 - percentHours / 100);
}

/**
 *
 * Excel: Used to calculate data in column I of "CalculateEERE" sheet
 *
 * NOTE: The result is not broken out into its own cell, but the relevant part
 * of the formula is below (using row 5 as an example):
 *
 * `IF(Data!F4>=TopPrctGen,Data!F4*-$N$10,0)`
 */
export function calculateHourlyTopPercentReduction(options: {
  regionalLoad: RegionalLoadData[];
  topPercentGeneration: TopPercentGeneration;
  broadProgram: number;
  reduction: number;
}) {
  const { regionalLoad, topPercentGeneration, broadProgram, reduction } =
    options;

  if (regionalLoad.length === 0) return [];

  const result = regionalLoad.map((data) => {
    const hourlyLoad = data.regional_load_mw;
    const percentReduction = (broadProgram || reduction) / 100;

    return hourlyLoad >= topPercentGeneration
      ? hourlyLoad * -1 * percentReduction
      : 0;
  });

  return result;
}
