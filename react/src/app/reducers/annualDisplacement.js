import {    
    START_DISPLACEMENT,
    COMPLETE_ANNUAL,
} from '../actions';

const resultsFormat = { original: '', post: '', impact: ''}

const annualDisplacement = (state = { 
    status: "not_started", 
    results: {
        generation: { so2: resultsFormat, nox: resultsFormat, co2: resultsFormat },
        totalEmissions: { so2: resultsFormat, nox: resultsFormat, co2: resultsFormat },
        emissionRates: { so2: resultsFormat, nox: resultsFormat, co2: resultsFormat },
    } 
}, action) => {
    switch (action.type) {
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