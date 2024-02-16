import { percentile } from 'stats-lite';
// ---
import type {
  RegionalLoadData,
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
export type HourlyEnergyStorageData = ReturnType<
  typeof calculateHourlyEnergyStorageData
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
  eereDefaults: RegionState['eereDefaults']['data'];
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
      utilitySolarUnpaired: utilitySolarInput * data.utility_pv,
      rooftopSolarUnpaired: (rooftopSolarInput * data.rooftop_pv) / (1 - lineLoss), // prettier-ignore
    };
  });

  return result;
}

/**
 * Returns hourly energy storage data
 *
 * Excel: Data from the "Utility Scale" and "Distributed" tables in the
 * "CalculateEERE" sheet (columns indicated in comments below).
 */
export function calculateHourlyEnergyStorageData(options: {
  storageDefaults: RegionState['storageDefaults']['data'];
  utilityStorage: number;
  rooftopStorage: number;
  hourlyRenewableEnergyProfiles: HourlyRenewableEnergyProfiles;
  batteryRoundTripEfficiency: number;
  batteryStorageDuration: number;
}) {
  const {
    storageDefaults,
    utilityStorage,
    rooftopStorage,
    hourlyRenewableEnergyProfiles,
    batteryRoundTripEfficiency,
    batteryStorageDuration,
  } = options;

  /* built up charging and discharging needed for each day of the year */
  const dailyData = [] as {
    date: string;
    chargingNeeded: { utility: number; rooftop: number };
    dischargingNeeded: { utility: number; rooftop: number };
    availableSolar: { utility: number; rooftop: number };
  }[];

  const result = storageDefaults.reduce(
    (array, hourlyData, hourlyIndex) => {
      const { date, hour, battery } = hourlyData;

      const previousHourData = array[array.length - 1];

      const esProfileUnpaired = {
        utility: battery * utilityStorage,
        rooftop: battery * rooftopStorage,
      };

      const hourlyProfiles = hourlyRenewableEnergyProfiles[hourlyIndex];

      const solarUnpaired = {
        utility: -hourlyProfiles.utilitySolarUnpaired + 0,
        rooftop: -hourlyProfiles.rooftopSolarUnpaired + 0,
      };

      const dailyIndex = Math.floor(hourlyIndex / 24);
      const dayOfYear = dailyIndex + 1;

      /* initialize data for each day of the year */
      if (!dailyData[dailyIndex]) {
        dailyData[dailyIndex] = {
          date,
          chargingNeeded: { utility: 0, rooftop: 0 },
          dischargingNeeded: { utility: 0, rooftop: 0 },
          availableSolar: { utility: 0, rooftop: 0 },
        };
      }

      /* build up daily data, based on ES Profile's hourly value */
      if (esProfileUnpaired.utility > 0) {
        dailyData[dailyIndex].chargingNeeded.utility += esProfileUnpaired.utility; // prettier-ignore
        dailyData[dailyIndex].availableSolar.utility += solarUnpaired.utility;
      }

      if (esProfileUnpaired.rooftop > 0) {
        dailyData[dailyIndex].chargingNeeded.rooftop += esProfileUnpaired.rooftop; // prettier-ignore
        dailyData[dailyIndex].availableSolar.rooftop += solarUnpaired.rooftop;
      }

      if (esProfileUnpaired.utility < 0) {
        dailyData[dailyIndex].dischargingNeeded.utility += esProfileUnpaired.utility; // prettier-ignore
      }

      if (esProfileUnpaired.rooftop < 0) {
        dailyData[dailyIndex].dischargingNeeded.rooftop += esProfileUnpaired.rooftop; // prettier-ignore
      }

      /* initialize data for each hour of the year */
      array.push({
        /* column B */ date,
        /* column F */ dayOfYear,
        /* column _ */ hourOfYear: hour,
        esProfileUnpaired: {
          /* column AK */ utility: esProfileUnpaired.utility,
          /* column AX */ rooftop: esProfileUnpaired.rooftop,
        },
        solarUnpaired: {
          /* column AL */ utility: solarUnpaired.utility,
          /* column AY */ rooftop: solarUnpaired.rooftop,
        },
        dailyChargingNeeded: {
          /* column AM */ utility: 0,
          /* column AZ */ rooftop: 0,
        },
        dailyDischargingNeeded: {
          /* column AN */ utility: 0,
          /* column BA */ rooftop: 0,
        },
        dailyAvailableSolar: {
          /* column AO */ utility: 0,
          /* column BB */ rooftop: 0,
        },
        dailyAllowableCharging: {
          /* column AP */ utility: 0,
          /* column BC */ rooftop: 0,
        },
        dailyAllowableDischarging: {
          /* column AQ */ utility: 0,
          /* column BD */ rooftop: 0,
        },
        /* column AR */ overloadedHourUtilitySolar: false,
        /* column BE */ overloadedHourRooftopSolar: false,
        /* column AS */ overloadedDayUtilitySolar: false,
        /* column BF */ overloadedDayRooftopSolar: false,
        /* column AT */ dailyCumulativeAvailableUtilitySolarCharge: 0,
        /* column BG */ dailyCumulativeAvailableRooftopSolarCharge: 0,
        /* column AU */ dailyMaxAllowableUtilitySolarCharge: 0,
        /* column BH */ dailyMaxAllowableRooftopSolarCharge: 0,
        /* column AV */ esProfilePairedUtilitySolar: 0,
        /* column BI */ esProfilePairedRooftopSolar: 0,
      });

      const finalHourOfYear = hourlyIndex === storageDefaults.length - 1;

      /*
       * NOTE: If on the final hour (and therefore final day) of the year, or as
       * soon as the day of the year changes (e.g., the previous hour is in the
       * day before), loop backwards through the built-up array and accumulate
       * values from the previous day of the year.
       */
      if (finalHourOfYear || previousHourData?.dayOfYear === dayOfYear - 1) {
        /*
         * NOTE: overloaded day values will be possibly re-defined in the first
         * loop, and then assigned in the second loop
         */
        let overloadedDayUtilitySolar = false;
        let overloadedDayRooftopSolar = false;

        /** NOTE: will be set in the first loop */
        let indexOfFirstHourOfDay = 0;

        /**
         * NOTE: If on the final hour of the year (which means final day of the
         * year), the index would be the current day's last hour (which is the
         * last item in the array). Otherwise, the index would be the previous
         * day's last hour.
         */
        const indexOfLastHourOfDay = finalHourOfYear
          ? array.length - 1
          : array.length - 2;

        /*
         * NOTE: loop backwards through the built-up array, starting at either
         * the last item (if on the final day of the year) or the item just
         * before the last one (because the last item is part of the next day
         * of the year)
         */
        for (let i = indexOfLastHourOfDay; i >= 0; i--) {
          const previousDay = finalHourOfYear ? dayOfYear - 1 : dayOfYear - 2;
          /*
           * NOTE: break out of loop once the day of year changes again
           * (ensures we don't go back too far since we're looping backwards)
           */
          if (array[i].dayOfYear === previousDay) {
            /*
             * NOTE: store the index of the first hour of the day (to be used as
             * the starting index for the second loop)
             */
            indexOfFirstHourOfDay = i + 1;
            break;
          }

          const daily = dailyData[dailyIndex - 1];

          array[i].dailyChargingNeeded.utility = daily.chargingNeeded.utility;
          array[i].dailyChargingNeeded.rooftop = daily.chargingNeeded.rooftop;

          array[i].dailyDischargingNeeded.utility = daily.dischargingNeeded.utility; // prettier-ignore
          array[i].dailyDischargingNeeded.rooftop = daily.dischargingNeeded.rooftop; // prettier-ignore

          array[i].dailyAvailableSolar.utility = daily.availableSolar.utility;
          array[i].dailyAvailableSolar.rooftop = daily.availableSolar.rooftop;

          const allowableChargingUtility = Math.min(
            -daily.availableSolar.utility + 0,
            daily.chargingNeeded.utility,
          );

          const allowableChargingRooftop = Math.min(
            -daily.availableSolar.rooftop + 0,
            daily.chargingNeeded.rooftop,
          );

          array[i].dailyAllowableCharging.utility = allowableChargingUtility;
          array[i].dailyAllowableCharging.rooftop = allowableChargingRooftop;

          const allowableDischargingUtility =
            (-allowableChargingUtility + 0) * batteryRoundTripEfficiency;

          const allowableDischargingRooftop =
            (-allowableChargingRooftop + 0) * batteryRoundTripEfficiency;

          array[i].dailyAllowableDischarging.utility = allowableDischargingUtility; // prettier-ignore
          array[i].dailyAllowableDischarging.rooftop = allowableDischargingRooftop; // prettier-ignore

          const overloadedHourUtilitySolar =
            array[i].esProfileUnpaired.utility > 0 &&
            daily.chargingNeeded.utility < -daily.availableSolar.utility &&
            array[i].esProfileUnpaired.utility >
              -array[i].solarUnpaired.utility;

          const overloadedHourRooftopSolar =
            array[i].esProfileUnpaired.rooftop > 0 &&
            daily.chargingNeeded.rooftop < -daily.availableSolar.rooftop &&
            array[i].esProfileUnpaired.rooftop >
              -array[i].solarUnpaired.rooftop;

          array[i].overloadedHourUtilitySolar = overloadedHourUtilitySolar;
          array[i].overloadedHourRooftopSolar = overloadedHourRooftopSolar;

          /*
           * NOTE: set overloadedDay values flag to true if any hour of the day
           * is overloaded (to be used in the second loop)
           */
          if (overloadedHourUtilitySolar) overloadedDayUtilitySolar = true;
          if (overloadedHourRooftopSolar) overloadedDayRooftopSolar = true;
        }

        /*
         * NOTE: loop a second time, this time forwards through the built-up
         * array, starting with the first hour of the day and ending with the
         * item just before the last one (because the last item is part of the
         * next day of the year)
         */
        for (let i = indexOfFirstHourOfDay; i <= indexOfLastHourOfDay; i++) {
          array[i].overloadedDayUtilitySolar = overloadedDayUtilitySolar;
          array[i].overloadedDayRooftopSolar = overloadedDayRooftopSolar;

          const cumulativeAvailableUtilityCharge = overloadedDayUtilitySolar
            ? array[i].esProfileUnpaired.utility <= 0
              ? 0
              : -array[i].solarUnpaired.utility +
                array[i - 1].dailyCumulativeAvailableUtilitySolarCharge
            : 0;

          const cumulativeAvailableRooftopCharge = overloadedDayRooftopSolar
            ? array[i].esProfileUnpaired.rooftop <= 0
              ? 0
              : -array[i].solarUnpaired.rooftop +
                array[i - 1].dailyCumulativeAvailableRooftopSolarCharge
            : 0;

          array[i].dailyCumulativeAvailableUtilitySolarCharge = cumulativeAvailableUtilityCharge; // prettier-ignore
          array[i].dailyCumulativeAvailableRooftopSolarCharge = cumulativeAvailableRooftopCharge; // prettier-ignore

          const maxAllowableUtilityCharge =
            cumulativeAvailableUtilityCharge === 0
              ? 0
              : cumulativeAvailableUtilityCharge <
                array[i].dailyAllowableCharging.utility
              ? -array[i].solarUnpaired.utility
              : array[i].dailyAllowableCharging.utility -
                array[i - 1].dailyCumulativeAvailableUtilitySolarCharge;

          const maxAllowableRooftopCharge =
            cumulativeAvailableRooftopCharge === 0
              ? 0
              : cumulativeAvailableRooftopCharge <
                array[i].dailyAllowableCharging.rooftop
              ? -array[i].solarUnpaired.rooftop
              : array[i].dailyAllowableCharging.rooftop -
                array[i - 1].dailyCumulativeAvailableRooftopSolarCharge;

          array[i].dailyMaxAllowableUtilitySolarCharge = maxAllowableUtilityCharge; // prettier-ignore
          array[i].dailyMaxAllowableRooftopSolarCharge = maxAllowableRooftopCharge; // prettier-ignore

          const esProfilePairedUtilitySolar =
            array[i].esProfileUnpaired.utility === 0
              ? 0
              : array[i].esProfileUnpaired.utility < 0
              ? array[i].dailyAllowableDischarging.utility /
                batteryStorageDuration
              : overloadedDayUtilitySolar
              ? array[i].dailyMaxAllowableUtilitySolarCharge
              : array[i].dailyChargingNeeded.utility >
                array[i].dailyAllowableCharging.utility
              ? -array[i].solarUnpaired.utility
              : array[i].esProfileUnpaired.utility;

          const esProfilePairedRooftopSolar =
            array[i].esProfileUnpaired.rooftop === 0
              ? 0
              : array[i].esProfileUnpaired.rooftop < 0
              ? array[i].dailyAllowableDischarging.rooftop /
                batteryStorageDuration
              : overloadedDayRooftopSolar
              ? array[i].dailyMaxAllowableRooftopSolarCharge
              : array[i].dailyChargingNeeded.rooftop >
                array[i].dailyAllowableCharging.rooftop
              ? -array[i].solarUnpaired.rooftop
              : array[i].esProfileUnpaired.rooftop;

          array[i].esProfilePairedUtilitySolar = esProfilePairedUtilitySolar;
          array[i].esProfilePairedRooftopSolar = esProfilePairedRooftopSolar;
        }
      }

      return array;
    },
    [] as {
      date: string;
      dayOfYear: number;
      hourOfYear: number;
      esProfileUnpaired: { utility: number; rooftop: number };
      solarUnpaired: { utility: number; rooftop: number };
      dailyChargingNeeded: { utility: number; rooftop: number };
      dailyDischargingNeeded: { utility: number; rooftop: number };
      dailyAvailableSolar: { utility: number; rooftop: number };
      dailyAllowableCharging: { utility: number; rooftop: number };
      dailyAllowableDischarging: { utility: number; rooftop: number };
      overloadedHourUtilitySolar: boolean;
      overloadedHourRooftopSolar: boolean;
      overloadedDayUtilitySolar: boolean;
      overloadedDayRooftopSolar: boolean;
      dailyCumulativeAvailableUtilitySolarCharge: number;
      dailyCumulativeAvailableRooftopSolarCharge: number;
      dailyMaxAllowableUtilitySolarCharge: number;
      dailyMaxAllowableRooftopSolarCharge: number;
      esProfilePairedUtilitySolar: number;
      esProfilePairedRooftopSolar: number;
    }[],
  );

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
      const utilitySolar = renewableEnergyProfiles?.utilitySolarUnpaired || 0;
      const rooftopSolar = renewableEnergyProfiles?.rooftopSolarUnpaired || 0;

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
