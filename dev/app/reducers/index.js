import { combineReducers } from 'redux';
// reducers
import activeStepReducer from './activeStepReducer';
import selectedRegionReducer from './selectedRegionReducer';

const reducers = combineReducers({
  activeStep: activeStepReducer,
  selectedRegion: selectedRegionReducer,
});

export default reducers;
