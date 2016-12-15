import { combineReducers } from 'redux';
// reducers
import annualDisplacementReducer from './annualDisplacementReducer';
import dataDownloadReducer from './dataDownloadReducer';
import eereReducer from './eereReducer';
import monthlyEmissionsReducer from './monthlyEmissionsReducer';
import panelReducer from './panelReducer';
import rdfsReducer from './rdfsReducer';
import regionsReducer from './regionsReducer';
import stateEmissionsReducer from './stateEmissionsReducer';

const reducers = combineReducers({
  annualDisplacement: annualDisplacementReducer,
  dataDownload: dataDownloadReducer,
  eere: eereReducer,
  monthlyEmissions: monthlyEmissionsReducer,
  panel: panelReducer,
  rdfs: rdfsReducer,
  regions: regionsReducer,
  stateEmissions: stateEmissionsReducer,
});

export default reducers;
