import { combineReducers } from 'redux';
import api, * as fromApi from './api';
import generation, * as fromGeneration from './generation';
import so2, * as fromSo2 from './so2';
import nox, * as fromNox from './nox';
import co2, * as fromCo2 from './co2';
import annualDisplacement from '../../reducers/annualDisplacementReducer';
import dataDownload from '../../reducers/dataDownloadReducer';
import eere from '../../reducers/eereReducer';
import monthlyEmissions from '../../reducers/monthlyEmissionsReducer';
import panel from '../../reducers/panelReducer';
import rdfs from '../../reducers/rdfsReducer';
import regions from '../../reducers/regionsReducer';
import stateEmissions from '../../reducers/stateEmissionsReducer';

export default combineReducers({
  panel,
  regions,
  rdfs,
  eere,
  api,
  generation,
  so2,
  nox,
  co2,
  annualDisplacement,
  monthlyEmissions,
  stateEmissions,
  dataDownload,
});

export const getBaseUrl = (state) => fromApi.getBaseUrl(state);
export const getGenerationData = (state) => fromGeneration.getGenerationData(state);
export const getGenerationOriginal = (state) => fromGeneration.getGenerationOriginal(state);
export const getGenerationPost = (state) => fromGeneration.getGenerationPost(state);
export const getSo2Data = (state) => fromSo2.getSo2Data(state);
export const getSo2Rate = (state) => fromSo2.getSo2Rate(state);
export const getNoxData = (state) => fromNox.getNoxData(state);
export const getNoxRate = (state) => fromNox.getNoxRate(state);
export const getCo2Data = (state) => fromCo2.getCo2Data(state);
export const getCo2Rate = (state) => fromCo2.getCo2Rate(state);
