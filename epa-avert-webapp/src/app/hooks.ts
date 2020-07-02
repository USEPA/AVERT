// reducers
import { useTypedSelector } from 'app/redux/index';
import { RegionState } from 'app/redux/reducers/geography';
// config
import { RegionId, StateId } from 'app/config';

function useSelectedRegions() {
  return useTypedSelector(({ geography }) => {
    const selectedRegions: RegionState[] = [];
    for (const regionId in geography.regions) {
      const region = geography.regions[regionId as RegionId];
      if (region.selected) selectedRegions.push(region);
    }
    return selectedRegions;
  });
}

function useSelectedState() {
  return useTypedSelector(({ geography }) => {
    for (const stateId in geography.states) {
      const state = geography.states[stateId as StateId];
      if (state.selected) return state;
    }
  });
}

export { useSelectedRegions, useSelectedState };
