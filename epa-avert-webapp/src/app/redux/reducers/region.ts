// reducers
import { AppThunk } from 'app/redux/index';
// engines
import { avert } from 'app/engines';
// enums
import Regions from 'app/enums/Regions';

type RegionAction = {
  type: 'region/SELECT_REGION';
  payload: {
    number: number;
    name: string;
  };
};

type RegionState = {
  number: number;
  name: string;
};

// reducer
const initialState: RegionState = {
  number: 0,
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
        number: action.payload.number,
        name: action.payload.name,
      };

    default:
      return state;
  }
}

// action creators
export function selectRegion(regionNumber: number): AppThunk {
  return (dispatch) => {
    avert.region = regionNumber;

    const selectedRegion = Object.values(Regions).find((region) => {
      return region.number === regionNumber;
    });

    dispatch({
      type: 'region/SELECT_REGION',
      payload: {
        number: regionNumber,
        name: selectedRegion ? selectedRegion.label : '',
      },
    });
  };
}
