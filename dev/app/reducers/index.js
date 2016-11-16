import { combineReducers } from 'redux';
// reducers
import activeStepReducer from './activeStepReducer';

const reducers = combineReducers({
  activeStep: activeStepReducer,
});

export default reducers;
