// config
import { RegionId, Region, regions } from 'app/config';

type RegionsAction = {
  type: 'regions/SELECT_REGIONS';
  payload: { regionIds: RegionId[] };
};

type RegionsState = {
  [key in RegionId]: Region & { selected: boolean };
};

// augment regions (from config) with additonal 'selected' property for each region
const updatedRegions: any = { ...regions };
for (const key in updatedRegions) {
  updatedRegions[key].selected = false;
}

// reducer
const initialState: RegionsState = updatedRegions;

export default function reducer(
  state: RegionsState = initialState,
  action: RegionsAction,
): RegionsState {
  switch (action.type) {
    case 'regions/SELECT_REGIONS':
      const updatedState = { ...state };
      for (const key in state) {
        const regId = key as RegionId;
        updatedState[regId].selected = action.payload.regionIds.includes(regId);
      }
      return updatedState;

    default:
      return state;
  }
}

// action creators
export function selectRegions(regionIds: RegionId[]) {
  return {
    type: 'regions/SELECT_REGIONS',
    payload: { regionIds },
  };
}
