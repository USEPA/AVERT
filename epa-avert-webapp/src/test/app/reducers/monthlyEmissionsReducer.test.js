// import expect from 'expect';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import _ from 'lodash';
import monthlyEmissionsReducer from '../../../app/redux/monthlyEmissions';
import { MonthlyUnitEnum } from '../../../app/utils/MonthlyUnitEnum';
import { StatusEnum } from '../../../app/utils/StatusEnum';
import { AggregationEnum } from '../../../app/utils/AggregationEnum';

import {
  COMPLETE_MONTHLY_EMISSIONS,
  SELECT_MONTHLY_STATE,
  SELECT_MONTHLY_COUNTY,
  SELECT_MONTHLY_UNIT,
  RENDER_MONTHLY_EMISSIONS_CHARTS,
  SET_DOWNLOAD_DATA,
  renderMonthlyEmissionsCharts,
  completeMonthlyEmissions,
  selectMonthlyUnit,
  selectMonthlyState,
  selectMonthlyCounty,
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
        selectedAggregation: AggregationEnum.REGION,
        newSelectedState: '',
        newSelectedCounty: '',
        selectedUnit: MonthlyUnitEnum.EMISSION,
        newRawData: {},
        emissionsRegionSo2: [],
        emissionsRegionNox: [],
        emissionsRegionCo2: [],
        emissionsStatesSo2: {},
        emissionsStatesNox: {},
        emissionsStatesCo2: {},
        emissionsCountiesSo2: {},
        emissionsCountiesNox: {},
        emissionsCountiesCo2: {},
        percentagesRegionSo2: [],
        percentagesRegionNox: [],
        percentagesRegionCo2: [],
        percentagesStatesSo2: {},
        percentagesStatesNox: {},
        percentagesStatesCo2: {},
        percentagesCountiesSo2: {},
        percentagesCountiesNox: {},
        percentagesCountiesCo2: {},
        newStates: [],
        newCounties: {},
        newVisibleCounties: [],
        visibleData: { so2: [], nox: [], co2: [] },
        downloadableData: [],
      });
    });

    it('should handle COMPLETE_MONTHLY_EMISSIONS', () => {
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
          type: COMPLETE_MONTHLY_EMISSIONS,
          data: data,
        }))
        .toEqual({
          status: StatusEnum.DONE,
          newRawData: data,
          emissionsRegionSo2: data.emissions.so2.regional,
          emissionsRegionNox: data.emissions.nox.regional,
          emissionsRegionCo2: data.emissions.co2.regional,
          emissionsStatesSo2: data.emissions.so2.state,
          emissionsStatesNox: data.emissions.nox.state,
          emissionsStatesCo2: data.emissions.co2.state,
          emissionsCountiesSo2: data.emissions.so2.county,
          emissionsCountiesNox: data.emissions.nox.county,
          emissionsCountiesCo2: data.emissions.co2.county,
          percentagesRegionSo2: data.percentages.so2.regional,
          percentagesRegionNox: data.percentages.nox.regional,
          percentagesRegionCo2: data.percentages.co2.regional,
          percentagesStatesSo2: data.percentages.so2.state,
          percentagesStatesNox: data.percentages.nox.state,
          percentagesStatesCo2: data.percentages.co2.state,
          percentagesCountiesSo2: data.percentages.so2.county,
          percentagesCountiesNox: data.percentages.nox.county,
          percentagesCountiesCo2: data.percentages.co2.county,
          newStates: Object.keys(data.statesAndCounties),
          newCounties: data.statesAndCounties,
        });
    });

    it('should handle SELECT_MONTHLY_STATE', () => {
      expect(
        monthlyEmissionsReducer([], {
          type: SELECT_MONTHLY_STATE,
          state: 'Virginia',
          visibleCounties: ['Arlington County']
        }))
        .toEqual({
          newSelectedState: 'Virginia',
          newSelectedCounty: '',
          newVisibleCounties: ['Arlington County'],
        });
    });

    it('should handle SELECT_MONTHLY_COUNTY', () => {
      expect(
        monthlyEmissionsReducer([], {
          type: SELECT_MONTHLY_COUNTY,
          county: 'Arlington County',
        }))
        .toEqual({
          newSelectedCounty: 'Arlington County',
        });
    });

    it('should handle SELECT_MONTHLY_UNIT', () => {
      expect(
        monthlyEmissionsReducer([], {
          type: SELECT_MONTHLY_UNIT,
          unit: MonthlyUnitEnum.PERCENT_CHANGE,
        }))
        .toEqual({
          selectedUnit: MonthlyUnitEnum.PERCENT_CHANGE,
        });
    });

    //TODO: Why is this returning nothing?
    // it('should handle RENDER_MONTHLY_EMISSIONS_CHARTS', () => {
    //   expect(
    //     monthlyEmissionsReducer([], {
    //       type: RENDER_MONTHLY_EMISSIONS_CHARTS,
    //       visibleData: { so2: { 1: 123, 2: 456, 3: 789 }, nox: { 1: 123, 2: 456, 3: 789 }, co2: { 1: 123, 2: 456, 3: 789 } },
    //     }))
    //     .toEqual({
    //       visibleData: { so2: { 1: 123, 2: 456, 3: 789 }, nox: { 1: 123, 2: 456, 3: 789 }, co2: { 1: 123, 2: 456, 3: 789 } },
    //     });
    // });
  });

  describe('Actions',() => {
    it('should create an action to render monthly charts with regional data if aggregation is region and unit is emissions', () => {
      const sampleData = { so2: { 1: 123, 2: 456, 3: 789 }, nox: { 1: 123, 2: 456, 3: 789 }, co2: { 1: 123, 2: 456, 3: 789 } };
      const monthlyEmissions = {
        selectedAggregation: 'region',
        selectedUnit: MonthlyUnitEnum.EMISSION,
        emissionsRegionSo2: _.values(sampleData.so2),
        emissionsRegionNox: _.values(sampleData.nox),
        emissionsRegionCo2: _.values(sampleData.co2),
      };
      // newSelectedState: '',
      // newSelectedCounty: '',
      expect(
        renderMonthlyEmissionsCharts(monthlyEmissions)
      ).toEqual({
        type: RENDER_MONTHLY_EMISSIONS_CHARTS
      })
    });

    it('should create an action to render monthly charts with regional percentages if aggregation is region and unit is percentage', () => {
      const badSampleData = { so2: { 1: 0 }, nox: { 1: 0 }, co2: { 1: 0 } };
      const sampleData = { so2: { 1: 123, 2: 456, 3: 789 }, nox: { 1: 123, 2: 456, 3: 789 }, co2: { 1: 123, 2: 456, 3: 789 } };
      const monthlyEmissions = {
        selectedAggregation: 'region',
        selectedUnit: MonthlyUnitEnum.PERCENT_CHANGE,
        emissionsRegionSo2: _.values(badSampleData.so2),
        emissionsRegionNox: _.values(badSampleData.nox),
        emissionsRegionCo2: _.values(badSampleData.co2),
        percentagesRegionSo2: _.values(sampleData.so2),
        percentagesRegionNox: _.values(sampleData.nox),
        percentagesRegionCo2: _.values(sampleData.co2),
      };
      // newSelectedState: '',
      // newSelectedCounty: '',
      expect(
        renderMonthlyEmissionsCharts(monthlyEmissions)
      ).toEqual({
        type: RENDER_MONTHLY_EMISSIONS_CHARTS,
      })
    });

    it('should create an action with state emission data if the aggregation is state and unit is emissions', () => {
      const badSampleData = { so2: { 1: 0 }, nox: { 1: 0 }, co2: { 1: 0 } };
      const goodSampleData = { so2: { 1: 123, 2: 456, 3: 789 }, nox: { 1: 123, 2: 456, 3: 789 }, co2: { 1: 123, 2: 456, 3: 789 } };
      const monthlyEmissions = {
        selectedAggregation: 'state',
        selectedUnit: MonthlyUnitEnum.EMISSION,
        newSelectedState: 'Virginia',
        emissionsRegionSo2: _.values(badSampleData.so2),
        emissionsRegionNox: _.values(badSampleData.nox),
        emissionsRegionCo2: _.values(badSampleData.co2),
        newEmissionsStateSo2: { 'Virginia': _.values(goodSampleData.so2) },
        newEmissionsStateNox: { 'Virginia': _.values(goodSampleData.nox) },
        newEmissionsStateCo2: { 'Virginia': _.values(goodSampleData.co2) },
      };

      expect(
        renderMonthlyEmissionsCharts(monthlyEmissions)
      ).toEqual({
        type: RENDER_MONTHLY_EMISSIONS_CHARTS,
      });

      expect(
        renderMonthlyEmissionsCharts(monthlyEmissions)
      ).not.toEqual({
        type: RENDER_MONTHLY_EMISSIONS_CHARTS,
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
        selectedAggregation: 'state',
        selectedUnit: MonthlyUnitEnum.PERCENT_CHANGE,
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
        type: RENDER_MONTHLY_EMISSIONS_CHARTS,
      });

      expect(
        renderMonthlyEmissionsCharts(monthlyEmissions)
      ).not.toEqual({
        type: RENDER_MONTHLY_EMISSIONS_CHARTS,
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
        selectedAggregation: 'county',
        selectedUnit: MonthlyUnitEnum.EMISSION,
        newSelectedState: 'Virginia',
        newSelectedCounty: 'Arlington County',
        emissionsRegionSo2: _.values(badSampleData.so2),
        emissionsRegionNox: _.values(badSampleData.nox),
        emissionsRegionCo2: _.values(badSampleData.co2),
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
        type: RENDER_MONTHLY_EMISSIONS_CHARTS,
      });

      expect(
        renderMonthlyEmissionsCharts(monthlyEmissions)
      ).not.toEqual({
        type: RENDER_MONTHLY_EMISSIONS_CHARTS,
        visibleData: {
          so2: [0],
          nox: [0],
          co2: [0],
        },
      });

      expect(
        renderMonthlyEmissionsCharts(monthlyEmissions)
      ).not.toEqual({
        type: RENDER_MONTHLY_EMISSIONS_CHARTS,
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
        selectedAggregation: 'county',
        selectedUnit: MonthlyUnitEnum.PERCENT_CHANGE,
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
        type: RENDER_MONTHLY_EMISSIONS_CHARTS,
      });

      expect(
        renderMonthlyEmissionsCharts(monthlyEmissions)
      ).not.toEqual({
        type: RENDER_MONTHLY_EMISSIONS_CHARTS,
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
        selectedAggregation: 'region',
        selectedUnit: MonthlyUnitEnum.EMISSION,
        emissionsRegionSo2: _.values(sampleData.so2),
        emissionsRegionNox: _.values(sampleData.nox),
        emissionsRegionCo2: _.values(sampleData.co2),
      }});

      const expectedActions = [
        { type: COMPLETE_MONTHLY_EMISSIONS, data: 'data' },
        { type: SET_DOWNLOAD_DATA, data: 'data'  },
        { type: RENDER_MONTHLY_EMISSIONS_CHARTS },
      ];

      store.dispatch(completeMonthlyEmissions('data'));
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should create an action when the unit is selected', () => {
      const sampleData = { so2: { 1: 123, 2: 456, 3: 789 }, nox: { 1: 123, 2: 456, 3: 789 }, co2: { 1: 123, 2: 456, 3: 789 } };
      const store = mockStore({ monthlyEmissions: {
        selectedAggregation: 'region',
        selectedUnit: MonthlyUnitEnum.EMISSION,
        emissionsRegionSo2: _.values(sampleData.so2),
        emissionsRegionNox: _.values(sampleData.nox),
        emissionsRegionCo2: _.values(sampleData.co2),
      }});
      const expectedActions = [
        { type: SELECT_MONTHLY_UNIT, unit: 'emissions' },
        { type: RENDER_MONTHLY_EMISSIONS_CHARTS },
      ];

      store.dispatch(selectMonthlyUnit('emissions'));
      expect(store.getActions()).toEqual(expectedActions);
    });

    //TODO: selectMonthlyState function is not pure.
    // it('should create an action when the state aggregation is selected', () => {
    //   const sampleData = { so2: { 1: 123, 2: 456, 3: 789 }, nox: { 1: 123, 2: 456, 3: 789 }, co2: { 1: 123, 2: 456, 3: 789 } };
    //   const store = mockStore({ monthlyEmissions: {
    //     selectedAggregation: 'region',
    //     selectedUnit: MonthlyUnitEnum.EMISSION,
    //     emissionsRegionSo2: _.values(sampleData.so2),
    //     emissionsRegionNox: _.values(sampleData.nox),
    //     emissionsRegionCo2: _.values(sampleData.co2),
    //   }});
    //   const expectedActions = [
    //     { type: SELECT_MONTHLY_STATE, state: 'Virginia' },
    //     { type: RENDER_MONTHLY_EMISSIONS_CHARTS, visibleData: { so2: _.values(sampleData.so2), nox: _.values(sampleData.nox), co2: _.values(sampleData.co2) } },
    //   ];
    //
    //   store.dispatch(selectMonthlyState('Virginia'));
    //   expect(store.getActions()).toEqual(expectedActions);
    // });

    it('should create an action when the county aggregation is selected', () => {
      const sampleData = { so2: { 1: 123, 2: 456, 3: 789 }, nox: { 1: 123, 2: 456, 3: 789 }, co2: { 1: 123, 2: 456, 3: 789 } };
      const store = mockStore({ monthlyEmissions: {
        selectedAggregation: 'region',
        selectedUnit: MonthlyUnitEnum.EMISSION,
        emissionsRegionSo2: _.values(sampleData.so2),
        emissionsRegionNox: _.values(sampleData.nox),
        emissionsRegionCo2: _.values(sampleData.co2),
      }});
      const expectedActions = [
        { type: SELECT_MONTHLY_COUNTY, county: 'Montgomery County' },
        { type: RENDER_MONTHLY_EMISSIONS_CHARTS },
      ];

      store.dispatch(selectMonthlyCounty('Montgomery County'));
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
