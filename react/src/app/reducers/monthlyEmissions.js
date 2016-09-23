import {    
    START_DISPLACEMENT,
    COMPLETE_MONTHLY,
} from '../actions';

const monthlyEmissions = (state = { status: "not_started", results: [] }, action) => {
    switch (action.type) {
        case START_DISPLACEMENT:
            return Object.assign({}, state, {
                status: "started",
            });
        case COMPLETE_MONTHLY:
            return Object.assign({}, state, {
                status: "complete",
                results: action.data
            });
        default:
            return state;
    }
}

export default monthlyEmissions;