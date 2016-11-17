// action types
import { CHANGE_SELECTED_AGGREGATION } from '../../actions';

const selectedAggregationReducer = (state = 'Region', action) => {
  switch (action.type)  {
    case CHANGE_SELECTED_AGGREGATION:
      return action.payload.aggregateLevel;
    default:
      return state;
  }
};

export default selectedAggregationReducer;
