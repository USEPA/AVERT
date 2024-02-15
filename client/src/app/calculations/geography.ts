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

      const previousHourlyData = array[array.length - 1];

      const dailyIndex = Math.floor(hourlyIndex / 24);
      const dayOfYear = dailyIndex + 1;

      const hourlyProfiles = hourlyRenewableEnergyProfiles[hourlyIndex];
      const utilitySolarUnpaired = -hourlyProfiles.utilitySolarUnpaired + 0;
      const rooftopSolarUnpaired = -hourlyProfiles.rooftopSolarUnpaired + 0;

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

      /* build up daily data, based on battery's hourly value */
      if (battery > 0) {
        dailyData[dailyIndex].chargingNeeded += battery;
        dailyData[dailyIndex].availableUtilitySolar += utilitySolarUnpaired;
        dailyData[dailyIndex].availableRooftopSolar += rooftopSolarUnpaired;
      }

      if (battery < 0) {
        dailyData[dailyIndex].dischargingNeeded -= battery;
      }

      /* initialize data for each hour of the year */
      array.push({
        /* column B */ date,
        /* column F */ dayOfYear,
        /* column _ */ hourOfYear: hour,
        /* column AK and AX */ esProfileUnpaired: battery,
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
      });

      /*
       * NOTE: As soon as the day of year changes (e.g., the first hour of the
       * next day) loop backwards through the built up array, and add cumulative
       * values for the previous day of the year.
       */
      if (dayOfYear - 1 === previousHourlyData?.dayOfYear) {
        for (let i = array.length - 2; i >= 0; i--) {
          /* break out of loop once the day of year changes again */
          if (array[i].dayOfYear === dayOfYear - 2) break;

          const daily = dailyData[dailyIndex - 1];

          const chargingNeeded = daily.chargingNeeded;
          const dischargingNeeded = daily.dischargingNeeded;

          const availableUtility = daily.availableUtilitySolar;
          const availableRooftop = daily.availableRooftopSolar;

          const allowableUtilityCharging = Math.min(-availableUtility + 0, chargingNeeded); // prettier-ignore
          const allowableRooftopCharging = Math.min(-availableRooftop + 0, chargingNeeded); // prettier-ignore

          const allowableUtilityDischarging = (-allowableUtilityCharging + 0) * esRoundTripEfficiency; // prettier-ignore
          const allowableRooftopDischarging = (-allowableRooftopCharging + 0) * esRoundTripEfficiency; // prettier-ignore

          const overloadedHourUtilitySolar =
            array[i].esProfileUnpaired > 0 &&
            chargingNeeded < -availableUtility &&
            array[i].esProfileUnpaired > -array[i].utilitySolarUnpaired;

          const overloadedHourRooftopSolar =
            array[i].esProfileUnpaired > 0 &&
            chargingNeeded < -availableRooftop &&
            array[i].esProfileUnpaired > -array[i].rooftopSolarUnpaired;

          array[i].dailyChargingNeeded = chargingNeeded;
          array[i].dailyDischargingNeeded = dischargingNeeded;

          array[i].dailyAvailableUtilitySolar = availableUtility;
          array[i].dailyAvailableRooftopSolar = availableRooftop;

          array[i].dailyAllowableUtilitySolarCharging = allowableUtilityCharging; // prettier-ignore
          array[i].dailyAllowableRooftopSolarCharging = allowableRooftopCharging; // prettier-ignore

          array[i].dailyAllowableUtilitySolarDischarging = allowableUtilityDischarging; // prettier-ignore
          array[i].dailyAllowableRooftopSolarDischarging = allowableRooftopDischarging; // prettier-ignore

          array[i].overloadedHourUtilitySolar = overloadedHourUtilitySolar;
          array[i].overloadedHourRooftopSolar = overloadedHourRooftopSolar;
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
    }[],
  );

  return result;
}
