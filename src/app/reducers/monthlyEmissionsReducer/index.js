// action types
import {
  SELECT_REGION,
  START_DISPLACEMENT,
  COMPLETE_MONTHLY,
  SELECT_AGGREGATION,
  SELECT_STATE,
  SELECT_COUNTY,
  SELECT_UNIT,
} from '../../actions';

const standardStructure = { so2: [], nox: [], co2: []}

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
      console.warn('- Complete Monthly',action);

      // const regionalEmissionsData = {
      //   so2: action.emissions.so2.regional,
      //   nox: action.emissions.nox.regional,
      //   co2: action.emissions.co2.regional
      // };

      return {
        ...state,
        status: "complete",
        results: { so2: action.data.emissions.so2, nox: action.data.emissions.nox, co2: action.data.emissions.co2 },
        regional: { so2: action.data.emissions.so2.regional, nox: action.data.emissions.nox.regional, co2: action.data.emissions.co2.regional },
        output: { so2: action.data.emissions.so2.regional, nox: action.data.emissions.nox.regional, co2: action.data.emissions.co2.regional },
        available_states: Object.keys(action.data.emissions.so2.state),
        states: [],
        counties: [],

        // regional_emissions: regionalEmissionsData,
        // state_emissions: { so2: action.emissions.so2.state, nox: action.emissions.nox.state, co2: action.emissions.co2.state },
        // county_emissions: { so2: action.emissions.so2.county, nox: action.emissions.nox.county, co2: action.emissions.co2.county },
        //
        // regional_percentages: { so2: action.percentages.so2.regional, nox: action.percentages.nox.regional, co2: action.percentages.co2.regional },
        // state_percentages: { so2: action.percentages.so2.state, nox: action.percentages.nox.state, co2: action.percentages.co2.state },
        // county_percentages: { so2: action.percentages.so2.county, nox: action.percentages.nox.county, co2: action.percentages.co2.county },
        //
        // output: regionalEmissionsData,
      };

    case SELECT_AGGREGATION:
      return {
        ...state,
        selected_aggregation: action.aggregation,
        output: action.aggregation === 'region' ? state.regional : state.output,
      };

    case SELECT_STATE:
      const counties = Object.keys(state.results.so2.county[action.state]).filter((val) => isNaN(val));
      const stateData = {
        so2: Object.values(state.results.so2.state[action.state]),
        nox: Object.values(state.results.nox.state[action.state]),
        co2: Object.values(state.results.co2.state[action.state]),
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
        so2: Object.values(state.results.so2.county[state.selected_state][action.county]),
        nox: Object.values(state.results.nox.county[state.selected_state][action.county]),
        co2: Object.values(state.results.co2.county[state.selected_state][action.county]),
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

    default:
      return state;
  }
};

export default monthlyEmissionsReducer;
