import { percentile } from 'stats-lite';
// ---
import type {
  RegionalLoadData,
  EEREDefaultData,
  RegionState,
} from 'app/redux/reducers/geography';
import type {
  DailyStats,
  HourlyEVChargingPercentages,
  SelectedRegionsMonthlyDailyEVEnergyUsage,
} from 'app/calculations/transportation';
import type { RegionId, RegionName } from 'app/config';
/**
 * EV hourly limits by region
 *
 * (NOTE: not in Excel file, but sent by Pat via email 02/21/23)
 */
import regionEvHourlyLimits from 'app/data/region-ev-hourly-limits.json';

export type HourlyRenewableEnergyProfiles = ReturnType<
  typeof calculateHourlyRenewableEnergyProfiles
>;
export type HourlyEVLoad = ReturnType<typeof calculateHourlyEVLoad>;
export type TopPercentGeneration = ReturnType<
  typeof calculateTopPercentGeneration
>;
export type HourlyTopPercentReduction = ReturnType<
  typeof calculateHourlyTopPercentReduction
>;
export type HourlyImpacts = ReturnType<typeof calculateHourlyImpacts>;
export type HourlyChangesValidation = ReturnType<
  typeof calculateHourlyChangesValidation
>;

/**
 * Excel: Data in columns I, J, and K of the "CalculateEERE" sheet (I5:K8788).
 *
 * NOTE: The Excel version actually combines onshore and offshore wind profiles
 * into one value (column I), but we're keeping them separate for consistency
 * with the two solar profiles.
 */
export function calculateHourlyRenewableEnergyProfiles(options: {
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
    return {
      onshoreWind: onshoreWindInput * data.onshore_wind,
      offshoreWind: offshoreWindInput * (data.offshore_wind || 0),
      utilitySolar: utilitySolarInput * data.utility_pv,
      rooftopSolar: (rooftopSolarInput * data.rooftop_pv) / (1 - lineLoss),
    };
  });

  return result;
}

/**
 * Excel: Data in column Y of the "CalculateEERE" sheet (Y5:Y8788).
 */
