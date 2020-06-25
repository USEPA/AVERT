// reducers
import { useTypedSelector } from 'app/redux/index';
import { RegionState } from 'app/redux/reducers/regions';
// config
import { RegionId, StateId } from 'app/config';

function useSelectedRegions() {
  return useTypedSelector(({ regions }) => {
    const selectedRegions: RegionState[] = [];
    for (const key in regions) {
      const region = regions[key as RegionId];
      if (region.selected) selectedRegions.push(region);
    }
    return selectedRegions;
  });
}

function useSelectedState() {
  return useTypedSelector(({ states }) => {
    for (const key in states) {
      const state = states[key as StateId];
      if (state.selected) return state;
    }
  });
}

export { useSelectedRegions, useSelectedState };
