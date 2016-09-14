import {    
    UPDATE_EERE_TOP_HOURS,
    UPDATE_EERE_REDUCTION,
    UPDATE_EERE_ANNUAL_GWH,
    UPDATE_EERE_CONSTANT_MW,
    UPDATE_EERE_WIND_CAPACITY,
    UPDATE_EERE_UTILITY_SOLAR,
    UPDATE_EERE_ROOFTOP_SOLAR,
    SUBMIT_PARAMS,
} from '../actions';

const eere = (state = {}, action) => {
	switch (action.type) {
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
        case SUBMIT_PARAMS:
            return Object.assign({}, state, {
                submitted: true
            });
		default:
			return state;
	}
}

export default eere;