export function calculateHourlyEVLoad(options: {
  regionId: RegionId;
  regionalScalingFactor: number;
  regionalLoad: RegionalLoadData[];
  dailyStats: DailyStats;
  hourlyEVChargingPercentages: HourlyEVChargingPercentages;
  selectedRegionsMonthlyDailyEVEnergyUsage: SelectedRegionsMonthlyDailyEVEnergyUsage | {}; // prettier-ignore
}) {
  const {
    regionId,
    regionalScalingFactor,
    regionalLoad,
    dailyStats,
    hourlyEVChargingPercentages,
    selectedRegionsMonthlyDailyEVEnergyUsage,
  } = options;

  const selectedRegionsEnergyData =
    Object.keys(selectedRegionsMonthlyDailyEVEnergyUsage).length !== 0
      ? (selectedRegionsMonthlyDailyEVEnergyUsage as SelectedRegionsMonthlyDailyEVEnergyUsage)
      : null;

  const monthlyDailyEVEnergyUsage = selectedRegionsEnergyData?.[regionId];

  if (
    regionalLoad.length === 0 ||
    Object.keys(dailyStats).length === 0 ||
    Object.keys(hourlyEVChargingPercentages).length === 0 ||
    !monthlyDailyEVEnergyUsage
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

    return evLoad * regionalScalingFactor;
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

/**
 * Calculates regional hourly impacts of the entered energy impacts inputs.
 */
export function calculateHourlyImpacts(options: {
  lineLoss: number; // region.lineLoss
  regionalLoad: RegionalLoadData[]; // region.rdf.regional_load
  hourlyRenewableEnergyProfiles: HourlyRenewableEnergyProfiles;
  hourlyEVLoad: HourlyEVLoad;
  hourlyTopPercentReduction: HourlyTopPercentReduction;
  annualGwh: number; // impacts.inputs.annualGwh
  constantMwh: number; // impacts.inputs.annualGwh
}) {
  const {
    lineLoss,
    regionalLoad,
    hourlyRenewableEnergyProfiles,
    hourlyEVLoad,
    hourlyTopPercentReduction,
    annualGwh,
    constantMwh,
  } = options;

  const hourlyMwReduction = (annualGwh * 1_000) / regionalLoad.length;

  const result = regionalLoad.reduce(
    (object, data, index) => {
      const hour = data.hour_of_year;
      const originalLoad = data.regional_load_mw;

      const topPercentReduction = hourlyTopPercentReduction[index] || 0;

      const renewableEnergyProfiles = hourlyRenewableEnergyProfiles[index] || {}; // prettier-ignore
      const onshoreWind = renewableEnergyProfiles?.onshoreWind || 0;
      const offshoreWind = renewableEnergyProfiles?.offshoreWind || 0;
      const utilitySolar = renewableEnergyProfiles?.utilitySolar || 0;
      const rooftopSolar = renewableEnergyProfiles?.rooftopSolar || 0;

      const renewableProfile =
        -1 * (onshoreWind + offshoreWind + utilitySolar + rooftopSolar);

      const evLoad = hourlyEVLoad[index] || 0;

      /**
       * Excel: Data in column I of the "CalculateEERE" sheet (I5:I8788).
       */
      const impactsLoad =
        (topPercentReduction - hourlyMwReduction - constantMwh + evLoad) /
          (1 - lineLoss) +
        renewableProfile;

      const percentChange = (impactsLoad / originalLoad) * 100;

      object[hour] = {
        originalLoad,
        impactsLoad,
        percentChange,
      };

      return object;
    },
    {} as {
      [hour: number]: {
        originalLoad: number;
        impactsLoad: number;
        percentChange: number;
      };
    },
  );

  return result;
}

/**
 * Determines if the regional hourly changes exceeds the upper or lower limits:
 * - upper limit error: at least one hourly total > the region's hourly EV limit
 * - lower limit warning: at least one hourly change < 15%
 * - lower limit error: at least one hourly change < 30%
 */
export function calculateHourlyChangesValidation(options: {
  regions: { [regionId in RegionId]: RegionState };
  regionalHourlyImpacts: Partial<{
    [key in RegionId]: {
      regionalLoad: RegionalLoadData[];
      hourlyImpacts: HourlyImpacts;
    };
  }>;
}) {
  const { regions, regionalHourlyImpacts } = options;

  type ExceedanceData = {
    regionId: RegionId;
    regionName: RegionName;
    regionHourlyLimit: number;
    hourOfYear: number;
    month: number;
    day: number;
    hour: number;
    originalLoad: number;
    impactsLoad: number;
    percentChange: number;
    postImpactsLoad: number;
  };

  const result = {
    upperError: null,
    lowerWarning: null,
    lowerError: null,
  } as {
    upperError: null | ExceedanceData;
    lowerWarning: null | ExceedanceData;
    lowerError: null | ExceedanceData;
  };

  Object.entries(regionalHourlyImpacts).forEach(([regionKey, regionValue]) => {
    const regionId = regionKey as keyof typeof regionalHourlyImpacts;
    const { regionalLoad, hourlyImpacts } = regionValue;

    const regionName = Object.entries(regions).find(([_, region]) => {
      return region.id === regionId;
    })?.[1].name as RegionName | undefined;

    const regionHourlyLimit = regionEvHourlyLimits[regionId];

    if (regionName && regionHourlyLimit) {
      Object.entries(hourlyImpacts).forEach(([hourKey, hourValue]) => {
        const hourOfYear = Number(hourKey);
        const { originalLoad, impactsLoad, percentChange } = hourValue;
        const { month, day, hour } = regionalLoad[hourOfYear - 1];

        const postImpactsLoad = originalLoad + impactsLoad;

        const hourlyExceedance = {
          regionId,
          regionName,
          regionHourlyLimit,
          hourOfYear,
          month,
          day,
          hour,
          originalLoad,
          impactsLoad,
          percentChange,
          postImpactsLoad,
        };

        if (postImpactsLoad > regionHourlyLimit) {
          result.upperError ??= hourlyExceedance;

          if (postImpactsLoad > result.upperError.postImpactsLoad) {
            result.upperError = hourlyExceedance;
          }
        }

        if (percentChange < -15 && percentChange >= -30) {
          result.lowerWarning ??= hourlyExceedance;

          if (percentChange < result.lowerWarning.percentChange) {
            result.lowerWarning = hourlyExceedance;
          }
        }

        if (percentChange < -30) {
          result.lowerError ??= hourlyExceedance;

          if (percentChange < result.lowerError.percentChange) {
            result.lowerError = hourlyExceedance;
          }
        }
      });
    }
  });

  return result;
}
