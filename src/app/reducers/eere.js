import {    
    SELECT_REGION,
    UPDATE_EERE_TOP_HOURS,
    UPDATE_EERE_REDUCTION,
    UPDATE_EERE_ANNUAL_GWH,
    UPDATE_EERE_CONSTANT_MW,
    UPDATE_EERE_WIND_CAPACITY,
    UPDATE_EERE_UTILITY_SOLAR,
    UPDATE_EERE_ROOFTOP_SOLAR,
    VALIDATE_EERE,
    UPDATE_EXCEEDENCES,
    SUBMIT_PARAMS,
    SUBMIT_CALCULATION,
    COMPLETE_CALCULATION,
} from '../actions';

const eere = (state = { 
    status: 'select_region', 
    submitted: false,
    valid: true,
    exceedences: [],
    errors: [],
    topHours: '', 
    reduction: '', 
    annualGwh: '', 
    constantMw: '', 
    capacity: '', 
    utilitySolar: '', 
    rooftopSolar: '', 
    hourlyEere: [] 
}, action) => {
	switch (action.type) {
        case SELECT_REGION:
            return Object.assign({}, state, {
                status: "ready",
            });
		
        case UPDATE_EERE_TOP_HOURS:
			return Object.assign({}, state, {
				topHours: action.text
			});
        
        case UPDATE_EERE_REDUCTION:
            return Object.assign({}, state, {
                reduction: action.text
            });
        
        case UPDATE_EERE_ANNUAL_GWH:
            return Object.assign({}, state, {
                annualGwh: action.text
            });
        
        case UPDATE_EERE_CONSTANT_MW:
            return Object.assign({}, state, {
                constantMw: action.text
            });
        
        case UPDATE_EERE_WIND_CAPACITY:
            return Object.assign({}, state, {
                capacity: action.text
            });
        
        case UPDATE_EERE_UTILITY_SOLAR:
            return Object.assign({}, state, {
                utilitySolar: action.text
            });
        
        case UPDATE_EERE_ROOFTOP_SOLAR:
            return Object.assign({}, state, {
                rooftopSolar: action.text
            });
        
        case VALIDATE_EERE:
            return Object.assign({}, state, {
                valid: action.valid,
                errors: action.errors,
            });

        case UPDATE_EXCEEDENCES:
            console.warn("UPDATE_EXCEEDENCES",action.exceedences.reduce((a,b) => a + b));
            return Object.assign({}, state, {
                // TODO: Consider breaking validity for exceed from validity for fields
                valid: action.exceedences.reduce((a,b) => a + b) === 0,
                exceedences: action.exceedences
            })
        
        case SUBMIT_PARAMS:
            return Object.assign({}, state, {
                submitted: true,
            });
        
        case SUBMIT_CALCULATION:
            return Object.assign({}, state, {
                status: 'started',
                hourlyEere: [],
            });
        
        case COMPLETE_CALCULATION:
            return Object.assign({}, state, {
                status: 'complete',
                hourlyEere: action.hourlyEere
            });
		default:
			return state;
	}
}

export default eere;