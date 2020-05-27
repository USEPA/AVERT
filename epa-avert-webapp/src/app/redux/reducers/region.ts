// reducers
import { AppThunk } from 'app/redux/index';
// config
import { regions } from 'app/config';

type RegionAction = {
  type: 'region/SELECT_REGION';
  payload: {
    number: number;
    name: string;
    slug: string;
  };
};

type RegionState = {
  number: number;
  name: string;
  slug: string;
};

// reducer
const initialState: RegionState = {
  number: 0,
  name: '',
  slug: '',
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
        slug: action.payload.slug,
      };

    default:
      return state;
  }
}

// action creators
export function selectRegion(regionNumber: number): AppThunk {
  return (dispatch) => {
    const selectedRegion = Object.values(regions).find((region) => {
      return region.number === regionNumber;
    });

    dispatch({
      type: 'region/SELECT_REGION',
      payload: {
        number: regionNumber,
        name: selectedRegion ? selectedRegion.label : '',
        slug: selectedRegion ? selectedRegion.slug : '',
      },
    });
  };
}
