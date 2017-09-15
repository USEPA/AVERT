import { combineReducers } from 'redux';
// reducers
import regions from 'app/redux/regions';
import panel from 'app/redux/panel';
import api from 'app/redux/api';
import rdfs from 'app/redux/rdfs';
import generation from 'app/redux/generation';
import so2 from 'app/redux/so2';
import nox from 'app/redux/nox';
import co2 from 'app/redux/co2';
import eere from 'app/redux/eere';

import annualDisplacement from '../reducers/annualDisplacementReducer';
import dataDownload from '../reducers/dataDownloadReducer';
import monthlyEmissions from '../reducers/monthlyEmissionsReducer';
import stateEmissions from '../reducers/stateEmissionsReducer';

export default combineReducers({
  regions,
  panel,
  api,
  rdfs,
  generation,
  so2,
  nox,
  co2,
  eere,
  annualDisplacement,
  monthlyEmissions,
  stateEmissions,
  dataDownload,
});
