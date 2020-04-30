import { useSelector, TypedUseSelectorHook } from 'react-redux';
// reducers
import { AppThunk } from 'app/redux/index';
// engines
import { avert } from 'app/engines';
// enums
import Regions from 'app/enums/Regions';

// action types
export const SELECT_REGION = 'region/SELECT_REGION';

type RegionAction = {
  type: typeof SELECT_REGION;
  payload: {
    id: number;
    name: string;
  };
};

type RegionState = {
  id: number;
  name: string;
};

export const useRegionState: TypedUseSelectorHook<RegionState> = useSelector;

// reducer
const initialState: RegionState = {
  id: 0,
  name: '',
};

export default function reducer(
  state = initialState,
  action: RegionAction,
): RegionState {
  switch (action.type) {
    case SELECT_REGION:
      return {
        ...state,
        id: action.payload.id,
        name: action.payload.name,
      };

    default:
      return state;
  }
}

// action creators
export const selectRegion = (regionId: number): AppThunk => {
  return (dispatch) => {
    avert.region = regionId;

    const region = Object.values(Regions).find((r) => r.id === regionId);

    dispatch({
      type: SELECT_REGION,
      payload: {
        id: regionId,
        name: region ? region.label : '',
      },
    });
  };
};
