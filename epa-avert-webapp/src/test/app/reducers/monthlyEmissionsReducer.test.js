import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import monthlyEmissionsReducer, {
  RENDER_MONTHLY_EMISSIONS_CHARTS,
  COMPLETE_MONTHLY_EMISSIONS,
  SET_DOWNLOAD_DATA,
  SELECT_MONTHLY_UNIT,
  SELECT_MONTHLY_STATE,
  SELECT_MONTHLY_COUNTY,
  renderMonthlyEmissionsCharts,
  completeMonthlyEmissions,
  selectMonthlyUnit,
  selectMonthlyState,
  selectMonthlyCounty,
} from 'app/redux/monthlyEmissions';

const mockStore = configureMockStore([thunk]);

describe('monthlyEmissions', () => {
  describe('Reducer', () => {
    it('should return an initial state', () => {
      expect(monthlyEmissionsReducer(undefined, {})).toEqual({
        status: 'select_region',
        aggregation: 'region',
        unit: 'emissions',
        availableStates: [],
        availableCounties: [],
        selectedState: '',
        selectedCounty: '',
        data: {},
        output: {
          so2: [],
          nox: [],
          co2: [],
          pm25: [],
        },
        downloadableData: [],
      });
    });

    it('should handle COMPLETE_MONTHLY_EMISSIONS', () => {
      const stateData = { Virginia: [1, 2, 3] };
      const countyData = { 'Arlington County': [4, 5, 6] };
      const data = {
        statesAndCounties: {
          Maryland: ['Montgomery County', "Prince George's County"],
          Virginia: ['Arlington County'],
        },
        emissions: {
          generation: {
            regional: [1, 2, 3],
            state: stateData,
            county: countyData,
          },
          so2: { regional: [4, 5, 6], state: stateData, county: countyData },
          nox: { regional: [7, 8, 9], state: stateData, county: countyData },
          co2: { regional: [10, 11, 12], state: stateData, county: countyData },
          pm25: {
            regional: [13, 14, 15],
            state: stateData,
            county: countyData,
          },
        },
        percentages: {
          generation: {
            regional: [15, 14, 13],
            state: stateData,
            county: countyData,
          },
          so2: { regional: [12, 11, 10], state: stateData, county: countyData },
          nox: { regional: [9, 8, 7], state: stateData, county: countyData },
          co2: { regional: [6, 5, 4], state: stateData, county: countyData },
          pm25: { regional: [3, 2, 1], state: stateData, county: countyData },
        },
      };

      expect(
        monthlyEmissionsReducer([], {
          type: COMPLETE_MONTHLY_EMISSIONS,
          data: data,
        }),
      ).toEqual({
        status: 'complete',
        data: data,
        availableStates: ['Maryland', 'Virginia'],
      });
    });

    it('should handle SELECT_MONTHLY_STATE', () => {
      expect(
        monthlyEmissionsReducer([], {
          type: SELECT_MONTHLY_STATE,
          selectedState: 'Virginia',
          availableCounties: ['Arlington County'],
        }),
      ).toEqual({
        selectedState: 'Virginia',
        selectedCounty: '',
        availableCounties: ['Arlington County'],
      });
    });

    it('should handle SELECT_MONTHLY_COUNTY', () => {
      expect(
        monthlyEmissionsReducer([], {
          type: SELECT_MONTHLY_COUNTY,
          selectedCounty: 'Arlington County',
        }),
      ).toEqual({
        selectedCounty: 'Arlington County',
      });
    });

    it('should handle SELECT_MONTHLY_UNIT', () => {
      expect(
        monthlyEmissionsReducer([], {
          type: SELECT_MONTHLY_UNIT,
          unit: 'percentages',
        }),
      ).toEqual({
        unit: 'percentages',
      });
    });
  });

  describe('Actions', () => {
    it('should create an action to render monthly charts with regional data if aggregation is region and unit is emissions', () => {
      const sampleData = {
        so2: { 1: 123, 2: 456, 3: 789 },
        nox: { 1: 123, 2: 456, 3: 789 },
        co2: { 1: 123, 2: 456, 3: 789 },
      };
      const monthlyEmissions = {
        aggregation: 'region',
        unit: 'emission',
        emissionsRegionSo2: Object.values(sampleData.so2),
        emissionsRegionNox: Object.values(sampleData.nox),
        emissionsRegionCo2: Object.values(sampleData.co2),
      };
      expect(renderMonthlyEmissionsCharts(monthlyEmissions)).toEqual({
        type: RENDER_MONTHLY_EMISSIONS_CHARTS,
      });
    });

    it('should create an action to render monthly charts with regional percentages if aggregation is region and unit is percentage', () => {
      const badSampleData = { so2: { 1: 0 }, nox: { 1: 0 }, co2: { 1: 0 } };
      const sampleData = {
        so2: { 1: 123, 2: 456, 3: 789 },
        nox: { 1: 123, 2: 456, 3: 789 },
        co2: { 1: 123, 2: 456, 3: 789 },
      };
      const monthlyEmissions = {
        aggregation: 'region',
        unit: 'percent',
        emissionsRegionSo2: Object.values(badSampleData.so2),
        emissionsRegionNox: Object.values(badSampleData.nox),
        emissionsRegionCo2: Object.values(badSampleData.co2),
        percentagesRegionSo2: Object.values(sampleData.so2),
        percentagesRegionNox: Object.values(sampleData.nox),
        percentagesRegionCo2: Object.values(sampleData.co2),
      };
      expect(renderMonthlyEmissionsCharts(monthlyEmissions)).toEqual({
        type: RENDER_MONTHLY_EMISSIONS_CHARTS,
      });
    });

    it('should create an action with state emission data if the aggregation is state and unit is emissions', () => {
      const badSampleData = { so2: { 1: 0 }, nox: { 1: 0 }, co2: { 1: 0 } };
      const goodSampleData = {
        so2: { 1: 123, 2: 456, 3: 789 },
        nox: { 1: 123, 2: 456, 3: 789 },
        co2: { 1: 123, 2: 456, 3: 789 },
      };
      const monthlyEmissions = {
        aggregation: 'state',
        unit: 'emission',
        newSelectedState: 'Virginia',
        emissionsRegionSo2: Object.values(badSampleData.so2),
        emissionsRegionNox: Object.values(badSampleData.nox),
        emissionsRegionCo2: Object.values(badSampleData.co2),
        newEmissionsStateSo2: { Virginia: Object.values(goodSampleData.so2) },
        newEmissionsStateNox: { Virginia: Object.values(goodSampleData.nox) },
        newEmissionsStateCo2: { Virginia: Object.values(goodSampleData.co2) },
      };

      expect(renderMonthlyEmissionsCharts(monthlyEmissions)).toEqual({
        type: RENDER_MONTHLY_EMISSIONS_CHARTS,
      });

      expect(renderMonthlyEmissionsCharts(monthlyEmissions)).not.toEqual({
        type: RENDER_MONTHLY_EMISSIONS_CHARTS,
        output: {
          so2: [0],
          nox: [0],
          co2: [0],
        },
      });
    });

    it('should create an action with state percentage data if the aggregation is state and unit is percentage', () => {
      const badSampleData = { so2: { 1: 0 }, nox: { 1: 0 }, co2: { 1: 0 } };
      const goodSampleData = {
        so2: { 1: 123, 2: 456, 3: 789 },
        nox: { 1: 123, 2: 456, 3: 789 },
        co2: { 1: 123, 2: 456, 3: 789 },
      };
      const monthlyEmissions = {
        aggregation: 'state',
        unit: 'percent',
        newSelectedState: 'Virginia',
        newEmissionsStateSo2: { Virginia: Object.values(badSampleData.so2) },
        newEmissionsStateNox: { Virginia: Object.values(badSampleData.nox) },
        newEmissionsStateCo2: { Virginia: Object.values(badSampleData.co2) },
        newPercentagesStateSo2: { Virginia: Object.values(goodSampleData.so2) },
        newPercentagesStateNox: { Virginia: Object.values(goodSampleData.nox) },
        newPercentagesStateCo2: { Virginia: Object.values(goodSampleData.co2) },
      };

      expect(renderMonthlyEmissionsCharts(monthlyEmissions)).toEqual({
        type: RENDER_MONTHLY_EMISSIONS_CHARTS,
      });

      expect(renderMonthlyEmissionsCharts(monthlyEmissions)).not.toEqual({
        type: RENDER_MONTHLY_EMISSIONS_CHARTS,
        output: {
          so2: [0],
          nox: [0],
          co2: [0],
        },
      });
    });

    it('should create an action with county emission data if the aggregation is county and unit is emissions', () => {
      const badSampleData = { so2: { 1: 0 }, nox: { 1: 0 }, co2: { 1: 0 } };
      const badSampleData2 = { so2: { 1: 1 }, nox: { 1: 1 }, co2: { 1: 1 } };
      const goodSampleData = {
        so2: { 1: 123, 2: 456, 3: 789 },
        nox: { 1: 123, 2: 456, 3: 789 },
        co2: { 1: 123, 2: 456, 3: 789 },
      };
      const monthlyEmissions = {
        aggregation: 'county',
        unit: 'emission',
        newSelectedState: 'Virginia',
        newSelectedCounty: 'Arlington County',
        emissionsRegionSo2: Object.values(badSampleData.so2),
        emissionsRegionNox: Object.values(badSampleData.nox),
        emissionsRegionCo2: Object.values(badSampleData.co2),
        newEmissionsStateSo2: { Virginia: Object.values(badSampleData2.so2) },
        newEmissionsStateNox: { Virginia: Object.values(badSampleData2.nox) },
        newEmissionsStateCo2: { Virginia: Object.values(badSampleData2.co2) },
        newEmissionsCountySo2: {
          Virginia: { 'Arlington County': Object.values(goodSampleData.so2) },
        },
        newEmissionsCountyNox: {
          Virginia: { 'Arlington County': Object.values(goodSampleData.nox) },
        },
        newEmissionsCountyCo2: {
          Virginia: { 'Arlington County': Object.values(goodSampleData.co2) },
        },
      };

      expect(renderMonthlyEmissionsCharts(monthlyEmissions)).toEqual({
        type: RENDER_MONTHLY_EMISSIONS_CHARTS,
      });

      expect(renderMonthlyEmissionsCharts(monthlyEmissions)).not.toEqual({
        type: RENDER_MONTHLY_EMISSIONS_CHARTS,
        output: {
          so2: [0],
          nox: [0],
          co2: [0],
        },
      });

      expect(renderMonthlyEmissionsCharts(monthlyEmissions)).not.toEqual({
        type: RENDER_MONTHLY_EMISSIONS_CHARTS,
        output: {
          so2: [1],
          nox: [1],
          co2: [1],
        },
      });
    });

    it('should create an action with county percentage data if the aggregation is county and unit is percentage', () => {
      const badSampleData = { so2: { 1: 0 }, nox: { 1: 0 }, co2: { 1: 0 } };
      const goodSampleData = {
        so2: { 1: 123, 2: 456, 3: 789 },
        nox: { 1: 123, 2: 456, 3: 789 },
        co2: { 1: 123, 2: 456, 3: 789 },
      };
      const monthlyEmissions = {
        aggregation: 'county',
        unit: 'percent',
        newSelectedState: 'Virginia',
        newSelectedCounty: 'Arlington County',
        newEmissionsCountySo2: {
          Virginia: { 'Arlington County': Object.values(badSampleData.so2) },
        },
        newEmissionsCountyNox: {
          Virginia: { 'Arlington County': Object.values(badSampleData.nox) },
        },
        newEmissionsCountyCo2: {
          Virginia: { 'Arlington County': Object.values(badSampleData.co2) },
        },
        newPercentagesCountySo2: {
          Virginia: { 'Arlington County': Object.values(goodSampleData.so2) },
        },
        newPercentagesCountyNox: {
          Virginia: { 'Arlington County': Object.values(goodSampleData.nox) },
        },
        newPercentagesCountyCo2: {
          Virginia: { 'Arlington County': Object.values(goodSampleData.co2) },
        },
      };

      expect(renderMonthlyEmissionsCharts(monthlyEmissions)).toEqual({
        type: RENDER_MONTHLY_EMISSIONS_CHARTS,
      });

      expect(renderMonthlyEmissionsCharts(monthlyEmissions)).not.toEqual({
        type: RENDER_MONTHLY_EMISSIONS_CHARTS,
        output: {
          so2: [0],
          nox: [0],
          co2: [0],
        },
      });
    });

    it('should create an action when the AVERT engine completed the monthly emissions', () => {
      const sampleData = {
        so2: { 1: 123, 2: 456, 3: 789 },
        nox: { 1: 123, 2: 456, 3: 789 },
        co2: { 1: 123, 2: 456, 3: 789 },
      };
      const store = mockStore({
        monthlyEmissions: {
          aggregation: 'region',
          unit: 'emission',
          emissionsRegionSo2: Object.values(sampleData.so2),
          emissionsRegionNox: Object.values(sampleData.nox),
          emissionsRegionCo2: Object.values(sampleData.co2),
        },
      });

      const expectedActions = [
        { type: COMPLETE_MONTHLY_EMISSIONS, data: 'data' },
        { type: SET_DOWNLOAD_DATA },
        { type: RENDER_MONTHLY_EMISSIONS_CHARTS },
      ];

      store.dispatch(completeMonthlyEmissions('data'));
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should create an action when the unit is selected', () => {
      const sampleData = {
        so2: { 1: 123, 2: 456, 3: 789 },
        nox: { 1: 123, 2: 456, 3: 789 },
        co2: { 1: 123, 2: 456, 3: 789 },
      };
      const store = mockStore({
        monthlyEmissions: {
          aggregation: 'region',
          unit: 'emission',
          emissionsRegionSo2: Object.values(sampleData.so2),
          emissionsRegionNox: Object.values(sampleData.nox),
          emissionsRegionCo2: Object.values(sampleData.co2),
        },
      });
      const expectedActions = [
        { type: SELECT_MONTHLY_UNIT, unit: 'emissions' },
        { type: RENDER_MONTHLY_EMISSIONS_CHARTS },
      ];

      store.dispatch(selectMonthlyUnit('emissions'));
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should create an action when the county aggregation is selected', () => {
      const sampleData = {
        so2: { 1: 123, 2: 456, 3: 789 },
        nox: { 1: 123, 2: 456, 3: 789 },
        co2: { 1: 123, 2: 456, 3: 789 },
      };
      const store = mockStore({
        monthlyEmissions: {
          aggregation: 'region',
          unit: 'emission',
          emissionsRegionSo2: Object.values(sampleData.so2),
          emissionsRegionNox: Object.values(sampleData.nox),
          emissionsRegionCo2: Object.values(sampleData.co2),
        },
      });
      const expectedActions = [
        { type: SELECT_MONTHLY_COUNTY, selectedCounty: 'Montgomery County' },
        { type: RENDER_MONTHLY_EMISSIONS_CHARTS },
      ];

      store.dispatch(selectMonthlyCounty('Montgomery County'));
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
