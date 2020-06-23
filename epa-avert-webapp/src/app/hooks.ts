// reducers
import { useTypedSelector } from 'app/redux/index';
import { RegionState } from 'app/redux/reducers/regions';
// config
import { RegionId } from 'app/config';

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

export { useSelectedRegions };
