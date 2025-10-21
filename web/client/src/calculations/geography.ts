import {
  type GeographicFocus,
  type RegionState,
  type StateState,
} from "@/redux/reducers/geography";
import { sortObjectByKeys } from "@/utilities";
import {
  type CountyFIPS,
  type RegionAverageTemperatures,
  type RegionId,
  type RegionName,
  type StateId,
} from "@/config";
/**
 * Excel: "CountyFIPS" sheet.
 */
import countyFipsData from "@/data/county-fips.json";

/**
 * Work around due to TypeScript inability to infer types from large JSON files.
 */
const countyFips = countyFipsData as CountyFIPS;

export type CountiesByGeography = ReturnType<
  typeof organizeCountiesByGeography
>;
export type RegionalScalingFactors = ReturnType<
  typeof calculateRegionalScalingFactors
>;
export type ClimateAdjustmentFactorByRegion = ReturnType<
  typeof calculateClimateAdjustmentFactorByRegion
>;
export type SelectedGeographyRegions = ReturnType<
  typeof getSelectedGeographyRegions
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
    const regionName = data["AVERT Region"] as RegionName;
    const stateId = data["Postal State Code"] as StateId;
    const county = data["County Name Long"];

    const regionId = Object.entries(regions).find(([_, regionValue]) => {
      return regionValue.name === regionName;
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

  if (geographicFocus === "regions" && selectedRegion) {
    result[selectedRegion.id] = 1;
  }

  if (geographicFocus === "states" && selectedState) {
    Object.entries(selectedState.percentageByRegion).forEach(
      ([regionId, data]) => {
        result[regionId as RegionId] = data / 100;
      },
    );
  }

  return result;
}

/**
 * Climate adjustment factor for each region: additional energy is consumed in
 * regions whose climate is more than +/-18F different from St. Louis, MO
 *
 * Excel: "Table 9: Default EV load profiles and related values from EVI-Pro
 * Lite" table in the "Library" sheet (D830:D843)
 */
export function calculateClimateAdjustmentFactorByRegion(options: {
  regionAverageTemperatures: RegionAverageTemperatures;
  percentageAdditionalEnergyConsumedFactor: number;
}) {
  const {
    regionAverageTemperatures,
    percentageAdditionalEnergyConsumedFactor,
  } = options;

  const result = Object.entries(regionAverageTemperatures).reduce(
    (object, [regionKey, regionValue]) => {
      const regionId = regionKey as RegionId;

      const adjustment =
        regionValue === 68
          ? 1
          : regionValue === 50 || regionValue === 86
            ? 1 + percentageAdditionalEnergyConsumedFactor
            : 1 + percentageAdditionalEnergyConsumedFactor / 2;

      object[regionId] = adjustment;

      return object;
    },
    {} as {
      [regionId in RegionId]: number;
    },
  );

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
    (object, [regionKey, regionValue]) => {
      const regionId = regionKey as RegionId;

      if (selectedGeographyRegionIds.includes(regionValue.id)) {
        object[regionId] = regionValue;
      }
      return object;
    },
    {} as Partial<{ [regionId in RegionId]: RegionState }>,
  );

  return result;
}
