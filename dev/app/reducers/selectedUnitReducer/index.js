// action types
import { CHANGE_SELECTED_UNIT } from '../../actions';

const selectedUnitReducer = (state = 'Emission changes', action) => {
  switch (action.type)  {
    case CHANGE_SELECTED_UNIT:
      return action.payload.unitType;
    default:
      return state;
  }
};

export default selectedUnitReducer;
