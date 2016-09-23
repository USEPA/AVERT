import {    
    START_GENERATION,
    COMPLETE_GENERATION,
} from '../actions';

const generation = (state = { status: "not_started", results: [] }, action) => {
    switch (action.type) {
        case START_GENERATION:
            return Object.assign({}, state, {
                status: "started",
            });
        case COMPLETE_GENERATION:
            return Object.assign({}, state, {
                status: "complete",
                results: action.data
            });
        default:
            return state;
    }
}

export default generation;