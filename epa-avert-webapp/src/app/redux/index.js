import { combineReducers } from 'redux';
// reducers
import region from 'app/redux/region';
import panel from 'app/redux/panel';
import api from 'app/redux/api';
import rdfs from 'app/redux/rdfs';
import generation from 'app/redux/generation';
import so2 from 'app/redux/so2';
import nox from 'app/redux/nox';
import co2 from 'app/redux/co2';
import pm25 from 'app/redux/pm25';
import eere from 'app/redux/eere';
import annualDisplacement from 'app/redux/annualDisplacement';
import stateEmissions from 'app/redux/stateEmissions';
import monthlyEmissions from 'app/redux/monthlyEmissions';
import dataDownload from 'app/redux/dataDownload';

export default combineReducers({
  region,
  panel,
  api,
  rdfs,
  generation,
  so2,
  nox,
  co2,
  pm25,
  eere,
  annualDisplacement,
  stateEmissions,
  monthlyEmissions,
  dataDownload,
});
