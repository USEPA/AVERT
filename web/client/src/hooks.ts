import { useAppSelector } from "@/redux/index";
import { type RegionState } from "@/redux/reducers/geography";
import { type RegionId, type StateId } from "@/config";

function useSelectedRegion() {
  return useAppSelector(({ geography }) => {
    return Object.values(geography.regions).find((region) => region.selected);
  });
}

function useSelectedState() {
  return useAppSelector(({ geography }) => {
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
  return useAppSelector(({ geography }) => {
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
