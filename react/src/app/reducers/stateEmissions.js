import {    
    START_DISPLACEMENT,
    COMPLETE_STATE,
} from '../actions';

const stateEmissions = (state = { status: "not_started", results: [] }, action) => {
    switch (action.type) {
        case START_DISPLACEMENT:
            return Object.assign({}, state, {
                status: "started",
            });
        case COMPLETE_STATE:
            return Object.assign({}, state, {
                status: "complete",
                results: action.data
            });
        default:
            return state;
    }
}

export default stateEmissions;