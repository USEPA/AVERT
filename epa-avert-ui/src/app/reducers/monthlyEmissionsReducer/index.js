import _ from 'lodash';
import {extractDownloadStructure} from '../../utils/DataDownloadHelper';
import {StatusEnum} from '../../utils/StatusEnum';
import {AggregationEnum} from '../../utils/AggregationEnum';
import {MonthlyUnitEnum} from '../../utils/MonthlyUnitEnum';

// action types
import { SELECT_REGION } from 'app/actions';

import {
  START_DISPLACEMENT,
  COMPLETE_MONTHLY,
  SELECT_AGGREGATION,
  RESELECT_REGION,
  SELECT_STATE,
  SELECT_COUNTY,
  SELECT_UNIT,
  RENDER_MONTHLY_CHARTS,
  RESET_MONTHLY_EMISSIONS,
  SET_DOWNLOAD_DATA,
} from '../../actions';

// const standardStructure = { so2: [], nox: [], co2: []};

const initialState = {
  status: "select_region",
  newSelectedAggregation: AggregationEnum.REGION,
  newSelectedState: '',
  newSelectedCounty: '',
  newSelectedUnit: MonthlyUnitEnum.EMISSION,
  newRawData: {},
  newEmissionsRegionSo2: [],
  newEmissionsRegionNox: [],
  newEmissionsRegionCo2: [],
  newEmissionsStatesSo2: {},
  newEmissionsStatesNox: {},
  newEmissionsStatesCo2: {},
  newEmissionsCountiesSo2: {},
  newEmissionsCountiesNox: {},
  newEmissionsCountiesCo2: {},
  newPercentagesRegionSo2: [],
  newPercentagesRegionNox: [],
  newPercentagesRegionCo2: [],
  newPercentagesStatesSo2: {},
  newPercentagesStatesNox: {},
  newPercentagesStatesCo2: {},
  newPercentagesCountiesSo2: {},
  newPercentagesCountiesNox: {},
  newPercentagesCountiesCo2: {},
  newStates: [],
  newCounties: {},
  newVisibleCounties: [],
  newVisibleData: {so2: [], nox: [], co2: []},
  newDownloadableData: [],
};

const monthlyEmissionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SELECT_REGION:
      return {
        ...state,
        status: "ready",
      };

    case START_DISPLACEMENT:
      return {
        ...state,
        status: "started",
      };

    case COMPLETE_MONTHLY:
      return {
        ...state,
        status: StatusEnum.DONE,
        newRawData: action.data,
        newEmissionsRegionSo2: action.data.emissions.so2.regional,
        newEmissionsRegionNox: action.data.emissions.nox.regional,
        newEmissionsRegionCo2: action.data.emissions.co2.regional,
        newEmissionsStatesSo2: action.data.emissions.so2.state,
        newEmissionsStatesNox: action.data.emissions.nox.state,
        newEmissionsStatesCo2: action.data.emissions.co2.state,
        newEmissionsCountiesSo2: action.data.emissions.so2.county,
        newEmissionsCountiesNox: action.data.emissions.nox.county,
        newEmissionsCountiesCo2: action.data.emissions.co2.county,
        newPercentagesRegionSo2: action.data.percentages.so2.regional,
        newPercentagesRegionNox: action.data.percentages.nox.regional,
        newPercentagesRegionCo2: action.data.percentages.co2.regional,
        newPercentagesStatesSo2: action.data.percentages.so2.state,
        newPercentagesStatesNox: action.data.percentages.nox.state,
        newPercentagesStatesCo2: action.data.percentages.co2.state,
        newPercentagesCountiesSo2: action.data.percentages.so2.county,
        newPercentagesCountiesNox: action.data.percentages.nox.county,
        newPercentagesCountiesCo2: action.data.percentages.co2.county,
        newStates: Object.keys(action.data.statesAndCounties),
        newCounties: action.data.statesAndCounties,
      };

    case SELECT_AGGREGATION:
      return {
        ...state,
        newSelectedAggregation: action.aggregation,
      };

    case RESELECT_REGION:
      return {
        ...state,
        newSelectedAggregation: 'region',
        newSelectedState: '',
        newSelectedCounty: '',
      };

    case SELECT_STATE:
      return {
        ...state,
        // newSelectedAggregation: 'state',
        newSelectedState: action.state,
        newSelectedCounty: '',
        newVisibleCounties: action.visibleCounties,
      };

    case SELECT_COUNTY:
      return {
        ...state,
        // newSelectedAggregation: 'county',
        newSelectedCounty: action.county,
      };

    case SELECT_UNIT:
      return {
        ...state,
        newSelectedUnit: action.unit,
      };

    case RENDER_MONTHLY_CHARTS:


      const aggregation = state.newSelectedAggregation;
      const unit = state.newSelectedUnit;
      // const selectedState = state.newSelectedState !== '' ? state.newSelectedState : state.newStates[0];
      // const county = state.newSelectedCounty !== '' ? state.newSelectedCounty : state.newCounties[selectedState][0];
      const selectedState = state.newSelectedState !== '' ? state.newSelectedState : false;
      const county = state.newSelectedCounty !== '' ? state.newSelectedCounty : false;
      let dataPrefix = unit === MonthlyUnitEnum.PERCENT_CHANGE ? 'newPercentages' : 'newEmissions';
      const dataSuffixes = [{key: 'so2', suffix: 'So2'}, {key: 'nox', suffix: 'Nox'}, {key: 'co2', suffix: 'Co2'}];
      let visibleData = {};
      if (aggregation === AggregationEnum.REGION || selectedState === '' || (selectedState === '' && county === '')) {
        dataPrefix += 'Region';
        dataSuffixes.forEach((gas) => {
          visibleData[gas.key] = _.values(state[dataPrefix + gas.suffix]);
        });
      } else if (aggregation === AggregationEnum.STATE || county === '') {
        dataPrefix += 'States';
        dataSuffixes.forEach((gas) => {
          visibleData[gas.key] = _.values(state[dataPrefix + gas.suffix][selectedState]);
        });
      } else if (aggregation === AggregationEnum.COUNTY) {
        dataPrefix += 'Counties';
        dataSuffixes.forEach((gas) => {
          visibleData[gas.key] = _.values(state[dataPrefix + gas.suffix][selectedState][county]);
        });
      }

      return {
        ...state,
        newVisibleData: visibleData,
      };

    case RESET_MONTHLY_EMISSIONS:
      return initialState;

    case SET_DOWNLOAD_DATA:

      let downloadableData = [];
      downloadableData.push(extractDownloadStructure('SO2', 'emissions', state.newEmissionsRegionSo2));
      downloadableData.push(extractDownloadStructure('NOX', 'emissions', state.newEmissionsRegionNox));
      downloadableData.push(extractDownloadStructure('CO2', 'emissions', state.newEmissionsRegionCo2));

      downloadableData.push(extractDownloadStructure('SO2', 'percentages', state.newPercentagesRegionSo2));
      downloadableData.push(extractDownloadStructure('NOX', 'percentages', state.newPercentagesRegionNox));
      downloadableData.push(extractDownloadStructure('CO2', 'percentages', state.newPercentagesRegionCo2));

      state.newStates.forEach((thisState) => {
        downloadableData.push(extractDownloadStructure('SO2', 'emissions', state.newEmissionsStatesSo2[thisState], thisState));
        downloadableData.push(extractDownloadStructure('NOX', 'emissions', state.newEmissionsStatesNox[thisState], thisState));
        downloadableData.push(extractDownloadStructure('CO2', 'emissions', state.newEmissionsStatesCo2[thisState], thisState));

        downloadableData.push(extractDownloadStructure('SO2', 'percentages', state.newPercentagesStatesSo2[thisState], thisState));
        downloadableData.push(extractDownloadStructure('NOX', 'percentages', state.newPercentagesStatesNox[thisState], thisState));
        downloadableData.push(extractDownloadStructure('CO2', 'percentages', state.newPercentagesStatesCo2[thisState], thisState));

        state.newCounties[thisState].forEach((county) => {
          downloadableData.push(extractDownloadStructure('SO2', 'emissions', state.newEmissionsCountiesSo2[thisState][county], thisState, county));
          downloadableData.push(extractDownloadStructure('NOX', 'emissions', state.newEmissionsCountiesNox[thisState][county], thisState, county));
          downloadableData.push(extractDownloadStructure('CO2', 'emissions', state.newEmissionsCountiesCo2[thisState][county], thisState, county));

          downloadableData.push(extractDownloadStructure('SO2', 'percentages', state.newPercentagesCountiesSo2[thisState][county], thisState, county));
          downloadableData.push(extractDownloadStructure('NOX', 'percentages', state.newPercentagesCountiesNox[thisState][county], thisState, county));
          downloadableData.push(extractDownloadStructure('CO2', 'percentages', state.newPercentagesCountiesCo2[thisState][county], thisState, county));
        });
      });

      return {
        ...state,
        newDownloadableData: downloadableData,
      };

    default:
      return state;
  }
};


export default monthlyEmissionsReducer;
