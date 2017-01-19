// import expect from 'expect';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import _ from 'lodash';
import monthlyEmissionsReducer from '../../../app/reducers/monthlyEmissionsReducer';
import { MonthlyUnitEnum } from '../../../app/utils/MonthlyUnitEnum';
import { StatusEnum } from '../../../app/utils/StatusEnum';
import { AggregationEnum } from '../../../app/utils/AggregationEnum';

import {
  COMPLETE_MONTHLY,
  RESELECT_REGION,
  SELECT_STATE,
  SELECT_COUNTY,
  SELECT_UNIT,
  RENDER_MONTHLY_CHARTS,
  SET_DOWNLOAD_DATA,
  renderMonthlyEmissionsCharts,
  completeMonthlyEmissions,
  updateMonthlyUnit,
  selectState,
  selectCounty,
} from '../../../app/actions';

const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);

describe('monthlyEmissions', () => {
  describe('Reducer', () => {
    it('should return an initial state', () => {
      expect(
        monthlyEmissionsReducer(undefined, {})
      ).toEqual({
        status: StatusEnum.READY,
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
        newVisibleData: { so2: [], nox: [], co2: [] },
        newDownloadableData: [],
      });
    });

    it('should handle COMPLETE_MONTHLY', () => {
      const stateData = { 'Virginia': [1,2,3] };
      const countyData = { 'Arlington County': [4,5,6] };
      const data = {
        statesAndCounties: {
          'Maryland': ['Montgomery County', 'Prince George\'s County'],
          'Virginia': ['Arlington County']
        },
        emissions: {
          generation: {regional: [1, 2, 3], state: stateData, county: countyData},
          so2: {regional: [4, 5, 6], state: stateData, county: countyData},
          nox: {regional: [7, 8, 9], state: stateData, county: countyData},
          co2: {regional: [10, 11, 12], state: stateData, county: countyData},
        },
        percentages: {
          generation: { regional: [12,11,10], state: stateData, county: countyData },
          so2: { regional: [9,8,7], state: stateData, county: countyData },
          nox: { regional: [6,5,4], state: stateData, county: countyData },
          co2: { regional: [3,2,1], state: stateData, county: countyData },
        },
      };

      expect(
        monthlyEmissionsReducer([], {
          type: COMPLETE_MONTHLY,
          data: data,
        }))
        .toEqual({
          status: StatusEnum.DONE,
          newRawData: data,
          newEmissionsRegionSo2: data.emissions.so2.regional,
          newEmissionsRegionNox: data.emissions.nox.regional,
          newEmissionsRegionCo2: data.emissions.co2.regional,
          newEmissionsStatesSo2: data.emissions.so2.state,
          newEmissionsStatesNox: data.emissions.nox.state,
          newEmissionsStatesCo2: data.emissions.co2.state,
          newEmissionsCountiesSo2: data.emissions.so2.county,
          newEmissionsCountiesNox: data.emissions.nox.county,
          newEmissionsCountiesCo2: data.emissions.co2.county,
          newPercentagesRegionSo2: data.percentages.so2.regional,
          newPercentagesRegionNox: data.percentages.nox.regional,
          newPercentagesRegionCo2: data.percentages.co2.regional,
          newPercentagesStatesSo2: data.percentages.so2.state,
          newPercentagesStatesNox: data.percentages.nox.state,
          newPercentagesStatesCo2: data.percentages.co2.state,
          newPercentagesCountiesSo2: data.percentages.so2.county,
          newPercentagesCountiesNox: data.percentages.nox.county,
          newPercentagesCountiesCo2: data.percentages.co2.county,
          newStates: Object.keys(data.statesAndCounties),
          newCounties: data.statesAndCounties,
        });
    });

    it('should handle RESELECT_REGION', () => {
      expect(
        monthlyEmissionsReducer([], {
          type: RESELECT_REGION,
        }))
        .toEqual({
          newSelectedAggregation: "region",
          newSelectedCounty: "",
          newSelectedState: "",
        });
    });

    it('should handle SELECT_STATE', () => {
      expect(
        monthlyEmissionsReducer([], {
          type: SELECT_STATE,
          state: 'Virginia',
          visibleCounties: ['Arlington County']
        }))
        .toEqual({
          newSelectedState: 'Virginia',
          newSelectedCounty: '',
          newVisibleCounties: ['Arlington County'],
        });
    });

    it('should handle SELECT_COUNTY', () => {
      expect(
        monthlyEmissionsReducer([], {
          type: SELECT_COUNTY,
          county: 'Arlington County',
        }))
        .toEqual({
          newSelectedCounty: 'Arlington County',
        });
    });

    it('should handle SELECT_UNIT', () => {
      expect(
        monthlyEmissionsReducer([], {
          type: SELECT_UNIT,
          unit: MonthlyUnitEnum.PERCENT_CHANGE,
        }))
        .toEqual({
          newSelectedUnit: MonthlyUnitEnum.PERCENT_CHANGE,
        });
    });

    //TODO: Why is this returning nothing?
    // it('should handle RENDER_MONTHLY_CHARTS', () => {
    //   expect(
    //     monthlyEmissionsReducer([], {
    //       type: RENDER_MONTHLY_CHARTS,
    //       visibleData: { so2: { 1: 123, 2: 456, 3: 789 }, nox: { 1: 123, 2: 456, 3: 789 }, co2: { 1: 123, 2: 456, 3: 789 } },
    //     }))
    //     .toEqual({
    //       newVisibleData: { so2: { 1: 123, 2: 456, 3: 789 }, nox: { 1: 123, 2: 456, 3: 789 }, co2: { 1: 123, 2: 456, 3: 789 } },
    //     });
    // });
  });

  describe('Actions',() => {
    it('should create an action to render monthly charts with regional data if aggregation is region and unit is emissions', () => {
      const sampleData = { so2: { 1: 123, 2: 456, 3: 789 }, nox: { 1: 123, 2: 456, 3: 789 }, co2: { 1: 123, 2: 456, 3: 789 } };
      const monthlyEmissions = {
        newSelectedAggregation: 'region',
        newSelectedUnit: MonthlyUnitEnum.EMISSION,
        newEmissionsRegionSo2: _.values(sampleData.so2),
        newEmissionsRegionNox: _.values(sampleData.nox),
        newEmissionsRegionCo2: _.values(sampleData.co2),
      };
      // newSelectedState: '',
      // newSelectedCounty: '',
      expect(
        renderMonthlyEmissionsCharts(monthlyEmissions)
      ).toEqual({
        type: RENDER_MONTHLY_CHARTS
      })
    });

    it('should create an action to render monthly charts with regional percentages if aggregation is region and unit is percentage', () => {
      const badSampleData = { so2: { 1: 0 }, nox: { 1: 0 }, co2: { 1: 0 } };
      const sampleData = { so2: { 1: 123, 2: 456, 3: 789 }, nox: { 1: 123, 2: 456, 3: 789 }, co2: { 1: 123, 2: 456, 3: 789 } };
      const monthlyEmissions = {
        newSelectedAggregation: 'region',
        newSelectedUnit: MonthlyUnitEnum.PERCENT_CHANGE,
        newEmissionsRegionSo2: _.values(badSampleData.so2),
        newEmissionsRegionNox: _.values(badSampleData.nox),
        newEmissionsRegionCo2: _.values(badSampleData.co2),
        newPercentagesRegionSo2: _.values(sampleData.so2),
        newPercentagesRegionNox: _.values(sampleData.nox),
        newPercentagesRegionCo2: _.values(sampleData.co2),
      };
      // newSelectedState: '',
      // newSelectedCounty: '',
      expect(
        renderMonthlyEmissionsCharts(monthlyEmissions)
      ).toEqual({
        type: RENDER_MONTHLY_CHARTS,
      })
    });

    it('should create an action with state emission data if the aggregation is state and unit is emissions', () => {
      const badSampleData = { so2: { 1: 0 }, nox: { 1: 0 }, co2: { 1: 0 } };
      const goodSampleData = { so2: { 1: 123, 2: 456, 3: 789 }, nox: { 1: 123, 2: 456, 3: 789 }, co2: { 1: 123, 2: 456, 3: 789 } };
      const monthlyEmissions = {
        newSelectedAggregation: 'state',
        newSelectedUnit: MonthlyUnitEnum.EMISSION,
        newSelectedState: 'Virginia',
        newEmissionsRegionSo2: _.values(badSampleData.so2),
        newEmissionsRegionNox: _.values(badSampleData.nox),
        newEmissionsRegionCo2: _.values(badSampleData.co2),
        newEmissionsStateSo2: { 'Virginia': _.values(goodSampleData.so2) },
        newEmissionsStateNox: { 'Virginia': _.values(goodSampleData.nox) },
        newEmissionsStateCo2: { 'Virginia': _.values(goodSampleData.co2) },
      };

      expect(
        renderMonthlyEmissionsCharts(monthlyEmissions)
      ).toEqual({
        type: RENDER_MONTHLY_CHARTS,
      });

      expect(
        renderMonthlyEmissionsCharts(monthlyEmissions)
      ).not.toEqual({
        type: RENDER_MONTHLY_CHARTS,
        visibleData: {
          so2: [0],
          nox: [0],
          co2: [0],
        },
      });
    });

    it('should create an action with state percentage data if the aggregation is state and unit is percentage', () => {
      const badSampleData = { so2: { 1: 0 }, nox: { 1: 0 }, co2: { 1: 0 } };
      const goodSampleData = { so2: { 1: 123, 2: 456, 3: 789 }, nox: { 1: 123, 2: 456, 3: 789 }, co2: { 1: 123, 2: 456, 3: 789 } };
      const monthlyEmissions = {
        newSelectedAggregation: 'state',
        newSelectedUnit: MonthlyUnitEnum.PERCENT_CHANGE,
        newSelectedState: 'Virginia',
        newEmissionsStateSo2: { 'Virginia': _.values(badSampleData.so2) },
        newEmissionsStateNox: { 'Virginia': _.values(badSampleData.nox) },
        newEmissionsStateCo2: { 'Virginia': _.values(badSampleData.co2) },
        newPercentagesStateSo2: { 'Virginia': _.values(goodSampleData.so2) },
        newPercentagesStateNox: { 'Virginia': _.values(goodSampleData.nox) },
        newPercentagesStateCo2: { 'Virginia': _.values(goodSampleData.co2) },
      };

      expect(
        renderMonthlyEmissionsCharts(monthlyEmissions)
      ).toEqual({
        type: RENDER_MONTHLY_CHARTS,
      });

      expect(
        renderMonthlyEmissionsCharts(monthlyEmissions)
      ).not.toEqual({
        type: RENDER_MONTHLY_CHARTS,
        visibleData: {
          so2: [0],
          nox: [0],
          co2: [0],
        },
      });
    });

    it('should create an action with county emission data if the aggregation is county and unit is emissions', () => {
      const badSampleData = { so2: { 1: 0 }, nox: { 1: 0 }, co2: { 1: 0 } };
      const badSampleData2 = { so2: { 1: 1 }, nox: { 1: 1 }, co2: { 1: 1 } };
      const goodSampleData = { so2: { 1: 123, 2: 456, 3: 789 }, nox: { 1: 123, 2: 456, 3: 789 }, co2: { 1: 123, 2: 456, 3: 789 } };
      const monthlyEmissions = {
        newSelectedAggregation: 'county',
        newSelectedUnit: MonthlyUnitEnum.EMISSION,
        newSelectedState: 'Virginia',
        newSelectedCounty: 'Arlington County',
        newEmissionsRegionSo2: _.values(badSampleData.so2),
        newEmissionsRegionNox: _.values(badSampleData.nox),
        newEmissionsRegionCo2: _.values(badSampleData.co2),
        newEmissionsStateSo2: { 'Virginia': _.values(badSampleData2.so2) },
        newEmissionsStateNox: { 'Virginia': _.values(badSampleData2.nox) },
        newEmissionsStateCo2: { 'Virginia': _.values(badSampleData2.co2) },
        newEmissionsCountySo2: { 'Virginia': { 'Arlington County': _.values(goodSampleData.so2) } },
        newEmissionsCountyNox: { 'Virginia': { 'Arlington County': _.values(goodSampleData.nox) } },
        newEmissionsCountyCo2: { 'Virginia': { 'Arlington County': _.values(goodSampleData.co2) } },
      };

      expect(
        renderMonthlyEmissionsCharts(monthlyEmissions)
      ).toEqual({
        type: RENDER_MONTHLY_CHARTS,
      });

      expect(
        renderMonthlyEmissionsCharts(monthlyEmissions)
      ).not.toEqual({
        type: RENDER_MONTHLY_CHARTS,
        visibleData: {
          so2: [0],
          nox: [0],
          co2: [0],
        },
      });

      expect(
        renderMonthlyEmissionsCharts(monthlyEmissions)
      ).not.toEqual({
        type: RENDER_MONTHLY_CHARTS,
        visibleData: {
          so2: [1],
          nox: [1],
          co2: [1],
        },
      });
    });

    it('should create an action with county percentage data if the aggregation is county and unit is percentage', () => {
      const badSampleData = { so2: { 1: 0 }, nox: { 1: 0 }, co2: { 1: 0 } };
      const goodSampleData = { so2: { 1: 123, 2: 456, 3: 789 }, nox: { 1: 123, 2: 456, 3: 789 }, co2: { 1: 123, 2: 456, 3: 789 } };
      const monthlyEmissions = {
        newSelectedAggregation: 'county',
        newSelectedUnit: MonthlyUnitEnum.PERCENT_CHANGE,
        newSelectedState: 'Virginia',
        newSelectedCounty: 'Arlington County',
        newEmissionsCountySo2: { 'Virginia': { 'Arlington County': _.values(badSampleData.so2) } },
        newEmissionsCountyNox: { 'Virginia': { 'Arlington County': _.values(badSampleData.nox) } },
        newEmissionsCountyCo2: { 'Virginia': { 'Arlington County': _.values(badSampleData.co2) } },
        newPercentagesCountySo2: { 'Virginia': { 'Arlington County': _.values(goodSampleData.so2) } },
        newPercentagesCountyNox: { 'Virginia': { 'Arlington County': _.values(goodSampleData.nox) } },
        newPercentagesCountyCo2: { 'Virginia': { 'Arlington County': _.values(goodSampleData.co2) } },
      };

      expect(
        renderMonthlyEmissionsCharts(monthlyEmissions)
      ).toEqual({
        type: RENDER_MONTHLY_CHARTS,
      });

      expect(
        renderMonthlyEmissionsCharts(monthlyEmissions)
      ).not.toEqual({
        type: RENDER_MONTHLY_CHARTS,
        visibleData: {
          so2: [0],
          nox: [0],
          co2: [0],
        },
      });
    });

    it('should create an action when the AVERT engine completed the monthly emissions', () => {
      const sampleData = { so2: { 1: 123, 2: 456, 3: 789 }, nox: { 1: 123, 2: 456, 3: 789 }, co2: { 1: 123, 2: 456, 3: 789 } };
      const store = mockStore({ monthlyEmissions: {
        newSelectedAggregation: 'region',
        newSelectedUnit: MonthlyUnitEnum.EMISSION,
        newEmissionsRegionSo2: _.values(sampleData.so2),
        newEmissionsRegionNox: _.values(sampleData.nox),
        newEmissionsRegionCo2: _.values(sampleData.co2),
      }});

      const expectedActions = [
        { type: COMPLETE_MONTHLY, data: 'data' },
        { type: SET_DOWNLOAD_DATA, data: 'data'  },
        { type: RENDER_MONTHLY_CHARTS },
      ];

      store.dispatch(completeMonthlyEmissions('data'));
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should create an action when the unit is selected', () => {
      const sampleData = { so2: { 1: 123, 2: 456, 3: 789 }, nox: { 1: 123, 2: 456, 3: 789 }, co2: { 1: 123, 2: 456, 3: 789 } };
      const store = mockStore({ monthlyEmissions: {
        newSelectedAggregation: 'region',
        newSelectedUnit: MonthlyUnitEnum.EMISSION,
        newEmissionsRegionSo2: _.values(sampleData.so2),
        newEmissionsRegionNox: _.values(sampleData.nox),
        newEmissionsRegionCo2: _.values(sampleData.co2),
      }});
      const expectedActions = [
        { type: SELECT_UNIT, unit: 'emissions' },
        { type: RENDER_MONTHLY_CHARTS },
      ];

      store.dispatch(updateMonthlyUnit('emissions'));
      expect(store.getActions()).toEqual(expectedActions);
    });

    //TODO: selectState function is not pure.
    // it('should create an action when the state aggregation is selected', () => {
    //   const sampleData = { so2: { 1: 123, 2: 456, 3: 789 }, nox: { 1: 123, 2: 456, 3: 789 }, co2: { 1: 123, 2: 456, 3: 789 } };
    //   const store = mockStore({ monthlyEmissions: {
    //     newSelectedAggregation: 'region',
    //     newSelectedUnit: MonthlyUnitEnum.EMISSION,
    //     newEmissionsRegionSo2: _.values(sampleData.so2),
    //     newEmissionsRegionNox: _.values(sampleData.nox),
    //     newEmissionsRegionCo2: _.values(sampleData.co2),
    //   }});
    //   const expectedActions = [
    //     { type: SELECT_STATE, state: 'Virginia' },
    //     { type: RENDER_MONTHLY_CHARTS, visibleData: { so2: _.values(sampleData.so2), nox: _.values(sampleData.nox), co2: _.values(sampleData.co2) } },
    //   ];
    //
    //   store.dispatch(selectState('Virginia'));
    //   expect(store.getActions()).toEqual(expectedActions);
    // });

    it('should create an action when the county aggregation is selected', () => {
      const sampleData = { so2: { 1: 123, 2: 456, 3: 789 }, nox: { 1: 123, 2: 456, 3: 789 }, co2: { 1: 123, 2: 456, 3: 789 } };
      const store = mockStore({ monthlyEmissions: {
        newSelectedAggregation: 'region',
        newSelectedUnit: MonthlyUnitEnum.EMISSION,
        newEmissionsRegionSo2: _.values(sampleData.so2),
        newEmissionsRegionNox: _.values(sampleData.nox),
        newEmissionsRegionCo2: _.values(sampleData.co2),
      }});
      const expectedActions = [
        { type: SELECT_COUNTY, county: 'Montgomery County' },
        { type: RENDER_MONTHLY_CHARTS },
      ];

      store.dispatch(selectCounty('Montgomery County'));
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
