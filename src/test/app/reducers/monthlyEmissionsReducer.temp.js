// import expect from 'expect';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import monthlyEmissionsReducer from '../../../app/reducers/monthlyEmissionsReducer';
import {
  COMPLETE_MONTHLY,
  RESELECT_REGION,
  SELECT_STATE,
  SELECT_COUNTY,
  SELECT_UNIT,
  RENDER_MONTHLY_CHARTS,
  renderMonthlyEmissionsCharts,
  completeMonthlyEmissions,
  updateMonthlyUnit,
  reselectRegion,
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
        status: "select_region",
        new_selected_aggregation: 'region',
        new_selected_state: '',
        new_selected_county: '',
        new_selected_unit: '',
        new_raw_data: {},
        new_emissions_region_so2: [],
        new_emissions_region_nox: [],
        new_emissions_region_co2: [],
        new_emissions_states_so2: {},
        new_emissions_states_nox: {},
        new_emissions_states_co2: {},
        new_emissions_counties_so2: {},
        new_emissions_counties_nox: {},
        new_emissions_counties_co2: {},
        new_percentages_region_so2: [],
        new_percentages_region_nox: [],
        new_percentages_region_co2: [],
        new_percentages_states_so2: {},
        new_percentages_states_nox: {},
        new_percentages_states_co2: {},
        new_percentages_counties_so2: {},
        new_percentages_counties_nox: {},
        new_percentages_counties_co2: {},
        new_states: [],
        new_counties: {},
        new_visible_counties: [],
        new_visible_data: { so2: {}, nox: {}, co2: {} },
        new_downloadable_data: [],
      });
    });

    it('should handle COMPLETE_MONTHLY', () => {
      expect(
        monthlyEmissionsReducer([], {
          type: COMPLETE_MONTHLY,
        }))
        .toEqual({
          new_raw_data: {},
          new_emissions_region_so2: [],
          new_emissions_region_nox: [],
          new_emissions_region_co2: [],
          new_emissions_states_so2: {},
          new_emissions_states_nox: {},
          new_emissions_states_co2: {},
          new_emissions_counties_so2: {},
          new_emissions_counties_nox: {},
          new_emissions_counties_co2: {},
          new_percentages_region_so2: [],
          new_percentages_region_nox: [],
          new_percentages_region_co2: [],
          new_percentages_states_so2: {},
          new_percentages_states_nox: {},
          new_percentages_states_co2: {},
          new_percentages_counties_so2: {},
          new_percentages_counties_nox: {},
          new_percentages_counties_co2: {},
          new_states: [],
          new_counties: {},
        });
    });

    it('should handle RESELECT_REGION', () => {
      expect(
        monthlyEmissionsReducer([], {
          type: RESELECT_REGION,
        }))
        .toEqual({
          new_selected_aggregation: "region"
        });
    });

    it('should handle SELECT_STATE', () => {
      expect(
        monthlyEmissionsReducer([], {
          type: SELECT_STATE,
        }))
        .toEqual({
          new_selected_aggregation: 'state',
          new_selected_state: '',
          new_visible_counties: [],
        });
    });

    it('should handle SELECT_COUNTY', () => {
      expect(
        monthlyEmissionsReducer([], {
          type: SELECT_COUNTY,
        }))
        .toEqual({
          new_selected_aggregation: 'county',
          new_selected_county: '',
        });
    });

    it('should handle SELECT_UNIT', () => {
      expect(
        monthlyEmissionsReducer([], {
          type: SELECT_UNIT,
        }))
        .toEqual({
          new_selected_unit: '',
        });
    });

    it('should handle RENDER_MONTHLY_CHARTS', () => {
      expect(
        monthlyEmissionsReducer([], {
          type: RENDER_MONTHLY_CHARTS,
        }))
        .toEqual({
          new_visible_data: { so2: {}, nox: {}, co2: {} },
        });
    });
  });

  describe('Actions',() => {
    it('should create an action to render monthly charts', () => {
      expect(
        renderMonthlyEmissionsCharts()
      ).toEqual({
        type: RENDER_MONTHLY_CHARTS,
      })
    });

    it('should create an action when the AVERT engine completed the monthly emissions', () => {
      const store = mockStore({ todos: [] });
      const expectedActions = [
        { type: COMPLETE_MONTHLY, data: 'data' },
        { type: RENDER_MONTHLY_CHARTS },
      ];

      store.dispatch(completeMonthlyEmissions('data'));
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should create an action when the unit is selected', () => {
      const store = mockStore({ todos: [] });
      const expectedActions = [
        { type: SELECT_UNIT, unit: 'emissions' },
        { type: RENDER_MONTHLY_CHARTS },
      ];

      store.dispatch(updateMonthlyUnit('emissions'));
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should create an action when the region aggregation is selected', () => {
      const store = mockStore({ todos: [] });
      const expectedActions = [
        { type: RESELECT_REGION, region: 'northeast' },
        { type: RENDER_MONTHLY_CHARTS },
      ];

      store.dispatch(reselectRegion('northeast'));
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should create an action when the state aggregation is selected', () => {
      const store = mockStore({ todos: [] });
      const expectedActions = [
        { type: SELECT_STATE, state: 'Virginia' },
        { type: RENDER_MONTHLY_CHARTS },
      ];

      store.dispatch(selectState('Virginia'));
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should create an action when the county aggregation is selected', () => {
      const store = mockStore({ todos: [] });
      const expectedActions = [
        { type: SELECT_COUNTY, county: 'Montgomery County' },
        { type: RENDER_MONTHLY_CHARTS },
      ];

      store.dispatch(selectCounty('Montgomery County'));
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});

