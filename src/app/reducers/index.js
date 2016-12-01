import { combineReducers } from 'redux';
// reducers
import panelReducer from './panelReducer';
import eereReducer from './eereReducer';
import annualDisplacementReducer from './annualDisplacementReducer';
import stateEmissionsReducer from './stateEmissionsReducer';
import monthlyEmissionsReducer from './monthlyEmissionsReducer';
import regionsReducer from './regionsReducer';
//import rdfsReducer from './rdfsReducer';

const reducers = combineReducers({
  panel: panelReducer,
  eere: eereReducer,
  annualDisplacement: annualDisplacementReducer,
  stateEmissions: stateEmissionsReducer,
  monthlyEmissions: monthlyEmissionsReducer,
  regions: regionsReducer,
  // rdfs: rdfsReducer,
});

export default reducers;
