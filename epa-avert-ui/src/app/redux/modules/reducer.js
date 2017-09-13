import { combineReducers } from 'redux';
// reducers
import api from 'app/redux/modules/api';
import generation from 'app/redux/modules/generation';
import so2 from 'app/redux/modules/so2';
import nox from 'app/redux/modules/nox';
import co2 from 'app/redux/modules/co2';

import annualDisplacement from '../../reducers/annualDisplacementReducer';
import dataDownload from '../../reducers/dataDownloadReducer';
import eere from '../../reducers/eereReducer';
import monthlyEmissions from '../../reducers/monthlyEmissionsReducer';
import panel from '../../reducers/panelReducer';
import rdfs from '../../reducers/rdfsReducer';
import regions from '../../reducers/regionsReducer';
import stateEmissions from '../../reducers/stateEmissionsReducer';

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
