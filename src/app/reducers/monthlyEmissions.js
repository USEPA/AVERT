import {    
    SELECT_REGION,
    START_DISPLACEMENT,
    COMPLETE_MONTHLY,
    FOO_COMPLETE_MONTHLY,
    SELECT_AGGREGATION,
    SELECT_STATE,
    SELECT_COUNTY,
    SELECT_UNIT,
} from '../actions';

const monthlyEmissions = (state = { 
    status: "select_region", 
    selected_aggregation: 'region',
    selected_state: false,
    selected_county: false,
    selected_unit: 'emission',
    results: { 
        so2: {}, 
        nox: {}, 
        co2: {},
    }, 
    output: {
        so2: [], 
        nox: [], 
        co2: [], 
    },
    regional: { 
        so2: [], 
        nox: [], 
        co2: [], 
    }, 
    states: { 
        so2: [], 
        nox: [], 
        co2: [],
    },
    available_states: [],
    available_counties: [],
    counties: { so2: [], nox: [], co2: [] },
}, action) => {
    switch (action.type) {
        case SELECT_REGION:
            return Object.assign({}, state, {
                status: "ready",
            });

        case START_DISPLACEMENT:
            return Object.assign({}, state, {
                status: "started",
            });

        case COMPLETE_MONTHLY:
            return Object.assign({}, state, {
                status: "complete",
                results: action.data,
            });

        case FOO_COMPLETE_MONTHLY:
            console.warn('- FOO Complete Monthly',action);
            return Object.assign({}, state, {
                status: "complete",
                results: { so2: action.so2, nox: action.nox, co2: action.co2 },
                regional: { so2: action.so2.regional, nox: action.nox.regional, co2: action.co2.regional },
                output: { so2: action.so2.regional, nox: action.nox.regional, co2: action.co2.regional },
                available_states: Object.keys(action.so2.state),
                states: [],
                counties: [],
            });

        case SELECT_AGGREGATION:
            return Object.assign({}, state, {
                selected_aggregation: action.aggregation,
                output: action.aggregation === 'region' ? state.regional : state.output,
            });

        case SELECT_STATE:
            const counties = Object.keys(state.results.so2.state[action.state].counties).filter((val) => isNaN(val));
            const stateData = { 
                so2: Object.values(state.results.so2.state[action.state].data), 
                nox: Object.values(state.results.nox.state[action.state].data), 
                co2: Object.values(state.results.co2.state[action.state].data), 
            };

            console.warn("- State Data",stateData);
            return Object.assign({}, state, {
                selected_state: action.state,
                available_counties: counties,
                states: stateData,
                output: stateData,
            });

        case SELECT_COUNTY:
            const countyData = {
                so2: Object.values(state.results.so2.state[state.selected_state].counties[action.county]),
                nox: Object.values(state.results.nox.state[state.selected_state].counties[action.county]),
                co2: Object.values(state.results.co2.state[state.selected_state].counties[action.county]),
            };
            return Object.assign({}, state, {
                selected_county: action.county,
                counties: countyData,
                output: countyData,
            });

        case SELECT_UNIT:
            return Object.assign({}, state, {
                selected_unit: action.unit,
            });

        default:
            return state;
    }
}

export default monthlyEmissions;