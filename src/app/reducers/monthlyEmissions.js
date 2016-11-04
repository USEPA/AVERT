import {    
    SELECT_REGION,
    START_DISPLACEMENT,
    COMPLETE_MONTHLY,
} from '../actions';

const monthlyEmissions = (state = { status: "select_region", results: [], regional: [], states: [] }, action) => {
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
            console.warn('- Complete Month',action);
            return Object.assign({}, state, {
                status: "complete",
                results: action.data,
                regional: [],
                states: [],
            });
        default:
            return state;
    }
}

export default monthlyEmissions;