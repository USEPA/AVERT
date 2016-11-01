import {    
    SELECT_REGION,
    START_DISPLACEMENT,
    COMPLETE_ANNUAL,
} from '../actions';

const resultsFormat = { original: '', post: '', impact: ''}

const annualDisplacement = (state = { 
    status: "select_region", 
    results: {
        generation: resultsFormat,
        totalEmissions: { so2: resultsFormat, nox: resultsFormat, co2: resultsFormat },
        emissionRates: { so2: resultsFormat, nox: resultsFormat, co2: resultsFormat },
    } 
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
        case COMPLETE_ANNUAL:
            return Object.assign({}, state, {
                status: "complete",
                results: action.data
            });
        default:
            return state;
    }
}

export default annualDisplacement;