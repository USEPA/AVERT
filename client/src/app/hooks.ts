// reducers
import { useTypedSelector } from '@/app/redux/index';
import { RegionState } from '@/app/redux/reducers/geography';
// config
import { RegionId, StateId } from '@/app/config';

function useSelectedRegion() {
  return useTypedSelector(({ geography }) => {
    return Object.values(geography.regions).find((region) => region.selected);
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

function useSelectedStateRegions() {
  const selectedState = useSelectedState();
  const selectedStateRegionIds = selectedState
    ? Object.keys(selectedState.percentageByRegion)
    : [];
  return useTypedSelector(({ geography }) => {
    const selectedStateRegions: RegionState[] = [];
    for (const regionId in geography.regions) {
      const region = geography.regions[regionId as RegionId];
      if (selectedStateRegionIds.includes(region.id)) {
        selectedStateRegions.push(region);
      }
    }
    return selectedStateRegions;
  });
}

export { useSelectedRegion, useSelectedState, useSelectedStateRegions };
