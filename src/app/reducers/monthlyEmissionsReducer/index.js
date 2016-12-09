// action types
import {
  SELECT_REGION,
  START_DISPLACEMENT,
  COMPLETE_MONTHLY,
  FOO_COMPLETE_MONTHLY,
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
      return {
        ...state,
        status: "complete",
        results: action.data,
      };

    case FOO_COMPLETE_MONTHLY:
      console.warn('- FOO Complete Monthly',action);

      // const regionalSo2Pre = Object.values(state.so2.regional.pre);
      // const regionalSo2Post = Object.values(state.so2.regional.post);
      // const regionalNoxPre = Object.values(state.nox.regional.pre);
      // const regionalNoxPost = Object.values(state.nox.regional.post);
      // const regionalCo2Pre = Object.values(state.co2.regional.pre);
      // const regionalCo2Post = Object.values(state.co2.regional.post);
      //
      // const regionalPercentage = {
      //   so2: regionalSo2Pre.map((val,index) => ((regionalSo2Post[index] - val) / regionalSo2Post[index]) * 100),
      //   nox: regionalNoxPre.map((val,index) => ((regionalNoxPost[index] - val) / regionalSo2Post[index]) * 100),
      //   co2: regionalCo2Pre.map((val,index) => ((regionalCo2Post[index] - val) / regionalSo2Post[index]) * 100),
      // };

      return {
        ...state,
        status: "complete",
        results: { so2: action.so2, nox: action.nox, co2: action.co2 },
        regional: { so2: action.so2.regional, nox: action.nox.regional, co2: action.co2.regional },
        output: { so2: action.so2.regional, nox: action.nox.regional, co2: action.co2.regional },
        available_states: Object.keys(action.so2.state),
        states: [],
        counties: [],
      };

    case SELECT_AGGREGATION:

      return {
        ...state,
        selected_aggregation: action.aggregation,
        output: action.aggregation === 'region' ? state.regional : state.output,
      };

    case SELECT_STATE:
      const counties = Object.keys(state.results.so2.state[action.state].counties).filter((val) => isNaN(val));
      const stateData = {
        so2: Object.values(state.results.so2.state[action.state].data),
        nox: Object.values(state.results.nox.state[action.state].data),
        co2: Object.values(state.results.co2.state[action.state].data),
      };

      const stateSo2Pre = Object.values(state.results.so2.state[action.state].pre);
      const stateSo2Post = Object.values(state.results.so2.state[action.state].post);
      const stateNoxPre = Object.values(state.results.nox.state[action.state].pre);
      const stateNoxPost = Object.values(state.results.nox.state[action.state].post);
      const stateCo2Pre = Object.values(state.results.co2.state[action.state].pre);
      const stateCo2Post = Object.values(state.results.co2.state[action.state].post);

      const statePercentage = {
        so2: stateSo2Pre.map((val,index) => ((stateSo2Post[index] - val) / stateSo2Post[index]) * 100),
        nox: stateNoxPre.map((val,index) => ((stateNoxPost[index] - val) / stateSo2Post[index]) * 100),
        co2: stateCo2Pre.map((val,index) => ((stateCo2Post[index] - val) / stateSo2Post[index]) * 100),
      };

      return {
        ...state,
        selected_state: action.state,
        available_counties: counties,
        states: stateData,
        output: state.unit === 'emission' ? stateData : statePercentage,
        percent_difference: statePercentage,
      };

    case SELECT_COUNTY:
      const countyData = {
        so2: Object.values(state.results.so2.state[state.selected_state].counties[action.county].data),
        nox: Object.values(state.results.nox.state[state.selected_state].counties[action.county].data),
        co2: Object.values(state.results.co2.state[state.selected_state].counties[action.county].data),
      };

      const countySo2Pre = Object.values(state.results.so2.state[state.selected_state].counties[action.county].pre);
      const countySo2Post = Object.values(state.results.so2.state[state.selected_state].counties[action.county].post);
      const countyNoxPre = Object.values(state.results.nox.state[state.selected_state].counties[action.county].pre);
      const countyNoxPost = Object.values(state.results.nox.state[state.selected_state].counties[action.county].post);
      const countyCo2Pre = Object.values(state.results.co2.state[state.selected_state].counties[action.county].pre);
      const countyCo2Post = Object.values(state.results.co2.state[state.selected_state].counties[action.county].post);

      const countyPercentage = {
        so2: countySo2Pre.map((val,index) => ((countySo2Post[index] - val) / countySo2Post[index]) * 100),
        nox: countyNoxPre.map((val,index) => ((countyNoxPost[index] - val) / countyNoxPost[index]) * 100),
        co2: countyCo2Pre.map((val,index) => ((countyCo2Post[index] - val) / countyCo2Post[index]) * 100),
      };
      console.warn("- County Percentages",countyPercentage);
      return {
        ...state,
        selected_county: action.county,
        counties: countyData,
        output: state.unit === 'emission' ? countyData : countyPercentage,
        percent_difference: countyPercentage,
      };

    case SELECT_UNIT:
      console.warn('...','SELECT_UNIT');

      return {
        ...state,
        selected_unit: action.unit,
        output: state.percent_difference,
      };

    default:
      return state;
  }
};

export default monthlyEmissionsReducer;
