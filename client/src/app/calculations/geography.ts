import {
  GeographicFocus,
  RegionState,
  StateState,
} from 'app/redux/reducers/geography';
import { RegionId } from 'app/config';

export type RegionalScalingFactors = ReturnType<
  typeof calculateRegionalScalingFactors
>;

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

  const result = {} as Partial<{ [stateId in RegionId]: number }>;

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
