// action types
import { CHANGE_SELECTED_REGION } from '../../actions';

const selectedRegionReducer = (state = '', action) => {
  switch (action.type) {
    case CHANGE_SELECTED_REGION:
      return action.payload.regionName;
    default:
      return state;
  }
};

export default selectedRegionReducer;
