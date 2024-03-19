import { percentile } from "stats-lite";
// ---
import type {
  RegionalLoadData,
  RegionState,
} from "@/app/redux/reducers/geography";
import type {
  DailyStats,
  HourlyEVChargingPercentages,
  SelectedRegionsMonthlyDailyEVEnergyUsage,
} from "@/app/calculations/transportation";
import { type EmptyObject } from "@/app/utilities";
import type { RegionId, RegionName } from "@/app/config";
/**
 * EV hourly limits by region
 *
 * (NOTE: not in Excel file, but sent by Pat via email 02/21/23)
 */
import regionEvHourlyLimits from "@/app/data/region-ev-hourly-limits.json";

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
  eereDefaults: RegionState["eereDefaults"]["data"];
  onshoreWind: number;
  offshoreWind: number;
  utilitySolar: number;
  rooftopSolar: number;
}) {
  const {
    eereDefaults,
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
      rooftopSolar: rooftopSolarInput * data.rooftop_pv,
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
  storageDefaults: RegionState["storageDefaults"]["data"];
  utilityStorage: number;
  rooftopStorage: number;
  maxAnnualDischargeCycles: number;
  hourlyRenewableEnergyProfiles: HourlyRenewableEnergyProfiles;
  batteryRoundTripEfficiency: number;
  batteryStorageDuration: number;
}) {
  const {
    storageDefaults,
    utilityStorage,
    rooftopStorage,
    maxAnnualDischargeCycles,
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
      const { date, hour, battery_75, battery_100, battery_150 } = hourlyData;

      const battery =
        maxAnnualDischargeCycles === 75
          ? battery_75
          : maxAnnualDischargeCycles === 100
            ? battery_100
            : maxAnnualDischargeCycles === 150
              ? battery_150
              : 0;

      const previousHourData = array[array.length - 1];

      const esProfileUnpaired = {
        utility: battery * utilityStorage,
        rooftop: battery * rooftopStorage,
      };

      const hourlyProfiles = hourlyRenewableEnergyProfiles[hourlyIndex];

      const solarUnpaired = {
        utility: -hourlyProfiles.utilitySolar + 0,
        rooftop: -hourlyProfiles.rooftopSolar + 0,
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
        /* column C */ hourOfDay: hour % 24 || 24,
        hourOfYear: hour,
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
        overloadedHour: {
          /* column AR */ utility: false,
          /* column BE */ rooftop: false,
        },
        overloadedDay: {
          /* column AS */ utility: false,
          /* column BF */ rooftop: false,
        },
        dailyCumulativeAvailableCharge: {
          /* column AT */ utility: 0,
          /* column BG */ rooftop: 0,
        },
        dailyMaxAllowableCharge: {
          /* column AU */ utility: 0,
          /* column BH */ rooftop: 0,
        },
        esProfilePaired: {
          /* column AV */ utility: 0,
          /* column BI */ rooftop: 0,
        },
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
        const overloadedDay = { utility: false, rooftop: false };

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
         * before the last one (because in that case, the last item is part of
         * the next day of the year)
         */
        for (let i = indexOfLastHourOfDay; i >= 0; i--) {
          const item = array[i];

          const previousDay = finalHourOfYear ? dayOfYear - 1 : dayOfYear - 2;
          /*
           * NOTE: break out of loop once the day of year changes again
           * (ensures we don't go back too far since we're looping backwards)
           */
          if (item.dayOfYear === previousDay) {
            /*
             * NOTE: store the index of the first hour of the day (to be used as
             * the starting index for the second loop)
             */
            indexOfFirstHourOfDay = i + 1;
            break;
          }

          const daily = dailyData[dailyIndex - 1];

          item.dailyChargingNeeded.utility = daily.chargingNeeded.utility;
          item.dailyChargingNeeded.rooftop = daily.chargingNeeded.rooftop;

          item.dailyDischargingNeeded.utility = daily.dischargingNeeded.utility;
          item.dailyDischargingNeeded.rooftop = daily.dischargingNeeded.rooftop;

          item.dailyAvailableSolar.utility = daily.availableSolar.utility;
          item.dailyAvailableSolar.rooftop = daily.availableSolar.rooftop;

          const dailyAllowableChargingUtility = Math.min(
            -daily.availableSolar.utility + 0,
            daily.chargingNeeded.utility,
          );

          const dailyAllowableChargingRooftop = Math.min(
            -daily.availableSolar.rooftop + 0,
            daily.chargingNeeded.rooftop,
          );

          item.dailyAllowableCharging.utility = dailyAllowableChargingUtility;
          item.dailyAllowableCharging.rooftop = dailyAllowableChargingRooftop;

          const dailyAllowableDischargingUtility =
            (-dailyAllowableChargingUtility + 0) * batteryRoundTripEfficiency;

          const dailyAllowableDischargingRooftop =
            (-dailyAllowableChargingRooftop + 0) * batteryRoundTripEfficiency;

          item.dailyAllowableDischarging.utility = dailyAllowableDischargingUtility; // prettier-ignore
          item.dailyAllowableDischarging.rooftop = dailyAllowableDischargingRooftop; // prettier-ignore

          const overloadedHourUtility =
            item.esProfileUnpaired.utility > 0 &&
            daily.chargingNeeded.utility < -daily.availableSolar.utility &&
            item.esProfileUnpaired.utility > -item.solarUnpaired.utility;

          const overloadedHourRooftop =
            item.esProfileUnpaired.rooftop > 0 &&
            daily.chargingNeeded.rooftop < -daily.availableSolar.rooftop &&
            item.esProfileUnpaired.rooftop > -item.solarUnpaired.rooftop;

          item.overloadedHour.utility = overloadedHourUtility;
          item.overloadedHour.rooftop = overloadedHourRooftop;

          /*
           * NOTE: set overloadedDay values flag to true if any hour of the day
           * is overloaded (to be used in the second loop)
           */
          if (overloadedHourUtility) overloadedDay.utility = true;
          if (overloadedHourRooftop) overloadedDay.rooftop = true;
        }

        /*
         * NOTE: loop a second time, this time forwards through the built-up
         * array, starting with the first hour of the day and ending with either
         * the last item (if on the final day of the year) or the item just
         * before the last one (because in that case, the last item is part of
         * the next day of the year)
         */
        for (let i = indexOfFirstHourOfDay; i <= indexOfLastHourOfDay; i++) {
          const item = array[i];
          const previousItem = array[i - 1];

          item.overloadedDay.utility = overloadedDay.utility;
          item.overloadedDay.rooftop = overloadedDay.rooftop;

          const dailyCumulativeAvailableChargeUtility = overloadedDay.utility
            ? item.esProfileUnpaired.utility <= 0
              ? 0
              : -item.solarUnpaired.utility +
                previousItem.dailyCumulativeAvailableCharge.utility
            : 0;

          const dailyCumulativeAvailableChargeRooftop = overloadedDay.rooftop
            ? item.esProfileUnpaired.rooftop <= 0
              ? 0
              : -item.solarUnpaired.rooftop +
                previousItem.dailyCumulativeAvailableCharge.rooftop
            : 0;

          item.dailyCumulativeAvailableCharge.utility = dailyCumulativeAvailableChargeUtility; // prettier-ignore
          item.dailyCumulativeAvailableCharge.rooftop = dailyCumulativeAvailableChargeRooftop; // prettier-ignore

          const dailyMaxAllowableChargeUtility =
            dailyCumulativeAvailableChargeUtility === 0
              ? 0
              : dailyCumulativeAvailableChargeUtility <
                  item.dailyAllowableCharging.utility
                ? -item.solarUnpaired.utility
                : item.dailyAllowableCharging.utility -
                  previousItem.dailyCumulativeAvailableCharge.utility;

          const dailyMaxAllowableChargeRooftop =
            dailyCumulativeAvailableChargeRooftop === 0
              ? 0
              : dailyCumulativeAvailableChargeRooftop <
                  item.dailyAllowableCharging.rooftop
                ? -item.solarUnpaired.rooftop
                : item.dailyAllowableCharging.rooftop -
                  previousItem.dailyCumulativeAvailableCharge.rooftop;

          item.dailyMaxAllowableCharge.utility = dailyMaxAllowableChargeUtility;
          item.dailyMaxAllowableCharge.rooftop = dailyMaxAllowableChargeRooftop;

          const esProfilePairedUtility =
            item.esProfileUnpaired.utility === 0
              ? 0
              : item.esProfileUnpaired.utility < 0
                ? item.dailyAllowableDischarging.utility /
                  batteryStorageDuration
                : overloadedDay.utility
                  ? item.dailyMaxAllowableCharge.utility
                  : item.dailyChargingNeeded.utility >
                      item.dailyAllowableCharging.utility
                    ? -item.solarUnpaired.utility
                    : item.esProfileUnpaired.utility;

          const esProfilePairedRooftop =
            item.esProfileUnpaired.rooftop === 0
              ? 0
              : item.esProfileUnpaired.rooftop < 0
                ? item.dailyAllowableDischarging.rooftop /
                  batteryStorageDuration
                : overloadedDay.rooftop
                  ? item.dailyMaxAllowableCharge.rooftop
                  : item.dailyChargingNeeded.rooftop >
                      item.dailyAllowableCharging.rooftop
                    ? -item.solarUnpaired.rooftop
                    : item.esProfileUnpaired.rooftop;

          item.esProfilePaired.utility = esProfilePairedUtility;
          item.esProfilePaired.rooftop = esProfilePairedRooftop;
        }
      }

      return array;
    },
    [] as {
      date: string;
      dayOfYear: number;
      hourOfDay: number;
      hourOfYear: number;
      esProfileUnpaired: { utility: number; rooftop: number };
      solarUnpaired: { utility: number; rooftop: number };
      dailyChargingNeeded: { utility: number; rooftop: number };
      dailyDischargingNeeded: { utility: number; rooftop: number };
      dailyAvailableSolar: { utility: number; rooftop: number };
      dailyAllowableCharging: { utility: number; rooftop: number };
      dailyAllowableDischarging: { utility: number; rooftop: number };
      overloadedHour: { utility: boolean; rooftop: boolean };
      overloadedDay: { utility: boolean; rooftop: boolean };
      dailyCumulativeAvailableCharge: { utility: number; rooftop: number };
      dailyMaxAllowableCharge: { utility: number; rooftop: number };
      esProfilePaired: { utility: number; rooftop: number };
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
  selectedRegionsMonthlyDailyEVEnergyUsage:
    | SelectedRegionsMonthlyDailyEVEnergyUsage
    | EmptyObject;
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
      !Object.hasOwn(data, "hour") &&
      !Object.hasOwn(data, "day") &&
      !Object.hasOwn(data, "month")
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
      ? "weekend"
      : "weekday";

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
  hourlyEnergyStorageData: HourlyEnergyStorageData;
  hourlyEVLoad: HourlyEVLoad;
  hourlyTopPercentReduction: HourlyTopPercentReduction;
  annualGwh: number; // impacts.inputs.annualGwh
  constantMwh: number; // impacts.inputs.annualGwh
}) {
  const {
    lineLoss,
    regionalLoad,
    hourlyRenewableEnergyProfiles,
    hourlyEnergyStorageData,
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

      const reProfiles = hourlyRenewableEnergyProfiles[index] || {};
      const onshoreWindProfile = reProfiles?.onshoreWind || 0;
      const offshoreWindProfile = reProfiles?.offshoreWind || 0;
      const utilitySolarProfile = reProfiles?.utilitySolar || 0;
      const rooftopSolarProfile = reProfiles?.rooftopSolar || 0;

      const esData = hourlyEnergyStorageData[index] || {};
      const date = esData?.date || "";
      const dayOfYear = esData?.dayOfYear || 0;
      const hourOfYear = esData?.hourOfYear || 0;
      const utilitySolarPaired = esData?.esProfilePaired?.utility || 0;
      const rooftopSolarPaired = esData?.esProfilePaired?.rooftop || 0;

      const evLoad = hourlyEVLoad[index] || 0;

      const windEnergyProfile = -(onshoreWindProfile + offshoreWindProfile) + 0;

      const finalUtility =
        -windEnergyProfile - (utilitySolarProfile - utilitySolarPaired);

      const finalRooftop =
        topPercentReduction -
        hourlyMwReduction -
        constantMwh +
        evLoad -
        rooftopSolarProfile -
        rooftopSolarPaired;

      const impactsLoad = finalUtility + finalRooftop / (1 - lineLoss);

      object[hour] = {
        /* column B */ date,
        /* column F */ dayOfYear,
        hourOfYear,
        /* column I */ windEnergyProfile,
        /* column J */ utilitySolarProfile,
        /* column K */ rooftopSolarProfile,
        /* column L */ finalUtility,
        /* column M */ finalRooftop,
        /* column N */ impactsLoad,
        /* column O */ originalLoad,
        percentChange: (impactsLoad / originalLoad) * 100,
      };

      return object;
    },
    {} as {
      [hour: number]: {
        date: string;
        dayOfYear: number;
        hourOfYear: number;
        windEnergyProfile: number;
        utilitySolarProfile: number;
        rooftopSolarProfile: number;
        finalUtility: number;
        finalRooftop: number;
        impactsLoad: number;
        originalLoad: number;
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
    [regionId in RegionId]: {
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
