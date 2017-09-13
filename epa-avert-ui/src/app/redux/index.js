import { combineReducers } from 'redux';
// reducers
import api from 'app/redux/api';
import generation from 'app/redux/generation';
import so2 from 'app/redux/so2';
import nox from 'app/redux/nox';
import co2 from 'app/redux/co2';

import annualDisplacement from '../reducers/annualDisplacementReducer';
import dataDownload from '../reducers/dataDownloadReducer';
import eere from '../reducers/eereReducer';
import monthlyEmissions from '../reducers/monthlyEmissionsReducer';
import panel from '../reducers/panelReducer';
import rdfs from '../reducers/rdfsReducer';
import regions from '../reducers/regionsReducer';
import stateEmissions from '../reducers/stateEmissionsReducer';

export default combineReducers({
  api,
  generation,
  so2,
  nox,
  co2,
  panel,
  regions,
  rdfs,
  eere,
  annualDisplacement,
  monthlyEmissions,
  stateEmissions,
  dataDownload,
});
