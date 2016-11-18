import { combineReducers } from 'redux';
// reducers
import activeStepReducer from './activeStepReducer';
import selectedRegionReducer from './selectedRegionReducer';
import selectedAggregationReducer from './selectedAggregationReducer';
import selectedUnitReducer from './selectedUnitReducer';

const reducers = combineReducers({
  activeStep: activeStepReducer,
  selectedRegion: selectedRegionReducer,
  selectedAggregation: selectedAggregationReducer,
  selectedUnit: selectedUnitReducer,
});

export default reducers;
