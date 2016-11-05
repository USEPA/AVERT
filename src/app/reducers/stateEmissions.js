import {    
    SELECT_REGION,
    START_DISPLACEMENT,
    COMPLETE_STATE,
    FOO_COMPLETE_STATE,
} from '../actions';

const stateEmissions = (state = { 
    status: "select_region", 
    results: [] 
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

        case COMPLETE_STATE:
            return Object.assign({}, state, {
                status: "complete",
                results: action.data,
            });

        case FOO_COMPLETE_STATE:
            console.warn('FOO_COMPLETE_STATE',action);
            return Object.assign({}, state, {
                state: "complete",
                results: action.data,
            });

        default:
            return state;
    }
}

export default stateEmissions;