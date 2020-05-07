// reducers
import { AppThunk } from 'app/redux/index';
// engines
import { avert } from 'app/engines';
// enums
import Regions from 'app/enums/Regions';

type RegionAction = {
  type: 'region/SELECT_REGION';
  payload: {
    id: number;
    name: string;
  };
};

type RegionState = {
  id: number;
  name: string;
};

// reducer
const initialState: RegionState = {
  id: 0,
  name: '',
};

export default function reducer(
  state: RegionState = initialState,
  action: RegionAction,
): RegionState {
  switch (action.type) {
    case 'region/SELECT_REGION':
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
export function selectRegion(regionId: number): AppThunk {
  return (dispatch) => {
    avert.region = regionId;

    const region = Object.values(Regions).find((r) => r.id === regionId);

    dispatch({
      type: 'region/SELECT_REGION',
      payload: {
        id: regionId,
        name: region ? region.label : '',
      },
    });
  };
}
