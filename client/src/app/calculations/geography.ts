import type {
  GeographicFocus,
  RegionState,
  StateState,
} from 'app/redux/reducers/geography';
import { type HourlyRenewableEnergyProfiles } from 'app/calculations/impacts';
import { sortObjectByKeys } from 'app/calculations/utilities';
import type { RegionId, RegionName, StateId } from 'app/config';
/**
 * Excel: "CountyFIPS" sheet.
 */
import countyFips from 'app/data/county-fips.json';

export type CountiesByGeography = ReturnType<
  typeof organizeCountiesByGeography
>;
export type RegionalScalingFactors = ReturnType<
  typeof calculateRegionalScalingFactors
>;
export type SelectedGeographyRegions = ReturnType<
  typeof getSelectedGeographyRegions
>;
export type HourlyEnergyStorageData = ReturnType<
  typeof calculateHourlyEnergyStorageData
>;

/**
 * Organizes counties by state and by AVERT regions.
 */
export function organizeCountiesByGeography(options: {
  regions: { [regionId in RegionId]: RegionState };
}) {
  const { regions } = options;

  const result = {
    regions: {},
    states: {},
  } as {
    regions: {
      [regionId in RegionId]: Partial<{
        [stateId in StateId]: string[];
      }>;
    };
    states: {
      [stateId in StateId]: string[];
    };
  };

  countyFips.forEach((data) => {
    const regionName = data['AVERT Region'] as RegionName;
    const stateId = data['Postal State Code'] as StateId;
    const county = data['County Name Long'];

    const regionId = Object.entries(regions).find(([_, region]) => {
      return region.name === regionName;
    })?.[0] as RegionId | undefined;

    if (regionId) {
      result.regions[regionId] ??= {} as Partial<{
        [stateId in StateId]: string[];
      }>;

      const regionResult = result.regions[regionId];

      if (regionResult) {
        regionResult[stateId] ??= [];
        regionResult[stateId]?.push(county);

        result.states[stateId] ??= [];
        result.states[stateId]?.push(county);
      }
    }
  });

  result.regions = sortObjectByKeys(result.regions);
  result.states = sortObjectByKeys(result.states);

  return result;
}

/**
 * Each regional scaling factor is a number between 0 and 1, representing the
 * proportion the selected geography exists within a given region.
 *
 * - If a region is selected, the regional scaling factor will always be 1.
 *
 * - If a state is selected, the regional scaling factor comes from the selected
 *   state's percentage by region value for the given region, as defined in the
 *   config file (`app/config.ts`).
 *
 *   For example, if the state falls exactly equally between the two regions,
 *   the regional scaling factor would be 0.5 for each of those two regions.
 */
export function calculateRegionalScalingFactors(options: {
  geographicFocus: GeographicFocus;
  selectedRegion: RegionState | undefined;
  selectedState: StateState | undefined;
}) {
  const { geographicFocus, selectedRegion, selectedState } = options;

  const result = {} as Partial<{ [regionId in RegionId]: number }>;

  if (geographicFocus === 'regions' && selectedRegion) {
    result[selectedRegion.id] = 1;
  }

  if (geographicFocus === 'states' && selectedState) {
    Object.entries(selectedState.percentageByRegion).forEach(
      ([regionId, data]) => {
        result[regionId as RegionId] = data / 100;
      },
    );
  }

  return result;
}

/**
 * Returns regions data for the selected geography.
 */
export function getSelectedGeographyRegions(options: {
  regions: { [regionId in RegionId]: RegionState };
  selectedGeographyRegionIds: RegionId[];
}) {
  const { regions, selectedGeographyRegionIds } = options;

  const result = Object.entries(regions).reduce(
    (object, [id, regionData]) => {
      if (selectedGeographyRegionIds.includes(regionData.id)) {
        object[id as RegionId] = regionData;
      }
      return object;
    },
    {} as Partial<{ [regionId in RegionId]: RegionState }>,
  );

  return result;
}

/**
 * Returns hourly energy storage data
 *
 * Excel: Data from the "Utility Scale" and "Distributed" tables in the
 * "CalculateEERE" sheet (columns AK, AL, AM, AN, and AY – NOTE: columns AX, AZ,
 * and BA, contain the same data as AK, AM, and AN).
 */
