import _ from 'lodash';
import { extractDownloadStructure } from '../../utils/DataDownloadHelper';

// action types
import {
  SELECT_REGION,
  START_DISPLACEMENT,
  COMPLETE_MONTHLY,
  SELECT_AGGREGATION,
  RESELECT_REGION,
  SELECT_STATE,
  SELECT_COUNTY,
  SELECT_UNIT,
  RENDER_MONTHLY_CHARTS,
} from '../../actions';

const standardStructure = { so2: [], nox: [], co2: []};

const initialState = {
  status: "select_region",
  selected_aggregation: 'region',
  selected_state: '',
  selected_county: '',
  selected_unit: 'emission',
  results: {
    so2: {},
    nox: {},
    co2: {},
  },
  output: standardStructure,
  percent_difference: standardStructure,
  regional: standardStructure,
  regional_percent_difference: standardStructure,
  states: standardStructure,
  available_states: [],
  available_counties: [],
  counties: standardStructure,
  forDownload: [],

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

    // case COMPLETE_MONTHLY:
    //   return {
    //     ...state,
    //     new_raw_data: {},
    //     new_emissions_region_so2: [],
    //     new_emissions_region_nox: [],
    //     new_emissions_region_co2: [],
    //     new_emissions_states_so2: {},
    //     new_emissions_states_nox: {},
    //     new_emissions_states_co2: {},
    //     new_emissions_counties_so2: {},
    //     new_emissions_counties_nox: {},
    //     new_emissions_counties_co2: {},
    //     new_percentages_region_so2: [],
    //     new_percentages_region_nox: [],
    //     new_percentages_region_co2: [],
    //     new_percentages_states_so2: {},
    //     new_percentages_states_nox: {},
    //     new_percentages_states_co2: {},
    //     new_percentages_counties_so2: {},
    //     new_percentages_counties_nox: {},
    //     new_percentages_counties_co2: {},
    //     new_states: [],
    //     new_counties: {},
    //   };
    //
    // case RESELECT_REGION:
    //   return {
    //     ...state,
    //     new_selected_aggregation: 'region',
    //   };
    //
    // case SELECT_STATE:
    //   return {
    //     ...state,
    //     new_selected_aggregation: 'state',
    //     new_selected_state: '',
    //     new_visible_counties: [],
    //   };
    //
    // case SELECT_COUNTY:
    //   return {
    //     ...state,
    //     new_selected_aggregation: 'county',
    //     new_selected_county: '',
    //   };
    //
    // case SELECT_UNIT:
    //   return {
    //     ...state,
    //     new_selected_unit: '',
    //   };
    //
    // case RENDER_MONTHLY_CHARTS:
    //   return {
    //     ...state,
    //     new_visible_data: { so2: {}, nox: {}, co2: {} },
    //   };
    //
    // default:
    //   return state;

    case COMPLETE_MONTHLY:
      console.warn('- Complete Monthly',action);

      // const regionalEmissionsData = {
      //   so2: action.emissions.so2.regional,
      //   nox: action.emissions.nox.regional,
      //   co2: action.emissions.co2.regional
      // };

      // Move this to action
      let forDownload = [];
      forDownload.push(extractDownloadStructure('SO2','emissions',action.data.emissions.so2.regional));
      forDownload.push(extractDownloadStructure('NOX','emissions',action.data.emissions.nox.regional));
      forDownload.push(extractDownloadStructure('CO2','emissions',action.data.emissions.co2.regional));

      forDownload.push(extractDownloadStructure('SO2','percentages',action.data.percentages.so2.regional));
      forDownload.push(extractDownloadStructure('NOX','percentages',action.data.percentages.nox.regional));
      forDownload.push(extractDownloadStructure('CO2','percentages',action.data.percentages.co2.regional));
      const availableStates = Object.keys(action.data.emissions.so2.state);
      let availableCounties;
      availableStates.forEach((state) => {
        forDownload.push(extractDownloadStructure('SO2','emissions',action.data.emissions.so2.state[state],state));
        forDownload.push(extractDownloadStructure('NOX','emissions',action.data.emissions.nox.state[state],state));
        forDownload.push(extractDownloadStructure('CO2','emissions',action.data.emissions.co2.state[state],state));

        forDownload.push(extractDownloadStructure('SO2','percentages',action.data.percentages.so2.state[state],state));
        forDownload.push(extractDownloadStructure('NOX','percentages',action.data.percentages.nox.state[state],state));
        forDownload.push(extractDownloadStructure('CO2','percentages',action.data.percentages.co2.state[state],state));

        availableCounties  = Object.keys(action.data.emissions.so2.county[state]);
        availableCounties.forEach((county) => {
          forDownload.push(extractDownloadStructure('SO2','emissions',action.data.emissions.so2.county[state][county],state,county));
          forDownload.push(extractDownloadStructure('NOX','emissions',action.data.emissions.nox.county[state][county],state,county));
          forDownload.push(extractDownloadStructure('CO2','emissions',action.data.emissions.co2.county[state][county],state,county));

          forDownload.push(extractDownloadStructure('SO2','percentages',action.data.percentages.so2.county[state][county],state,county));
          forDownload.push(extractDownloadStructure('NOX','percentages',action.data.percentages.nox.county[state][county],state,county));
          forDownload.push(extractDownloadStructure('CO2','percentages',action.data.percentages.co2.county[state][county],state,county));
        });
      });

      return {
        ...state,
        status: "complete",
        results: { so2: action.data.emissions.so2, nox: action.data.emissions.nox, co2: action.data.emissions.co2 },
        regional: { so2: action.data.emissions.so2.regional, nox: action.data.emissions.nox.regional, co2: action.data.emissions.co2.regional },
        output: { so2: action.data.emissions.so2.regional, nox: action.data.emissions.nox.regional, co2: action.data.emissions.co2.regional },
        available_states: availableStates,
        states: [],
        counties: [],
        forDownload: forDownload,
      };

    case SELECT_AGGREGATION:
      return {
        ...state,
        selected_aggregation: action.aggregation,
        output: action.aggregation === 'region' ? state.regional : state.output,
      };

    case RESELECT_REGION:
      return {
        ...state,
        output: action.region,
      };

    case SELECT_STATE:
      const counties = Object.keys(state.results.so2.county[action.state]).filter((val) => isNaN(val));
      const stateData = {
        so2: _.values(state.results.so2.state[action.state]),
        nox: _.values(state.results.nox.state[action.state]),
        co2: _.values(state.results.co2.state[action.state]),
      };

      return {
        ...state,
        selected_state: action.state,
        available_counties: counties,
        states: stateData,
        output: stateData,
      };

    case SELECT_COUNTY:
      const countyData = {
        so2: _.values(state.results.so2.county[state.selected_state][action.county]),
        nox: _.values(state.results.nox.county[state.selected_state][action.county]),
        co2: _.values(state.results.co2.county[state.selected_state][action.county]),
      };

      return {
        ...state,
        selected_county: action.county,
        counties: countyData,
        output: countyData,
      };

    case SELECT_UNIT:
      console.warn('...','SELECT_UNIT',action.unit);
      return {
        ...state,
        selected_unit: action.unit,
        // output: state.percent_difference,
      };

    case RENDER_MONTHLY_CHARTS:
      return state;

    default:
      return state;
  }
};



export default monthlyEmissionsReducer;
