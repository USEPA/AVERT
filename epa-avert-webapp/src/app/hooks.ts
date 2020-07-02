// reducers
import { useTypedSelector } from 'app/redux/index';
import { RegionState } from 'app/redux/reducers/geography';
// config
import { RegionId, StateId } from 'app/config';

function useSelectedRegions() {
  return useTypedSelector(({ geography }) => {
    const selectedRegions: RegionState[] = [];
    for (const key in geography.regions) {
      const region = geography.regions[key as RegionId];
      if (region.selected) selectedRegions.push(region);
    }
    return selectedRegions;
  });
}

function useSelectedState() {
  return useTypedSelector(({ geography }) => {
    for (const key in geography.states) {
      const state = geography.states[key as StateId];
      if (state.selected) return state;
    }
  });
}

export { useSelectedRegions, useSelectedState };