export function calculateHourlyEnergyStorageData(options: {
  regionalStorageDefaults: RegionState['storageDefaults'];
  hourlyRenewableEnergyProfiles: HourlyRenewableEnergyProfiles;
  esRoundTripEfficiency: number;
}) {
  const {
    regionalStorageDefaults,
    hourlyRenewableEnergyProfiles,
    esRoundTripEfficiency,
  } = options;

  /* built up charging and discharging needed for each day of the year */
  const dailyData = [] as {
    date: string;
    chargingNeeded: number;
    dischargingNeeded: number;
    availableUtilitySolar: number;
    availableRooftopSolar: number;
  }[];

  const result = regionalStorageDefaults.data.reduce(
    (array, hourlyData, hourlyIndex) => {
      const { date, hour, battery } = hourlyData;

      const previousHourData = array[array.length - 1];

      const esProfileUnpaired = battery * 10;
      const hourlyProfiles = hourlyRenewableEnergyProfiles[hourlyIndex];
      const utilitySolarUnpaired = -hourlyProfiles.utilitySolarUnpaired + 0;
      const rooftopSolarUnpaired = -hourlyProfiles.rooftopSolarUnpaired + 0;

      const dailyIndex = Math.floor(hourlyIndex / 24);
      const dayOfYear = dailyIndex + 1;

      /* initialize data for each day of the year */
      if (!dailyData[dailyIndex]) {
        dailyData[dailyIndex] = {
          date,
          chargingNeeded: 0,
          dischargingNeeded: 0,
          availableUtilitySolar: 0,
          availableRooftopSolar: 0,
        };
      }

      /* build up daily data, based on ES Profile's hourly value */
      if (esProfileUnpaired > 0) {
        dailyData[dailyIndex].chargingNeeded += esProfileUnpaired;
        dailyData[dailyIndex].availableUtilitySolar += utilitySolarUnpaired;
        dailyData[dailyIndex].availableRooftopSolar += rooftopSolarUnpaired;
      }

      if (esProfileUnpaired < 0) {
        dailyData[dailyIndex].dischargingNeeded -= esProfileUnpaired;
      }

      /* initialize data for each hour of the year */
      array.push({
        /* column B */ date,
        /* column F */ dayOfYear,
        /* column _ */ hourOfYear: hour,
        /* column AK and AX */ esProfileUnpaired,
        /* column AL */ utilitySolarUnpaired,
        /* column AY */ rooftopSolarUnpaired,
        /* column AM and AZ */ dailyChargingNeeded: 0,
        /* column AN and BA */ dailyDischargingNeeded: 0,
        /* column AO */ dailyAvailableUtilitySolar: 0,
        /* column BB */ dailyAvailableRooftopSolar: 0,
        /* column AP */ dailyAllowableUtilitySolarCharging: 0,
        /* column BC */ dailyAllowableRooftopSolarCharging: 0,
        /* column AQ */ dailyAllowableUtilitySolarDischarging: 0,
        /* column BD */ dailyAllowableRooftopSolarDischarging: 0,
        /* column AP */ overloadedHourUtilitySolar: false,
        /* column BE */ overloadedHourRooftopSolar: false,
        /* column AS */ overloadedDayUtilitySolar: false,
        /* column BF */ overloadedDayRooftopSolar: false,
        /* column AT */ dailyCumulativeAvailableUtilitySolarCharge: 0,
        /* column BG */ dailyCumulativeAvailableRooftopSolarCharge: 0,
        /* column AU */ dailyMaxAllowableUtilitySolarCharge: 0,
        /* column BH */ dailyMaxAllowableRooftopSolarCharge: 0,
      });

      /*
       * NOTE: As soon as the day of the year changes (e.g., the previous hour
       * is in the day before), loop backwards through the built-up array and
       * accumulate values from the previous day of the year.
       */
      if (previousHourData?.dayOfYear === dayOfYear - 1) {
        /*
         * NOTE: overloaded day values will be possibly re-defined in the first
         * loop, and then assigned in the second loop
         */
        let overloadedDayUtilitySolar = false;
        let overloadedDayRooftopSolar = false;

        /** index of the first hour of the day will be set in the first loop */
        let firstHourOfDayIndex = 0;

        /*
         * NOTE: loop backwards through the built-up array, starting at the item
         * just before the last one (because the last item is part of the next
         * day of the year)
         */
        for (let i = array.length - 2; i >= 0; i--) {
          /*
           * NOTE: break out of loop once the day of year changes again
           * (ensures we don't go back too far since we're looping backwards)
           */
          if (array[i].dayOfYear === dayOfYear - 2) {
            /*
             * NOTE: store the index of the first hour of the day (to be used as
             * the starting index for the second loop)
             */
            firstHourOfDayIndex = i + 1;
            break;
          }

          const daily = dailyData[dailyIndex - 1];

          const chargingNeeded = daily.chargingNeeded;
          const dischargingNeeded = daily.dischargingNeeded;

          array[i].dailyChargingNeeded = chargingNeeded;
          array[i].dailyDischargingNeeded = dischargingNeeded;

          const availableUtility = daily.availableUtilitySolar;
          const availableRooftop = daily.availableRooftopSolar;

          array[i].dailyAvailableUtilitySolar = availableUtility;
          array[i].dailyAvailableRooftopSolar = availableRooftop;

          const allowableUtilityCharging = Math.min(-availableUtility + 0, chargingNeeded); // prettier-ignore
          const allowableRooftopCharging = Math.min(-availableRooftop + 0, chargingNeeded); // prettier-ignore

          array[i].dailyAllowableUtilitySolarCharging = allowableUtilityCharging; // prettier-ignore
          array[i].dailyAllowableRooftopSolarCharging = allowableRooftopCharging; // prettier-ignore

          const allowableUtilityDischarging = (-allowableUtilityCharging + 0) * esRoundTripEfficiency; // prettier-ignore
          const allowableRooftopDischarging = (-allowableRooftopCharging + 0) * esRoundTripEfficiency; // prettier-ignore

          array[i].dailyAllowableUtilitySolarDischarging = allowableUtilityDischarging; // prettier-ignore
          array[i].dailyAllowableRooftopSolarDischarging = allowableRooftopDischarging; // prettier-ignore

          const overloadedHourUtilitySolar =
            array[i].esProfileUnpaired > 0 &&
            chargingNeeded < -availableUtility &&
            array[i].esProfileUnpaired > -array[i].utilitySolarUnpaired;

          const overloadedHourRooftopSolar =
            array[i].esProfileUnpaired > 0 &&
            chargingNeeded < -availableRooftop &&
            array[i].esProfileUnpaired > -array[i].rooftopSolarUnpaired;

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
        for (let i = firstHourOfDayIndex; i <= array.length - 2; i++) {
          array[i].overloadedDayUtilitySolar = overloadedDayUtilitySolar;
          array[i].overloadedDayRooftopSolar = overloadedDayRooftopSolar;

          const cumulativeAvailableUtilityCharge = overloadedDayUtilitySolar
            ? array[i].esProfileUnpaired <= 0
              ? 0
              : -array[i].utilitySolarUnpaired +
                array[i - 1].dailyCumulativeAvailableUtilitySolarCharge
            : 0;

          const cumulativeAvailableRooftopCharge = overloadedDayRooftopSolar
            ? array[i].esProfileUnpaired <= 0
              ? 0
              : -array[i].rooftopSolarUnpaired +
                array[i - 1].dailyCumulativeAvailableRooftopSolarCharge
            : 0;

          array[i].dailyCumulativeAvailableUtilitySolarCharge = cumulativeAvailableUtilityCharge; // prettier-ignore
          array[i].dailyCumulativeAvailableRooftopSolarCharge = cumulativeAvailableRooftopCharge; // prettier-ignore

          const maxAllowableUtilityCharge =
            cumulativeAvailableUtilityCharge === 0
              ? 0
              : cumulativeAvailableUtilityCharge <
                array[i].dailyAllowableUtilitySolarCharging
              ? -array[i].utilitySolarUnpaired
              : array[i].dailyAllowableUtilitySolarCharging -
                array[i - 1].dailyCumulativeAvailableUtilitySolarCharge;

          const maxAllowableRooftopCharge =
            cumulativeAvailableRooftopCharge === 0
              ? 0
              : cumulativeAvailableRooftopCharge <
                array[i].dailyAllowableRooftopSolarCharging
              ? -array[i].rooftopSolarUnpaired
              : array[i].dailyAllowableRooftopSolarCharging -
                array[i - 1].dailyCumulativeAvailableRooftopSolarCharge;

          array[i].dailyMaxAllowableUtilitySolarCharge = maxAllowableUtilityCharge; // prettier-ignore
          array[i].dailyMaxAllowableRooftopSolarCharge = maxAllowableRooftopCharge; // prettier-ignore
        }
      }

      return array;
    },
    [] as {
      date: string;
      dayOfYear: number;
      hourOfYear: number;
      esProfileUnpaired: number;
      utilitySolarUnpaired: number;
      rooftopSolarUnpaired: number;
      dailyChargingNeeded: number;
      dailyDischargingNeeded: number;
      dailyAvailableUtilitySolar: number;
      dailyAvailableRooftopSolar: number;
      dailyAllowableUtilitySolarCharging: number;
      dailyAllowableRooftopSolarCharging: number;
      dailyAllowableUtilitySolarDischarging: number;
      dailyAllowableRooftopSolarDischarging: number;
      overloadedHourUtilitySolar: boolean;
      overloadedHourRooftopSolar: boolean;
      overloadedDayUtilitySolar: boolean;
      overloadedDayRooftopSolar: boolean;
      dailyCumulativeAvailableUtilitySolarCharge: number;
      dailyCumulativeAvailableRooftopSolarCharge: number;
      dailyMaxAllowableUtilitySolarCharge: number;
      dailyMaxAllowableRooftopSolarCharge: number;
    }[],
  );

  return result;
}
